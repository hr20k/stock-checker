const express = require('express')
const router = express.Router()
const config = require('config')
const jwt = require('jsonwebtoken')
const User = require('../src/models/User')
const { check, validationResult } = require('express-validator')
const logger = require('../src/logger')

router.post('/',
  [
    check('username', 'The username didn\'t exist').exists(),
    check('password', 'The password didn\'t exist').exists()
  ],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({
          errorMessage: 'express-validator error.',
          status: 400,
          detail: errors.mapped()
        })
    }
    const body = req.body

    User.login(body.username, body.password).then((user) => {
      const payload = { id: user.attributes.id, username: user.attributes.username }
      const token = jwt.sign(payload, config.jwt.secretKey, { expiresIn: config.jwt.expire })
      logger.info(`${body.username} login.`)
      res.json({
        'x-sc-user': {
          id: user.attributes.id,
          username: user.attributes.username
        },
        'x-sc-token': token
      })
    }).catch(User.NotFoundError, (err) => {
      logger.stderr.error(err)
      res.status(404).json({
        errorMessage: `${body.username} not found.`,
        status: 404
      })
    }).catch((err) => {
      logger.stderr.error(err)
      res.status(400).json({
        errorMessage: err.message,
        status: 400
      })
    })
  })

module.exports = router
