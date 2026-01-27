const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: String,
  date: String,
  description: String,
  image: String   // image path
});

module.exports = mongoose.model("Event", eventSchema, "Events");
