const express = require('express')
const router = express.Router()

// View Contact Information Route
router.get('/', (req, res) => {
    let mode = 'light'
    if (req.query.theme != null && req.query.theme !== '') {
        mode = req.query.theme
    }

    res.render('contact/index', { mode: mode })
})

module.exports = router
