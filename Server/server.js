import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/reverse", async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ error: "lat and lon are required" });
    }

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error in reverse geocoding:", error);
    res.status(500).json({ error: "Failed to fetch location" });
  }
});

app.listen(5000, () => console.log("✅ Proxy running on http://localhost:5000"));
