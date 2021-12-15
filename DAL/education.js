const Education = require('../models/Education')

module.exports.deleteEducation = async (education_id) => {
  await Education.findByIdAndDelete(education_id)
}
