const mongoose = require('mongoose');

const magazineSchema = new mongoose.Schema({
  created: {
    type: Date,
    default: Date.now
  },
  order: {
    type: Number,
    required: 'please enter an order number'
  },
  date: {
    type: String,
    required: 'please enter a date',
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

module.exports = mongoose.model('Magazine', magazineSchema);
