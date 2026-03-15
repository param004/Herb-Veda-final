import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiStar, FiHeart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, 1);
        toast.success(`${product.name} added to cart! 🌿`, { duration: 2000 });
    };

    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : null;

    const imageUrl = product.images?.[0]?.startsWith('http')
        ? product.images[0]
        : product.images?.[0]
            ? product.images[0]
            : 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400';

    return (
        <motion.div
            whileHover={{ y: -6 }}
            transition={{ duration: 0.25 }}
            className="group"
        >
            <Link to={`/products/${product._id}`} className="block">
                <div className="card group-hover:shadow-card-hover">
                    {/* Image */}
                    <div className="relative overflow-hidden bg-forest-50 aspect-[4/3]">
                        <img
                            src={imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                            onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400';
                            }}
                        />
                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                            {discount && (
                                <span className="bg-earth-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                                    -{discount}%
                                </span>
                            )}
                            {product.isBestSeller && (
                                <span className="bg-forest-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                                    ⭐ Bestseller
                                </span>
                            )}
                        </div>
                        {/* Wishlist */}
                        <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-50 hover:text-red-500 shadow-sm">
                            <FiHeart className="w-4 h-4" />
                        </button>
                        {/* Quick add on hover */}
                        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                            <button
                                onClick={handleAddToCart}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-forest-600 hover:bg-forest-700 text-white font-semibold text-sm transition-colors"
                            >
                                <FiShoppingCart className="w-4 h-4" />
                                Quick Add
                            </button>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                        <div className="text-xs font-semibold text-sage-600 uppercase tracking-wider mb-1">
                            {product.category}
                        </div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-forest-700 transition-colors leading-snug mb-1.5 line-clamp-2">
                            {product.name}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{product.description}</p>

                        {/* Rating */}
                        <div className="flex items-center gap-1.5 mb-3">
                            <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <FiStar
                                        key={star}
                                        className={`w-3.5 h-3.5 ${star <= Math.round(product.rating || 0)
                                                ? 'fill-amber-400 text-amber-400'
                                                : 'text-gray-300'
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="text-xs text-gray-400">({product.numReviews || 0})</span>
                        </div>

                        {/* Price + Cart */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-baseline gap-2">
                                <span className="text-lg font-bold text-forest-700">₹{product.price}</span>
                                {product.originalPrice && (
                                    <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
                                )}
                            </div>
                            <button
                                onClick={handleAddToCart}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-forest-50 hover:bg-forest-600 text-forest-700 hover:text-white text-xs font-semibold rounded-full transition-all duration-200 border border-forest-200 hover:border-forest-600"
                            >
                                <FiShoppingCart className="w-3.5 h-3.5" />
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default ProductCard;
