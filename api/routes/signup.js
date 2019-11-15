const express = require('express')
const router = express.Router()
const config = require('config')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')
const User = require('../src/models/User')
const logger = require('../src/logger')

router.post(
  '/',
  [
    check('username', 'Invaid username')
      .trim()
      .exists()
      .isLength({ min: 1 }),
    check('password', 'Invaid password')
      .trim()
      .exists()
      .isLength({ min: 8, max: 20 })
  ],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({
          errorMessage: 'express-validator error.',
          detail: errors.mapped()
        })
    }

    const body = req.body
    User.signup(body.username, body.password).then(user => {
      logger.info(`${body.username} sign up.`)
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
    }).catch(err => {
      logger.stderr.error(err)
      res.status(400).json({
        errorMessage: err.message,
        status: 400
      })
    })
  }
)

module.exports = router
