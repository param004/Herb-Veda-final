const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

// @POST /api/orders
router.post(
    '/',
    protect,
    asyncHandler(async (req, res) => {
        const { items, shippingAddress, paymentMethod, itemsPrice } = req.body;
        if (!items || items.length === 0) {
            res.status(400);
            throw new Error('No order items');
        }
        const order = new Order({
            user: req.user._id,
            items,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice: 0,
            totalPrice: itemsPrice,
        });
        const created = await order.save();
        res.status(201).json(created);
    })
);

// @GET /api/orders/myorders
router.get(
    '/myorders',
    protect,
    asyncHandler(async (req, res) => {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    })
);

// @GET /api/orders (admin)
router.get(
    '/',
    protect,
    admin,
    asyncHandler(async (req, res) => {
        const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
        res.json(orders);
    })
);

// @GET /api/orders/:id
router.get(
    '/:id',
    protect,
    asyncHandler(async (req, res) => {
        const order = await Order.findById(req.params.id).populate('user', 'name email');
        if (!order) { res.status(404); throw new Error('Order not found'); }
        res.json(order);
    })
);

// @PUT /api/orders/:id/status (admin)
router.put(
    '/:id/status',
    protect,
    admin,
    asyncHandler(async (req, res) => {
        const order = await Order.findById(req.params.id);
        if (!order) { res.status(404); throw new Error('Order not found'); }
        order.status = req.body.status || order.status;
        if (req.body.status === 'Delivered') {
            order.deliveredAt = new Date();
        }
        const updated = await order.save();
        res.json(updated);
    })
);

module.exports = router;
