if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const compression = require('compression')

const app = express()

app.use(compression({
    level: 6
}))
app.use(express.static('public', { 
    maxAge: '7d' 
}))

const favicon = require('serve-favicon')
const expressLayouts = require('express-ejs-layouts')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const filter = require('content-filter')
const mongoSanitize = require('express-mongo-sanitize')
const flash = require('express-flash')
const session = require('express-session')
const passport = require('passport')

const indexRouter = require('./routes/index')
const userRouter = require('./routes/user')
const adminRouter = require('./routes/admin')
const codesRouter = require('./routes/codes')
const productsRouter = require('./routes/products')
const requestRouter = require('./routes/request')
const contactRouter = require('./routes/contact')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')

app.use(favicon(__dirname + '/public/images/favicon.ico'))
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))
app.use(bodyParser.json())

const blackList = ['$','{','&&','||']
const options = {
	urlBlackList: blackList,
	bodyBlackList: blackList,
    methodList:['GET', 'DELETE'],
    urlMessage: 'A forbidden expression has been found in the URL',
    bodyMessage: 'A forbidden expression has been found in the form data'
}
app.use(filter(options))

app.use(mongoSanitize())

app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

app.use('/', indexRouter)
app.use('/', userRouter)
app.use('/admin', adminRouter)
app.use('/codes', codesRouter)
app.use('/products', productsRouter)
app.use('/request', requestRouter)
app.use('/contact', contactRouter)

app.use(function (req, res, next) {
    res.status(404).send()
})

app.listen(process.env.PORT || 3000)
