const express = require('express')
const svgCaptcha = require('svg-captcha')
const bcrypt = require('bcrypt')
const userDAL = require('../DAL/user')
const checkPermission = require('../middlewares/checkPermission')
const router = express.Router()

router.get('/google_register', (req, res) => {

  console.log(req.query)

  res.redirect('/')
})

module.exports = router
