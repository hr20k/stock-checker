const express = require('express')
const router = express.Router({ mergeParams: true })
const { check, validationResult } = require('express-validator')
const Tag = require('../src/models/Tag')
const ItemsTags = require('../src/models/ItemsTags')
const logger = require('../src/logger')

router.get('/', (req, res) => {
  Tag.forge()
    .where('user_id', req.params.id)
    .fetchAll()
    .then(tags => {
      res.json({ tags })
    })
    .catch(Tag.NotFoundError, () => {
      res.json({ tags: [] })
    })
    .catch(err => {
      logger.stderr.error(err.message)
      res.status(400)
        .json({
          errorMessage: err.message,
          status: 400
        })
    })
})

router.post('/', [
  check('name', 'The name field didn\'t exist').exists()
], (req, res) => {
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
  new Tag({ user_id: req.params.id, name: req.body.name, color: req.body.color })
    .save()
    .then((tag) => {
      res
        .status(201)
        .location(`/users/${req.params.id}/tags/${tag.get('id')}`)
        .end()
    })
    .catch((err) => {
      logger.stderr.error(err)
      res.status(400).json({ errorMessage: err.message, status: 400 })
    })
})

router.put('/:tagId', [
  check('name', 'The name field didn\'t exist').exists()
], (req, res) => {
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
  new Tag({ id: req.params.tagId })
    .save({ name: req.body.name, color: req.body.color }, { method: 'update', require: true, patch: true })
    .then((item) => {
      res.json(item)
    })
    .catch(err => {
      logger.stderr.error(err)
      res.status(400).json({ errorMessage: err.message, status: 400 })
    })
})

router.delete('/:tagId', (req, res) => {
  new ItemsTags({ tag_id: req.params.tagId })
    .fetchAll()
    .then(result => {
      result.invokeThen('destroy')
        .then(() => {
          return result
        })
    })
    .catch(err => {
      logger.stderr.error(err)
      res.status(400).json({ errorMessage: err.message, status: 400 })
    })
    .then(() => {
      new Tag({ id: req.params.tagId })
        .destroy()
        .then(() => {
          res.status(200).end()
        })
        .catch(err => {
          logger.stderr.error(err)
          res.status(400).json({ errorMessage: err.message, status: 400 })
        })
    })
})

module.exports = router
