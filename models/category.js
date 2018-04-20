let mongoose = require('mongoose')
let Schema = mongoose.Schema
let uniqueValidator = require('mongoose-unique-validator')
let idPlugin = require('../db/idPlugin')

let categorySchema = new Schema({
  name: {type: String, required: true, index: {unique: true}},
  products: [{type: Schema.Types.ObjectId, ref: 'Product'}],
  products_count: {type: Number, default: 0}
})

categorySchema.pre('validate', function (next) {
  this.products_count = this.products.length
  next()
})

categorySchema.plugin(uniqueValidator)
categorySchema.plugin(idPlugin)

module.exports.schema = categorySchema
module.exports.model = mongoose.model('Category', categorySchema)
