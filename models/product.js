let mongoose = require('mongoose')
let Schema = mongoose.Schema

let productSchema = new Schema({
  name: {type: String, required: true},
  price: {type: Number, required: true, min: 0}
})

module.exports.schema = productSchema
module.exports.model = mongoose.model('Product', productSchema)
