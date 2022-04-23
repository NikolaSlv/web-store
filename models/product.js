const mongoose = require('mongoose')
const path = require('path')
const productImageBasePath = 'uploads/productImages'

const productSchema = new mongoose.Schema ({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    pricePerPiece: {
        type: Number,
        required: true
    },
    weightPerPiece: {
        type: Number,
        required: true
    },
    piecesPerUnit: {
        type: Number,
        required: true
    },
    pricePerUnit: {
        type: Number
    },
    productImageName: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

productSchema.virtual('productImagePath').get(function() {
    if (this.productImageName != null) {
        return path.join('/', productImageBasePath, this.productImageName)
    }
})

module.exports = mongoose.model('Products', productSchema)
module.exports.productImageBasePath = productImageBasePath
