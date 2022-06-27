const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const passport = require('passport')
const algs = require("../public/javascripts/algorithms")

const initializePassport = require('../passport-config')
initializePassport(passport)

// View LogIn Form
router.get('/login', algs.verifyLoggedInUser, (req, res) => {
    res.render('user/login', { userId: null })
})

// LogIn Request
router.post('/login', algs.verifyLoggedInUser, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

// View Register Form
router.get('/register', algs.verifyLoggedInUser, (req, res) => {
    res.render('user/register', { userId: null })
})

// Register Request
router.post('/register', algs.verifyLoggedInUser, async (req, res) => {
    try {
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

module.exports = router
