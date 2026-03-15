const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    image: { type: String },
    price: { type: Number, required: true },
    qty: { type: Number, required: true, default: 1 },
});

const orderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        items: [orderItemSchema],
        shippingAddress: {
            name: String,
            phone: String,
            street: String,
            city: String,
            state: String,
            pincode: String,
        },
        paymentMethod: { type: String, default: 'COD' },
        itemsPrice: { type: Number, default: 0 },
        shippingPrice: { type: Number, default: 0 },
        totalPrice: { type: Number, default: 0 },
        isPaid: { type: Boolean, default: false },
        paidAt: { type: Date },
        status: {
            type: String,
            enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
            default: 'Pending',
        },
        deliveredAt: { type: Date },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
