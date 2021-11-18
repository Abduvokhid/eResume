const express = require('express')
const svgCaptcha = require('svg-captcha')
const router = express.Router()

router.get('/login', (req, res) => {
  res.render('core/login', { layout: 'core_layout' })
})

router.get('/register', (req, res) => {
  const captcha = svgCaptcha.create({size: 5, noise: 2})
  req.session.captcha = captcha.text
  res.render('core/register', { layout: 'core_layout', captcha: captcha.data })
})

router.get('/', (req, res) => {
  res.render('dashboard/index')
})

module.exports = router
