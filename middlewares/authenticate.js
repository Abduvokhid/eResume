const { getAccountByID } = require('../DAL/account')
const { getResumes } = require('../DAL/resume')

module.exports = async (req, res, next) => {
  if (req.session === undefined || req.session.account === undefined) return next()

  const account_id = req.session.account
  const account = await getAccountByID(account_id)
  if (!account) {
    delete req.session.account
    return next()
  }

  req.user = account.user
  req.app.locals.user = account.user
  account.user = undefined
  req.account = account
  req.app.locals.account = account

  req.user.resumes = await getResumes(req.user._id)

  next()
}
