const cors = require('cors')
const express = require('express')
const auth = require('../src/auth')()
const util = require('../src/util')

const router = express.Router()

router.use(cors({
  exposedHeaders: 'location'
}))
router.use('/signup', require('./signup'))
router.use('/login', require('./login'))
router.use('/verify', auth.authenticate(), function (req, res, next) { res.sendStatus(200) })
router.use('/images', auth.authenticate(), require('./images'))
router.use('/users/:id/items', auth.authenticate(), function (req, res, next) {
  if (util.checkTokenAndPath(req)) {
    next()
  } else {
    res.sendStatus(401)
  }
}, require('./items'))
router.use('/users/:id/tags', auth.authenticate(), function (req, res, next) {
  if (util.checkTokenAndPath(req)) {
    next()
  } else {
    res.sendStatus(401)
  }
}, require('./tags'))

module.exports = router
