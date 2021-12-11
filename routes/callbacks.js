const express = require('express')
const svgCaptcha = require('svg-captcha')
const bcrypt = require('bcrypt')
const userDAL = require('../DAL/user')
const checkPermission = require('../middlewares/checkPermission')
const axios = require('axios')
const router = express.Router()

router.get('/google_register', async (req, res) => {
  const error = async (msg) => {
    await req.flash('error', msg)
    return res.render('core/login', { layout: 'core_layout', error: await req.getFlash('error') })
  }

  const {
    is_new,
    access_token
  } = req.query

  if (!is_new) {
    if (!access_token) return error('Что-то пошло не так. Попробуйте позже.')

    const userinfo = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', { headers: { 'Authorization': 'Bearer ' + access_token } })
    const { name, email, picture } = userinfo.data

    let user = await userDAL.getUserByEmail(email)

    if (!user) {
      const password_hash = await bcrypt.hash(`${picture}${email}${name}`, parseInt(process.env.BCRYPT_ROUNDS))
      await userDAL.createUser(name, email, password_hash)
      user = await userDAL.getUserByEmail(email)
    }

    req.session.user = user._id

    const redirect_to = req.session.redirect_to ? decodeURIComponent(req.session.redirect_to) : '/'
    delete req.session.redirect_to
    res.redirect(redirect_to)

  } else {
    res.render('callbacks/google_register', { layout: false })
  }
})

module.exports = router
