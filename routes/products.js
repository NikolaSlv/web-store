const express = require('express')
const router = express.Router()
const Product = require('../models/product')

// View Products Route
router.get('/', async (req, res) => {
    res.send('All products')
})

module.exports = router
