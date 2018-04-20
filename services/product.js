const mongoose = require('mongoose')
const Product = mongoose.model('Product')

module.exports = {
  deleteById
}

function deleteById(productId) {
  Product.findById(productId)
    .populate('category')
    .exec()
    .then(product => {
      let category = product.category
      category.products.splice(category.products.indexOf(productId), 1)
      category.save()

      product.delete()
      return Promise.resolve({})
    })
}
