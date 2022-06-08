const express = require('express')
const router = express.Router()
const Product = require('../models/product')
const algs = require("../public/javascripts/algorithms")

// View Products Route
router.get('/', async (req, res) => {
    let query = Product.find()
    let emptyQuery = true
    if (req.query.title != null && req.query.title !== '') {
        query = query.regex('title', new RegExp(algs.setSearchStr(req.query.title), 'i'))
        emptyQuery = false
    }
    if (req.query.description != null && req.query.description !== '') {
        query = query.regex('description', new RegExp(algs.setSearchStr(req.query.description), 'i'))
        emptyQuery = false
    }
    if (req.query.minPricePerPiece != null && req.query.minPricePerPiece !== '') {
        query = query.gte('pricePerPiece', req.query.minPricePerPiece)
        emptyQuery = false
    }
    if (req.query.maxPricePerPiece != null && req.query.maxPricePerPiece !== '') {
        query = query.lte('pricePerPiece', req.query.maxPricePerPiece)
        emptyQuery = false
    }
    if (req.query.minPricePerUnit != null && req.query.minPricePerUnit !== '') {
        query = query.gte('pricePerUnit', req.query.minPricePerUnit)
        emptyQuery = false
    }
    if (req.query.maxPricePerUnit != null && req.query.maxPricePerUnit !== '') {
        query = query.lte('pricePerUnit', req.query.maxPricePerUnit)
        emptyQuery = false
    }
    if (req.query.allProducts != null && req.query.allProducts !== '') {
        emptyQuery = false
    }

    let page = 1
    let limit = 2
    let startIndex = 0
    if (req.query.page != null && req.query.page !== '') {
        page = parseInt(req.query.page)
        startIndex = (page - 1) * limit
    }

    let sortConfig
    let sortParam = ''
    let sortType = 1
    if (req.query.sortParam != null && req.query.sortParam !== '') {
        sortParam = req.query.sortParam;
    }
    if (req.query.sortType != null && req.query.sortType !== '') {
        sortType = req.query.sortType;
    }
    if (sortParam == 'pricePerPiece') {
        if (sortType == 1) {
            sortConfig = { 
                pricePerPiece: 1,
                title: 1
            }
        } else {
            sortConfig = { 
                pricePerPiece: -1,
                title: 1
            }
        }
    } else if (sortParam == 'pricePerUnit') {
        if (sortType == 1) {
            sortConfig = { 
                pricePerUnit: 1,
                title: 1
            }
        } else {
            sortConfig = { 
                pricePerUnit: -1,
                title: 1
            }
        }
    } else {
        sortConfig = { 
            title: 1
        }
    }

    try {
        let count = (await query.clone().exec()).length
        let maxPage = Math.ceil(count / limit)

        if (emptyQuery) {
            req.query.allProducts = 'yes'
            res.render('products/index', { 
                products: null,
                searchOptions: req.query
            })
        } else {
            const products = await query.sort(sortConfig).limit(limit).skip(startIndex).exec()
            res.render('products/index', { 
                products: products, 
                searchOptions: req.query,
                pos: startIndex,
                maxPage: maxPage,
                page: page
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
