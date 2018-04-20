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
    .catch(err => {
      let res = {errors: {name: []}}
      if (err.errors.name.kind === 'required') {
        res.errors.name.push('can\'t be blank')
      }
      if (err.errors.name.kind === 'unique') {
        res.errors.name.push('must be unique')
      }
      return res
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
      // TODO: move error parsing to another module
      let res = {errors: {}}

      if (err.code === 11000) {
        res.errors.name = []
        res.errors.name.push('must be unique')
        return res
      } else if (err.errors.hasOwnProperty('name')) {
        res.errors.name = []
        if (err.errors.name.kind === 'required') {
          res.errors.name.push('can\'t be blank')
        }
        if (err.errors.name.kind === 'unique') {
          res.errors.name.push('must be unique')
        }
      }

      if (err.errors.hasOwnProperty('price')) {
        res.errors.price = []
        if (err.errors.price.kind === 'required') {
          res.errors.price.push('can\'t be blank')
        }
        if (err.errors.price.kind === 'unique') {
          res.errors.price.push('must be unique')
        }
        if (err.errors.price.kind === 'min') {
          res.errors.price.push('can\'t be negative')
        }
      }
      return res
    })
}
