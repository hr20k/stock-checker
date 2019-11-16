const cors = require('cors')
const express = require('express')
const auth = require('../src/auth')()
const util = require('../src/util')
const logger = require('../src/logger')

const router = express.Router()

router.use(
  cors({
    origin: '*',
    methods: 'GET,PUT,POST,DELETE',
    allowedHeaders:
      'Access-Control-Allow-Origin,Content-Type,Accept,Accept-Encoding,Accept-Language,Origin,Referer,User-Agent,Authorization',
    exposedHeaders:
      'x-sc-user,x-sc-token'
  })
)
router.use('/signup', require('./signup'))
router.use('/login', require('./login'))
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
