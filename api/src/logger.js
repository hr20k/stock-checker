const log4js = require('log4js')

log4js.configure({
  appenders: {
    system: {
      type: 'dateFile',
      filename: './logs/system.log',
      compress: true,
      pattern: '-yyyy-MM-dd'
    },
    error: {
      type: 'dateFile',
      filename: './logs/error.log',
      compress: true,
      pattern: '-yyyy-MM-dd'
    },
    console: {
      type: 'console'
    },
    stderr: {
      type: 'stderr'
    }
  },
  categories: {
    default: {
      appenders: ['system', 'console'],
      level: 'INFO'
    },
    error: {
      appenders: ['error', 'stderr'],
      level: 'WARN'
    }
  }
})

module.exports = log4js.getLogger()
module.exports.stderr = log4js.getLogger('error')
