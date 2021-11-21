const { getUserByID } = require('../DAL/user')

module.exports = async (req, res, next) => {
  if (req.session === undefined || req.session.user === undefined) return next()

  const user_id = req.session.user
  const user = await getUserByID(user_id)
  if (!user) delete req.session.user

  req.user = user
  next()
}
