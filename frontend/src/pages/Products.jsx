import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiX, FiChevronDown } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/api';

const CATEGORIES = ['Body Care', 'Skin Care', 'Lip Care', 'Wax & Baby Care', 'Hair Care'];
const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' },
];

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtersOpen, setFiltersOpen] = useState(false);

    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const params = {};
            if (search) params.search = search;
            if (selectedCategory) params.category = selectedCategory;
            if (minPrice) params.minPrice = minPrice;
            if (maxPrice) params.maxPrice = maxPrice;
            if (sort) params.sort = sort;
            const { data } = await getProducts(params);
            setProducts(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [search, selectedCategory, minPrice, maxPrice, sort]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const clearFilters = () => {
        setSearch('');
        setSelectedCategory('');
        setMinPrice('');
        setMaxPrice('');
        setSort('newest');
        setSearchParams({});
    };

    const activeFilters = [search, selectedCategory, minPrice, maxPrice].filter(Boolean).length;

    return (
        <div className="pt-24 pb-20">
            <div className="page-container">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">All Products</h1>
                    <p className="text-gray-500">
                        {loading ? 'Loading...' : `${products.length} products found`}
                        {selectedCategory && <span className="text-forest-600 font-medium"> in {selectedCategory}</span>}
                    </p>
                </div>

                {/* Search + Sort bar */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="relative flex-1">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search products..."
                            className="input pl-11"
                        />
                    </div>
                    <div className="relative">
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="input appearance-none pr-10 min-w-[180px]"
                        >
                            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                        <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                    </div>
                    <button
                        onClick={() => setFiltersOpen(!filtersOpen)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 font-medium text-sm transition-all ${activeFilters > 0 ? 'border-forest-600 bg-forest-50 text-forest-700' : 'border-gray-200 text-gray-600 hover:border-forest-300'
                            }`}
                    >
                        <FiFilter className="w-4 h-4" />
                        Filters {activeFilters > 0 && <span className="w-5 h-5 bg-forest-600 text-white rounded-full text-xs flex items-center justify-center">{activeFilters}</span>}
                    </button>
                </div>

                {/* Filter Panel */}
                {filtersOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-beige rounded-2xl p-6 mb-6 border border-parchment"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Category */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Category</label>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => setSelectedCategory('')}
                                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${!selectedCategory ? 'bg-forest-600 text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-forest-50 border border-gray-200'}`}
                                    >All</button>
                                    {CATEGORIES.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat === selectedCategory ? '' : cat)}
                                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${selectedCategory === cat ? 'bg-forest-600 text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-forest-50 border border-gray-200'}`}
                                        >{cat}</button>
                                    ))}
                                </div>
                            </div>
                            {/* Price Range */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Price Range (₹)</label>
                                <div className="flex items-center gap-2">
                                    <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Min" className="input text-sm py-2" />
                                    <span className="text-gray-400">–</span>
                                    <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Max" className="input text-sm py-2" />
                                </div>
                            </div>
                            {/* Actions */}
                            <div className="flex items-end gap-3">
                                <button onClick={clearFilters} className="flex items-center gap-2 px-4 py-2.5 border-2 border-gray-300 text-gray-600 rounded-xl text-sm font-medium hover:border-red-300 hover:text-red-500 transition-all">
                                    <FiX className="w-4 h-4" /> Clear All
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Active Category pills */}
                {selectedCategory && (
                    <div className="flex items-center gap-2 mb-6">
                        <span className="text-sm text-gray-500">Active filters:</span>
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-forest-100 text-forest-700 rounded-full text-sm font-medium">
                            {selectedCategory}
                            <button onClick={() => setSelectedCategory('')}><FiX className="w-3.5 h-3.5" /></button>
                        </span>
                    </div>
                )}

                {/* Products Grid */}
                {loading ? (
                    <div className="products-grid">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="card">
                                <div className="skeleton aspect-[4/3]" />
                                <div className="p-4 space-y-3">
                                    <div className="skeleton h-4 w-2/3 rounded" />
                                    <div className="skeleton h-3 w-full rounded" />
                                    <div className="skeleton h-8 w-1/2 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🌿</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
                        <p className="text-gray-400 mb-6">Try adjusting your search or filters</p>
                        <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="products-grid"
                    >
                        {products.map((product, i) => (
                            <motion.div
                                key={product._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.04 }}
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Products;
