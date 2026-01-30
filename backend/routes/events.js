const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

/* ======================
   MULTER CONFIG
====================== */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

/* ======================
   GET ALL EVENTS
====================== */
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ _id: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

/* ======================
   ADD EVENT
====================== */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, description } = req.body;

    const newEvent = new Event({
      title,
      description,
      image: req.file ? req.file.filename : "",
      date: new Date().toLocaleDateString()
    });

    await newEvent.save();
    res.json({ message: "Event added successfully" });

  } catch (err) {
    res.status(500).json({ error: "Failed to add event" });
  }
});

/* ======================
   DELETE EVENT + IMAGE
====================== */
router.delete("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // 🧹 delete image file
    if (event.image) {
      const imagePath = path.join(__dirname, "..", "uploads", event.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: "Failed to delete event" });
  }
});

module.exports = router;
