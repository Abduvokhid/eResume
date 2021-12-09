const Resume = require('../models/Resume')

module.exports.getUserResumes = async (user_id) => {
  return Resume.find({ user: user_id }).lean()
}
