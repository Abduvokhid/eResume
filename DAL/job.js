const Job = require('../models/Job')

module.exports.deleteJob = async (job_id) => {
  await Job.findByIdAndDelete(job_id)
}
