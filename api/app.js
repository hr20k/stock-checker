const express = require('express')
const morgan = require('morgan')
const FileStreamRotator = require('file-stream-rotator')
const path = require('path')
const fs = require('fs-extra')
const bodyParser = require('body-parser')
const auth = require('./src/auth')()
const routes = require('./routes/index')
const moment = require('moment')

const logger = require('./src/logger')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(auth.initialize())
app.use('/v1', routes)

const logDirectory = path.join(__dirname, './logs')
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
const accessLogStream = FileStreamRotator.getStream({
  filename: logDirectory + '/access-%DATE%.log',
  frequency: 'daily',
  verbose: false,
  date_format: 'YYYY-MM-DD'
})
app.use(morgan('combined', { stream: accessLogStream }))

app.use(function (req, res, next) {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

app.use(function (err, req, res, next) {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  if (!err.status || err.status >= 500) {
    logger.stderr.error(err)
  }

  res.status(err.status || 500)
  res.json({
    errorMessage: err.message,
    status: err.status
  })
})

app.set('json replacer', function (key, value) {
  if (this[key] instanceof Date) {
    value = moment.utc(this[key]).format('YYYY-MM-DD HH:mm:ss')
  }

  return value
})

module.exports = app
