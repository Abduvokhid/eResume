const express = require('express')
const svgCaptcha = require('svg-captcha')
const bcrypt = require('bcrypt')
const router = express.Router()

router.get('/login', (req, res) => {
  const { redirect_to } = req.query
  req.session.redirect_to = redirect_to
  res.render('core/login', { layout: 'core_layout' })
})

// test data
const user = {
  _id: '1',
  email: 'me@abdu.one',
  password: '$2a$08$yuk4TkNmbxGs1HKCHtLrWOVLLWS3rChzMN16uTSyFAiGlN7x6b.mO'
}

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  const error = () => {
    req.flash('error', 'Указаны неверные данные. Пожалуйста, попробуйте еще раз.')
    return res.render('core/login', { layout: 'core_layout', email, error: req.flash('error') })
  }

  // TODO: Get user from database

  if (!user) return error()

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) return error()

  req.session.user = user._id
  const redirect_to = req.session.redirect_to ? req.session.redirect_to : '/'
  delete req.session.redirect_to
  res.redirect(redirect_to)
})

router.get('/register', (req, res) => {
  const captcha = svgCaptcha.create({ size: 5, noise: 2 })
  req.session.captcha = captcha.text
  res.render('core/register', { layout: 'core_layout', captcha: captcha.data })
})

router.post('/register', (req, res) => {

})

router.post('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

router.get('/', (req, res) => {
  res.render('dashboard/index')
})

module.exports = router
