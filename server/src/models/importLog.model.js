const mongoose = require('mongoose');

const ImportLogSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true, // This will be the feed URL
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    totalFetched: {
      type: Number,
      default: 0,
    },
    totalImported: {
      type: Number,
      default: 0,
    },
    newJobs: {
      type: Number,
      default: 0,
    },
    updatedJobs: {
      type: Number,
      default: 0,
    },
    failedJobs: [
      {
        guid: String,
        error: String,
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

module.exports = mongoose.model('ImportLog', ImportLogSchema);
