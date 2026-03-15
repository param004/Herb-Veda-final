import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiTrash2, FiMinus, FiPlus, FiArrowRight, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

const Cart = () => {
    const { cartItems, removeFromCart, updateQty, cartTotal } = useCart();
    const navigate = useNavigate();

    const grandTotal = cartTotal;

    if (cartItems.length === 0) {
        return (
            <div className="pt-24 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-8xl mb-4">🛒</div>
                    <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">Your cart is empty</h2>
                    <p className="text-gray-500 mb-8">Discover our amazing Ayurvedic products</p>
                    <Link to="/products" className="btn-primary">Start Shopping</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-20">
            <div className="page-container">
                <h1 className="text-3xl font-display font-bold text-gray-900 mb-8">Shopping Cart</h1>
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => {
                            const imgSrc = item.images?.[0]?.startsWith('http')
                                ? item.images[0]
                                : item.images?.[0]
                                    ? item.images[0]
                                    : 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=200';
                            return (
                                <motion.div
                                    key={item._id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="card p-4 flex gap-4"
                                >
                                    <img src={imgSrc} alt={item.name} className="w-24 h-24 object-cover rounded-xl flex-shrink-0" onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=200'} />
                                    <div className="flex-1 min-w-0">
                                        <Link to={`/products/${item._id}`} className="font-semibold text-gray-900 hover:text-forest-700 line-clamp-1">{item.name}</Link>
                                        <p className="text-sm text-gray-500 mb-3">{item.category}</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 bg-gray-100 rounded-full px-2 py-1">
                                                <button onClick={() => updateQty(item._id, item.qty - 1)} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white transition-colors">
                                                    <FiMinus className="w-3.5 h-3.5" />
                                                </button>
                                                <span className="w-6 text-center text-sm font-semibold">{item.qty}</span>
                                                <button onClick={() => updateQty(item._id, item.qty + 1)} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white transition-colors">
                                                    <FiPlus className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="font-bold text-forest-700">₹{(item.price * item.qty).toLocaleString()}</span>
                                                <button onClick={() => removeFromCart(item._id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                                    <FiTrash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Order Summary */}
                    <div>
                        <div className="card p-6 sticky top-28">
                            <h2 className="font-semibold text-gray-900 text-lg mb-5">Order Summary</h2>
                            <div className="space-y-3 mb-5">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal ({cartItems.reduce((a, i) => a + i.qty, 0)} items)</span>
                                    <span>₹{cartTotal.toLocaleString()}</span>
                                </div>

                            </div>
                            <div className="border-t border-gray-200 pt-4 mb-6">
                                <div className="flex justify-between font-bold text-gray-900 text-lg">
                                    <span>Total</span>
                                    <span>₹{grandTotal.toLocaleString()}</span>
                                </div>
                            </div>
                            <button onClick={() => navigate('/checkout')} className="w-full btn-primary py-4 text-base">
                                Proceed to Checkout <FiArrowRight className="w-5 h-5" />
                            </button>
                            <Link to="/products" className="mt-3 w-full flex items-center justify-center gap-2 text-sm text-forest-600 hover:underline">
                                <FiShoppingBag className="w-4 h-4" /> Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
