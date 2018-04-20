/* eslint-disable no-undef */
process.env.NODE_ENV = 'test'

let Category = require('../models/category').model
let Product = require('../models/product').model

let categoryService = require('../services/category')

let chai = require('chai')
let server = require('../app')

chai.should()

describe('Category service', () => {
  beforeEach((done) => { // Before each test we empty the database
    Promise.all([Category.remove(), Product.remove()])
      .then(done())
  })

  it('new product should increment category.products_count value', (done) => {
    let product = {name: 'Butter', price: 2.6}
    let categoryId

    Category.create({'name': 'serviceTest'})
      .then(category => {
        categoryId = category.id
        return categoryService.createProductInCategory(categoryId, product)
      })
      .then(product => {
        return Category.findById(categoryId)
      })
      .then(category => {
        category.products_count.should.be.eql(1)
        done()
      })
  })
})
