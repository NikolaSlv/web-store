const express = require('express')
const router = express.Router()
const Product = require('../models/product')
const imageMimeTypes = ['image/webp', 'image/jpeg', 'image/png']
const algs = require("../public/javascripts/algorithms")

async function authorize(req, res) {
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

function renderNewPage(req, res, product, hasError = false) {
    renderFormPage(req, res, product, 'newProduct', hasError)
}

function renderEditPage(req, res, product, hasError = false) {
    renderFormPage(req, res, product, 'editProduct', hasError)
}

function renderFormPage(req, res, product, form, hasError = false) {
    try {
        let mode = 'light'
        if (req.query.theme != null && req.query.theme !== '') {
            mode = req.query.theme
        }

        const params = { 
            product: product,
            mode: mode
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
        if (!(await authorize(req, res))) {
            return
        }
    } catch {
        res.redirect('/')
    }

    let query = Product.find()
    let emptyQuery = true
    if (req.query.title != null && req.query.title !== '') {
        query = query.regex('title', new RegExp(algs.setSearchStr(req.query.title), 'i'))
        emptyQuery = false
    }
    if (req.query.category != null && req.query.category !== '') {
        if (req.query.category != 'Всички')
            query = query.regex('category', new RegExp(req.query.category, 'i'))
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
    if (req.query.allProducts != null && req.query.allProducts !== '') {
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

    let mode = 'light'
    if (req.query.theme != null && req.query.theme !== '') {
        mode = req.query.theme
    }

    try {
        let count = (await query.clone().exec()).length
        let maxPage = Math.ceil(count / limit)

        if (emptyQuery) {
            req.query.allProducts = 'yes'
            res.render('admin/index', { 
                products: null, 
                searchOptions: req.query,
                mode: mode
            })
        } else {
            const products = await query.sort(sortConfig).limit(limit).skip(startIndex).exec()
            res.render('admin/index', { 
                products: products, 
                searchOptions: req.query,
                maxPage: maxPage,
                page: page,
                mode: mode
            })
        }
    } catch {
        res.redirect('/')
    }
})

// New Product Route
router.get('/new', async (req, res) => {
    try {
        if (!(await authorize(req, res))) {
            return
        }
    } catch {
        res.redirect('/')
    }

    renderNewPage(req, res, new Product())
})

// Create Product Route
router.post('/', async (req, res) => {
    try {
        if (!(await authorize(req, res))) {
            return
        }
    } catch {
        res.redirect('/')
    }

    const product = new Product({
        title: req.body.title,
        category: req.body.category,
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
        renderNewPage(req, res, product, true)
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
        if (!(await authorize(req, res))) {
            return
        }
    } catch {
        res.redirect('/')
    }

    let mode = 'light'
    if (req.query.theme != null && req.query.theme !== '') {
        mode = req.query.theme
    }

    try {
        const product = await Product.findById(req.params.id)
        res.render('admin/show', {
            product: product,
            mode: mode
        })
    } catch {
        res.redirect('/')
    }
})

// Edit Product Route
router.get('/:id/edit', async (req, res) => {
    try {
        if (!(await authorize(req, res))) {
            return
        }
    } catch {
        res.redirect('/')
    }

    try {
        const product = await Product.findById(req.params.id)
        renderEditPage(req, res, product)
    } catch {
        res.redirect('/admin')
    }
})

// Update Product Route
router.put('/:id', async (req, res) => {
    try {
        if (!(await authorize(req, res))) {
            return
        }
    } catch {
        res.redirect('/')
    }

    let product
    try {
        product = await Product.findById(req.params.id)

        product.title = req.body.title
        product.category = req.body.category
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
            renderEditPage(req, res, product, true)
        }
    }
})

// Delete Product Route
router.delete('/:id', async (req, res) => {
    try {
        if (!(await authorize(req, res))) {
            return
        }
    } catch {
        res.redirect('/')
    }

    let mode = 'light'
    if (req.query.theme != null && req.query.theme !== '') {
        mode = req.query.theme
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
                errorMessage: "Грешка при изтриването на продукт!",
                mode: mode
            })
        }
    }
})

module.exports = router
