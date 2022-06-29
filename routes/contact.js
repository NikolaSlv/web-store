const express = require('express')
const router = express.Router()

// View Contact Information Route
router.get('/', (req, res) => {
    let userEmail = null
    if (req.user) { userEmail = req.user.email }

    res.render('contact/index', { userEmail: userEmail })
})

module.exports = router
