import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiPackage, FiShoppingBag, FiDollarSign, FiClock } from 'react-icons/fi';
import { getDashboardStats } from '../../services/api';

const STATUS_COLORS = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Processing: 'bg-blue-100 text-blue-700',
    Shipped: 'bg-indigo-100 text-indigo-700',
    Delivered: 'bg-green-100 text-green-700',
    Cancelled: 'bg-red-100 text-red-700',
};

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDashboardStats().then(({ data }) => setStats(data)).catch(console.error).finally(() => setLoading(false));
    }, []);

    const cards = stats ? [
        { label: 'Total Revenue', value: `₹${stats.totalRevenue?.toLocaleString('en-IN') || 0}`, icon: FiDollarSign, color: 'bg-green-50 text-green-600' },
        { label: 'Total Orders', value: stats.ordersCount, icon: FiShoppingBag, color: 'bg-blue-50 text-blue-600' },
        { label: 'Products', value: stats.productsCount, icon: FiPackage, color: 'bg-purple-50 text-purple-600' },
        { label: 'Customers', value: stats.usersCount, icon: FiUsers, color: 'bg-amber-50 text-amber-600' },
    ] : [];

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-2xl font-display font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500">Welcome back, Admin 🌿</p>
            </div>

            {loading ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
                </div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    {cards.map((card, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card p-5">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${card.color}`}>
                                <card.icon className="w-5 h-5" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900">{card.value}</div>
                            <div className="text-sm text-gray-500">{card.label}</div>
                        </motion.div>
                    ))}
                </div>
            )}

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Order Status */}
                <div className="card p-6">
                    <h2 className="font-semibold text-gray-900 mb-4">Orders by Status</h2>
                    {stats?.ordersByStatus && (
                        <div className="space-y-3">
                            {Object.entries(stats.ordersByStatus).map(([status, count]) => (
                                <div key={status} className="flex items-center justify-between">
                                    <span className={`badge text-xs font-semibold ${STATUS_COLORS[status]}`}>{status}</span>
                                    <div className="flex items-center gap-3 flex-1 mx-4">
                                        <div className="flex-1 bg-gray-100 rounded-full h-2">
                                            <div
                                                className="h-2 bg-forest-400 rounded-full"
                                                style={{ width: `${stats.ordersCount ? (count / stats.ordersCount) * 100 : 0}%` }}
                                            />
                                        </div>
                                    </div>
                                    <span className="font-bold text-gray-900 w-6 text-right">{count}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Orders */}
                <div className="card p-6">
                    <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><FiClock className="w-4 h-4 text-forest-500" />Recent Orders</h2>
                    <div className="space-y-3">
                        {stats?.recentOrders?.map((order) => (
                            <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl text-sm">
                                <div>
                                    <div className="font-medium text-gray-900">{order.user?.name || 'Guest'}</div>
                                    <div className="text-xs text-gray-400">#{order._id.slice(-8).toUpperCase()}</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-forest-700">₹{order.totalPrice}</div>
                                    <span className={`badge text-xs font-semibold ${STATUS_COLORS[order.status]}`}>{order.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
