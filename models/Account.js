const mongoose = require('mongoose')

const AccountSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  method: {
    type: String,
    enum: ['password', 'google', 'facebook'],
    required: true
  },
  unique_id: {
    type: String,
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed
  },
  created_date: {
    type: Date,
    default: Date.now
  }
}, {
  versionKey: false
})

module.exports = Account = mongoose.model('account', AccountSchema)
