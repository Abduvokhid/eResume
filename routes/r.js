const express = require('express')
const ResumeDAL = require('../DAL/resume')
const router = express.Router()

router.get('/:id', async (req, res) => {
  const resume = await ResumeDAL.getResumeByID(req.params.id)
  res.send(resume)
})

module.exports = router
