const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/User");

const app = express();

/* ---------- MIDDLEWARE (TOP) ---------- */
app.use(cors());
app.use(express.json());

/* ---------- DATABASE CONNECTION ---------- */
mongoose.connect("mongodb://127.0.0.1:27017/weatherApp")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log(err));

/* ---------- TEST ROUTE ---------- */
app.get("/", (req, res) => {
  res.send("Backend is running");
});

/* ---------- 👉 PASTE YOUR CODE HERE ---------- */
app.post("/save-search", async (req, res) => {
  const { city } = req.body;
  console.log("City received from frontend:", city);

  try {
    await User.updateOne(
      { username: "defaultUser" },
      { $push: { searches: city } },
      { upsert: true }
    );

    res.json({ message: "City saved successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save city" });
  }
});

/* ---------- SERVER START (BOTTOM) ---------- */
if (process.env.NODE_ENV !== "test") {
  app.listen(5000, () => {
    console.log("🚀 Server running at http://localhost:5000");
  });
}

module.exports = app;
