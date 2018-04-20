/* eslint-disable no-undef */
process.env.NODE_ENV = 'test'

let Category = require('../models/category').model
let Product = require('../models/product').model

let categoryService = require('../services/category')

let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../app')

chai.use(chaiHttp)
chai.should()

describe('Category route', () => {
  beforeEach((done) => { // Before each test we empty the database
    Promise.all([Category.remove(), Product.remove()])
      .then(done())
  })

  describe('/GET categories', () => {
    it('it should return empty array, if we doesn\'t create category before', (done) => {
      chai.request(server)
        .get('/categories')
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('array')
          res.body.length.should.be.eql(0)
          done()
        })
    })

    it('it should GET all categories', (done) => {
      Promise.all([Category.create({'name': 'test1'}), Category.create({'name': 'test2'})])
        .then(() => {
          chai.request(server)
            .get('/categories')
            .end((err, res) => {
              res.should.have.status(200)
              res.body.should.be.a('array')
              res.body.length.should.be.eql(2)
              done()
            })
        })
    })
  })

  describe('/POST categories', () => {
    it('it should POST new category', (done) => {
      let requestObject = {
        category: {name: 'Candy'}
      }

      chai.request(server)
        .post('/categories')
        .send(requestObject)
        .end((err, res) => {
          res.should.have.status(201)
          res.body.should.be.a('object')
          res.body.should.have.property('id')
          res.body.should.have.property('name').and.be.eql('Candy')
          res.body.should.have.property('products_count').and.be.eql(0)
          done()
        })
    })

    it('With blank/undefined category.name should send error', (done) => {
      let requestObject = {
        category: {name: ''}
      }

      chai.request(server)
        .post('/categories')
        .send(requestObject)
        .end((err, res) => {
          res.should.have.status(422)
          res.body.should.be.a('object')
          res.body.should.have.property('errors')
          res.body.errors.should.have.property('name')
          res.body.errors.name.should.be.a('array').and.be.eql(['can\'t be blank'])
          done()
        })
    })

    it('With not unique category.name should send error', (done) => {
      Category.create({name: 'not unique name'})
        .then(() => {
          let requestObject = {
            category: {name: 'not unique name'}
          }

          chai.request(server)
            .post('/categories')
            .send(requestObject)
            .end((err, res) => {
              res.should.have.status(422)
              res.body.should.be.a('object')
              res.body.should.have.property('errors')
              res.body.errors.should.have.property('name')
              res.body.errors.name.should.be.a('array').and.be.eql(['must be unique'])
              done()
            })
        })
    })
  })

  describe('/GET /categories/ID/products ', () => {
    it('Should send empty array for new category', (done) => {
      Category.create({name: 'test'})
        .then(category => {
          let categoryId = category.id

          chai.request(server)
            .get(`/categories/${categoryId}/products`)
            .end((err, res) => {
              res.should.have.status(200)
              res.body.should.be.a('array')
              res.body.length.should.be.eql(0)
              done()
            })
        })
    })

    it('Should GET all products in category', (done) => {
      let categoryId
      Category.create({'name': 'test'})
        .then((category) => {
          categoryId = category.id
          return categoryService.createProductInCategory(categoryId, {name: 'productName', price: 0.2})
        })
        .then(() => {
          chai.request(server)
            .get(`/categories/${categoryId}/products`)
            .end((err, res) => {
              res.should.have.status(200)
              res.body.should.be.a('array')
              res.body.length.should.be.eql(1)
              done()
            })
        })
    })
  })

  describe('/POST /categories/ID/products ', () => {
    it('Should POST new product', (done) => {
      let requestObject = {product: {name: 'Butter', price: 2.6}}

      Category.create({'name': 'test'})
        .then((category) => {
          chai.request(server)
            .post(`/categories/${category.id}/products`)
            .send(requestObject)
            .end((err, res) => {
              res.should.have.status(201)
              res.body.should.be.a('object')
              res.body.should.have.property('id')
              res.body.should.have.property('price').and.be.eql(2.6)
              res.body.should.have.property('name').and.be.eql('Butter')
              done()
            })
        })
    })

    it('With not unique product.name should send error', (done) => {
      let notUniqueObject = {product: {name: 'dup', price: 2.6}}
      let categoryId

      Category.create({'name': 'test'})
        .then((category) => {
          categoryId = category.id
          categoryService.createProductInCategory(categoryId, notUniqueObject.product)
        })
        .then(() => {
          chai.request(server)
            .post(`/categories/${categoryId}/products`)
            .send(notUniqueObject)
            .end((err, res) => {
              res.should.have.status(422)
              res.body.should.be.a('object')
              res.body.should.have.property('errors')
              res.body.errors.should.have.property('name')
              res.body.errors.name.should.be.a('array').and.be.eql(['must be unique'])
              done()
            })
        })
    })

    it('With blank/undefined product.name should send error', (done) => {
      let requestObject = {product: {name: '', price: 2.6}}

      Category.create({name: 'test'})
        .then(category => {
          chai.request(server)
            .post(`/categories/${category.id}/products`)
            .send(requestObject)
            .end((err, res) => {
              res.should.have.status(422)
              res.body.should.be.a('object')
              res.body.should.have.property('errors')
              res.body.errors.should.have.property('name')
              res.body.errors.name.should.be.a('array').and.be.eql(['can\'t be blank'])
              done()
            })
        })
    })

    it('With blank/undefined product.price should send error', (done) => {
      let requestObject = {product: {name: 'Butter'}}

      Category.create({name: 'test'})
        .then(category => {
          chai.request(server)
            .post(`/categories/${category.id}/products`)
            .send(requestObject)
            .end((err, res) => {
              res.should.have.status(422)
              res.body.should.be.a('object')
              res.body.should.have.property('errors')
              res.body.errors.should.have.property('price')
              res.body.errors.price.should.be.a('array').and.be.eql(['can\'t be blank'])
              done()
            })
        })
    })

    it('With negative product.price should send error', (done) => {
      let requestObject = {product: {name: 'Butter', price: -1}}

      Category.create({name: 'test'})
        .then(category => {
          chai.request(server)
            .post(`/categories/${category.id}/products`)
            .send(requestObject)
            .end((err, res) => {
              res.should.have.status(422)
              res.body.should.be.a('object')
              res.body.should.have.property('errors')
              res.body.errors.should.have.property('price')
              res.body.errors.price.should.be.a('array').and.be.eql(['can\'t be negative'])
              done()
            })
        })
    })
  })
})
