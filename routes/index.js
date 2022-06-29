const express = require('express')
const router = express.Router()
const Product = require('../models/product')

// View Last 10 Products Route
router.get('/', async (req, res) => {
    let userEmail = null
    if (req.user) { userEmail = req.user.email }

    let products
    try {
        products = await Product.find().sort({ createdAt: 'desc' }).limit(10).exec()
    } catch {
        products = []
    }

    res.render('index', { 
        userEmail: userEmail,
        products: products
    })
})

module.exports = router
