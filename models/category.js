const mongoose = require('mongoose')

const catSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Categories', catSchema)
