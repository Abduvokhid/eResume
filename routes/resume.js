const express = require('express')
const ResumeDAL = require('../DAL/resume')
const EducationDAL = require('../DAL/education')
const JobDAL = require('../DAL/job')
const checkPermission = require('../middlewares/checkPermission')
const router = express.Router()

router.get('/', checkPermission(), async (req, res) => {
  const user_resumes = await ResumeDAL.getResumes(req.user._id)
  // const resumes = {
  //   public: [],
  //   private: [],
  //   draft: [],
  // }
  // for (const resume of user_resumes) {
  //   resumes[resume.status].push(resume)
  // }
  res.render('resume/index', { user_resumes })
})

router.get('/new', checkPermission(), async (req, res) => {
  res.render('resume/new')
})

router.post('/new', checkPermission(), async (req, res) => {
  const { title, name, job_position, about, living_city, gender } = req.body
  await ResumeDAL.createResume(req.user._id, title, name, job_position, about, living_city, gender)
  res.redirect('/resume')
})

router.get('/:id/edit', checkPermission(), async (req, res) => {
  const resume = await ResumeDAL.getResumeByID(req.params.id)
  if (!resume) return res.status(404).render('core/not_found', { layout: 'core_layout' })
  if (resume.user.toString() !== req.user._id.toString()) return res.status(404).render('core/not_found', { layout: 'core_layout' })
  res.render('resume/edit', { resume })
})

router.post('/:id/edit', checkPermission(), async (req, res) => {
  const resume = await ResumeDAL.getResumeByID(req.params.id)
  if (!resume) return res.status(404).render('core/not_found', { layout: 'core_layout' })
  if (resume.user.toString() !== req.user._id.toString()) return res.status(404).render('core/not_found', { layout: 'core_layout' })
  const { title, name, about, job_position, living_city, gender } = req.body
  await ResumeDAL.updateResume(req.params.id, title, name, about, job_position, living_city, gender)
  res.redirect('/resume')
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
  for (const education of resume.educations) await EducationDAL.deleteEducation(education._id)
  for (const job of resume.jobs) await JobDAL.deleteJob(job._id)
  await ResumeDAL.deleteResume(resume._id)
  res.redirect('/resume')
})

router.get('/:id', checkPermission(), async (req, res) => {
  const resume = await ResumeDAL.getResumeByID(req.params.id)
  if (!resume) return res.status(404).render('core/not_found', { layout: 'core_layout' })
  if (resume.user.toString() !== req.user._id.toString()) return res.status(404).render('core/not_found', { layout: 'core_layout' })
  res.render('resume/show', { resume })
})

module.exports = router
