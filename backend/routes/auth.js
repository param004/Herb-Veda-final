const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// @POST /api/auth/google
router.post(
    '/google',
    asyncHandler(async (req, res) => {
        const { idToken } = req.body;

        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { sub, email, name, picture } = ticket.getPayload();

        let user = await User.findOne({ email });

        if (user) {
            // Update Google ID and picture if not already present
            user.googleId = sub;
            user.picture = picture;
            user.name = name;
            await user.save();
        } else {
            // Create new user
            user = await User.create({
                googleId: sub,
                name,
                email,
                picture,
            });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            picture: user.picture,
            token: generateToken(user._id),
        });
    })
);

// @POST /api/auth/register
router.post(
    '/register',
    asyncHandler(async (req, res) => {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }
        const user = await User.create({ name, email, password });
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    })
);

// @POST /api/auth/login
router.post(
    '/login',
    asyncHandler(async (req, res) => {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    })
);

// @GET /api/auth/profile
router.get(
    '/profile',
    protect,
    asyncHandler(async (req, res) => {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    })
);

// @PUT /api/auth/profile
router.put(
    '/profile',
    protect,
    asyncHandler(async (req, res) => {
        const user = await User.findById(req.user._id);
        if (user) {
            user.name = req.body.name || user.name;
            user.phone = req.body.phone || user.phone;
            user.address = req.body.address || user.address;
            if (req.body.password) {
                user.password = req.body.password;
            }
            const updated = await user.save();
            res.json({
                _id: updated._id,
                name: updated.name,
                email: updated.email,
                role: updated.role,
                phone: updated.phone,
                address: updated.address,
                token: generateToken(updated._id),
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    })
);

module.exports = router;
