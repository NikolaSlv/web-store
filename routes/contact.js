const express = require('express')
const router = express.Router()

// View Contact Information Route
router.get('/', (req, res) => {
    let userEmail = null
    let userVerified = null
    if (req.user) { 
        userEmail = req.user.email
        userVerified = req.user.verified
    }

    res.render('contact/index', { 
        userEmail: userEmail,
        verified: userVerified
    })
})

module.exports = router
