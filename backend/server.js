require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const PORT = 3001;

console.log("SERVER FILE LOADED");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));
app.use("/api/auth", require("./routes/auth"));


// TEST ROUTE
app.get('/test', (req, res) => {
  res.status(200).json({ ok: true });
});

// EVENTS ROUTE
const eventRoutes = require('./routes/events');
app.use('/api/events', eventRoutes);

// DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

  


app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
