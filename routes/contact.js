const express = require('express')
const router = express.Router()

// View Contact Information Route
router.get('/', (req, res) => {
    res.render('contact/index')
})

module.exports = router
