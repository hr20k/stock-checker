const express = require('express')
const router = express.Router({ mergeParams: true })
const { check, validationResult } = require('express-validator')
const Item = require('../src/models/Item')
const ItemsTags = require('../src/models/ItemsTags')
const logger = require('../src/logger')

router.get('/', (req, res) => {
  Item.forge()
    .where('user_id', req.params.id)
    .fetchAll({ withRelated: ['tags'] })
    .then(items => {
      res.json({ items })
    })
    .catch(Item.NotFoundError, () => {
      res.json({ items: [] })
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
  check('item.name', 'The name field didn\'t exist').exists(),
  check('item.quantity', 'The quantity field didn\'t exist').exists().isInt().withMessage('The quantity field needs Integer.')
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
  const tags = req.body.tags
  const item = req.body.item
  delete item.id
  item.user_id = req.params.id

  new Item(item)
    .save()
    .then((item) => {
      console.log('item: ', item.attributes)

      const itemsTags = tags.map(tag => {
        return {
          item_id: item.get('id'),
          tag_id: tag
        }
      })
      ItemsTags.collection(itemsTags)
        .invokeThen('save')
        .then(() => {
          res
            .status(201)
            .location(`/users/${req.params.id}/items/${item.get('id')}`)
            .end()
        })
    })
    .catch((err) => {
      logger.stderr.error(err)
      res.status(400).json({ errorMessage: err.message, status: 400 })
    })
})

router.put('/:itemId', (req, res) => {
  const tags = req.body.tags
  const item = req.body.item
  item.id = req.params.itemId
  delete item.user_id

  new Item()
    .where('id', req.params.itemId)
    .save(item, { method: 'update', require: true, patch: true })
    .then((item) => {
      new ItemsTags({ item_id: item.get('id') })
        .fetchAll()
        .then(result => {
          result.invokeThen('destroy')
            .then(() => {
              console.log({ result })
              return result
            })
        })
        .catch(err => {
          logger.stderr.error(err)
          res.status(400).json({ errorMessage: err.message, status: 400 })
        })
        .then(() => {
          const itemsTags = tags.map(tag => {
            return {
              item_id: item.get('id'),
              tag_id: tag
            }
          })
          ItemsTags.collection(itemsTags)
            .invokeThen('save')
            .then(() => {
              res.json(item)
            })
        })
    }).catch(err => {
      logger.stderr.error(err)
      res.status(400).json({ errorMessage: err.message, status: 400 })
    })
})

router.delete('/:itemId', (req, res) => {
  new ItemsTags({ item_id: req.params.itemId })
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
      new Item({ id: req.params.itemId })
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
