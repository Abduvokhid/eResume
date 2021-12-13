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
  status: {
    type: String,
    enum: ['draft', 'public', 'private', 'deleted'],
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
