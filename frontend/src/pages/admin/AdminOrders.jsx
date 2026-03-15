import { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '../../services/api';
import { FiChevronDown, FiChevronUp, FiMapPin, FiPackage, FiPhone } from 'react-icons/fi';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Processing: 'bg-blue-100 text-blue-700',
    Shipped: 'bg-indigo-100 text-indigo-700',
    Delivered: 'bg-green-100 text-green-700',
    Cancelled: 'bg-red-100 text-red-700',
};
const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(null);

    const fetchOrders = async () => {
        try { const { data } = await getAllOrders(); setOrders(data); }
        catch (err) { console.error(err); } finally { setLoading(false); }
    };

    useEffect(() => { fetchOrders(); }, []);

    const handleStatusChange = async (id, status) => {
        try {
            await updateOrderStatus(id, status);
            setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
            toast.success(`Order status updated to ${status}`);
        } catch (err) { toast.error('Failed to update status'); }
    };

    const toggleExpand = (id) => setExpanded(prev => prev === id ? null : id);

    return (
        <div className="p-8">
            <div className="mb-6">
                <h1 className="text-2xl font-display font-bold text-gray-900">Orders</h1>
                <p className="text-gray-500">{orders.length} total orders</p>
            </div>
            {loading ? (
                <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-20 rounded-xl" />)}</div>
            ) : (
                <div className="card overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>{['', 'Order ID', 'Customer', 'Items', 'Total', 'Date', 'Status', 'Update'].map(h => <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.map((order) => (
                                <>
                                    <tr key={order._id} className="hover:bg-gray-50 cursor-pointer" onClick={() => toggleExpand(order._id)}>
                                        <td className="px-3 py-4 text-gray-400">
                                            {expanded === order._id ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
                                        </td>
                                        <td className="px-5 py-4 font-mono text-xs text-gray-500">#{order._id.slice(-8).toUpperCase()}</td>
                                        <td className="px-5 py-4">
                                            <div className="font-medium text-gray-900">{order.user?.name || 'Guest'}</div>
                                            <div className="text-xs text-gray-400">{order.user?.email}</div>
                                        </td>
                                        <td className="px-5 py-4 text-gray-600">{order.items?.length} item(s)</td>
                                        <td className="px-5 py-4 font-bold text-forest-700">₹{order.totalPrice?.toLocaleString()}</td>
                                        <td className="px-5 py-4 text-gray-500 text-xs">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                                        <td className="px-5 py-4"><span className={`badge text-xs font-semibold ${STATUS_COLORS[order.status]}`}>{order.status}</span></td>
                                        <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                                            <select
                                                value={order.status}
                                                onChange={e => handleStatusChange(order._id, e.target.value)}
                                                className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-forest-400 bg-white"
                                            >
                                                {STATUSES.map(s => <option key={s}>{s}</option>)}
                                            </select>
                                        </td>
                                    </tr>
                                    {expanded === order._id && (
                                        <tr key={order._id + '-detail'} className="bg-forest-50/50">
                                            <td colSpan={8} className="px-8 py-5">
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    {/* Shipping Address */}
                                                    <div>
                                                        <div className="flex items-center gap-2 text-forest-700 font-semibold mb-3">
                                                            <FiMapPin className="w-4 h-4" />
                                                            <span>Delivery Address</span>
                                                        </div>
                                                        {order.shippingAddress ? (
                                                            <div className="bg-white rounded-xl p-4 border border-gray-200 space-y-1 text-sm text-gray-700">
                                                                <p className="font-semibold text-gray-900">{order.shippingAddress.name}</p>
                                                                {order.shippingAddress.phone && (
                                                                    <p className="flex items-center gap-1.5 text-gray-600"><FiPhone className="w-3.5 h-3.5" />{order.shippingAddress.phone}</p>
                                                                )}
                                                                <p>{order.shippingAddress.street}</p>
                                                                <p>{order.shippingAddress.city}{order.shippingAddress.state ? `, ${order.shippingAddress.state}` : ''}{order.shippingAddress.pincode ? ` - ${order.shippingAddress.pincode}` : ''}</p>
                                                            </div>
                                                        ) : <p className="text-gray-400 text-sm">No address on record</p>}
                                                    </div>
                                                    {/* Order Items */}
                                                    <div>
                                                        <div className="flex items-center gap-2 text-forest-700 font-semibold mb-3">
                                                            <FiPackage className="w-4 h-4" />
                                                            <span>Order Items</span>
                                                        </div>
                                                        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                                                            {order.items?.map((item, i) => (
                                                                <div key={i} className="flex items-center justify-between px-4 py-2.5 text-sm">
                                                                    <div>
                                                                        <p className="font-medium text-gray-900">{item.name}</p>
                                                                        <p className="text-xs text-gray-400">Qty: {item.qty}</p>
                                                                    </div>
                                                                    <span className="font-semibold text-forest-700">₹{(item.price * item.qty).toLocaleString()}</span>
                                                                </div>
                                                            ))}
                                                            <div className="flex justify-between px-4 py-2.5 font-bold text-sm bg-gray-50 rounded-b-xl">
                                                                <span>Total</span>
                                                                <span className="text-forest-700">₹{order.totalPrice?.toLocaleString()}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
