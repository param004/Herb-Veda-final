import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiStar, FiArrowLeft, FiMinus, FiPlus, FiCheck } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getProductById, addReview } from '../services/api';
import StarRating from '../components/StarRating';
import toast from 'react-hot-toast';

const ProductDetail = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const { userInfo } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [qty, setQty] = useState(1);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('description');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await getProductById(id);
                setProduct(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product, qty);
        toast.success(`${product.name} added to cart! 🌿`);
    };

    const handleReview = async (e) => {
        e.preventDefault();
        if (!userInfo) return toast.error('Please login to leave a review');
        setSubmitting(true);
        try {
            await addReview(id, { rating, comment });
            const { data } = await getProductById(id);
            setProduct(data);
            setComment('');
            setRating(5);
            toast.success('Review submitted! 🌿');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="pt-24 pb-20 page-container">
                <div className="grid md:grid-cols-2 gap-16 mt-8">
                    <div className="skeleton aspect-square rounded-2xl" />
                    <div className="space-y-4">
                        <div className="skeleton h-8 w-3/4 rounded" />
                        <div className="skeleton h-4 w-full rounded" />
                        <div className="skeleton h-4 w-5/6 rounded" />
                        <div className="skeleton h-12 w-1/3 rounded-xl" />
                    </div>
                </div>
            </div>
        );
    }

    if (!product) return <div className="pt-40 text-center text-gray-500">Product not found.</div>;

    const images = product.images?.length ? product.images : ['https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600'];

    const getImgSrc = (img) => img?.startsWith('http') ? img : img;

    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : null;

    return (
        <div className="pt-24 pb-20">
            <div className="page-container">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                    <Link to="/" className="hover:text-forest-600">Home</Link>
                    <span>/</span>
                    <Link to="/products" className="hover:text-forest-600">Products</Link>
                    <span>/</span>
                    <span className="text-gray-900 font-medium truncate max-w-xs">{product.name}</span>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 mb-16">
                    {/* Images */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <div className="sticky top-28">
                            <div className="aspect-square rounded-3xl overflow-hidden bg-forest-50 mb-4 shadow-xl">
                                <img
                                    src={getImgSrc(images[selectedImage])}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600'}
                                />
                            </div>
                            {images.length > 1 && (
                                <div className="flex gap-3">
                                    {images.map((img, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedImage(i)}
                                            className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${i === selectedImage ? 'border-forest-500 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                        >
                                            <img src={getImgSrc(img)} className="w-full h-full object-cover" alt="" onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=200'} />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Info */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="badge-green">{product.category}</span>
                            {product.isBestSeller && <span className="badge bg-earth-100 text-earth-700">⭐ Bestseller</span>}
                            {product.stock > 0 ? (
                                <span className="flex items-center gap-1 text-xs font-medium text-emerald-600"><FiCheck className="w-3.5 h-3.5" /> In Stock</span>
                            ) : (
                                <span className="text-xs font-medium text-red-500">Out of Stock</span>
                            )}
                        </div>

                        <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 leading-tight mb-4">{product.name}</h1>

                        {/* Rating */}
                        <div className="flex items-center gap-3 mb-6">
                            <StarRating value={product.rating} readonly size="md" />
                            <span className="text-gray-700 font-medium">{product.rating?.toFixed(1)}</span>
                            <span className="text-gray-400 text-sm">({product.numReviews} reviews)</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-3 mb-8">
                            <span className="text-4xl font-bold text-forest-700">₹{product.price}</span>
                            {product.originalPrice && <span className="text-xl text-gray-400 line-through">₹{product.originalPrice}</span>}
                            {discount && <span className="badge bg-red-100 text-red-600 text-sm font-bold">Save {discount}%</span>}
                        </div>

                        {/* Qty + Add to Cart */}
                        <div className="flex items-center gap-4 mb-8">
                            <div className="flex items-center gap-3 bg-gray-100 rounded-full px-2 py-1">
                                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white transition-colors">
                                    <FiMinus className="w-4 h-4" />
                                </button>
                                <span className="w-8 text-center font-semibold">{qty}</span>
                                <button onClick={() => setQty(qty + 1)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white transition-colors">
                                    <FiPlus className="w-4 h-4" />
                                </button>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className="flex-1 btn-primary py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FiShoppingCart className="w-5 h-5" />
                                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                            </button>
                        </div>

                        {/* Highlights */}
                        <div className="grid grid-cols-3 gap-3 mb-8">
                            {['100% Natural', 'Free Shipping', 'Easy Returns'].map((h) => (
                                <div key={h} className="text-center p-3 bg-forest-50 rounded-xl border border-forest-100">
                                    <FiCheck className="w-5 h-5 text-forest-500 mx-auto mb-1" />
                                    <span className="text-xs font-medium text-forest-700">{h}</span>
                                </div>
                            ))}
                        </div>

                        {/* Tabs */}
                        <div className="border-b border-gray-200 mb-6">
                            <div className="flex gap-6">
                                {['description', 'ingredients', 'benefits'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`pb-3 text-sm font-semibold capitalize transition-colors border-b-2 ${activeTab === tab ? 'border-forest-600 text-forest-700' : 'border-transparent text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="text-gray-700 text-sm leading-relaxed">
                            {activeTab === 'description' && <p>{product.description}</p>}
                            {activeTab === 'ingredients' && (
                                <ul className="space-y-2">
                                    {product.ingredients?.map((ing, i) => (
                                        <li key={i} className="flex items-center gap-2"><span className="w-2 h-2 bg-forest-400 rounded-full" />{ing}</li>
                                    ))}
                                </ul>
                            )}
                            {activeTab === 'benefits' && (
                                <ul className="space-y-2">
                                    {product.benefits?.map((ben, i) => (
                                        <li key={i} className="flex items-center gap-2"><FiCheck className="w-4 h-4 text-forest-500" />{ben}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Reviews */}
                <div className="max-w-3xl">
                    <h2 className="text-2xl font-display font-bold text-gray-900 mb-8">Customer Reviews</h2>

                    {/* Write Review */}
                    {userInfo ? (
                        <form onSubmit={handleReview} className="card p-6 mb-8">
                            <h3 className="font-semibold text-gray-900 mb-4">Write a Review</h3>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-sm text-gray-600">Your rating:</span>
                                <StarRating value={rating} onChange={setRating} size="lg" />
                            </div>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Share your experience with this product..."
                                rows={4}
                                className="input resize-none mb-4"
                                required
                            />
                            <button type="submit" disabled={submitting} className="btn-primary">
                                {submitting ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </form>
                    ) : (
                        <div className="card p-6 mb-8 text-center">
                            <p className="text-gray-600 mb-3">Please login to write a review</p>
                            <Link to="/login" className="btn-primary inline-flex">Login to Review</Link>
                        </div>
                    )}

                    {/* Review List */}
                    {product.reviews?.length === 0 ? (
                        <p className="text-gray-400 text-center py-8">No reviews yet. Be the first! 🌿</p>
                    ) : (
                        <div className="space-y-4">
                            {product.reviews?.map((review) => (
                                <motion.div key={review._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 bg-forest-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                {review.name?.charAt(0)?.toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900 text-sm">{review.name}</div>
                                                <StarRating value={review.rating} readonly size="sm" />
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
