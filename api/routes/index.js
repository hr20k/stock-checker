const cors = require('cors')
const express = require('express')
const auth = require('../src/auth')()

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
router.use('/users/:id/items', auth.authenticate(), require('./items'))
router.use('/users/:id/tags', auth.authenticate(), require('./tags'))

module.exports = router
