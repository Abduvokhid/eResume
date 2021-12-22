const Account = require('../models/Account')

module.exports.getAccountByID = (id) => {
  return Account.findById(id).populate('user')
}

module.exports.getAccountByEmail = (email) => {
  return Account.findOne({ method: 'password', unique_id: email.toLowerCase() })
}

module.exports.getAccountByGoogle = (google_id) => {
  return Account.findOne({ method: 'google', unique_id: google_id })
}

module.exports.getAccountByFacebook = (facebook_id) => {
  return Account.findOne({ method: 'facebook', unique_id: facebook_id })
}

module.exports.getPasswordAccountByUser = (user_id) => {
  return Account.findOne({ user: user_id, method: 'password' })
}

module.exports.createPasswordAccount = async (user_id, email, password) => {
  const account = new Account({
    user: user_id,
    method: 'password',
    unique_id: email.toLowerCase(),
    data: { password: password, is_verified: false }
  })
  await account.save()
  return account
}

module.exports.createGoogleAccount = async (user_id, google_id, email) => {
  const account = new Account({
    user: user_id,
    method: 'google',
    unique_id: google_id,
    data: { email: email }
  })
  await account.save()
  return account
}

module.exports.createFacebookAccount = async (user_id, facebook_id, email) => {
  const account = new Account({
    user: user_id,
    method: 'facebook',
    unique_id: facebook_id,
    data: { email: email }
  })
  await account.save()
  return account
}

module.exports.updateUserPassword = async (user_id, password) => {
  await Account.updateOne({ user: user_id, method: 'password' }, { 'data.password': password })
}

module.exports.markEmailVerified = async (account_id) => {
  await Account.findByIdAndUpdate(account_id, { 'data.is_verified': true })
}
