const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const router = express.Router()
const Product = require('../models/product')
const uploadPath = path.join('public', Product.productImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})

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
    try {
        const params = { 
            product: product 
        }
        if (hasError) {
            params.errorMessage = 'Грешка при добавянето на продукт'
        }
        res.render('admin/new-product', params)
    } catch {
        res.redirect('/admin')
    }
}

function removeProductImage(fileName) {
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) {
            console.error(err)
        }
    })
}

// All Products Route
router.get('/', async (req, res) => {
    if (!authorize(req, res)) {
        return
    }

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
        res.render('admin/index', { 
            products: products, 
            searchOptions: req.query 
        })
    } catch {
        res.redirect('/')
    }
})

// New Product Route
router.get('/new', (req, res) => {
    if (!authorize(req, res)) {
        return
    }

    renderNewPage(res, new Product())
})

// Create Product Route
router.post('/', upload.single('productImage'), async (req, res) => {
    if (!authorize(req, res)) {
        return
    }

    const fileName = req.file != null ? req.file.filename : null
    const product = new Product({
        title: req.body.title,
        description: req.body.description,
        pricePerPiece: req.body.pricePerPiece,
        weightPerPiece: req.body.weightPerPiece,
        piecesPerUnit: req.body.piecesPerUnit,
        pricePerUnit: req.body.pricePerUnit,
        productImageName: fileName
    })
    try {
        const newProduct = await product.save()
        res.redirect('/admin')
    } catch {
        if (product.productImageName != null) {
            removeProductImage(product.productImageName)
        }
        renderNewPage(res, product, true)
    }
})

module.exports = router
