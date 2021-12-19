const Education = require('../models/Education')

module.exports.deleteEducation = async (education_id) => {
  await Education.findByIdAndDelete(education_id)
}

module.exports.addEducation = async (data) => {
  const education = new Education(data)
  await education.save()
  return education
}
