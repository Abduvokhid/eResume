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
  educations: [{
    education: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'education'
    },
    order: Number
  }],
  status: {
    type: String,
    enum: ['draft', 'public', 'hidden', 'deleted'],
    default: 'draft'
  }
}, {
  versionKey: false
})

module.exports = Resume = mongoose.model('resume', ResumeSchema)
