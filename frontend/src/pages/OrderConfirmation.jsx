import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheck, FiPackage, FiArrowRight } from 'react-icons/fi';
import { getOrderById } from '../services/api';

const OrderConfirmation = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        getOrderById(id).then(({ data }) => setOrder(data)).catch(console.error);
    }, [id]);

    return (
        <div className="pt-24 pb-20 min-h-screen flex items-center justify-center">
            <div className="page-container max-w-2xl text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    className="w-24 h-24 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                    <FiCheck className="w-12 h-12 text-forest-600" />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <h1 className="text-4xl font-display font-bold text-gray-900 mb-3">Order Confirmed! 🌿</h1>
                    <p className="text-gray-500 text-lg mb-2">Thank you for choosing Herb & Veda</p>
                    <p className="text-sm text-gray-400 mb-8">Order ID: <span className="font-mono font-medium text-gray-700">{id}</span></p>

                    {order && (
                        <div className="card p-6 text-left mb-8">
                            <h2 className="font-semibold text-gray-900 mb-4">Order Details</h2>
                            <div className="space-y-3 mb-5">
                                {order.items?.map((item) => (
                                    <div key={item._id} className="flex justify-between text-sm">
                                        <span className="text-gray-600">{item.name} × {item.qty}</span>
                                        <span className="font-medium">₹{(item.price * item.qty).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-gray-200 pt-4 space-y-2">
                                <div className="flex justify-between font-bold text-gray-900">
                                    <span>Total Paid</span>
                                    <span className="text-forest-700">₹{order.totalPrice?.toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
                                <FiPackage className="inline w-4 h-4 mr-1.5" />
                                Payment Method: Cash on Delivery — Pay when your order arrives!
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link to="/profile/orders" className="btn-primary">Track My Orders</Link>
                        <Link to="/products" className="btn-secondary flex items-center gap-2">
                            Continue Shopping <FiArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default OrderConfirmation;
