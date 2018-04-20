const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const config = require('config')
require('./db')

const categoriesRouter = require('./routes/categories')
const productsRouter = require('./routes/products')

const app = express()

const loggerLevel = config.get('loggerLevel')
if (loggerLevel !== 'disabled') { app.use(logger(loggerLevel)) }

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/categories', categoriesRouter)
app.use('/products', productsRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.json({'status': 'not found'})
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500).json({'status': 'internal server error'})
})

module.exports = app

process.on('unhandledRejection', error => {
  // Will print "unhandledRejection err is not defined"
  console.log('unhandledRejection', error.message)
})
