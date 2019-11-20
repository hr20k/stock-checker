const bookshelf = require('./Model')
const Tag = require('./Tag')

const Item = bookshelf.model('Item', {
  tableName: 'items',
  hasTimestamps: true,
  soft: ['deleted_at'],
  tags () {
    return this.belongsToMany(Tag).where('deleted_at', null)
  }
}, {
})

module.exports = Item
