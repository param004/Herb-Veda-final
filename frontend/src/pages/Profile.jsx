import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiPackage, FiEdit2, FiSave } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { getMyOrders, updateProfile } from '../services/api';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Processing: 'bg-blue-100 text-blue-700',
    Shipped: 'bg-indigo-100 text-indigo-700',
    Delivered: 'bg-green-100 text-green-700',
    Cancelled: 'bg-red-100 text-red-700',
};

const Profile = ({ tab }) => {
    const { userInfo, login } = useAuth();
    const [activeTab, setActiveTab] = useState(tab || 'profile');
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ name: userInfo?.name || '', phone: '', address: {} });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (activeTab === 'orders') {
            getMyOrders().then(({ data }) => setOrders(data)).catch(console.error).finally(() => setOrdersLoading(false));
        }
    }, [activeTab]);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const { data } = await updateProfile(form);
            login(data);
            setEditing(false);
            toast.success('Profile updated! 🌿');
        } catch (err) {
            toast.error('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="pt-24 pb-20">
            <div className="page-container max-w-4xl">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-forest-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {userInfo?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-2xl font-display font-bold text-gray-900">{userInfo?.name}</h1>
                        <p className="text-gray-500">{userInfo?.email}</p>
                    </div>
                    {userInfo?.role === 'admin' && <span className="ml-auto badge bg-forest-100 text-forest-700 text-xs">Admin</span>}
                </div>

                {/* Tabs */}
                <div className="flex gap-4 border-b border-gray-200 mb-8">
                    {[{ id: 'profile', icon: FiUser, label: 'My Profile' }, { id: 'orders', icon: FiPackage, label: 'My Orders' }].map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setActiveTab(t.id)}
                            className={`flex items-center gap-2 pb-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === t.id ? 'border-forest-600 text-forest-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            <t.icon className="w-4 h-4" /> {t.label}
                        </button>
                    ))}
                </div>

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="font-semibold text-gray-900">Account Information</h2>
                            <button onClick={() => setEditing(!editing)} className="btn-ghost text-sm gap-1.5">
                                <FiEdit2 className="w-4 h-4" /> {editing ? 'Cancel' : 'Edit'}
                            </button>
                        </div>
                        {editing ? (
                            <form onSubmit={handleSave} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                                    <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                                    <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input" placeholder="10-digit mobile" />
                                </div>
                                <button type="submit" disabled={saving} className="btn-primary gap-2">
                                    <FiSave className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </form>
                        ) : (
                            <div className="grid sm:grid-cols-2 gap-4">
                                {[{ label: 'Full Name', value: userInfo?.name }, { label: 'Email', value: userInfo?.email }, { label: 'Account Type', value: userInfo?.role === 'admin' ? 'Administrator' : 'Customer' }].map((f) => (
                                    <div key={f.label}>
                                        <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">{f.label}</div>
                                        <div className="font-medium text-gray-900">{f.value || '—'}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        {ordersLoading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-5xl mb-3">📦</div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">No orders yet</h3>
                                <p className="text-gray-400 mb-4">Start shopping to see your orders here</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order) => (
                                    <div key={order._id} className="card p-5">
                                        <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
                                            <div>
                                                <div className="font-mono text-xs text-gray-400">#{order._id.slice(-8).toUpperCase()}</div>
                                                <div className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`badge text-xs font-semibold ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}>{order.status}</span>
                                                <span className="font-bold text-forest-700">₹{order.totalPrice?.toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {order.items?.map((item) => `${item.name} × ${item.qty}`).join(', ')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Profile;
