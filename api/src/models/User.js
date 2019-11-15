const bookshelf = require('./Model')
const Promise = require('bluebird')
const bcrypt = Promise.promisifyAll(require('bcrypt'))

const User = bookshelf.model('User', {
  tableName: 'users',
  hasTimestamps: true,
  soft: ['deleted_at']
}, {
  signup: Promise.method((username, password) => {
    return new User({ username: username })
      .fetch()
      .tap(() => {
        throw new Error(`${username} already exists.`)
      })
      .catch(User.NotFoundError, () => {
        return new User({ username, password })
          .save()
      })
  }),
  login: Promise.method((username, password) => {
    return new User({ username: username })
      .fetch()
      .tap((user) => {
        return bcrypt.compareAsync(password, user.get('password'))
          .then((valid) => {
            if (!valid) throw new Error('Invalid password')
          })
      })
  })
})

module.exports = User
