/* eslint-disable no-undef */
process.env.NODE_ENV = 'test'

let Category = require('../models/category').model
let Product = require('../models/product').model

let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../app')

chai.use(chaiHttp)
chai.should()

describe('Products route', () => {
  beforeEach((done) => { // Before each test we empty the database
    Promise.all([Category.remove(), Product.remove()])
      .then(done())
  })

  it('it should DELETE product', (done) => {
    Category.create({name: 'deleteCat'}).then(category => {
      Product.create({name: 'butter', 'price': 2.6, category: category.id})
        .then((product) => {
          chai.request(server)
            .delete(`/products/${product.id}`)
            .end((err, res) => {
              res.should.have.status(204)
              res.body.should.be.a('object')
              done()
            })
        })
    })
  })
})
