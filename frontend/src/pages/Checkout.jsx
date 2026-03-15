import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/api';
import toast from 'react-hot-toast';

const Checkout = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { userInfo } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: userInfo?.name || '',
        phone: '',
        street: '',
        city: '',
        state: '',
        pincode: '',
    });

    const shipping = 0;
    const grandTotal = cartTotal;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const orderData = {
                items: cartItems.map((item) => ({
                    product: item._id,
                    name: item.name,
                    image: item.images?.[0] || '',
                    price: item.price,
                    qty: item.qty,
                })),
                shippingAddress: form,
                paymentMethod: 'COD',
                itemsPrice: cartTotal,
                shippingPrice: shipping,
                totalPrice: grandTotal,
            };
            const { data } = await createOrder(orderData);
            clearCart();
            toast.success('Order placed successfully! 🌿');
            navigate(`/order-confirmation/${data._id}`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    const fields = [
        { key: 'name', label: 'Full Name', placeholder: 'Your full name', type: 'text' },
        { key: 'phone', label: 'Phone Number', placeholder: '10-digit mobile number', type: 'tel' },
        { key: 'street', label: 'Street Address', placeholder: 'House/Flat No., Street, Area', type: 'text' },
        { key: 'city', label: 'City', placeholder: 'Your city', type: 'text' },
        { key: 'state', label: 'State', placeholder: 'Your state', type: 'text' },
        { key: 'pincode', label: 'PIN Code', placeholder: '6-digit PIN code', type: 'text' },
    ];

    return (
        <div className="pt-24 pb-20">
            <div className="page-container">
                <h1 className="text-3xl font-display font-bold text-gray-900 mb-8">Checkout</h1>
                <form onSubmit={handleSubmit}>
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Shipping Form */}
                        <div className="lg:col-span-2">
                            <div className="card p-6">
                                <h2 className="font-semibold text-gray-900 text-lg mb-5">Delivery Address</h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {fields.map((f) => (
                                        <div key={f.key} className={f.key === 'street' ? 'sm:col-span-2' : ''}>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">{f.label}</label>
                                            <input
                                                type={f.type}
                                                value={form[f.key]}
                                                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                                                placeholder={f.placeholder}
                                                className="input"
                                                required
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6">
                                    <h3 className="font-semibold text-gray-900 mb-3">Payment Method</h3>
                                    <div className="flex items-center gap-3 p-4 bg-forest-50 border-2 border-forest-400 rounded-xl">
                                        <div className="w-5 h-5 rounded-full border-4 border-forest-500 bg-white" />
                                        <div>
                                            <div className="font-medium text-gray-900">Cash on Delivery</div>
                                            <div className="text-xs text-gray-500">Pay when you receive your order</div>
                                        </div>
                                        <span className="ml-auto badge-green text-xs">Available</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div>
                            <div className="card p-6 sticky top-28">
                                <h2 className="font-semibold text-gray-900 text-lg mb-4">Order Summary</h2>
                                <div className="space-y-3 mb-4 max-h-52 overflow-y-auto pr-1">
                                    {cartItems.map((item) => (
                                        <div key={item._id} className="flex justify-between text-sm">
                                            <span className="text-gray-600 truncate max-w-[70%]">{item.name} × {item.qty}</span>
                                            <span className="font-medium">₹{(item.price * item.qty).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t border-gray-200 pt-4 space-y-2 mb-4">
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Subtotal</span>
                                        <span>₹{cartTotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-gray-900 text-lg border-t border-gray-200 pt-3 mt-2">
                                        <span>Total</span>
                                        <span>₹{grandTotal.toLocaleString()}</span>
                                    </div>
                                </div>
                                <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={loading}
                                    className="w-full btn-primary py-4 text-base"
                                >
                                    {loading ? 'Placing order...' : `Place Order · ₹${grandTotal.toLocaleString()}`}
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
