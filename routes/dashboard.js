const express = require('express')
const svgCaptcha = require('svg-captcha')
const bcrypt = require('bcrypt')
const userDAL = require('../DAL/user')
const checkPermission = require('../middlewares/checkPermission')
const router = express.Router()

router.get('/login', async (req, res) => {
  if (req.user) return res.redirect('/')
  const { redirect_to } = req.query
  if (redirect_to) req.session.redirect_to = redirect_to
  res.render('core/login', { layout: 'core_layout', success: await req.getFlash('info') })
})

router.post('/login', async (req, res) => {
  if (req.user) return res.redirect('/')

  const { email, password } = req.body

  const error = async () => {
    await req.flash('error', 'Указаны неверные данные. Пожалуйста, попробуйте еще раз.')
    return res.render('core/login', { layout: 'core_layout', email, error: await req.getFlash('error') })
  }

  const user = await userDAL.getUserByEmail(email)

  if (!user) return await error()

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) return await error()

  req.session.user = user._id
  const redirect_to = req.session.redirect_to ? decodeURIComponent(req.session.redirect_to) : '/'
  delete req.session.redirect_to
  res.redirect(redirect_to)
})

router.get('/register', (req, res) => {
  if (req.user) return res.redirect('/')

  const captcha = svgCaptcha.create({ size: 5, noise: 2 })
  req.session.captcha = captcha.text
  res.render('core/register', { layout: 'core_layout', captcha: captcha.data })
})

router.post('/register', async (req, res) => {
  if (req.user) return res.redirect('/')

  const { username, email, password, confirm_password, captcha } = req.body

  const error = async (message) => {
    await req.flash('error', message)
    const captcha = svgCaptcha.create({ size: 5, noise: 2 })
    req.session.captcha = captcha.text
    return res.render('core/register', {
      layout: 'core_layout',
      username, email,
      error: await req.getFlash('error'),
      captcha: captcha.data
    })
  }

  if (!captcha || !username || !password || !email) return await error('Все поля обязательны.')

  if (captcha !== req.session.captcha) return await error('Неверно! Подтвердите, что вы не робот.')

  if (password !== confirm_password) return await error('Пароли не совпадают. Проверьте и попробуйте заново.')

  if (await userDAL.getUserByUsername(username)) return await error('Пользователь с таким юзернеймом уже существует.')
  if (await userDAL.getUserByEmail(email)) return await error('Пользователь с такой почтой уже существует.')

  const password_hash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS))

  await req.flash('info', 'Ваш аккаунт успешно зарегистрирован!')
  await userDAL.createUser(username, email, password_hash)
  res.redirect('/login')
})

router.post('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

router.get('/', checkPermission(), (req, res) => {
  res.render('dashboard/index')
})

module.exports = router
