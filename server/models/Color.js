const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Color name is required'],
        unique: true,
        trim: true
    },
    hexCode: {
        type: String,
        required: [true, 'Hex code is required'],
        trim: true,
        match: [/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color code']
    }
}, { timestamps: true });

module.exports = mongoose.model('Color', colorSchema);