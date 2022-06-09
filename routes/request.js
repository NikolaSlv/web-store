const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer')
const request = require('request');

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
        res.render(`request/index`, {requestData: emptyReq})
    } catch {
        res.redirect('/')
    }
})

// Send Email
router.get('/send', (req, res) => {
    let requestData = {
        name: req.query.name,
        storeName: req.query.storeName,
        address: req.query.address,
        phone: req.query.phone,
        info: req.query.info
    }

    if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null)
    {
        return res.json({"responseError" : "something goes to wrong"});
    }
    const secretKey = "6LfYkFogAAAAAPmr7XJqDFH9T1e__X162hXfiaci";
    
    const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
    
    request(verificationURL,function(error,response,body) {
        body = JSON.parse(body);
    
        if(body.success !== undefined && !body.success) {
        return res.json({"responseError" : "Failed captcha verification"});
        }
        res.json({"responseSuccess" : "Sucess"});
    });

    /*const resKey = req.body['g-recaptcha-response']
    const secretKey = '6LfYaFogAAAAAIUsXwrY8RgUWEhKfhsmU7YyNyS0'
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${resKey}`

    fetch(url, {
        method: 'post',
    })
    .then((response) => response.json())
    .then((google_response) => {
        if (google_response.success != true) {
            renderResultPage(res, request, true)
        }
    })
    .catch((error) => {
        res.redirect('/')
    })*/

    let mailOptions = {
        from: process.env.EMAIL_NAME,
        to: process.env.EMAIL_NAME,
        subject: `Заявка от ${requestData.name}, ${requestData.storeName}`,
        text: `Адрес: ${requestData.address}\nТелефон: ${requestData.phone}\n\nПоръчка:\n${requestData.info}`
    }

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            renderResultPage(res, requestData, true)
        } else {
            console.log('Email sent: ' + info.response)
            renderResultPage(res, emptyReq)
        }
    })
})

function renderResultPage(res, requestData, hasError = false) {
    try {
        const params = {
            requestData: requestData
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
