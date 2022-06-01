if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const router = express.Router()
const Product = require('../models/product')
const imageMimeTypes = ['image/jpeg', 'image/png']
const algs = require("../public/javascripts/algorithms")

function authorize(req, res) {
    const reject = () => {
        res.setHeader('www-authenticate', 'Basic')
        res.sendStatus(401)
        return false
    }

    const authorization = req.headers.authorization

    if (!authorization) {
        return reject()
    }

    const [username, password] = Buffer.from(authorization.replace('Basic ', ''), 'base64').toString().split(':')

    if (!(username === process.env.ADMIN_NAME && password === process.env.ADMIN_PASS)) {
        return reject()
    }

    return true
}

function renderNewPage(res, product, hasError = false) {
    renderFormPage(res, product, 'newProduct', hasError)
}

function renderEditPage(res, product, hasError = false) {
    renderFormPage(res, product, 'editProduct', hasError)
}

function renderFormPage(res, product, form, hasError = false) {
    try {
        const params = { 
            product: product 
        }
        if (hasError) {
            if (form === 'editProduct') {
                params.errorMessage = 'Грешка при редактирането на продукт!'
            } else {
                params.errorMessage = 'Грешка при добавянето на продукт!'
            }
        }
        res.render(`admin/${form}`, params)
    } catch {
        res.redirect('/admin')
    }
}

// All Products Route
router.get('/', async (req, res) => {
    try {
        if (!authorize(req, res)) {
            return
        }
    } catch {
        res.redirect('/')
    }

    let query = Product.find()
    let emptyQuery = true
    if (req.query.title != null && req.query.title !== '') {
        query = query.regex('title', new RegExp(algs.searchAlg(req.query.title), 'i'))
        emptyQuery = false
    }
    if (req.query.description != null && req.query.description !== '') {
        query = query.regex('description', new RegExp(algs.searchAlg(req.query.description), 'i'))
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

    try {
        if (emptyQuery) {
            req.query.allProducts = 'yes'
            res.render('admin/index', { 
                products: null, 
                searchOptions: req.query 
            })
        } else {
            const products = await query.exec()
            res.render('admin/index', { 
                products: products, 
                searchOptions: req.query 
            })
        }
    } catch {
        res.redirect('/')
    }
})

// New Product Route
router.get('/new', (req, res) => {
    try {
        if (!authorize(req, res)) {
            return
        }
    } catch {
        res.redirect('/')
    }

    renderNewPage(res, new Product())
})

// Create Product Route
router.post('/', async (req, res) => {
    try {
        if (!authorize(req, res)) {
            return
        }
    } catch {
        res.redirect('/')
    }

    const product = new Product({
        title: req.body.title,
        description: req.body.description,
        pricePerPiece: req.body.pricePerPiece,
        weightPerPiece: req.body.weightPerPiece,
        piecesPerUnit: req.body.piecesPerUnit,
        pricePerUnit: req.body.pricePerUnit
    })

    try {
        saveProduct(product, req.body.productImage)
        const newProduct = await product.save()
        res.redirect(`/admin/${product.id}`)
    } catch {
        renderNewPage(res, product, true)
    }
})

function saveProduct(product, productImageEncoded) {
    if (productImageEncoded == '') {
        return
    }
    const productImage = JSON.parse(productImageEncoded)
    if (productImage != null && imageMimeTypes.includes(productImage.type)) {
        product.productImage = new Buffer.from(productImage.data, 'base64')
        product.productImageType = productImage.type
    }
}

// View Single Product Route
router.get('/:id', async (req, res) => {
    try {
        if (!authorize(req, res)) {
            return
        }
    } catch {
        res.redirect('/')
    }

    try {
        const product = await Product.findById(req.params.id)
        res.render('admin/show', {product: product})
    } catch {
        res.redirect('/')
    }
})

// Edit Product Route
router.get('/:id/edit', async (req, res) => {
    try {
        if (!authorize(req, res)) {
            return
        }
    } catch {
        res.redirect('/')
    }

    try {
        const product = await Product.findById(req.params.id)
        renderEditPage(res, product)
    } catch {
        res.redirect('/admin')
    }
})

// Update Product Route
router.put('/:id', async (req, res) => {
    try {
        if (!authorize(req, res)) {
            return
        }
    } catch {
        res.redirect('/')
    }

    let product
    try {
        product = await Product.findById(req.params.id)

        product.title = req.body.title
        product.description = req.body.description
        product.pricePerPiece = req.body.pricePerPiece
        product.weightPerPiece = req.body.weightPerPiece
        product.piecesPerUnit = req.body.piecesPerUnit
        product.pricePerUnit = req.body.pricePerUnit
        if (req.body.productImage != null && req.body.productImage !== ''){
            saveProduct(product, req.body.productImage)
        }

        await product.save()
        res.redirect(`/admin/${product.id}`)
    } catch {
        if (product == null) {
            res.redirect('/')
        } else {
            renderEditPage(res, product, true)
        }
    }
})

// Delete Product Route
router.delete('/:id', async (req, res) => {
    try {
        if (!authorize(req, res)) {
            return
        }
    } catch {
        res.redirect('/')
    }

    let product
    try {
        product = await Product.findById(req.params.id)
        await product.remove()
        res.redirect('/admin')
    } catch {
        if (product == null) {
            res.redirect('/')
        } else {
            res.render('admin/show', {
                product: product,
                errorMessage: "Грешка при изтриването на продукт!"
            })
        }
    }
})

module.exports = router
