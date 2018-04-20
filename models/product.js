let mongoose = require('mongoose')
let Schema = mongoose.Schema
let uniqueValidator = require('mongoose-unique-validator')
let idPlugin = require('../db/idPlugin')

let productSchema = new Schema({
  name: {type: String, required: true, index: {unique: true}},
  price: {type: Number, required: true, min: 0},
  category: {type: Schema.Types.ObjectId, ref: 'Category'}
})

productSchema.plugin(uniqueValidator)
productSchema.plugin(idPlugin)

module.exports.schema = productSchema
module.exports.model = mongoose.model('Product', productSchema)
