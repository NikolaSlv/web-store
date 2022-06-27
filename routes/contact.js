const express = require('express')
const router = express.Router()

// View Contact Information Route
router.get('/', (req, res) => {
    let userId = null
    if (req.user) { userId = req.user._id }

    res.render('contact/index', { userId: userId })
})

module.exports = router
