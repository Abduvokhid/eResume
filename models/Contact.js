const mongoose = require('mongoose')

const ContactSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  type: {
    type: String,
    enum: ['email', 'phone', 'telegram'],
    required: true
  },
  value: {
    type: String,
    required: true
  },
  created_date: {
    type: Date,
    default: Date.now
  }
}, {
  versionKey: false
})

module.exports = Contact = mongoose.model('contact', ContactSchema)
