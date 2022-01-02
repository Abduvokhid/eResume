const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email_preferences: {
    new_features: {
      type: Boolean,
      default: true
    }
  },
  created_date: {
    type: Date,
    default: Date.now
  }
}, {
  versionKey: false
})

module.exports = User = mongoose.model('user', UserSchema)
