const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  created: {
    type: Date,
    default: Date.now
  },
  photo: {
    type: String,
    required: 'Plase upload a banner photo'
  }
});

module.exports = mongoose.model('Banner', bannerSchema);
