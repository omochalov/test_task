let mongoose = require('mongoose')
let Schema = mongoose.Schema

let productSchema = new Schema({
  name: {type: String, required: true},
  price: {type: Number, required: true, min: 0},
  category: {type: Schema.Types.ObjectId, ref: 'Category'}
})

module.exports.schema = productSchema
module.exports.model = mongoose.model('Product', productSchema)
