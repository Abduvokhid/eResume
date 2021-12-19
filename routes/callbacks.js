const express = require('express')
const userDAL = require('../DAL/user')
const accountDAL = require('../DAL/account')
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
    const { id, name, email } = userinfo.data

    let account = await accountDAL.getAccountByGoogle(id)

    if (!account) {
      const user = await userDAL.createUser(name)
      account = await accountDAL.createGoogleAccount(user._id, id, email)
      req.session.account = account._id
    } else {
      req.session.account = account._id
    }

    const redirect_to = req.session.redirect_to ? decodeURIComponent(req.session.redirect_to) : '/'
    delete req.session.redirect_to
    res.redirect(redirect_to)

  } else {
    res.render('callbacks/google_register', { layout: false })
  }
})

router.get('/facebook_register', async (req, res) => {
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

    const userinfo = await axios.get('https://graph.facebook.com/v12.0/me', {
      params: {
        fields: 'id,name,email',
        access_token: access_token
      }
    })
    const { id, name, email } = userinfo.data

    let account = await accountDAL.getAccountByFacebook(id)

    if (!account) {
      const user = await userDAL.createUser(name)
      account = await accountDAL.createFacebookAccount(user._id, id, email)
      req.session.account = account._id
    } else {
      req.session.account = account._id
    }

    const redirect_to = req.session.redirect_to ? decodeURIComponent(req.session.redirect_to) : '/'
    delete req.session.redirect_to
    res.redirect(redirect_to)

  } else {
    res.render('callbacks/facebook_register', { layout: false })
  }
})

module.exports = router
