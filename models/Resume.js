const mongoose = require('mongoose')

const ResumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  name: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  job_position: {
    type: String
  },
  gender: {
    type: String,
    enum: ['hidden', 'male', 'female'],
    default: 'hidden'
  },
  living_city: {
    type: String
  },
  about: {
    type: String
  },
  educations: [{
    education: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'education'
    },
    order: Number
  }],
  jobs: [{
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'job'
    },
    order: Number
  }],
  status: {
    type: String,
    enum: ['draft', 'public', 'private'],
    default: 'draft'
  },
  edited_date: {
    type: Date,
    default: Date.now
  },
  created_date: {
    type: Date,
    default: Date.now
  }
}, {
  versionKey: false
})

module.exports = Resume = mongoose.model('resume', ResumeSchema)
