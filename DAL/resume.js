const Resume = require('../models/Resume')

module.exports.getResumes = async (user_id) => {
  return Resume.find({ user: user_id }).lean()
}

module.exports.createResume = async (user_id, title, name, job_position, about, living_city, gender, birthday) => {
  const resume = new Resume({
    user: user_id,
    title: title,
    name: name,
    job_position: !!job_position ? job_position : undefined,
    about: !!about ? about : undefined,
    living_city: !!living_city ? living_city : undefined,
    gender: gender,
    birthday: !!birthday ? birthday : undefined
  })
  await resume.save()
  return resume
}

module.exports.getResumeByID = async (resume_id) => {
  return Resume.findById(resume_id).populate({ path: 'educations' }).populate({ path: 'jobs' }).populate({ path: 'contacts' }).lean()
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

module.exports.addContactToResume = async (resume_id, contact_id) => {
  await Resume.findByIdAndUpdate(resume_id, { $push: { contacts: contact_id }, edited_date: Date.now() })
}

module.exports.deleteContactFromResume = async (resume_id, contact_id) => {
  await Resume.findByIdAndUpdate(resume_id, { $pull: { contacts: contact_id }, edited_date: Date.now() })
}

module.exports.setResumeUpdated = async (resume_id) => {
  await Resume.findByIdAndUpdate(resume_id, { edited_date: Date.now() })
}

module.exports.updateResume = async (resume_id, title, name, about, job_position, living_city, gender, birthday) => {
  const data = {
    title: title,
    name: name,
    gender: gender,
    edited_date: Date.now(),
    '$unset': {}
  }
  !!job_position ? data.job_position = job_position : data['$unset'].job_position = true
  !!about ? data.about = about : data['$unset'].about = true
  !!living_city ? data.living_city = living_city : data['$unset'].living_city = true
  !!birthday ? data.birthday = birthday : data['$unset'].birthday = true
  await Resume.findByIdAndUpdate(resume_id, data)
}
