const mongoose = require('mongoose')
const config = require('config')

let connectionString = config.get('connectionString')

const options = {
  autoReconnect: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 5000,
  poolSize: 10,
  bufferMaxEntries: 0
}

mongoose.connect(connectionString, options)

mongoose.connection.on('connected', function () {
  console.log('Mongoose default connection open to ' + connectionString)
})

mongoose.connection.on('error', function (err) {
  console.log('Mongoose default connection error: ' + err)
  mongoose.disconnect()
})

mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected')
  setTimeout(() => mongoose.connect(connectionString, options), 5000)
})

process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    console.log('Mongoose default connection disconnected through app termination')
    process.exit(0)
  })
})

require('../models/category')
require('../models/product')
