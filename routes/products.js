const express = require('express')
const router = express.Router()
const Product = require('../models/product')
const algs = require("../public/javascripts/algorithms")

// View Products Route
router.get('/', async (req, res) => {
    let userEmail = null
    if (req.user) { userEmail = req.user.email }

    let query = Product.find()
    let emptyQuery = true
    if (req.query.sbar != null && req.query.sbar !== '') {
        if (req.query.description != null && req.query.description !== '') {
            // reset other search params
            req.query.title = null
            req.query.category = null
            req.query.description = null
            req.query.minPricePerPiece = null
            req.query.maxPricePerPiece = null
            req.query.allProducts = null
        }
        query = query.regex('description', new RegExp(algs.setSearchStr(req.query.sbar), 'i'))
        emptyQuery = false
    }
    if (req.query.title != null && req.query.title !== '') {
        // reset search bar
        req.query.sbar = null
        query = query.regex('title', new RegExp(algs.setSearchStr(req.query.title), 'i'))
        emptyQuery = false
    }
    if (req.query.category != null && req.query.category !== '') {
        // reset search bar
        req.query.sbar = null
        if (req.query.category != 'Всички')
            query = query.regex('category', new RegExp(req.query.category, 'i'))
        emptyQuery = false
    }
    if (req.query.description != null && req.query.description !== '') {
        // reset search bar
        req.query.sbar = null
        query = query.regex('description', new RegExp(algs.setSearchStr(req.query.description), 'i'))
        emptyQuery = false
    }
    if (req.query.minPricePerPiece != null && req.query.minPricePerPiece !== '') {
        // reset search bar
        req.query.sbar = null
        query = query.gte('pricePerPiece', req.query.minPricePerPiece)
        emptyQuery = false
    }
    if (req.query.maxPricePerPiece != null && req.query.maxPricePerPiece !== '') {
        // reset search bar
        req.query.sbar = null
        query = query.lte('pricePerPiece', req.query.maxPricePerPiece)
        emptyQuery = false
    }
    if (req.query.allProducts != null && req.query.allProducts !== '') {
        // reset search bar
        req.query.sbar = null
        emptyQuery = false
    }

    let page = 1
    let limit = 15
    let startIndex = 0
    if (req.query.page != null && req.query.page !== '') {
        page = parseInt(req.query.page)
        startIndex = (page - 1) * limit
    }

    let sortConfig
    let sortParam = ''
    let sortType = 1
    if (req.query.sortParam != null && req.query.sortParam !== '') {
        sortParam = req.query.sortParam
    }
    if (req.query.sortType != null && req.query.sortType !== '') {
        sortType = req.query.sortType
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
                userEmail: userEmail,
                products: null,
                searchOptions: req.query
            })
        } else {
            const products = await query.sort(sortConfig).limit(limit).skip(startIndex).exec()
            res.render('products/index', { 
                userEmail: userEmail,
                products: products, 
                searchOptions: req.query,
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
    let userEmail = null
    if (req.user) { userEmail = req.user.email }

    try {
        const product = await Product.findById(req.params.id)
        res.render('products/show', {
            userEmail: userEmail,
            product: product
        })
    } catch {
        res.redirect('/')
    }
})

module.exports = router
