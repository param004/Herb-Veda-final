require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

connectDB();

const products = [
    {
        name: 'Kesuda Handmade Soap',
        description: 'Traditional Ayurvedic soap infused with Kesuda (Palash) flowers. known for its natural cooling and skin-soothing properties. Completely handmade and chemical-free.',
        ingredients: ['Kesuda Flower Extract', 'Coconut Oil', 'Neem Oil', 'Essential Oils'],
        benefits: ['Cooling effect', 'Soothes skin irritation', 'Natural fragrance', 'Gentle cleansing'],
        price: 60,
        originalPrice: 80,
        category: 'Body Care',
        stock: 100,
        images: ['/uploads/kesuda-soap.jpeg'],
        rating: 4.8,
        numReviews: 45,
        isFeatured: true,
        isBestSeller: true,
        tags: ['soap', 'kesuda', 'handmade'],
    },
    {
        name: 'Refreshing Rose Handmade Soap',
        description: 'Luxurious rose soap that hydrates and refreshes. Made with pure rose petals and essential oils for a spa-like bathing experience.',
        ingredients: ['Rose Petals', 'Rose Oil', 'Glycerin', 'Aloe Vera'],
        benefits: ['Hydrating', 'Refreshes mind & body', 'Skin softening', 'Divine aroma'],
        price: 70,
        originalPrice: 90,
        category: 'Body Care',
        stock: 100,
        images: ['/uploads/rose-soap.jpeg'],
        rating: 4.9,
        numReviews: 62,
        isFeatured: true,
        isBestSeller: true,
        tags: ['soap', 'rose', 'handmade'],
    },
    {
        name: 'Premium Sandalwood Handmade Soap',
        description: 'Exotic sandalwood soap that brightens skin tone and provides deep purification. A timeless Ayurvedic classic for glowing skin.',
        ingredients: ['Sandalwood Oil', 'Turmeric', 'Coconut Oil', 'Almond Oil'],
        benefits: ['Skin brightening', 'Purifying', 'Anti-infammatory', 'Woody fragrance'],
        price: 70,
        originalPrice: 95,
        category: 'Body Care',
        stock: 100,
        images: ['/uploads/sandalwood-soap.jpeg'],
        rating: 4.7,
        numReviews: 54,
        isFeatured: true,
        isBestSeller: false,
        tags: ['soap', 'sandalwood', 'handmade'],
    },
    {
        name: 'Multani Mitti Handmade Soap',
        description: 'Deeply cleansing soap with Fuller\'s Earth (Multani Mitti). Effectively removes excess oil and impurities for a clear, matte complexion.',
        ingredients: ['Multani Mitti', 'Sandalwood', 'Neem', 'Clay'],
        benefits: ['Oil control', 'Deep cleansing', 'Detoxifies skin', 'Clear complexion'],
        price: 60,
        originalPrice: 85,
        category: 'Body Care',
        stock: 100,
        images: ['/uploads/multani-soap.jpeg'],
        rating: 4.6,
        numReviews: 38,
        isFeatured: false,
        isBestSeller: true,
        tags: ['soap', 'multani mitti', 'oil control'],
    },
    {
        name: 'Bhringadi Hair Oil',
        description: 'Potent Ayurvedic hair oil with Bhringraj and Brahmi. Stimulates hair follicles, prevents hair loss, and promotes thick, healthy growth.',
        ingredients: ['Bhringraj', 'Amla', 'Brahmi', 'Sesame Oil', 'Coconut Oil'],
        benefits: ['Promotes hair growth', 'Prevents hair fall', 'Strengthens roots', 'Nourishes scalp'],
        price: 280,
        originalPrice: 399,
        category: 'Hair Care',
        stock: 50,
        images: ['/uploads/bhringadi-oil.jpeg'],
        rating: 4.9,
        numReviews: 128,
        isFeatured: true,
        isBestSeller: true,
        tags: ['hair oil', 'bhringraj', 'growth'],
    },
    {
        name: 'Pure Gulab Arka (Rose Water)',
        description: '100% pure and steam-distilled Rose Water. Acts as a natural toner, hydrates the skin, and provides an instant refreshing glow.',
        ingredients: ['Steam Distilled Rose Water (Rosa Damascena)'],
        benefits: ['Natural toner', 'Hydrating', 'Refreshes skin', 'Balances pH'],
        price: 120,
        originalPrice: 180,
        category: 'Skin Care',
        stock: 80,
        images: ['/uploads/rose-water.jpeg'],
        rating: 4.8,
        numReviews: 95,
        isFeatured: true,
        isBestSeller: false,
        tags: ['rose water', 'toner', 'pure'],
    },
    {
        name: 'Rose Foaming Face Wash',
        description: 'Gentle rose-infused foaming facewash that cleanses without drying. Enriched with Ayurvedic herbs to keep skin soft and supple.',
        ingredients: ['Rose Extract', 'Aloe Vera', 'Neem', 'Turmeric'],
        benefits: ['Gentle cleansing', 'Non-drying', 'Purifies skin', 'Natural glow'],
        price: 170,
        originalPrice: 250,
        category: 'Skin Care',
        stock: 75,
        images: ['/uploads/facewash.jpeg'],
        rating: 4.7,
        numReviews: 68,
        isFeatured: false,
        isBestSeller: true,
        tags: ['facewash', 'ayurvedic', 'cleansing'],
    },
    {
        name: 'Suvarnaprashan Ayurvedic Drops',
        description: 'Ancient Ayurvedic immunity booster for children. Enhances memory, focus, and overall immunity. Infused with pure gold and herbs.',
        ingredients: ['Pure Gold (Swarna Bhasma)', 'Honey', 'Ghee', 'Brahmi', 'Shankhpushpi'],
        benefits: ['Boosts immunity', 'Enhances memory', 'Improves focus', 'Natural growth'],
        price: 650,
        originalPrice: 850,
        category: 'Wax & Baby Care',
        stock: 50,
        images: ['/uploads/suvarnaprashan.jpeg'],
        rating: 5.0,
        numReviews: 12,
        isFeatured: true,
        isBestSeller: false,
        tags: ['suvarnaprashan', 'immunity', 'kids'],
    },
    {
        name: 'Ayurwax - Painless Hair Removal',
        description: '100% natural Ayurvedic powder for painless and effective hair removal. No irritation, no burns, just smooth radiant skin.',
        ingredients: ['Natural Powders', 'Mineral Clay', 'Ayurvedic Extracts'],
        benefits: ['Painless', 'Zero irritation', 'Removes tan', 'Smooth skin'],
        price: 200,
        originalPrice: 350,
        category: 'Wax & Baby Care',
        stock: 90,
        images: ['/uploads/ayurwax.jpeg'],
        rating: 4.8,
        numReviews: 110,
        isFeatured: true,
        isBestSeller: true,
        tags: ['wax', 'hair removal', 'painless'],
    },
    {
        name: 'Lip Balm (5gm)',
        description: 'Deeply nourishing lip balm with natural waxes and oils. Prevents chapping and keeps lips soft with a natural hue.',
        ingredients: ['Beeswax', 'Cocoa Butter', 'Almond Oil', 'Herbal Extracts'],
        benefits: ['Heals cracked lips', 'Softens lips', 'Long-lasting', 'Natural gloss'],
        price: 100,
        originalPrice: 150,
        category: 'Lip Care',
        stock: 120,
        images: ['/uploads/lip-balm-jar.jpeg'],
        rating: 4.6,
        numReviews: 42,
        isFeatured: false,
        isBestSeller: false,
        tags: ['lip balm', 'herbal', 'nourishing'],
    },
    {
        name: 'Tinted Lip Balm',
        description: 'Tinted lip balm sticks for on-the-go hydration with a natural hue. Crafted with the goodness of Ayurveda for smooth, healthy lips.',
        ingredients: ['Shea Butter', 'Castor Oil', 'Vitamin E', 'Herbal Oils'],
        benefits: ['Smooth lips', 'Natural tint', 'Hydrating', 'Safe & natural'],
        price: 150,
        originalPrice: 200,
        category: 'Lip Care',
        stock: 150,
        images: ['/uploads/lip-balm-stick.jpeg'],
        rating: 4.7,
        numReviews: 28,
        isFeatured: false,
        isBestSeller: false,
        tags: ['lip balm', 'stick', 'natural'],
    },
    {
        name: 'Brightening Body Wash',
        description: 'Rich brightening body wash with natural actives and Ayurvedic extracts. Deeply cleanses, hydrates and gives radiant glowing skin.',
        ingredients: ['Aloe Vera', 'Shea Butter', 'Vitamin C', 'Turmeric Extract'],
        benefits: ['Brightening', 'Deep cleansing', 'Non-drying', 'Radiant skin'],
        price: 250,
        originalPrice: 350,
        category: 'Skin Care',
        stock: 60,
        images: ['/uploads/aloe-lotion.jpeg'],
        rating: 4.8,
        numReviews: 35,
        isFeatured: false,
        isBestSeller: false,
        tags: ['body lotion', 'aloe vera', 'hydrating'],
    },
    {
        name: 'Brightening Face Oil',
        description: 'Luxurious brightening face oil with potent Ayurvedic botanicals. Reduces dark spots, evens skin tone, and gives a healthy luminous glow.',
        ingredients: ['Rosehip Oil', 'Saffron', 'Vitamin C', 'Sandalwood'],
        benefits: ['Brightens skin', 'Reduces dark spots', 'Even skin tone', 'Luminous glow'],
        price: 250,
        originalPrice: 350,
        category: 'Skin Care',
        stock: 40,
        images: ['/uploads/face-serum.jpeg'],
        rating: 4.9,
        numReviews: 88,
        isFeatured: true,
        isBestSeller: true,
        tags: ['face oil', 'brightening', 'glow'],
    },
    {
        name: 'Bhringadi Shampoo',
        description: 'Ayurvedic herbal shampoo enriched with Bhringraj and Brahmi. Gently cleanses the scalp, reduces hair fall, and leaves hair strong and shiny.',
        ingredients: ['Bhringraj Extract', 'Brahmi', 'Amla', 'Hibiscus', 'Coconut Milk'],
        benefits: ['Reduces hair fall', 'Strengthens hair', 'Nourishes scalp', 'Adds shine'],
        price: 250,
        originalPrice: 350,
        category: 'Hair Care',
        stock: 60,
        images: ['/uploads/bhringadi-oil.jpeg'],
        rating: 4.8,
        numReviews: 34,
        isFeatured: true,
        isBestSeller: true,
        tags: ['shampoo', 'bhringraj', 'hair care'],
    },
];

const seedDB = async () => {
    try {
        await User.deleteMany();
        await Product.deleteMany();
        await Order.deleteMany();

        // Create admin
        const admin = await User.create({
            name: 'Admin',
            email: 'admin@herbveda.com',
            password: 'admin123',
            role: 'admin',
        });

        // Create sample user
        await User.create({
            name: 'Priya Sharma',
            email: 'priya@example.com',
            password: 'user123',
            role: 'user',
        });

        // Generate slugs for products
        const productsWithSlugs = products.map(p => ({
            ...p,
            slug: p.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
        }));

        // Insert products
        const createdProducts = await Product.insertMany(productsWithSlugs);

        console.log('✅ Database seeded successfully!');
        console.log(`   Admin: admin@herbveda.com / admin123`);
        console.log(`   User: priya@example.com / user123`);
        console.log(`   Products: ${createdProducts.length} products added`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error);
        process.exit(1);
    }
};

seedDB();
