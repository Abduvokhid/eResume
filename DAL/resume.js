const Resume = require('../models/Resume')

module.exports.getResumes = async (user_id) => {
  return Resume.find({ user: user_id }).lean()
}

module.exports.createResume = async (user_id, title, name, job_position, about) => {
  const resume = new Resume({
    user: user_id,
    title: title,
    name: name,
    job_position: job_position,
    about: about
  })
  await resume.save()
}

module.exports.getResumeByID = async (resume_id) => {
  return Resume.findById(resume_id)
}

module.exports.updateResumeStatus = async (resume_id, status) => {
  await Resume.findByIdAndUpdate(resume_id, { status })
}

module.exports.updateResume = async (resume_id, title, name, job_position, about) => {
  await Resume.findByIdAndUpdate(resume_id, { title, name, job_position, about })
}
