const express = require('express')
const router = express.Router()
const config = require('config')
const AWS = require('aws-sdk')
const util = require('../src/util')
const logger = require('../src/logger')

AWS.config.update({
  region: config.aws.s3.region
})

router.post('/', (req, res) => {
  // console.log({ req: req.body.data })
  const filename = util.generateUuid()

  const s3 = new AWS.S3()
  const params = {
    Body: req.body.data,
    Bucket: config.aws.s3.bucketName,
    Key: `public/images/${filename}.jpeg`
  }
  s3.putObject(params, function (err, data) {
    if (err) {
      logger.stderr.error(err)
      console.log({ err })
      res.status(400).json({
        errorMessage: err.message,
        status: 400
      })
    }
    console.log({ data })
    res
      .status(201)
      .location(`/public/images/${filename}.jpeg`)
      .end()
    return res
  })
})

module.exports = router
