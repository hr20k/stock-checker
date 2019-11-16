const config = require('config')
const jwt = require('jsonwebtoken')

exports.generateUuid = function () {
  const chars = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.split('')
  for (let i = 0, len = chars.length; i < len; i += 1) {
    switch (chars[i]) {
      case 'x':
        chars[i] = Math.floor(Math.random() * 16).toString(16)
        break
      case 'y':
        chars[i] = (Math.floor(Math.random() * 4) + 8).toString(16)
        break
      default:
        break
    }
  }
  return chars.join('')
}

exports.checkTokenAndPath = function (req) {
  const decoded = jwt.verify(req.headers['x-sc-token'], config.jwt.secretKey)
  return parseInt(decoded.id) === parseInt(req.params.id)
}
