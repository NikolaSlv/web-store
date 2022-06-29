const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const passport = require('passport')
const algs = require("../public/javascripts/algorithms")
const request = require('request')

const initializePassport = require('../passport-config')
initializePassport(passport)

// View LogIn Form
router.get('/login', algs.verifyLoggedInUser, (req, res) => {
    res.render('user/login', { userEmail: null })
})

// LogIn Request
router.post('/login', algs.verifyLoggedInUser, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

// View Register Form
router.get('/register', algs.verifyLoggedInUser, (req, res) => {
    let newUser = new User({
        email: '',
        name: '',
        businessName: '',
        address: '',
        phone: ''
    })

    res.render('user/register', { 
        userEmail: null,
        user: newUser
    })
})

// Register Request
router.post('/register', algs.verifyLoggedInUser, async (req, res) => {
    try {
        if (req.body.password !== req.body.passwordRepeat) {
            let returnData = new User({
                email: req.body.email,
                name: req.body.name,
                businessName: req.body.businessName,
                address: req.body.address,
                phone: req.body.phone
            })
            res.render('user/register', { 
                userEmail: null, 
                errorMessage: 'Паролата не съвпада',
                user: returnData
            })
            return
        }

        if (await User.findOne({ email: req.body.email })) {
            let returnData = new User({
                email: '',
                name: req.body.name,
                businessName: req.body.businessName,
                address: req.body.address,
                phone: req.body.phone
            })
            res.render('user/register', { 
                userEmail: null, 
                errorMessage: 'Имейл адресът е зает',
                user: returnData
            })
            return
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        let name = ''
        let businessName = ''
        let address = ''
        let phone = ''
        if (req.body.name != null && req.body.name !== '') {
            name = req.body.name
        }
        if (req.body.businessName != null && req.body.businessName !== '') {
            businessName = req.body.businessName
        }
        if (req.body.address != null && req.body.address !== '') {
            address = req.body.address
        }
        if (req.body.phone != null && req.body.phone !== '') {
            phone = req.body.phone
        }

        let user = new User({
            email: req.body.email,
            password: hashedPassword,
            name: name,
            businessName: businessName,
            address: address,
            phone: phone
        })
        
        const newUser = await user.save()
        res.redirect('/login')
    } catch {
        res.redirect('/register')
    }
})

// LogOut
router.delete('/logout', (req, res) => {
    req.logOut(function(err) {
        if (err) { return next(err) }
        res.redirect('/')
    })
})

const secretKey = process.env.SECRET_KEY

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

// View Profile
router.get('/profile', algs.verifyUser, async (req, res) => {
    const user = await User.findOne({ email: req.user.email })
    res.render('user/profile', {
        userEmail: user.email,
        user: user
    })
})

// Update Profile
router.put('/profile/update', algs.verifyUser, async (req, res) => {
    const user = await User.findOne({ email: req.user.email })

    if (req.body.updatePass === 'yes') {
        if (req.body.password !== req.body.passwordRepeat) {
            res.render('user/profile', { 
                userEmail: user.email, 
                user: user,
                errorMessage: 'Паролата не съвпада' 
            })
            return
        }
        let hashedPassword = await bcrypt.hash(req.body.password, 10)
        user.password = hashedPassword
    } else {
        if (req.body.email !== user.email && await User.findOne({ email: req.body.email })) {
            res.render('user/profile', {
                userEmail: req.user.email,
                user: user,
                errorMessage: 'Имейл адресът е зает'
            })
            return
        }

        user.email = req.body.email
        user.name = req.body.name
        user.businessName = req.body.businessName
        user.address = req.body.address
        user.phone = req.body.phone
    }

    await user.save()

    res.render('user/profile', {
        userEmail: user.email,
        user: user
    })
})

module.exports = router
