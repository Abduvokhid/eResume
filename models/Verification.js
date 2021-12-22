const mongoose = require('mongoose')

const VerificationSchema = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'account',
    required: true
  },
  hash: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: true,
    enum: ['validate', 'reset']
  },
  last_sent: {
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

module.exports = Verification = mongoose.model('verification', VerificationSchema)
