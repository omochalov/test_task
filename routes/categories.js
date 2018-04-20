let router = require('express').Router()
const categoryService = require('../services/category')

router.get('/', (req, res) => {
  categoryService.getAllCategories()
    .then(result => res.json(result))
    .catch(err => res.status(500).send(err))
})

router.post('/', (req, res) => {
  if (!req.body.category) {
    req.body.category = {}
  }

  categoryService.create(req.body.category.name)
    .then(result => {
      if (result.errors) {
        res.status(422).json(result)
      } else {
        res.status(201).json(result)
      }
    })
    .catch(err => res.status(422).send(err))
})

router.get('/:categoryID/products', (req, res) => {
  categoryService.getAllProductsByCategoryId(req.params.categoryID)
    .then(result => res.json(result))
    .catch(err => res.status(500).send(err))
})

router.post('/:categoryID/products', (req, res) => {
  categoryService.createProductInCategory(req.params.categoryID, req.body.product)
    .then(result => {
      if (result.errors) {
        res.status(422).json(result)
      } else {
        res.status(201).json(result)
      }
    })
    .catch(err => res.status(422).send(err))
})

module.exports = router
