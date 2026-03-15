const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');
const upload = require('../middleware/upload');

// @GET /api/products
router.get(
    '/',
    asyncHandler(async (req, res) => {
        const keyword = req.query.search
            ? { name: { $regex: req.query.search, $options: 'i' } }
            : {};
        const category = req.query.category ? { category: req.query.category } : {};
        const minPrice = req.query.minPrice ? { price: { $gte: Number(req.query.minPrice) } } : {};
        const maxPrice = req.query.maxPrice
            ? { price: { ...minPrice.price, $lte: Number(req.query.maxPrice) } }
            : {};

        let filter = { ...keyword, ...category };
        if (req.query.minPrice || req.query.maxPrice) {
            filter.price = {};
            if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
            if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
        }

        let sortOption = {};
        if (req.query.sort === 'price_asc') sortOption = { price: 1 };
        else if (req.query.sort === 'price_desc') sortOption = { price: -1 };
        else if (req.query.sort === 'rating') sortOption = { rating: -1 };
        else if (req.query.sort === 'newest') sortOption = { createdAt: -1 };
        else sortOption = { createdAt: -1 };

        const products = await Product.find(filter).sort(sortOption);
        res.json(products);
    })
);

// @GET /api/products/featured
router.get('/featured', asyncHandler(async (req, res) => {
    const products = await Product.find({ isFeatured: true }).limit(6);
    res.json(products);
}));

// @GET /api/products/bestsellers
router.get('/bestsellers', asyncHandler(async (req, res) => {
    const products = await Product.find({ isBestSeller: true }).limit(8);
    res.json(products);
}));

// @GET /api/products/:id
router.get(
    '/:id',
    asyncHandler(async (req, res) => {
        const product = await Product.findById(req.params.id).populate('reviews.user', 'name');
        if (product) {
            res.json(product);
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    })
);

// @POST /api/products (admin)
router.post(
    '/',
    protect,
    admin,
    upload.array('images', 5),
    asyncHandler(async (req, res) => {
        const { name, description, price, originalPrice, category, stock, ingredients, benefits, tags, isFeatured, isBestSeller } = req.body;
        const images = req.files ? req.files.map((f) => `/uploads/${f.filename}`) : [];
        const product = new Product({
            name,
            description,
            price,
            originalPrice,
            category,
            stock,
            ingredients: ingredients ? JSON.parse(ingredients) : [],
            benefits: benefits ? JSON.parse(benefits) : [],
            tags: tags ? JSON.parse(tags) : [],
            images,
            isFeatured: isFeatured === 'true',
            isBestSeller: isBestSeller === 'true',
        });
        const created = await product.save();
        res.status(201).json(created);
    })
);

// @PUT /api/products/:id (admin)
router.put(
    '/:id',
    protect,
    admin,
    upload.array('images', 5),
    asyncHandler(async (req, res) => {
        const product = await Product.findById(req.params.id);
        if (!product) {
            res.status(404);
            throw new Error('Product not found');
        }
        const { name, description, price, originalPrice, category, stock, ingredients, benefits, tags, isFeatured, isBestSeller } = req.body;
        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.originalPrice = originalPrice || product.originalPrice;
        product.category = category || product.category;
        product.stock = stock !== undefined ? stock : product.stock;
        product.ingredients = ingredients ? JSON.parse(ingredients) : product.ingredients;
        product.benefits = benefits ? JSON.parse(benefits) : product.benefits;
        product.tags = tags ? JSON.parse(tags) : product.tags;
        product.isFeatured = isFeatured !== undefined ? isFeatured === 'true' : product.isFeatured;
        product.isBestSeller = isBestSeller !== undefined ? isBestSeller === 'true' : product.isBestSeller;
        if (req.files && req.files.length > 0) {
            product.images = req.files.map((f) => `/uploads/${f.filename}`);
        }
        const updated = await product.save();
        res.json(updated);
    })
);

// @DELETE /api/products/:id (admin)
router.delete(
    '/:id',
    protect,
    admin,
    asyncHandler(async (req, res) => {
        const product = await Product.findById(req.params.id);
        if (!product) {
            res.status(404);
            throw new Error('Product not found');
        }
        await product.deleteOne();
        res.json({ message: 'Product removed' });
    })
);

// @POST /api/products/:id/reviews
router.post(
    '/:id/reviews',
    protect,
    asyncHandler(async (req, res) => {
        const { rating, comment } = req.body;
        const product = await Product.findById(req.params.id);
        if (!product) {
            res.status(404);
            throw new Error('Product not found');
        }
        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        );
        if (alreadyReviewed) {
            res.status(400);
            throw new Error('Product already reviewed');
        }
        const review = {
            user: req.user._id,
            name: req.user.name,
            rating: Number(rating),
            comment,
        };
        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating = product.reviews.reduce((acc, r) => r.rating + acc, 0) / product.reviews.length;
        await product.save();
        res.status(201).json({ message: 'Review added' });
    })
);

// @DELETE /api/products/:id/reviews/:reviewId (admin)
router.delete(
    '/:id/reviews/:reviewId',
    protect,
    admin,
    asyncHandler(async (req, res) => {
        const product = await Product.findById(req.params.id);
        if (!product) { res.status(404); throw new Error('Product not found'); }
        product.reviews = product.reviews.filter(r => r._id.toString() !== req.params.reviewId);
        product.numReviews = product.reviews.length;
        product.rating = product.reviews.length ? product.reviews.reduce((acc, r) => r.rating + acc, 0) / product.reviews.length : 0;
        await product.save();
        res.json({ message: 'Review removed' });
    })
);

module.exports = router;
