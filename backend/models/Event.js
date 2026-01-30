const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: String,
  date: String,
  description: String,
  image: String
});

module.exports = mongoose.model("Event", eventSchema, "Events");
