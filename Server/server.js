import express from "express";
import pkg from "pg";

const { Pool } = pkg;
const app = express();
const PORT = 5000;

app.use(express.json());

// 🔗 PostgreSQL connection
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

// ✅ Utility: Calculate distance (Haversine formula)
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ✅ Test DB
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ message: "DB connected!", time: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB connection failed" });
  }
});

// ✅ Mark attendance
app.post("/attendance", async (req, res) => {
  const { employeeId, latitude, longitude } = req.body;

  if (!employeeId || !latitude || !longitude) {
    return res.status(400).json({ error: "employeeId, latitude, longitude required" });
  }

  try {
    // 1️⃣ Get office location
    const officeResult = await pool.query("SELECT * FROM office_location LIMIT 1");
    const office = officeResult.rows[0];

    if (!office) {
      return res.status(400).json({ error: "No office location found in DB" });
    }

    // 2️⃣ Calculate distance
    const distance = getDistance(latitude, longitude, office.latitude, office.longitude);
    const status = distance <= office.radius_meters ? "PRESENT" : "ABSENT";

    // 3️⃣ Insert attendance
    const insertResult = await pool.query(
      `INSERT INTO attendance (employee_id, latitude, longitude, status)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [employeeId, latitude, longitude, status]
    );

    res.json({ success: true, attendance: insertResult.rows[0], distance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to mark attendance" });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
