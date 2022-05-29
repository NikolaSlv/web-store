const express = require('express')
const router = express.Router()
const Product = require('../models/product')
const algs = require("../public/javascripts/algorithms")

// View Products Route
router.get('/', async (req, res) => {
    let query = Product.find()
    let emptyQuery = true
    if (req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(algs.searchAlg(req.query.title), 'i'))
        emptyQuery = false
    }
    if (req.query.description != null && req.query.description != '') {
        query = query.regex('description', new RegExp(algs.searchAlg(req.query.description), 'i'))
        emptyQuery = false
    }
    if (req.query.minPricePerPiece != null && req.query.minPricePerPiece != '') {
        query = query.gte('pricePerPiece', req.query.minPricePerPiece)
        emptyQuery = false
    }
    if (req.query.maxPricePerPiece != null && req.query.maxPricePerPiece != '') {
        query = query.lte('pricePerPiece', req.query.maxPricePerPiece)
        emptyQuery = false
    }
    if (req.query.minPricePerUnit != null && req.query.minPricePerUnit != '') {
        query = query.gte('pricePerUnit', req.query.minPricePerUnit)
        emptyQuery = false
    }
    if (req.query.maxPricePerUnit != null && req.query.maxPricePerUnit != '') {
        query = query.lte('pricePerUnit', req.query.maxPricePerUnit)
        emptyQuery = false
    }

    try {
        if (emptyQuery) {
            res.render('products/index', { 
                products: null, 
                searchOptions: req.query 
            })
        } else {
            const products = await query.exec()
            res.render('products/index', { 
                products: products, 
                searchOptions: req.query 
            })
        }
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
