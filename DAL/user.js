const User = require('../models/User')

module.exports.createUser = async (name) => {
  const user = new User({
    name
  })
  await user.save()
  return user
}

module.exports.updateEmailPreferences = async (id, data) => {
  await User.findByIdAndUpdate(id, {email_preferences: data})
}

module.exports.getUserByID = (id) => {
  return User.findById(id)
}
