import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import userAuth from "./middleware/userauth.js"; // adjust path if needed
import jwt from "jsonwebtoken";
import pkg from "pg";
import cors from "cors";
import axios from "axios";


dotenv.config();
const { Pool } = pkg;

const app = express();
app.use(express.json());
app.use(cors()); 

// function for the sending otp via API
const sendOtpSms = async ({ mobile, otp }) => {
  try {
    const APIKey = process.env.SMS_API_KEY; 
    const senderid = "SMSHUB";              
    const fl = 0;                           
    const gwid = 2;                         

    const brand = "DayTracker Attendance System";
    const msg = `Welcome to the ${brand} powered by SMSINDIAHUB. Your OTP for registration is ${otp}`;

    const url = `https://cloud.smsindiahub.in/vendorsms/pushsms.aspx?APIKey=${APIKey}&msisdn=${mobile}&sid=${senderid}&msg=${encodeURIComponent(msg)}&fl=${fl}&gwid=${gwid}`;

    const response = await axios.get(url);
    console.log("SMS sent successfully:", response.data);
    return response.data;
  } catch (err) {
    console.error("Error sending SMS:", err.response?.data || err.message);
    throw err;
  }
};

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.PG_URI,
  ssl: { rejectUnauthorized: false },
});

// In-memory OTP store (⚡ better: save in DB with expire time)
const otpStore = new Map();

// Sending OTP 
app.post("/register/send-otp", async (req, res) => {
  const { mobile } = req.body;
  if (!mobile) {
    return res
      .status(400)
      .json({ success: false, message: "Mobile number required" });
  }

  try {
    // check if mobile already registered
    const existing = await pool.query(
      "SELECT * FROM employees WHERE mobile=$1",
      [mobile]
    );
    if (existing.rows.length > 0) {
      return res.json({
        success: false,
        message: "Mobile already registered",
      });
    }

    // generate OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    otpStore.set(mobile, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

    console.log(`📲 OTP for ${mobile}: ${otp}`);
      // send SMS via SMSINDIAHUB
    await sendOtpSms({ mobile, otp });

    return res.json({
      success: true,
      message: "OTP sent successfully",
      otp, // ⚠️ for dev only, remove in production
    });
  } catch (err) {
    console.error(err.message);
    return res
      .status(500)
      .json({ success: false, message: "Error sending OTP" });
  }
});

// verifying OTP
app.post("/register/verify-otp", async (req, res) => {
  const { mobile, otp } = req.body;

  if (!mobile || !otp) {
    return res.json({ success: false, message: "Mobile and OTP required" });
  }

  try {
    const record = otpStore.get(mobile);
    if (!record || record.otp !== otp || record.expiresAt < Date.now()) {
      return res.json({ success: false, message: "Invalid or expired OTP" });
    }

    // ✅ Mark as verified
    otpStore.set(mobile, { ...record, verified: true });

    // insert or fetch user (only mobile for now)
    const result = await pool.query(
      "INSERT INTO employees (mobile) VALUES ($1) ON CONFLICT (mobile) DO NOTHING RETURNING *",
      [mobile]
    );

    const user =
      result.rows[0] ||
      (await pool.query( "SELECT id, name, mobile, email FROM employees WHERE mobile=$1", [mobile]))
        .rows[0];

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({
      success: true,
      message: "OTP verified",
      token,
      user,
    });
  } catch (err) {
    console.error(err.message);
    return res
      .status(500)
      .json({ success: false, message: "Error verifying OTP" });
  }
});

// complete registration
app.post("/register/complete", async (req, res) => {
  const { mobile, name, email, password } = req.body;
  if (!mobile || !name || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Missing details" });
  }

  try {
    const record = otpStore.get(mobile);
    if (!record || !record.verified) {
      return res.json({
        success: false,
        message: "Mobile not verified via OTP",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

// update only the rows where the phone number matches
    const result = await pool.query(
      "UPDATE employees SET name=$1, email=$2, password=$3 WHERE mobile=$4 RETURNING *",
      [name, email, hashedPassword, mobile]
    );

    otpStore.delete(mobile); // cleanup

    return res.json({
      success: true,
      message: "Registration complete",
      user: result.rows[0],
    });
  } catch (err) {
    console.error(err.message);
    return res
      .status(500)
      .json({ success: false, message: "Error completing registration" });
  }
});

// user Router 
const userRouter = express.Router();
app.use("/user", userRouter);

userRouter.get("/data", userAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const query = "SELECT id, name, mobile, email FROM employees WHERE id = $1";
    const { rows } = await pool.query(query, [userId]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// user login
app.post("/login", async (req, res) => {
  const { mobile, password } = req.body;

  if (!mobile || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Mobile and password required" });
  }

  try {
    // check if user exists
    const { rows } = await pool.query(
      "SELECT * FROM employees WHERE mobile=$1",
      [mobile]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const user = rows[0];

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    // create JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, mobile: user.mobile, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Server error during login" });
  }
});

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ message: "DB connected!", time: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "DB connection failed" });
  }
});


// Check-in
app.post("/attendance/checkin", async (req, res) => {
  const { mobile, name } = req.body; // ✅ use mobile
  try {
    const result = await pool.query(
      `INSERT INTO attendance (mobile, name, login_time, attendance_marked)
       VALUES ($1, $2, NOW(), true)
       RETURNING *`,
      [mobile, name]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Check-out
app.post("/attendance/checkout", async (req, res) => {
  const { mobile } = req.body;
  try {
    const result = await pool.query(
      `UPDATE attendance
       SET logout_time = NOW(), attendance_marked = false
       WHERE mobile = $1
       RETURNING *`,
      [mobile]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




const PORT = 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
