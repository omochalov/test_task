const mongoose = require('mongoose')
const config = require('config')

let connectionString = config.get('connectionString')

mongoose.connect(connectionString)

mongoose.connection.on('connected', function () {
  console.log('Mongoose default connection open to ' + connectionString)
})

mongoose.connection.on('error', function (err) {
  console.log('Mongoose default connection error: ' + err)
})

mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected')
})

process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    console.log('Mongoose default connection disconnected through app termination')
    process.exit(0)
  })
})

require('../models/category')
require('../models/product')
