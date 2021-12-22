const express = require('express')
const svgCaptcha = require('svg-captcha')
const bcrypt = require('bcrypt')
const userDAL = require('../DAL/user')
const accountDAL = require('../DAL/account')
const verificationDAL = require('../DAL/verification')
const { sendVerification } = require('../services/sendinblue')
const checkPermission = require('../middlewares/checkPermission')
const sha1 = require('sha1')
const router = express.Router()

router.get('/login', async (req, res) => {
  if (req.user) return res.redirect('/')
  const { redirect_to } = req.query
  if (redirect_to) req.session.redirect_to = redirect_to
  const success = await req.getFlash('register_success')
  const password_success = req.cookies.password_success
  res.clearCookie('password_success')
  res.render('core/login', {
    layout: 'core_layout',
    password_success: password_success,
    success: success,
    domain: process.env.CURRENT_DOMAIN || 'http://localhost:5000'
  })
})

router.post('/login', async (req, res) => {
  if (req.user) return res.redirect('/')

  const { email, password } = req.body

  const error = async () => {
    await req.flash('login_error', 'Указаны неверные данные. Пожалуйста, попробуйте еще раз.')
    return res.render('core/login', {
      layout: 'core_layout', email,
      domain: process.env.CURRENT_DOMAIN || 'http://localhost:5000', error: await req.getFlash('login_error')
    })
  }

  const account = await accountDAL.getAccountByEmail(email)

  if (!account) return await error()

  const isMatch = await bcrypt.compare(password, account.data.password)
  if (!isMatch) return await error()

  req.session.account = account._id
  const redirect_to = req.session.redirect_to ? decodeURIComponent(req.session.redirect_to) : '/'
  delete req.session.redirect_to
  res.redirect(redirect_to)
})

router.get('/register', (req, res) => {
  if (req.user) return res.redirect('/')

  const captcha = svgCaptcha.create({ size: 5, noise: 2 })
  req.session.captcha = captcha.text
  res.render('core/register', {
    layout: 'core_layout', captcha: captcha.data,
    domain: process.env.CURRENT_DOMAIN || 'http://localhost:5000'
  })
})

router.post('/register', async (req, res) => {
  if (req.user) return res.redirect('/')

  const { name, email, password, confirm_password, captcha } = req.body

  const error = async (message) => {
    await req.flash('register_error', message)
    const captcha = svgCaptcha.create({ size: 5, noise: 2 })
    req.session.captcha = captcha.text
    return res.render('core/register', {
      layout: 'core_layout',
      name, email,
      error: await req.getFlash('register_error'),
      captcha: captcha.data,
      domain: process.env.CURRENT_DOMAIN || 'http://localhost:5000'
    })
  }

  if (!captcha || !name || !password || !email) return await error('Все поля обязательны.')

  if (captcha !== req.session.captcha) return await error('Неверно! Подтвердите, что вы не робот.')

  if (password !== confirm_password) return await error('Пароли не совпадают. Проверьте и попробуйте заново.')

  if (await accountDAL.getAccountByEmail(email)) return await error('Пользователь с такой почтой уже существует.')

  const password_hash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS))

  await req.flash('register_success', 'Ваш аккаунт успешно зарегистрирован!')
  const user = await userDAL.createUser(name)
  const account = await accountDAL.createPasswordAccount(user._id, email, password_hash)

  const hash = sha1(`${account._id}${email}${Date.now()}`)
  await verificationDAL.createVerification(account._id, hash, 'validate')
  await sendVerification(email, `${process.env.CURRENT_DOMAIN}/validate/${hash}`)
  res.redirect('/login')
})

router.post('/logout', async (req, res) => {
  await req.session.destroy()
  res.redirect('/')
})

router.get('/account', checkPermission(), (req, res) => {
  res.render('dashboard/account')
})

router.get('/settings', checkPermission(), async (req, res) => {
  const flash = await req.getFlash()
  return res.render('dashboard/settings', { flash })
})

router.post('/settings/password', checkPermission(), async (req, res) => {
  const error = async (type, message) => {
    await req.flash(type, message)
    await res.redirect('/settings')
  }

  const { old_password, new_password, new_password_confirm } = req.body

  if (new_password_confirm !== new_password) return await error('passwords_mismatch', 'Новые пароли не совпадают. Попробуйте заново.')

  const account = await accountDAL.getPasswordAccountByUser(req.user._id)

  const isMatch = await bcrypt.compare(old_password, account.data.password)
  if (!isMatch) return await error('incorrect_password', 'Неправильный пароль. Попробуйте заново.')

  const password_hash = await bcrypt.hash(new_password, parseInt(process.env.BCRYPT_ROUNDS))
  await accountDAL.updateUserPassword(req.user._id, password_hash)

  req.session.regenerate(() => {})
  res.cookie('password_success', 'Пароль успешно изменён! Теперь авторизуйтесь.')

  return res.redirect('/login')
})

router.get('/validate/:hash', async (req, res) => {
  const verification = await verificationDAL.getVerification(req.params.hash, 'validate')
  if (!verification || !verification.account || !verification.account.user) {
    return res.render('core/verify', { layout: 'core_layout', message: 'Э-почта не может быть подтверждена. Попробуйте заново или обращайтесь службе поддержки.', type: 'danger' })
  }

  // await accountDAL.markEmailVerified(verification.account._id)
  // await verificationDAL.deleteVerification(verification._id)

  // res.send(verification)

  res.render('core/verify', { layout: 'core_layout', message: 'Э-почта подтверждена', type: 'success' })
})

router.get('/', checkPermission(), (req, res) => {
  res.render('dashboard/index')
})

module.exports = router
