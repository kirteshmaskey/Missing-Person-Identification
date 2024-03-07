const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  _id: {
    type: String,
  },
  uniqueId: {
    type: Number,
  },
});

const Counter = new mongoose.model("uniquecounters", counterSchema);

module.exports = { Counter };