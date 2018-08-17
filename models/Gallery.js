const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  created: {
    type: Date,
    default: Date.now
  },
  city: {
    type: String,
    required: 'please choose a city',
    trim: true
  },
  photo: {
    type: String,
    required: 'please upload a photo'
  }
});

module.exports = mongoose.model('Gallery', gallerySchema);
