const mongoose = require('mongoose')
const mongoErrorParser = require('../util/mongoErrorParser')

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
    .catch(err => {
      return mongoErrorParser(err)
    })
}

function getAllProductsByCategoryId (categoryId) {
  return Category.findById(categoryId)
    .populate('products', ['_id', 'name', 'price'])
    .exec()
    .then(result => result.products)
}

function createProductInCategory (categoryId, product) {
  let findedCategory
  let newProduct

  return Category.findById(categoryId)
    .then(category => {
      findedCategory = category
      product.category = category._id
      return Product.create(product)
    })
    .then(product => {
      newProduct = product
      findedCategory.products.push(product)
      findedCategory.products_count++
      return findedCategory.save()
    })
    .then(category => {
      return newProduct
    })
    .catch(err => {
      return mongoErrorParser(err)
    })
}
