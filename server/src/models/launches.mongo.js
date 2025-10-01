const mongoose = require("mongoose")

const launchesSchema = new mongoose.Schema({
  flightNumber: {
    type: Number,
    required: true,
    // default: 100,
    // min:100,
    // max:999
  },
  launchDate: {
    type: Date,
    required: true,
  },
  mission: {
    type: String,
    required: true,
  },
  rocket: {
    type: String,
    required: true,
  },
  target: {
    type: String,
    // required: true,
  },
  // (relationship with Planet Schema)
  //   target: {
  //     type: mongoose.ObjectId,
  //     ref: "Planet",
  //   },
  customers: [String], // array of STring
  upcoming: {
    type: Boolean,
    required: true,
    default: true,
  },
  success: {
    type: Boolean,
    required: true,
    default: true,
  },
})

// Connects launchesSchema with the "Launches" collection
// "Launches" collection is created automatically at MongoDB
module.exports = mongoose.model("Launch", launchesSchema)
