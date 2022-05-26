const express = require('express')
const router = express.Router()
const Product = require('../models/product')

// View Products Route
router.get('/', async (req, res) => {
    let query = Product.find()
    if (req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if (req.query.minPricePerPiece != null && req.query.minPricePerPiece != '') {
        query = query.gte('pricePerPiece', req.query.minPricePerPiece)
    }
    if (req.query.maxPricePerPiece != null && req.query.maxPricePerPiece != '') {
        query = query.lte('pricePerPiece', req.query.maxPricePerPiece)
    }
    if (req.query.minPricePerUnit != null && req.query.minPricePerUnit != '') {
        query = query.gte('pricePerUnit', req.query.minPricePerUnit)
    }
    if (req.query.maxPricePerUnit != null && req.query.maxPricePerUnit != '') {
        query = query.lte('pricePerUnit', req.query.maxPricePerUnit)
    }

    try {
        const products = await query.exec()
        res.render('products/index', { 
            products: products, 
            searchOptions: req.query 
        })
    } catch {
        res.redirect('/')
    }
})

// View Single Product Route
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        res.render('products/show', {product: product})
    } catch {
        res.redirect('/')
    }
})

module.exports = router
