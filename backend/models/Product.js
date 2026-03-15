const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true },
    },
    { timestamps: true }
);

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        slug: { type: String, unique: true },
        description: { type: String, required: true },
        ingredients: [{ type: String }],
        benefits: [{ type: String }],
        price: { type: Number, required: true, default: 0 },
        originalPrice: { type: Number },
        category: {
            type: String,
            required: true,
            enum: ['Body Care', 'Skin Care', 'Lip Care', 'Wax & Baby Care', 'Hair Care'],
        },
        images: [{ type: String }],
        stock: { type: Number, required: true, default: 0 },
        reviews: [reviewSchema],
        rating: { type: Number, default: 0 },
        numReviews: { type: Number, default: 0 },
        isFeatured: { type: Boolean, default: false },
        isBestSeller: { type: Boolean, default: false },
        tags: [{ type: String }],
    },
    { timestamps: true }
);

productSchema.pre('save', function (next) {
    if (!this.slug) {
        this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    }
    next();
});

module.exports = mongoose.model('Product', productSchema);
