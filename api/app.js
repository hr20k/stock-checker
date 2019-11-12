const express = require('express');
const logger = require('morgan');
const config = require('config');
const auth = require('./auth')();
const index = require('./routes/index');
const moment = require('moment')

const Logger = require('./src/utils/Logger')

const app = express();

app.use(logger(config.morgan.format));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(auth.initialize());

app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  if(!err.status || err.status >= 500){
    Logger.stderr.error('API内部でエラーが発生しました。')
    Logger.stderr.error(err)
  }

  // render the error page
  res.status(err.status || 500);
  res.json({
    errors: {
      other: {
        status: err.status,
        msg: err.message
      }
    }
  });
});

/* JSON返却時の日付型は、このフォーマットに統一する */
app.set('json replacer', function (key, value) {
  if (this[key] instanceof Date) {
    value = moment.utc(this[key]).format('YYYY-MM-DD HH:mm:ss');
  }

  return value;
});

module.exports = app;