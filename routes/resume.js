const express = require('express')
const ResumeDAL = require('../DAL/resume')
const EducationDAL = require('../DAL/education')
const ContactDAL = require('../DAL/contact')
const JobDAL = require('../DAL/job')
const checkPermission = require('../middlewares/checkPermission')
const { sortByDates } = require('../helpers/sorters')
const router = express.Router()

router.get('/', checkPermission(), async (req, res) => {
  const user_resumes = await ResumeDAL.getResumes(req.user._id)
  res.render('resume/index', { user_resumes })
})

router.get('/new', checkPermission(), async (req, res) => {
  res.render('resume/new')
})

router.post('/new', checkPermission(), async (req, res) => {
  const { title, name, job_position, about, living_city, gender, birthday } = req.body
  const resume = await ResumeDAL.createResume(req.user._id, title, name, job_position, about, living_city, gender, birthday)
  res.redirect(`/resume/${resume._id}`)
})

router.post('/:id/edit', checkPermission(), async (req, res) => {
  const resume = await ResumeDAL.getResumeByID(req.params.id)
  if (!resume) return res.status(404).render('core/not_found', { layout: 'core_layout' })
  if (resume.user.toString() !== req.user._id.toString()) return res.status(404).render('core/not_found', { layout: 'core_layout' })
  const { title, name, about, job_position, living_city, gender, birthday } = req.body
  await ResumeDAL.updateResume(req.params.id, title, name, about, job_position, living_city, gender, birthday)
  res.redirect(`/resume/${req.params.id}`)
})

router.post('/:id/status', checkPermission(), async (req, res) => {
  const resume = await ResumeDAL.getResumeByID(req.params.id)
  if (!resume) return res.status(404).render('core/not_found', { layout: 'core_layout' })
  if (resume.user.toString() !== req.user._id.toString()) return res.status(404).render('core/not_found', { layout: 'core_layout' })

  const status = req.body.status
  if (!['draft', 'public', 'private'].includes(status)) return res.status(404).render('core/not_found', { layout: 'core_layout' })
  await ResumeDAL.updateResumeStatus(req.params.id, status)
  res.redirect('/resume')
})

router.post('/:id/delete', checkPermission(), async (req, res) => {
  const resume = await ResumeDAL.getResumeByID(req.params.id)
  if (!resume) return res.status(404).render('core/not_found', { layout: 'core_layout' })
  if (resume.user.toString() !== req.user._id.toString()) return res.status(404).render('core/not_found', { layout: 'core_layout' })

  for (const education of resume.educations) await EducationDAL.deleteEducation(education._id)
  for (const job of resume.jobs) await JobDAL.deleteJob(job._id)
  await ResumeDAL.deleteResume(resume._id)
  res.redirect('/resume')
})

router.post('/:id/add_job', checkPermission(), async (req, res) => {
  const resume = await ResumeDAL.getResumeByID(req.params.id)
  if (!resume) return res.status(404).render('core/not_found', { layout: 'core_layout' })
  if (resume.user.toString() !== req.user._id.toString()) return res.status(404).render('core/not_found', { layout: 'core_layout' })

  const data = { ...req.body, user: req.user._id }

  if (data.title === '') delete data.title
  if (data.company === '') delete data.company
  if (data.location === '') delete data.location
  if (data.duties === '') delete data.duties
  if (data.achievements === '') data.achievements = undefined
  data.from_date = Date.parse(req.body.from_date) || undefined
  if (data.from_date === undefined) delete data.from_date
  data.to_date = Date.parse(req.body.to_date) || undefined
  if (data.to_date === undefined) delete data.to_date

  const job = await JobDAL.addJob(data)
  await ResumeDAL.addJobToResume(resume._id, job._id)

  res.redirect(`/resume/${req.params.id}`)
})

router.post('/:id/add_education', checkPermission(), async (req, res) => {
  const resume = await ResumeDAL.getResumeByID(req.params.id)
  if (!resume) return res.status(404).render('core/not_found', { layout: 'core_layout' })
  if (resume.user.toString() !== req.user._id.toString()) return res.status(404).render('core/not_found', { layout: 'core_layout' })

  const data = { ...req.body, user: req.user._id }

  if (data.name === '') delete data.name
  if (data.course === '') delete data.course
  if (data.award === '') delete data.award
  if (data.location === '') delete data.location
  data.from_date = Date.parse(req.body.from_date) || undefined
  if (data.from_date === undefined) delete data.from_date
  data.to_date = Date.parse(req.body.to_date) || undefined
  if (data.to_date === undefined) delete data.to_date

  const education = await EducationDAL.addEducation(data)
  await ResumeDAL.addEducationToResume(resume._id, education._id)

  res.redirect(`/resume/${req.params.id}`)
})

router.post('/:id/add_contact', checkPermission(), async (req, res) => {
  const resume = await ResumeDAL.getResumeByID(req.params.id)
  if (!resume) return res.status(404).render('core/not_found', { layout: 'core_layout' })
  if (resume.user.toString() !== req.user._id.toString()) return res.status(404).render('core/not_found', { layout: 'core_layout' })

  const data = { ...req.body, user: req.user._id }

  const contact = await ContactDAL.createContact(data)
  await ResumeDAL.addContactToResume(resume._id, contact._id)

  res.redirect(`/resume/${req.params.id}`)
})

router.post('/:id/delete_job/:job_id', checkPermission(), async (req, res) => {
  const resume = await ResumeDAL.getResumeByID(req.params.id)
  if (!resume) return res.status(404).render('core/not_found', { layout: 'core_layout' })
  if (resume.user.toString() !== req.user._id.toString()) return res.status(404).render('core/not_found', { layout: 'core_layout' })

  await ResumeDAL.deleteJobFromResume(resume._id, req.params.job_id)
  await JobDAL.deleteJob(req.params.job_id)

  res.redirect(`/resume/${req.params.id}`)
})

router.post('/:id/delete_education/:education_id', checkPermission(), async (req, res) => {
  const resume = await ResumeDAL.getResumeByID(req.params.id)
  if (!resume) return res.status(404).render('core/not_found', { layout: 'core_layout' })
  if (resume.user.toString() !== req.user._id.toString()) return res.status(404).render('core/not_found', { layout: 'core_layout' })

  await ResumeDAL.deleteEducationFromResume(resume._id, req.params.education_id)
  await EducationDAL.deleteEducation(req.params.education_id)

  res.redirect(`/resume/${req.params.id}`)
})

router.get('/:id', checkPermission(), async (req, res) => {
  const resume = await ResumeDAL.getResumeByID(req.params.id)
  if (!resume) return res.status(404).render('core/not_found', { layout: 'core_layout' })
  if (resume.user.toString() !== req.user._id.toString()) return res.status(404).render('core/not_found', { layout: 'core_layout' })
  resume.jobs.sort(sortByDates)
  resume.educations.sort(sortByDates)
  res.render('resume/show', { resume })
})

module.exports = router
