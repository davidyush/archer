const mongoose = require('mongoose');

const taleSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: 'Please enter a title name'
  },
  description: {
    type: String,
    trim: true,
    required: 'Please enter a description'
  },
  created: {
    type: Date,
    default: Date.now
  },
  photo: String
});

module.exports = mongoose.model('Tale', taleSchema);
