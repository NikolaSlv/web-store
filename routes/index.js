const express = require('express')
const router = express.Router()
const Product = require('../models/product')

// View Last 10 Products Route
router.get('/', async (req, res) => {
    let userId = null
    if (req.user) { userId = req.user._id }

    let products
    try {
        products = await Product.find().sort({ createdAt: 'desc' }).limit(10).exec()
    } catch {
        products = []
    }

    res.render('index', { 
        userId: userId,
        products: products
    })
})

module.exports = router
