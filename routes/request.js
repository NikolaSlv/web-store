const express = require('express')
const router = express.Router()
const Product = require('../models/product')
const User = require('../models/user')
const nodemailer = require('nodemailer')
const request = require('request')

const secretKey = process.env.SECRET_KEY

const transporter = nodemailer.createTransport({
    pool: true,
    maxConnections: 5,
    maxMessages: 50,
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_NAME,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
})

// View Form
router.get('/', async (req, res) => {
    try {
        let validate = false
        let inputKey = ''
        let user = null

        if (req.query.key != null && req.query.key !== '') {
            inputKey = req.query.key
            user = await User.findOne({ key: inputKey })
            if (user) {
                validate = true
            }
        }

        const products = await Product.find().sort({ title: 1 }).exec()
        const params = {
            approved: validate,
            inputKey: inputKey,
            user: user,
            products: products
        }
        res.render(`request/index`, params)
    } catch {
        res.redirect('/')
    }
})

// Verify With Google reCaptcha v3
router.post('/verify', (req, res) => {
    if (!req.body.captcha) {
        res.json({'status': '-1'})
    }

    const verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}`

    request(verifyURL, (err, response, body) => {
        if (err) {
            console.log(err)
        }
        body = JSON.parse(body)

        if (!body.success || body.score < 0.4) {
            return res.json({'status': '0'})
        }
        return res.json({'status': '1'})
    })
})

const emptyUser = {
    name: '',
    businessName: '',
    address: '',
    phone: '',
    info: ''
}

// Send Email
router.get('/send', async (req, res) => {
    const products = await Product.find().sort({ title: 1 }).exec()

    let user = {
        name: req.query.name,
        businessName: req.query.businessName,
        address: req.query.address,
        phone: req.query.phone,
        info: req.query.info
    }

    if (user.info == null || user.info === '') {
        renderResultPage(res, user, products, true)
    } else {
        let mailOptions = {
            from: process.env.EMAIL_NAME,
            to: process.env.EMAIL_NAME,
            subject: `Заявка от ${user.name}, ${user.businessName}`,
            text: `Адрес: ${user.address}\nТелефон: ${user.phone}\n\nПоръчка:\n\n${user.info}`
        }
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                renderResultPage(res, user, products, true)
            } else {
                console.log('Email sent: ' + info.response)
                renderResultPage(res, emptyUser, products)
            }
        })
    }
})

function renderResultPage(res, user, products, hasError = false) {
    try {
        const params = {
            user: user,
            products: products,
            approved: true
        }
        if (hasError) {
            params.errorMessage = "Грешка при създаването на заявка!"
        } else {
            params.successMessage = "Заявката бе успешно изпратена!"
        }
        res.render(`request/index`, params)
    } catch {
        res.redirect('/')
    }
}

module.exports = router
