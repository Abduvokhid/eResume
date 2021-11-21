const User = require('../models/User')

module.exports.createUser = async (username, email, password) => {
  const user = new User({
    username,
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
