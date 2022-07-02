const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Category = require('../models/category')
const Product = require('../models/product')
const User = require('../models/user')
const imageMimeTypes = ['image/webp', 'image/jpeg', 'image/png']
const algs = require("../public/javascripts/algorithms")
const bcrypt = require('bcrypt')

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

function renderFormPage(req, res, data, form, hasError = false) {
    try {
        let userEmail = null
        let userVerified = null
        if (req.user) { 
            userEmail = req.user.email
            userVerified = req.user.verified
        }

        let params
        if (form === 'newUser' || form === 'editUser') {
            params = { 
                userEmail: userEmail,
                verified: userVerified,
                user: data
            }
            if (hasError) {
                if (form === 'editUser') {
                    params.errorMessage = 'Грешка при редактирането на клиент!'
                } else {
                    params.errorMessage = 'Грешка при добавянето на клиент!'
                }
            }
        } else {
            params = { 
                userEmail: userEmail,
                verified: userVerified,
                product: data
            }
            if (hasError) {
                if (form === 'editProduct') {
                    params.errorMessage = 'Грешка при редактирането на продукт!'
                } else {
                    params.errorMessage = 'Грешка при добавянето на продукт!'
                }
            }
        }
        res.render(`admin/${form}`, params)
    } catch {
        res.redirect('/admin')
    }
}

// Update Categories Route
router.post('/cat-update', async (req, res) => {
    try {
        mongoose.connection.db.listCollections({name: 'categories'})
        .next(async function(err, collinfo) {
            if (collinfo) {
                await Category.collection.drop()
            }
        })

        const dataArr = await Product.find({}, {category: 1, _id: 0})

        let category
        for (i = 0; i < dataArr.length; i++) {
            category = new Category({
                name: dataArr[i].category
            })
            if (!(await Category.findOne({ name: category.name }))) {
                await category.save()
            }
        }
        
        return res.json({'status': '1'})
    } catch {
        return res.json({'status': '0'})
    }
})

// Verify User Route
router.post('/user-verify/:id', async (req, res) => {
    try {
        var user = await User.findOne({ _id: req.params.id })
        user.verified = true
        await user.save()
        return res.json({'status': '1'})
    } catch {
        return res.json({'status': '0'})
    }
})

// All Products Route
router.get('/', async (req, res) => {
    try {
        if (!(await authorize(req, res))) {
            return
        }
    } catch {
        res.redirect('/')
    }

    let userEmail = null
    let userVerified = null
    if (req.user) { 
        userEmail = req.user.email
        userVerified = req.user.verified
    }

    let users
    try {
        users = await User.find().sort({ businessName: 1 }).exec()
    } catch {
        users = null
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
    
    let categoryList = await Category.find().sort({name: 1}).exec()

    try {
        let count = (await query.clone().exec()).length
        let maxPage = Math.ceil(count / limit)

        if (emptyQuery) {
            req.query.allProducts = 'yes'
            res.render('admin/index', { 
                userEmail: userEmail,
                verified: userVerified,
                categoryList: categoryList,
                users: users,
                products: null, 
                searchOptions: req.query,
                updateBtn: true
            })
        } else {
            const products = await query.sort(sortConfig).limit(limit).skip(startIndex).exec()
            res.render('admin/index', { 
                userEmail: userEmail,
                verified: userVerified,
                categoryList: categoryList,
                users: users,
                products: products, 
                searchOptions: req.query,
                maxPage: maxPage,
                page: page,
                updateBtn: true
            })
        }
    } catch {
        res.redirect('/')
    }
})

// New Product Route
router.get('/new-product', async (req, res) => {
    try {
        if (!(await authorize(req, res))) {
            return
        }
    } catch {
        res.redirect('/')
    }

    renderFormPage(req, res, new Product(), 'newProduct')
})

// New User Route
router.get('/new-user', async (req, res) => {
    try {
        if (!(await authorize(req, res))) {
            return
        }
    } catch {
        res.redirect('/')
    }

    renderFormPage(req, res, new User(), 'newUser')
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

// Create Product Route
router.post('/create-product', async (req, res) => {
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
        renderFormPage(req, res, product, 'newProduct', true)
    }
})

// Create User Route
router.post('/create-user', async (req, res) => {
    try {
        if (!(await authorize(req, res))) {
            return
        }
    } catch {
        res.redirect('/')
    }
    
    let userEmail = null
    let userVerified = null
    if (req.user) { 
        userEmail = req.user.email
        userVerified = req.user.verified
    }

    const hashedPassword = await bcrypt.hash(req.body.inPassword, 10)

    const user = new User({
        verified: req.body.inVerified,
        email: req.body.inEmail,
        password: hashedPassword,
        name: req.body.inName,
        businessName: req.body.inBusinessName,
        address: req.body.inAddress,
        phone: req.body.inPhone
    })

    if (req.body.inPassword !== req.body.inPasswordRepeat) {
        res.render('admin/newUser', { 
            userEmail: userEmail, 
            verified: userVerified,
            user: user,
            errorMessage: 'Паролата не съвпада' 
        })
        return
    }

    if (await User.findOne({ email: user.email })) {
        user.email = ''
        res.render('admin/newUser', {
            userEmail: userEmail,
            verified: userVerified,
            user: user,
            errorMessage: 'Имейл адресът е зает'
        })
        return
    }

    try {
        const newUser = await user.save()
        res.redirect(`/admin/user/${user.id}`)
    } catch {
        renderFormPage(req, res, user, 'newUser', true)
    }
})

// View Single User Route
router.get('/user/:id', async (req, res) => {
    try {
        if (!(await authorize(req, res))) {
            return
        }
    } catch {
        res.redirect('/')
    }

    let userEmail = null
    let userVerified = null
    if (req.user) { 
        userEmail = req.user.email
        userVerified = req.user.verified
    }

    try {
        const user = await User.findById(req.params.id)
        res.render('admin/showUser', { 
            userEmail: userEmail,
            verified: userVerified,
            user: user 
        })
    } catch {
        res.redirect('/')
    }
})

// Edit User Route
router.get('/user/:id/edit', async (req, res) => {
    try {
        if (!(await authorize(req, res))) {
            return
        }
    } catch {
        res.redirect('/')
    }

    try {
        const user = await User.findById(req.params.id)
        renderFormPage(req, res, user, 'editUser')
    } catch {
        res.redirect('/admin')
    }
})

// Update User Route
router.put('/user/:id', async (req, res) => {
    try {
        if (!(await authorize(req, res))) {
            return
        }
    } catch {
        res.redirect('/')
    }

    let userEmail = null
    let userVerified = null
    if (req.user) { 
        userEmail = req.user.email
        userVerified = req.user.verified
    }

    let user
    try {
        user = await User.findById(req.params.id)

        if (req.body.inPassword !== req.body.inPasswordRepeat) {
            res.render('admin/editUser', { 
                userEmail: userEmail, 
                verified: userVerified,
                user: user,
                errorMessage: 'Паролата не съвпада' 
            })
            return
        }

        if (req.body.inEmail !== user.email && await User.findOne({ email: req.body.inEmail })) {
            res.render('admin/editUser', {
                userEmail: userEmail,
                verified: userVerified,
                user: user,
                errorMessage: 'Имейл адресът е зает'
            })
            return
        }

        let password = user.password

        if (req.body.inPassword !== '' && req.body.inPassword != null) {
            password = await bcrypt.hash(req.body.inPassword, 10)
        }

        user.verified = req.body.inVerified
        user.email = req.body.inEmail
        if (req.body.inPassword !== '' && req.body.inPassword != null) {
            user.password = password
        }
        user.name = req.body.inName
        user.businessName = req.body.inBusinessName
        user.address = req.body.inAddress
        user.phone = req.body.inPhone

        await user.save()
        res.redirect(`/admin/user/${user.id}`)
    } catch {
        if (user == null) {
            res.redirect('/')
        } else {
            renderFormPage(req, res, user, 'editUser', true)
        }
    }
})

// Delete User Route
router.delete('/user/:id', async (req, res) => {
    try {
        if (!(await authorize(req, res))) {
            return
        }
    } catch {
        res.redirect('/')
    }

    let userEmail = null
    let userVerified = null
    if (req.user) { 
        userEmail = req.user.email
        userVerified = req.user.verified
    }

    let user
    try {
        user = await User.findById(req.params.id)
        await user.remove()
        res.redirect('/admin')
    } catch {
        if (user == null) {
            res.redirect('/')
        } else {
            res.render('admin/showUser', {
                userEmail: userEmail,
                verified: userVerified,
                user: user,
                errorMessage: "Грешка при изтриването на клиент!"
            })
        }
    }
})

// View Single Product Route
router.get('/:id', async (req, res) => {
    try {
        if (!(await authorize(req, res))) {
            return
        }
    } catch {
        res.redirect('/')
    }

    let userEmail = null
    let userVerified = null
    if (req.user) { 
        userEmail = req.user.email
        userVerified = req.user.verified
    }

    try {
        const product = await Product.findById(req.params.id)
        res.render('admin/showProduct', {
            userEmail: userEmail,
            verified: userVerified,
            product: product
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
        renderFormPage(req, res, product, 'editProduct')
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
            renderFormPage(req, res, product, 'editProduct', true)
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

    let userEmail = null
    let userVerified = null
    if (req.user) { 
        userEmail = req.user.email
        userVerified = req.user.verified
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
            res.render('admin/showProduct', {
                userEmail: userEmail,
                verified: userVerified,
                product: product,
                errorMessage: "Грешка при изтриването на продукт!"
            })
        }
    }
})

module.exports = router
