const express = require('express')
const router = express.Router()
const Product = require('../models/product')

// View Last 10 Products Route
router.get('/', async (req, res) => {
    let products
    try {
        products = await Product.find().sort({ createdAt: 'desc' }).limit(10).exec()
    } catch {
        products = []
    }

    let mode = 'light'
    if (req.query.theme != null && req.query.theme !== '') {
        mode = req.query.theme
    }

    res.render('index', { 
        products: products,
        mode: mode
    })
})

module.exports = router
