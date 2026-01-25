const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    images: [{
        type: String,  // Array of image URLs
        trim: true
    }],
    brand: {
        type: String,
        required: [true, 'Brand is required'],
        trim: true
    },
    color: {
        type: String,
        trim: true,
        default: ''
    },
    size: {
        type: String,
        trim: true,
        default: ''
    },
    weight: {
        type: Number,
        required: [true, 'Weight is required'],
        min: [0, 'Weight cannot be negative']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    stock: {
        type: Number,
        required: true,
        min: [0, 'Stock cannot be negative'],
        default: 0
    },
    homePage: {
        type: Boolean,
        default: false,
        index: true  // Index for faster queries
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);