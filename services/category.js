const mongoose = require('mongoose')
const Category = mongoose.model('Category')

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
    .then(result => result.products)
}

function createProductInCategory (categoryId, product) {
  return Category.findById(categoryId)
    .then(category => {
      category.products.push(product)
      return category.save()
    })
}
