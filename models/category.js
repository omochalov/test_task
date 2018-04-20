let mongoose = require('mongoose')
let Schema = mongoose.Schema
let productSchema = require('./product').schema

let categorySchema = new Schema({
  name: {type: String, required: true, index: { unique: true }},
  products_count: {type: Number, default: 0},
  products: [ productSchema ]
})

module.exports.schema = categorySchema
module.exports.model = mongoose.model('Category', categorySchema)
