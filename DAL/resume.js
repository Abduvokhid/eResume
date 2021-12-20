const Resume = require('../models/Resume')

module.exports.getResumes = async (user_id) => {
  return Resume.find({ user: user_id }).lean()
}

module.exports.createResume = async (user_id, title, name, job_position, about, living_city, gender) => {
  const resume = new Resume({
    user: user_id,
    title: title,
    name: name,
    job_position: job_position,
    about: about,
    living_city: living_city,
    gender: gender
  })
  await resume.save()
  return resume
}

module.exports.getResumeByID = async (resume_id) => {
  return Resume.findById(resume_id).populate({ path: 'educations' }).populate({ path: 'jobs' }).lean()
}

module.exports.updateResumeStatus = async (resume_id, status) => {
  await Resume.findByIdAndUpdate(resume_id, { status })
}

module.exports.deleteResume = async (resume_id) => {
  await Resume.findByIdAndDelete(resume_id)
}

module.exports.addJobToResume = async (resume_id, job_id) => {
  await Resume.findByIdAndUpdate(resume_id, { $push: { jobs: job_id }, edited_date: Date.now() })
}

module.exports.deleteJobFromResume = async (resume_id, job_id) => {
  await Resume.findByIdAndUpdate(resume_id, { $pull: { jobs: job_id }, edited_date: Date.now() })
}

module.exports.addEducationToResume = async (resume_id, education_id) => {
  await Resume.findByIdAndUpdate(resume_id, { $push: { educations: education_id }, edited_date: Date.now() })
}

module.exports.deleteEducationFromResume = async (resume_id, education_id) => {
  await Resume.findByIdAndUpdate(resume_id, { $pull: { educations: education_id }, edited_date: Date.now() })
}

module.exports.setResumeUpdated = async (resume_id) => {
  await Resume.findByIdAndUpdate(resume_id, { edited_date: Date.now() })
}

module.exports.updateResume = async (resume_id, title, name, about, job_position, living_city, gender) => {
  await Resume.findByIdAndUpdate(resume_id, {
    title: title,
    name: name,
    job_position: job_position,
    about: about,
    living_city: living_city,
    gender: gender,
    edited_date: Date.now()
  })
}
