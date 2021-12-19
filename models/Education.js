const mongoose = require('mongoose')

const EducationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  course: {
    type: String,
    required: true
  },
  award: {
    type: String
  },
  location: {
    type: String,
    required: true
  },
  from_date: {
    type: Number,
    required: true
  },
  to_date: {
    type: Number
  },
  created_date: {
    type: Date,
    default: Date.now
  }
}, {
  versionKey: false
})

module.exports = Education = mongoose.model('education', EducationSchema)
