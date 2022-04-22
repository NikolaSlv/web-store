const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    const reject = () => {
        res.setHeader('www-authenticate', 'Basic')
        res.sendStatus(401)
    }

    const authorization = req.headers.authorization

    if (!authorization) {
        return reject()
    }

    const [username, password] = Buffer.from(authorization.replace('Basic ', ''), 'base64').toString().split(':')

    if (!(username === 'nikola' && password === 'difpass6y7')) {
        return reject()
    }

    res.send('Top secret stuff here')
})

module.exports = router
