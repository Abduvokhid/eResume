const express = require('express')
const router = express.Router()

router.use('/', require('./dashboard'))
router.use((req, res) => res.status(404).send('Sorry can\'t find that!'))

module.exports = router
