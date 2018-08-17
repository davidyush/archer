const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: 'Please enter a title name'
  },
  description: {
    type: String,
    trim: true,
    required: 'Plase enter a description'
  },
  created: {
    type: Date,
    default: Date.now
  },
  photo: String
});

module.exports = mongoose.model('Teacher', teacherSchema);
