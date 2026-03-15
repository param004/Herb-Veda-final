import { useState, useEffect } from 'react';
import { FiTrash2, FiChevronDown, FiChevronUp, FiMail, FiCalendar, FiShield, FiUser } from 'react-icons/fi';
import { getAllUsers, deleteUser } from '../../services/api';
import toast from 'react-hot-toast';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(null);

    useEffect(() => {
        getAllUsers().then(({ data }) => setUsers(data)).catch(console.error).finally(() => setLoading(false));
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this user?')) return;
        try { await deleteUser(id); setUsers(prev => prev.filter(u => u._id !== id)); toast.success('User deleted'); }
        catch (err) { toast.error('Failed to delete user'); }
    };

    const toggleExpand = (id) => setExpanded(prev => prev === id ? null : id);

    return (
        <div className="p-8">
            <div className="mb-6">
                <h1 className="text-2xl font-display font-bold text-gray-900">Users</h1>
                <p className="text-gray-500">{users.length} registered users</p>
            </div>
            {loading ? (
                <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}</div>
            ) : (
                <div className="card overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>{['', 'User', 'Email', 'Role', 'Joined', 'Actions'].map(h => <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.map((user) => (
                                <>
                                    <tr key={user._id} className="hover:bg-gray-50 cursor-pointer" onClick={() => toggleExpand(user._id)}>
                                        <td className="px-3 py-4 text-gray-400">
                                            {expanded === user._id ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-forest-600 rounded-full flex items-center justify-center text-white text-xs font-bold">{user.name?.charAt(0)?.toUpperCase()}</div>
                                                <span className="font-medium text-gray-900">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-gray-600">{user.email}</td>
                                        <td className="px-5 py-4">
                                            <span className={`badge text-xs font-semibold ${user.role === 'admin' ? 'badge-green' : 'bg-gray-100 text-gray-600'}`}>{user.role}</span>
                                        </td>
                                        <td className="px-5 py-4 text-gray-500 text-xs">{new Date(user.createdAt).toLocaleDateString('en-IN')}</td>
                                        <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                                            <button onClick={() => handleDelete(user._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" disabled={user.role === 'admin'} title={user.role === 'admin' ? 'Cannot delete admin' : 'Delete user'}>
                                                <FiTrash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                    {expanded === user._id && (
                                        <tr key={user._id + '-detail'} className="bg-forest-50/50">
                                            <td colSpan={6} className="px-8 py-5">
                                                <div className="bg-white rounded-xl border border-gray-200 p-5">
                                                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                        <FiUser className="w-4 h-4 text-forest-600" /> Profile Information
                                                    </h3>
                                                    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                        <div className="bg-gray-50 rounded-lg p-3">
                                                            <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><FiUser className="w-3 h-3" /> Full Name</p>
                                                            <p className="font-medium text-gray-900">{user.name}</p>
                                                        </div>
                                                        <div className="bg-gray-50 rounded-lg p-3">
                                                            <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><FiMail className="w-3 h-3" /> Email</p>
                                                            <p className="font-medium text-gray-900 break-all">{user.email}</p>
                                                        </div>
                                                        <div className="bg-gray-50 rounded-lg p-3">
                                                            <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><FiShield className="w-3 h-3" /> Role</p>
                                                            <p className="font-medium text-gray-900 capitalize">{user.role}</p>
                                                        </div>
                                                        <div className="bg-gray-50 rounded-lg p-3">
                                                            <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><FiCalendar className="w-3 h-3" /> Joined</p>
                                                            <p className="font-medium text-gray-900">{new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                                        <p className="text-xs text-gray-400 mb-1">User ID</p>
                                                        <p className="font-mono text-xs text-gray-500">{user._id}</p>
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

export default AdminUsers;
