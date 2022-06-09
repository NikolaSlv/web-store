const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer')
const Recaptcha = require('express-recaptcha').RecaptchaV3

const recaptcha = new Recaptcha('6LfYkFogAAAAAF7gcuF-tL3h8-LGut2eNzXLkA59', '6LfYkFogAAAAAPmr7XJqDFH9T1e__X162hXfiaci')

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
router.get('/', (req, res) => {
    try {
        res.render(`request/index`, { request: emptyReq })
    } catch {
        res.redirect('/')
    }
})

// Send Email
router.get('/send', recaptcha.middleware.verify, (req, res) => {
    if (!req.recaptcha.error) {
        res.send('Success')
    } else {
        res.send('Failed')
    }

    let request = {
        name: req.query.name,
        storeName: req.query.storeName,
        address: req.query.address,
        phone: req.query.phone,
        info: req.query.info
    }

    let mailOptions = {
        from: process.env.EMAIL_NAME,
        to: process.env.EMAIL_NAME,
        subject: `Заявка от ${request.name}, ${request.storeName}`,
        text: `Адрес: ${request.address}\nТелефон: ${request.phone}\n\nПоръчка:\n${request.info}`
    }

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            renderResultPage(res, request, true)
        } else {
            console.log('Email sent: ' + info.response)
            renderResultPage(res, emptyReq)
        }
    })
})

function renderResultPage(res, request, hasError = false) {
    try {
        const params = {
            request: request
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
