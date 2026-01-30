const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    selectedColor: {
        name: String,
        hex: String
    },
    selectedSize: String,
    image: String,
    description: String
});

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        required: true,
        unique: true,
        default: function () {
            // Generate default order number
            const date = new Date();
            const year = date.getFullYear().toString().slice(-2);
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
            return `ORD-${year}${month}${day}-${random}`;
        }
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    items: [orderItemSchema],
    shippingAddress: {
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        address: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    paymentInfo: {
        method: {
            type: String,
            enum: ['card', 'paypal', 'cash'],
            default: 'card'
        },
        cardLast4: String,
        transactionId: String,
        paidAt: Date
    },
    subtotal: {
        type: Number,
        required: true
    },
    shippingCost: {
        type: Number,
        required: true,
        default: 0
    },
    tax: {
        type: Number,
        required: true,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    shippingMethod: {
        type: String,
        enum: ['standard', 'express', 'overnight'],
        default: 'standard'
    },
    trackingNumber: String,
    notes: String,
    orderedAt: {
        type: Date,
        default: Date.now
    },
    deliveredAt: Date,
    cancelledAt: Date
}, {
    timestamps: true
});

// Remove the pre-save hook since we're using default value
// orderSchema.pre('save', function (next) {
//     if (!this.orderNumber) {
//         const date = new Date();
//         const year = date.getFullYear().toString().slice(-2);
//         const month = (date.getMonth() + 1).toString().padStart(2, '0');
//         const day = date.getDate().toString().padStart(2, '0');
//         const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
//         this.orderNumber = `ORD-${year}${month}${day}-${random}`;
//     }
//     next();
// });

module.exports = mongoose.model('Order', orderSchema);