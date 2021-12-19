const { getAccountByID } = require('../DAL/account')

module.exports = async (req, res, next) => {
  if (req.session === undefined || req.session.account === undefined) return next()

  const account_id = req.session.account
  const account = await getAccountByID(account_id)
  if (!account) {
    delete req.session.account
    next()
  }

  req.user = account.user
  req.app.locals.user = account.user
  account.user = undefined
  req.account = account
  req.app.locals.account = account
  next()
}
