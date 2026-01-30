require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const PORT = 3001;
const app = express();

console.log("SERVER FILE LOADED");

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// SERVE UPLOADED IMAGES
app.use("/uploads", express.static("uploads"));

// TEST ROUTE
app.get("/test", (req, res) => {
  res.status(200).json({ ok: true });
});

// EVENTS ROUTE
app.use("/api/events", require("./routes/events"));

// DATABASE CONNECTION
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("DB Error:", err));

// START SERVER
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
