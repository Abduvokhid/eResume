const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')

const options = {
  separator: "-",
  truncate: 120
}

mongoose.plugin(slug, options)

const ResumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  slug: {
    type: String,
    slug: 'name',
    unique: true,
    slug_padding_size: 1
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
  birthday: {
    type: Date
  },
  living_city: {
    type: String
  },
  about: {
    type: String
  },
  educations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'education'
  }],
  jobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'job'
  }],
  contacts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'contact'
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
