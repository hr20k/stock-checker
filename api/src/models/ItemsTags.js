const bookshelf = require('./Model')

const ItemsTags = bookshelf.model('ItemsTags', {
  tableName: 'items_tags',
  hasTimestamps: true,
  soft: ['deleted_at']
}, {
})

module.exports = ItemsTags
