const passport = require('passport')
const passportJWT = require('passport-jwt')
const config = require('config')
const User = require('./models/User')
const logger = require('../src/logger')

module.exports = () => {
  const jwtOptions = {
    secretOrKey: config.jwt.secretKey,
    jwtFromRequest: passportJWT.ExtractJwt.fromHeader('x-sc-token')
  }
  const strategy = new passportJWT.Strategy(jwtOptions, (payload, done) => {
    User.where('id', payload.id)
      .fetch()
      .then((user) => done(null, user))
      .catch(err => {
        logger.stderr.error(err)
      })
  })

  passport.use(strategy)

  return {
    initialize: () => passport.initialize(),
    authenticate: () => passport.authenticate('jwt', config.jwt.option)
  }
}
