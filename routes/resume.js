const express = require('express')
const { getUserResumes } = require('../DAL/resume')
const checkPermission = require('../middlewares/checkPermission')
const router = express.Router()

router.get('/', checkPermission(), async (req, res) => {
  const user_resumes = await getUserResumes(req.user._id)
  const resumes = {
    public: [],
    private: [],
    draft: [],
  }
  for (const resume of user_resumes) {
    resumes[resume.status].push(resume)
  }
  res.render('resume/index', { resumes })
})

router.get('/new', checkPermission(), async (req, res) => {
  res.render('resume/new')
})

router.post('/new', checkPermission(), async (req, res) => {
  console.log(req.body)
})

module.exports = router
