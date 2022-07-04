const express = require('express')
const router = express.Router()
const Product = require('../models/product')

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

    if (!(username === process.env.CODES_NAME && password === process.env.CODES_PASS)) {
        return reject()
    }

    return true
}

function getCode(desc) {
    var code
    if (desc.includes('Код: ')) {
        code = desc.split('Код: ').pop().slice(0, 4);
    } else {
        code = 'няма'
    }
    return code
}

// Get Products
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

    let products
    try {
        products = await Product.find().sort({ title: 1 }).exec()
    } catch {
        products = []
    }

    for (i = 0; i < products.length; i++) {
        products[i].description = getCode(products[i].description)
    }

    res.render('codes/index', { 
        userEmail: userEmail,
        verified: userVerified,
        products: products
    })
})

module.exports = router
