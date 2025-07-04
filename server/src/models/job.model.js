const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  guid: { type: String, unique: true },
  title: String,
  link: String,
  description: String,
  pubDate: Date,
  // Add other fields based on API structure
});

module.exports = mongoose.model('Job', JobSchema);
