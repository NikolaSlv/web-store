const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer')
var rp = require("request-promise");

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

    const secretKey = "6LfYkFogAAAAAPmr7XJqDFH9T1e__X162hXfiaci";
  var token = req.body.token
  var email = req.body.email;
  var uri = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + token;
  var options = {
    method: 'POST',
    uri: uri,
    json: true
  };

  if (token) {
    rp(options)
      .then(function(parsedBody) {
        if (parsedBody.success && parsedBody.score > 0.1) {
  // Save user email address to your database
          res.send("Success - You are human");
        } else {
          res.send("Failed - You are bot");
        }
      })
    .catch(function(err) {
      res.send("Error - request Failed");
    });
  } else
    res.send("Error - Token Failed");

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
