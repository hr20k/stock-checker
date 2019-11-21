const bookshelf = require('./Model')
const Promise = require('bluebird')
const bcrypt = require('bcrypt')

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
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)
        return new User({ username, password: hash })
          .save()
      })
  }),
  login: Promise.method((username, password) => {
    return new User({ username: username })
      .fetch()
      .tap((user) => {
        return bcrypt.compare(password, user.get('password'))
          .then((valid) => {
            if (!valid) throw new Error('Invalid password')
          })
      })
  })
})

module.exports = User
