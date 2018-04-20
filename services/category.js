const mongoose = require('mongoose')
const Category = mongoose.model('Category')
const Product = mongoose.model('Product')

module.exports = {
  getAllCategories,
  create,
  getAllProductsByCategoryId,
  createProductInCategory
}

function getAllCategories () {
  return Category.find({}, {name: 1, products_count: 1})
}

function create (name) {
  return Category.create({name})
    .then(result => result)
}

function getAllProductsByCategoryId (categoryId) {
  return Category.findById(categoryId)
    .populate('products', ['_id', 'name', 'price'])
    .exec()
    .then(result => result.products)
}

function createProductInCategory (categoryId, product) {
  return Category.findById(categoryId)
    .then(category => {
      product.category = category._id

      let newProduct = new Product(product)
      newProduct.save()

      category.products.push(newProduct)
      return category.save()
    })
}
