const Resume = require('../models/Resume')

module.exports.getResumes = async (user_id) => {
  return Resume.find({ user: user_id }).lean()
}

module.exports.createResume = async (user_id, title, name, about) => {
  const resume = new Resume({
    user: user_id,
    title: title,
    name: name,
    about: about
  })
  await resume.save()
}

module.exports.getResumeByID = async (resume_id) => {
  return Resume.findById(resume_id)
}
