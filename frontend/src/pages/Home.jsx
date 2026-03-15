import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiShield, FiStar, FiHeart, FiPackage, FiCheckCircle } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import { getFeaturedProducts, getBestSellers } from '../services/api';

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 },
};

const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
};

const testimonials = [
    { name: 'Ananya R.', location: 'Mumbai', rating: 5, text: 'The Kumkumadi face oil transformed my skin in just 2 weeks! I finally have the glow I always wanted. Completely natural and smells divine. ✨', avatar: 'A' },
    { name: 'Rohan M.', location: 'Delhi', rating: 5, text: 'Ashwagandha capsules genuinely helped with my work stress. Sleep improved drastically and I feel so much more energetic. 100% recommend!', avatar: 'R' },
    { name: 'Priya K.', location: 'Bangalore', rating: 5, text: 'Bhringraj oil reduced my hair fall within a month. The quality is premium and packaging is eco-friendly. Herb & Veda is my go-to wellness brand now!', avatar: 'P' },
    { name: 'Sahil T.', location: 'Pune', rating: 5, text: 'The Tulsi tea is my morning ritual now. So refreshing and genuinely boosts immunity. Loved the entire product range tbh!', avatar: 'S' },
];

const benefits = [
    { icon: FiCheckCircle, title: '100% Natural', desc: 'Every product crafted from pure botanical ingredients, free from harmful chemicals and synthetic additives.' },
    { icon: FiShield, title: 'Ayurvedic Science', desc: 'Formulas rooted in thousands of years of Ayurvedic wisdom, validated by modern research.' },
    { icon: FiCheckCircle, title: 'Clinically Safe', desc: 'Dermatologically tested and certified safe for all skin types. No side effects, pure natural goodness.' },
    { icon: FiPackage, title: 'Sustainable Packaging', desc: 'Eco-conscious packaging made from recyclable and biodegradable materials. Earth first, always.' },
    { icon: FiPackage, title: 'Ethically Sourced', desc: 'Ingredients sourced directly from organic farms with fair trade practices and no pesticides.' },
    { icon: FiHeart, title: 'Cruelty Free', desc: 'Never tested on animals. Certified vegan and cruelty-free. Wellness with a conscience.' },
];

const categories = [
    { name: 'Body Care', emoji: '🧼', color: 'from-amber-100 to-yellow-50', border: 'border-amber-200', text: 'text-amber-700', link: '/products?category=Body+Care' },
    { name: 'Skin Care', emoji: '✨', color: 'from-rose-100 to-pink-50', border: 'border-rose-200', text: 'text-rose-700', link: '/products?category=Skin+Care' },
    { name: 'Lip Care', emoji: '💄', color: 'from-pink-100 to-red-50', border: 'border-pink-200', text: 'text-pink-700', link: '/products?category=Lip+Care' },
    { name: 'Wax & Baby Care', emoji: '🌿', color: 'from-emerald-100 to-teal-50', border: 'border-emerald-200', text: 'text-emerald-700', link: '/products?category=Wax+%26+Baby+Care' },
    { name: 'Hair Care', emoji: '💆', color: 'from-purple-100 to-violet-50', border: 'border-purple-200', text: 'text-purple-700', link: '/products?category=Hair+Care' },
];

const Home = () => {
    const [featured, setFeatured] = useState([]);
    const [bestsellers, setBestsellers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [f, b] = await Promise.all([getFeaturedProducts(), getBestSellers()]);
                setFeatured(f.data);
                setBestsellers(b.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-hero-gradient" />
                <div className="absolute inset-0 bg-nature-pattern" />
                {/* Decorative circles */}
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/5 rounded-full blur-xl" />
                <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-sage-400/20 rounded-full blur-xl" />

                <div className="page-container relative z-10 py-32">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial="hidden"
                            animate="show"
                            variants={stagger}
                        >
                            <motion.div variants={fadeUp} className="flex items-center gap-2 mb-6">
                                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm font-medium">
                                    <span className="w-2 h-2 bg-sage-300 rounded-full animate-pulse" />
                                    Ancient Wisdom, Modern Wellness
                                </span>
                            </motion.div>
                            <motion.h1 variants={fadeUp} className="text-6xl md:text-7xl lg:text-8xl font-display font-bold text-white leading-[0.9] mb-6">
                                Herb &<br />
                                <span className="text-sage-300">Veda</span>
                            </motion.h1>
                            <motion.p variants={fadeUp} className="text-xl text-white/80 mb-4 font-light leading-relaxed">
                                Rediscover the healing power of Ayurveda.
                            </motion.p>
                            <motion.p variants={fadeUp} className="text-lg text-white/60 mb-10 leading-relaxed max-w-md">
                                Premium botanical formulas crafted from 100% natural ingredients. Pure, potent, and sustainably sourced from the heart of nature.
                            </motion.p>
                            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
                                <Link to="/products" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-forest-700 font-bold rounded-full hover:bg-forest-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5">
                                    Shop Now <FiArrowRight className="w-5 h-5" />
                                </Link>
                                <Link to="/products?category=Skin+Care" className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-white/60 text-white font-semibold rounded-full hover:bg-white/10 transition-all">
                                    Explore Range
                                </Link>
                            </motion.div>

                            {/* Stats */}
                            <motion.div variants={fadeUp} className="flex gap-8 mt-12 pt-8 border-t border-white/20">
                                {[{ val: '50K+', label: 'Happy Customers' }, { val: '100%', label: 'Natural Ingredients' }, { val: '12+', label: 'Product Lines' }].map((s) => (
                                    <div key={s.label}>
                                        <FiCheckCircle className="text-2xl" />
                                        <div className="text-2xl font-bold text-white">{s.val}</div>
                                        <div className="text-white/50 text-xs mt-0.5">{s.label}</div>
                                    </div>
                                ))}
                            </motion.div>
                        </motion.div>

                        {/* Hero Visual */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="relative hidden lg:block"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-white/10 rounded-3xl blur-lg" />
                                <div className="relative grid grid-cols-2 gap-4">
                                    <div className="space-y-4">
                                        <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="glass-card p-4">
                                            <img src="https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=200&h=200&fit=crop" className="w-full rounded-xl object-cover aspect-square" alt="Face oil" />
                                        </motion.div>
                                        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} className="glass-card p-4">
                                            <img src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&h=150&fit=crop" className="w-full rounded-xl object-cover" alt="Tea" />
                                        </motion.div>
                                    </div>
                                    <div className="space-y-4 mt-8">
                                        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }} className="glass-card p-4">
                                            <img src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=150&fit=crop" className="w-full rounded-xl object-cover" alt="Capsules" />
                                        </motion.div>
                                        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }} className="glass-card p-4">
                                            <img src="https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=200&h=200&fit=crop" className="w-full rounded-xl object-cover aspect-square" alt="Hair oil" />
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Floating badge */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.8 }}
                                    className="absolute -bottom-4 -left-4 glass-card px-4 py-3 flex items-center gap-3"
                                >
                                    <div className="w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center text-xl">🌿</div>
                                    <div>
                                        <div className="text-white font-bold text-sm">100% Organic</div>
                                        <div className="text-white/70 text-xs">Certified Natural</div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Wave divider */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 80L48 72C96 64 192 48 288 40C384 32 480 32 576 37.3C672 42.7 768 53.3 864 56C960 58.7 1056 53.3 1152 45.3C1248 37.3 1344 26.7 1392 21.3L1440 16V80H0Z" fill="#FFFDF7" />
                    </svg>
                </div>
            </section>

            {/* Categories */}
            <section className="section bg-cream">
                <div className="page-container">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        variants={stagger}
                        className="text-center mb-12"
                    >
                        <motion.p variants={fadeUp} className="text-sage-600 font-semibold text-sm uppercase tracking-widest mb-2">Browse by Category</motion.p>
                        <motion.h2 variants={fadeUp} className="section-title">What are you looking for?</motion.h2>
                    </motion.div>
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        variants={stagger}
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
                    >
                        {categories.map((cat) => (
                            <motion.div key={cat.name} variants={fadeUp}>
                                <Link
                                    to={cat.link}
                                    className={`flex flex-col items-center gap-3 p-5 rounded-2xl bg-gradient-to-br ${cat.color} border ${cat.border} hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group`}
                                >
                                    <span className="text-4xl group-hover:scale-110 transition-transform">{cat.emoji}</span>
                                    <span className={`text-sm font-semibold text-center ${cat.text}`}>{cat.name}</span>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="section bg-white">
                <div className="page-container">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        variants={stagger}
                        className="flex items-end justify-between mb-12"
                    >
                        <div>
                            <motion.p variants={fadeUp} className="text-sage-600 font-semibold text-sm uppercase tracking-widest mb-2">Handpicked for You</motion.p>
                            <motion.h2 variants={fadeUp} className="section-title">Featured Products</motion.h2>
                        </div>
                        <motion.div variants={fadeUp}>
                            <Link to="/products" className="btn-secondary hidden sm:flex">View All</Link>
                        </motion.div>
                    </motion.div>

                    {loading ? (
                        <div className="products-grid">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="card">
                                    <div className="skeleton aspect-[4/3]" />
                                    <div className="p-4 space-y-3">
                                        <div className="skeleton h-4 w-2/3 rounded" />
                                        <div className="skeleton h-3 w-full rounded" />
                                        <div className="skeleton h-8 w-1/2 rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            variants={stagger}
                            className="products-grid"
                        >
                            {featured.map((product) => (
                                <motion.div key={product._id} variants={fadeUp}>
                                    <ProductCard product={product} />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Benefits Section */}
            <section className="section bg-forest-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-nature-pattern" />
                <div className="page-container relative z-10">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        variants={stagger}
                        className="text-center mb-16"
                    >
                        <motion.p variants={fadeUp} className="text-sage-400 font-semibold text-sm uppercase tracking-widest mb-2">Why Choose Us</motion.p>
                        <motion.h2 variants={fadeUp} className="section-title text-white">The Herb & Veda Promise</motion.h2>
                        <motion.p variants={fadeUp} className="section-subtitle text-white/60 max-w-xl mx-auto">We believe wellness should be pure, honest, and connected to nature.</motion.p>
                    </motion.div>
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        variants={stagger}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {benefits.map((b) => (
                            <motion.div key={b.title} variants={fadeUp} className="group">
                                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-sage-400/30 transition-all duration-300">
                                    <div className="w-12 h-12 bg-forest-600/50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-forest-500/60 transition-colors">
                                        <b.icon className="w-6 h-6 text-sage-300" />
                                    </div>
                                    <h3 className="font-semibold text-white text-lg mb-2">{b.title}</h3>
                                    <p className="text-white/50 text-sm leading-relaxed">{b.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Bestsellers */}
            <section className="section bg-beige">
                <div className="page-container">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        variants={stagger}
                        className="flex items-end justify-between mb-12"
                    >
                        <div>
                            <motion.p variants={fadeUp} className="text-sage-600 font-semibold text-sm uppercase tracking-widest mb-2">Most Loved</motion.p>
                            <motion.h2 variants={fadeUp} className="section-title">Best Sellers</motion.h2>
                        </div>
                        <motion.div variants={fadeUp}>
                            <Link to="/products?sort=rating" className="btn-secondary hidden sm:flex">View All</Link>
                        </motion.div>
                    </motion.div>
                    {loading ? (
                        <div className="products-grid">
                            {[...Array(4)].map((_, i) => <div key={i} className="card"><div className="skeleton aspect-[4/3]" /><div className="p-4 space-y-3"><div className="skeleton h-4 w-2/3 rounded" /><div className="skeleton h-8 w-1/2 rounded" /></div></div>)}
                        </div>
                    ) : (
                        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="products-grid">
                            {bestsellers.map((product) => (
                                <motion.div key={product._id} variants={fadeUp}>
                                    <ProductCard product={product} />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Testimonials */}
            <section className="section bg-white">
                <div className="page-container">
                    <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="text-center mb-12">
                        <motion.p variants={fadeUp} className="text-sage-600 font-semibold text-sm uppercase tracking-widest mb-2">Real Stories</motion.p>
                        <motion.h2 variants={fadeUp} className="section-title">What Our Community Says</motion.h2>
                    </motion.div>
                    <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {testimonials.map((t, i) => (
                            <motion.div key={i} variants={fadeUp} className="card p-6 hover:-translate-y-2">
                                <div className="flex items-center gap-0.5 mb-4">
                                    {[...Array(t.rating)].map((_, j) => (
                                        <FiStar key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-forest-600 rounded-full flex items-center justify-center text-white font-bold text-sm">{t.avatar}</div>
                                    <div>
                                        <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                                        <div className="text-gray-400 text-xs">{t.location}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="py-20 bg-gradient-to-r from-sage-600 to-forest-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-nature-pattern" />
                <div className="page-container relative z-10 text-center">
                    <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
                        <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
                            Start Your Wellness Journey Today
                        </motion.h2>
                        <motion.p variants={fadeUp} className="text-white/70 text-lg mb-8 max-w-lg mx-auto">
                            Join 50,000+ customers who've transformed their wellness routine with Herb & Veda.
                        </motion.p>
                        <motion.div variants={fadeUp}>
                            <Link to="/products" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-forest-700 font-bold rounded-full hover:bg-forest-50 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all text-lg">
                                Shop the Collection <FiArrowRight className="w-5 h-5" />
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Home;
