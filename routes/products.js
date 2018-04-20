let router = require('express').Router()
const productService = require('../services/product')

router.delete('/:productId', (req, res) => {
  productService.deleteById(req.params.productId)
    .then(result => res.status(204).send(result))
    .catch(err => res.send(err))
})

module.exports = router
