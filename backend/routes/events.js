const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const multer = require("multer");

// multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// GET all events
router.get("/", async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

// POST add event with image
router.post("/", upload.single("image"), async (req, res) => {
  const { title, date, description } = req.body;

  const newEvent = new Event({
    title,
    date,
    description,
    image: req.file ? req.file.filename : ""
  });

  await newEvent.save();
  res.json({ message: "Event added successfully" });
});

module.exports = router;
