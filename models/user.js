const mongoose = require('mongoose')

const userSchema = new mongoose.Schema ({
    key: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    businessName: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Users', userSchema)
