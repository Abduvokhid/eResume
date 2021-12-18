const mongoose = require('mongoose')

const JobSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  duties: {
    type: String
  },
  achievements: {
    type: String
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

module.exports = Job = mongoose.model('job', JobSchema)
