const express = require('express')
const router = express.Router()
const Product = require('../models/product')

function authorize(req, res) {
    const reject = () => {
        res.setHeader('www-authenticate', 'Basic')
        res.sendStatus(401)
    }

    const authorization = req.headers.authorization

    if (!authorization) {
        return reject()
    }

    const [username, password] = Buffer.from(authorization.replace('Basic ', ''), 'base64').toString().split(':')

    if (!(username === 'nikola' && password === 'difpass6y7')) {
        return reject()
    }
}

// All Products Route
router.get('/', async (req, res) => {
    authorize(req, res)

    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }

    try {
        const products = await Product.find(searchOptions)
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
    authorize(req, res)

    res.render('admin/new-product', { product: new Product() })
})

// Create Product Route
router.post('/', async (req, res) => {
    authorize(req, res)

    const product = new Product({
        name: req.body.name
    })
    try {
        const newProduct = await product.save()
        res.redirect(`admin`)
    } catch {
        res.render('admin/new-product', {
            product: product,
            errorMessage: '___Грешка при добавянето на продукт___'
        })
    }
})

module.exports = router
