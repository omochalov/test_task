const mongoose = require('mongoose')
const Product = mongoose.model('Product')

module.exports = {
  deleteById
}

function deleteById (productId) {
  return Product.findById(productId)
    .populate('category')
    .exec()
    .then(product => {
      let category = product.category

      let index = category.products.indexOf(productId)
      if (index) {
        category.products.splice(category.products.indexOf(productId), 1)
        return category.save()
      } else return {}
    })
    .then(() => {
      Product.remove({_id: productId})
      return {}
    })
}
