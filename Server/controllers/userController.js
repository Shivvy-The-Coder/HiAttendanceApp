
import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pkg from "pg";

dotenv.config();
const { Pool } = pkg;

const app = express();
app.use(express.json());

// ✅ PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.PG_URI,
  ssl: { rejectUnauthorized: false },
});

// In-memory OTP store (⚡ better: save in DB with expire time)
const otpStore = new Map();

// ✅ Step 1: Request OTP (mobile number only)
app.post("/register/send-otp", async (req, res) => {
  const { mobile } = req.body;
  if (!mobile) {
    return res.status(400).json({ success: false, message: "Mobile number required" });
  }

  try {
    // check if mobile already registered
    const existing = await pool.query("SELECT * FROM users WHERE mobile=$1", [mobile]);
    if (existing.rows.length > 0) {
      return res.json({ success: false, message: "Mobile already registered" });
    }

    // generate OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    otpStore.set(mobile, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

    // ⚡ later integrate SMS gateway (Twilio, MSG91, etc.)
    return res.json({ success: true, message: "OTP sent successfully", otp }); // ⚠️ don’t send OTP in prod
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ success: false, message: "Error sending OTP" });
  }
});

// ✅ Step 2: Verify OTP
app.post("/register/verify-otp", (req, res) => {
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

  // OTP verified ✅
  otpStore.set(mobile, { verified: true });
  return res.json({ success: true, message: "OTP verified successfully" });
});

// ✅ Step 3: Complete Registration (after OTP verified)
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

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // save to DB
    const result = await pool.query(
      "INSERT INTO users (name, email, password, mobile) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, hashedPassword, mobile]
    );

    // clear OTP store
    otpStore.delete(mobile);

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return res.json({ success: true, message: "User registered successfully", token, user });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ success: false, message: "Error completing registration" });
  }
});

// ✅ Test DB
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
