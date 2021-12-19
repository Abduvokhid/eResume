const User = require('../models/User')

module.exports.createUser = async (name) => {
  const user = new User({
    name
  })
  await user.save()
  return user
}

module.exports.getUserByID = (id) => {
  return User.findById(id)
}
