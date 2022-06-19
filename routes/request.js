const express = require('express')
const router = express.Router()
const Product = require('../models/product')
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

let emptyReq = {
    name: '',
    storeName: '',
    address: '',
    phone: '',
    info: ''
}

// View Form
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().sort({ title: 1 }).exec()
        const params = {
            requestData: emptyReq,
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

// Send Email
router.get('/send', async (req, res) => {
    const products = await Product.find().sort({ title: 1 }).exec()

    let requestData = {
        name: req.query.name,
        storeName: req.query.storeName,
        address: req.query.address,
        phone: req.query.phone,
        info: req.query.info
    }

    if (requestData.info == null) {
        renderResultPage(res, requestData, products, true)
    } else {
        let mailOptions = {
            from: process.env.EMAIL_NAME,
            to: process.env.EMAIL_NAME,
            subject: `Заявка от ${requestData.name}, ${requestData.storeName}`,
            text: `Адрес: ${requestData.address}\nТелефон: ${requestData.phone}\n\nПоръчка:\n\n${requestData.info}`
        }
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                renderResultPage(res, requestData, products, true)
            } else {
                console.log('Email sent: ' + info.response)
                renderResultPage(res, emptyReq, products)
            }
        })
    }
})

function renderResultPage(res, requestData, products, hasError = false) {
    try {
        const params = {
            requestData: requestData,
            products: products
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
