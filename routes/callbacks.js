const express = require('express')
const svgCaptcha = require('svg-captcha')
const bcrypt = require('bcrypt')
const userDAL = require('../DAL/user')
const checkPermission = require('../middlewares/checkPermission')
const router = express.Router()

router.get('/google_register', (req, res) => {
  const error = async (msg) => {
    await req.flash('error', msg)
    return res.render('core/login', { layout: 'core_layout', error: await req.getFlash('error') })
  }

  const {
    is_new,
    token
  } = req.query

  if (!is_new) {
    if (!token) return error('Что-то пошло не так. Попробуйте позже.')

  } else {
    res.render('callbacks/google_register', { layout: false })
  }
})

module.exports = router
