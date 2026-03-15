import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiUpload } from 'react-icons/fi';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../services/api';
import toast from 'react-hot-toast';

const CATEGORIES = ['Body Care', 'Skin Care', 'Lip Care', 'Wax & Baby Care', 'Hair Care'];
const EMPTY_FORM = { name: '', description: '', price: '', originalPrice: '', category: 'Body Care', stock: '', ingredients: '', benefits: '', isFeatured: false, isBestSeller: false };

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [images, setImages] = useState([]);
    const [saving, setSaving] = useState(false);

    const fetchProducts = async () => {
        try {
            const { data } = await getProducts();
            setProducts(data);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    useEffect(() => { fetchProducts(); }, []);

    const openNew = () => { setEditing(null); setForm(EMPTY_FORM); setImages([]); setModalOpen(true); };
    const openEdit = (p) => {
        setEditing(p._id);
        setForm({
            name: p.name, description: p.description, price: p.price, originalPrice: p.originalPrice || '',
            category: p.category, stock: p.stock,
            ingredients: p.ingredients?.join(', ') || '', benefits: p.benefits?.join(', ') || '',
            isFeatured: p.isFeatured, isBestSeller: p.isBestSeller,
        });
        setImages([]);
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const fd = new FormData();
            Object.entries(form).forEach(([k, v]) => {
                if (k === 'ingredients' || k === 'benefits') fd.append(k, JSON.stringify(v.split(',').map(s => s.trim()).filter(Boolean)));
                else fd.append(k, v);
            });
            images.forEach((img) => fd.append('images', img));
            if (editing) await updateProduct(editing, fd);
            else await createProduct(fd);
            await fetchProducts();
            setModalOpen(false);
            toast.success(`Product ${editing ? 'updated' : 'created'}! 🌿`);
        } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); } finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this product?')) return;
        try { await deleteProduct(id); setProducts(prev => prev.filter(p => p._id !== id)); toast.success('Product deleted'); }
        catch (err) { toast.error('Failed to delete'); }
    };

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-6">
                <div><h1 className="text-2xl font-display font-bold text-gray-900">Products</h1><p className="text-gray-500">{products.length} total products</p></div>
                <button onClick={openNew} className="btn-primary gap-2"><FiPlus className="w-4 h-4" /> Add Product</button>
            </div>

            {loading ? (
                <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}</div>
            ) : (
                <div className="card overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>{['Product', 'Category', 'Price', 'Stock', 'Rating', 'Actions'].map(h => <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.map((p) => (
                                <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={p.images?.[0]?.startsWith('http') ? p.images[0] : p.images?.[0] ? p.images[0] : 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=80'} className="w-10 h-10 rounded-lg object-cover" alt="" onError={e => e.target.src = 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=80'} />
                                            <div>
                                                <div className="font-medium text-gray-900 max-w-[200px] truncate">{p.name}</div>
                                                <div className="flex gap-1.5">
                                                    {p.isFeatured && <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded font-medium">Featured</span>}
                                                    {p.isBestSeller && <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-600 rounded font-medium">Bestseller</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-gray-600">{p.category}</td>
                                    <td className="px-5 py-4"><span className="font-semibold text-forest-700">₹{p.price}</span>{p.originalPrice && <span className="text-gray-400 line-through ml-1 text-xs">₹{p.originalPrice}</span>}</td>
                                    <td className="px-5 py-4"><span className={`badge text-xs ${p.stock > 0 ? 'badge-green' : 'bg-red-100 text-red-600'}`}>{p.stock > 0 ? `${p.stock} left` : 'Out of stock'}</span></td>
                                    <td className="px-5 py-4 text-gray-600">⭐ {p.rating?.toFixed(1)} ({p.numReviews})</td>
                                    <td className="px-5 py-4">
                                        <div className="flex gap-2">
                                            <button onClick={() => openEdit(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><FiEdit2 className="w-4 h-4" /></button>
                                            <button onClick={() => handleDelete(p._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><FiTrash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Product Modal */}
            <AnimatePresence>
                {modalOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setModalOpen(false)}>
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                <h2 className="font-semibold text-gray-900 text-lg">{editing ? 'Edit Product' : 'Add New Product'}</h2>
                                <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><FiX className="w-5 h-5" /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Product Name *</label>
                                        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input" required placeholder="E.g. Kumkumadi Face Oil" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category *</label>
                                        <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input">
                                            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Stock *</label>
                                        <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} className="input" required placeholder="0" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Selling Price (₹) *</label>
                                        <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="input" required placeholder="999" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Original Price (₹)</label>
                                        <input type="number" value={form.originalPrice} onChange={e => setForm({ ...form, originalPrice: e.target.value })} className="input" placeholder="1299" />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description *</label>
                                        <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input resize-none" rows={3} required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ingredients (comma separated)</label>
                                        <input value={form.ingredients} onChange={e => setForm({ ...form, ingredients: e.target.value })} className="input" placeholder="Saffron, Turmeric, Aloe Vera" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Benefits (comma separated)</label>
                                        <input value={form.benefits} onChange={e => setForm({ ...form, benefits: e.target.value })} className="input" placeholder="Brightens skin, Reduces dark spots" />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Product Images</label>
                                        <label className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-forest-400 hover:bg-forest-50 transition-all">
                                            <FiUpload className="w-8 h-8 text-gray-400" />
                                            <span className="text-sm text-gray-500">Click to upload images (max 5)</span>
                                            <input type="file" multiple accept="image/*" className="hidden" onChange={e => setImages(Array.from(e.target.files))} />
                                        </label>
                                        {images.length > 0 && <p className="text-xs text-forest-600 mt-1.5">{images.length} image(s) selected</p>}
                                    </div>
                                    <div className="flex gap-6">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} className="w-4 h-4 accent-forest-600" />
                                            <span className="text-sm font-medium text-gray-700">Featured</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" checked={form.isBestSeller} onChange={e => setForm({ ...form, isBestSeller: e.target.checked })} className="w-4 h-4 accent-forest-600" />
                                            <span className="text-sm font-medium text-gray-700">Bestseller</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button type="submit" disabled={saving} className="flex-1 btn-primary py-3">{saving ? 'Saving...' : editing ? 'Update Product' : 'Create Product'}</button>
                                    <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary py-3 px-6">Cancel</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminProducts;
