const express = require('express')
const router = express.Router()

router.use('/callbacks', require('./callbacks'))
router.use('/', require('./dashboard'))
router.use('/resume', require('./resume'))
router.use((req, res) => res.status(404).render('core/not_found', { layout: 'core_layout' }))

module.exports = router
