const mongoose = require('mongoose')

const productSchema = new mongoose.Schema ({
    title: {
        type: String,
        required: true
    },
    category: {
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
    productImage: {
        type: Buffer,
        required: true
    },
    productImageType: {
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
    if (this.productImage != null && this.productImageType != null) {
        return `data:${this.productImageType};charset=utf-8;base64,
        ${this.productImage.toString('base64')}`
    }
})

module.exports = mongoose.model('Products', productSchema)
