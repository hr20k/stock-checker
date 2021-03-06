const bookshelf = require('./Model')
const Item = require('./Item')

const Tag = bookshelf.model('Tag', {
  tableName: 'tags',
  hasTimestamps: true,
  items () {
    return this.belongsToMany(Item).where('deleted_at', null)
  }
}, {
})

module.exports = Tag
