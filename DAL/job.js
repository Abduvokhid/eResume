const Job = require('../models/Job')

module.exports.deleteJob = async (job_id) => {
  await Job.findByIdAndDelete(job_id)
}

module.exports.addJob = async (data) => {
  const job = new Job(data)
  await job.save()
  return job
}
