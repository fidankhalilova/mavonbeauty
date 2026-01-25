const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Brand name is required'],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    logo: {
        type: String,
        trim: true,
        default: ''
    },
    website: {
        type: String,
        trim: true,
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('Brand', brandSchema);