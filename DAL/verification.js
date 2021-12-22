const Verification = require('../models/Verification')

module.exports.createVerification = async (account_id, hash, reason) => {
  const verification = new Verification({
    account: account_id,
    hash: hash,
    reason: reason
  })
  await verification.save()
}

module.exports.getVerification = (hash, reason) => {
  return Verification.findOne({ hash: hash, reason: reason }).populate('account')
}

module.exports.deleteVerification = async (verification_id) => {
  await Verification.findByIdAndDelete(verification_id)
}
