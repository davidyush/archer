const mongoose = require('mongoose');

const coloringSchema = new mongoose.Schema({
  created: {
    type: Date,
    default: Date.now
  },
  tag: {
    type: String,
    required: 'please enter a tag',
    trim: true
  },
  photo: {
    type: String,
    required: 'please upload a photo'
  },
  pdf: {
    type: String,
    required: 'please uplaod a pdf'
  }
});

module.exports = mongoose.model('Coloring', coloringSchema);
