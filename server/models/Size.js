const mongoose = require('mongoose');

const sizeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Size name is required'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['clothing', 'cosmetics', 'accessories', 'shoes'],
        default: 'clothing'
    }
}, { timestamps: true });

module.exports = mongoose.model('Size', sizeSchema);
