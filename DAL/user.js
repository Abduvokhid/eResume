const User = require('../models/User')

module.exports.createUser = async (name, email, password) => {
  const user = new User({
    name,
    email,
    password
  })
  await user.save()
}

module.exports.getUserByID = (id) => {
  return User.findById(id)
}

module.exports.getUserByUsername = (username) => {
  return User.findOne({ username })
}

module.exports.getUserByEmail = (email) => {
  return User.findOne({ email })
}

module.exports.updateUserPassword = async (user_id, password) => {
  await User.findByIdAndUpdate(user_id, { password })
}
