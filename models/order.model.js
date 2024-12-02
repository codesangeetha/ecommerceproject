const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    orderId: { type: String, required: true },
    cartDetails: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
            quantity: { type: Number, required: true },
            size: String,
            color: String,
        }
    ],
    address: {
        fullname: String,
        houseNo: String,
        city: String,
        state: String,
        pincode: String,
        phone: String,
    },
    paymentDetails: {
        transactionId: String,
        paymentStatus: String,
        paymentMethod: { type: String, default: 'Cashfree' },
    },
    totalAmount: { type: Number, required: true },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
