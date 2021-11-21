const express = require('express')
const cookieParser = require('cookie-parser')
const expressSession = require('express-session')
const expressLayouts = require('express-ejs-layouts')
const MongoDBStore = require('connect-mongodb-session')(expressSession)
const flash = require('./flash')
const authenticate = require('./authenticate')

const router = express.Router()

const mongoStore = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: 'sessions',
  connectionOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
})

router.use((req, res, next) => {
  req.app.set('view engine', 'ejs')
  req.app.locals.path = req.path
  next()
})

router.use(expressLayouts)
router.use(express.static('public'))
router.use(express.urlencoded({ extended: false }))
router.use(cookieParser(process.env.COOKIE_SECRET))
router.use(expressSession({
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: false,
  store: mongoStore,
  cookie: { maxAge: parseInt(process.env.COOKIE_MAX_AGE) }
}))
router.use(flash())
router.use(authenticate)
router.use((req, res, next) => {
  res.locals.path = req.path
  next()
})

module.exports = router
