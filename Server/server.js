import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import userAuth from "./middleware/userauth.js"; // adjust path if needed
import jwt from "jsonwebtoken";
import pkg from "pg";
import cors from "cors";

dotenv.config();
const { Pool } = pkg;

const app = express();
app.use(express.json());
app.use(cors()); // allow all origins (development only)

// ✅ PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.PG_URI,
  ssl: { rejectUnauthorized: false },
});

// In-memory OTP store (⚡ better: save in DB with expire time)
const otpStore = new Map();


// user will register the phone numer by recieve otp in thier device frim this
app.post("/register/send-otp", async (req, res) => {
  const { mobile } = req.body;
  if (!mobile) {
    return res.status(400).json({ success: false, message: "Mobile number required" });
  }

  try {
    // check if mobile already registered
    const existing = await pool.query("SELECT * FROM employees WHERE mobile=$1", [mobile]);
    if (existing.rows.length > 0) {
      return res.json({ success: false, message: "Mobile already registered" });
    }

    // generate OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    otpStore.set(mobile, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

    // ✅ log OTP in console (debugging only)
    console.log(`📲 OTP for ${mobile}: ${otp}`);

    // send only a safe message back to client
return res.json({
        success: true,
        message: "OTP sent successfully",
        otp, // 👈 this will return the OTP to the client
      });

  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ success: false, message: "Error sending OTP" });
  }
});

// OTP verufcation process will take place and save the phonenumber to employees table making other colpumns (temporary null)

app.post("/register/verify-otp", async (req, res) => {
  const { mobile, otp } = req.body;

  if (!mobile || !otp) {
    return res.json({ success: false, message: "Mobile and OTP required" });
  }

  const record = otpStore.get(mobile);
  if (!record) return res.json({ success: false, message: "No OTP requested for this number" });

  if (record.expiresAt < Date.now()) {
    otpStore.delete(mobile);
    return res.json({ success: false, message: "OTP expired" });
  }

  if (record.otp !== otp) {
    return res.json({ success: false, message: "Invalid OTP" });
  }

  try {
    // Insert mobile into employees table if not already present
    const result = await pool.query(
      "INSERT INTO employees (mobile) VALUES ($1) ON CONFLICT (mobile) DO NOTHING RETURNING *",
      [mobile]
    );

    // Get the user row (either newly inserted or existing)
    const user = result.rows[0] || (await pool.query("SELECT * FROM employees WHERE mobile=$1", [mobile])).rows[0];

    // ✅ Generate JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Mark as verified in memory
    otpStore.set(mobile, { verified: true });

    return res.json({ success: true, message: "OTP verified & mobile saved", token });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ success: false, message: "Error saving mobile" });
  }
});


//Once the user gets the number verified , they need ot fill up their name , email and password along with the phone number which they registered.
app.post("/register/complete", async (req, res) => {
  const { mobile, name, email, password } = req.body;
  if (!mobile || !name || !email || !password) {
    return res.status(400).json({ success: false, message: "Missing details" });
  }

  try {
    // check OTP verified
    const record = otpStore.get(mobile);
    if (!record || !record.verified) {
      return res.json({ success: false, message: "Mobile not verified via OTP" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Update the same row where mobile matches
    const result = await pool.query(
      "UPDATE employees SET name=$1, email=$2, password=$3 WHERE mobile=$4 RETURNING *",
      [name, email, hashedPassword, mobile]
    );

    otpStore.delete(mobile); // cleanup

    return res.json({ success: true, message: "Registration complete", user: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ success: false, message: "Error completing registration" });
  }
});




// app.get("/user/data", userAuth, async (req, res) => {
//   const user = await Employee.findById(req.userId); 
//   res.json({ success: true, user: { name: user.name, mobile: user.mobile } });
// });

const userRouter = express.Router();

userRouter.get("/data", userAuth, async (req, res) => {
  try {
    // req.userId comes from your JWT middleware
    const userId = req.userId;

    const query = "SELECT id, name, mobile, email FROM employees WHERE id = $1";
    const { rows } = await pool.query(query, [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const user = rows[0];

    res.json({ success: true, data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
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

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
