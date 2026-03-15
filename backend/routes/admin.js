const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

// @GET /api/admin/dashboard
router.get(
    '/dashboard',
    protect,
    admin,
    asyncHandler(async (req, res) => {
        const usersCount = await User.countDocuments({ role: 'user' });
        const productsCount = await Product.countDocuments();
        const ordersCount = await Order.countDocuments();
        const orders = await Order.find({});
        const totalRevenue = orders.reduce((acc, o) => acc + o.totalPrice, 0);
        const recentOrders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 }).limit(5);
        const ordersByStatus = {
            Pending: await Order.countDocuments({ status: 'Pending' }),
            Processing: await Order.countDocuments({ status: 'Processing' }),
            Shipped: await Order.countDocuments({ status: 'Shipped' }),
            Delivered: await Order.countDocuments({ status: 'Delivered' }),
            Cancelled: await Order.countDocuments({ status: 'Cancelled' }),
        };
        res.json({ usersCount, productsCount, ordersCount, totalRevenue, recentOrders, ordersByStatus });
    })
);

// @GET /api/admin/users
router.get('/users', protect, admin, asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
}));

// @DELETE /api/admin/users/:id
router.delete('/users/:id', protect, admin, asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) { res.status(404); throw new Error('User not found'); }
    await user.deleteOne();
    res.json({ message: 'User removed' });
}));

module.exports = router;
