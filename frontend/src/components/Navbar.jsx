import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiSearch, FiLogOut, FiPackage, FiSettings } from 'react-icons/fi';
import logo from '../assets/logo.svg';

const Navbar = () => {
    const { userInfo, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handler);
        return () => window.removeEventListener('scroll', handler);
    }, []);

    const handleLogout = () => {
        logout();
        setUserMenuOpen(false);
        navigate('/');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchOpen(false);
            setSearchQuery('');
        }
    };

    const navLinks = [
        { to: '/', label: 'Home' },
        { to: '/products', label: 'Products' },
    ];

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'
                    }`}
            >
                <div className="page-container">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2 group">
                            <img src={logo} alt="Herb & Veda" className="w-10 h-10 object-contain" />
                            <div>
                                <span className="font-display text-xl font-bold text-forest-800 leading-none">Herb & Veda</span>
                                <div className="text-[10px] text-sage-600 font-medium tracking-widest uppercase">Ayurvedic Wellness</div>
                            </div>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    end={link.to === '/'}
                                    className={({ isActive }) =>
                                        `px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 ${isActive
                                            ? 'bg-forest-600 text-white shadow-md'
                                            : scrolled
                                                ? 'text-gray-700 hover:bg-forest-50 hover:text-forest-700'
                                                : 'text-white/90 hover:bg-white/20'
                                        }`
                                    }
                                >
                                    {link.label}
                                </NavLink>
                            ))}
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            {/* Search */}
                            <button
                                onClick={() => setSearchOpen(true)}
                                className={`p-2 rounded-full transition-all ${scrolled ? 'text-gray-600 hover:bg-gray-100' : 'text-white/90 hover:bg-white/20'}`}
                            >
                                <FiSearch className="w-5 h-5" />
                            </button>

                            {/* Cart */}
                            <Link to="/cart" className="relative p-2 rounded-full transition-all">
                                <FiShoppingCart className={`w-5 h-5 ${scrolled ? 'text-gray-600' : 'text-white/90'}`} />
                                {cartCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-1 -right-1 w-5 h-5 bg-earth-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                                    >
                                        {cartCount > 9 ? '9+' : cartCount}
                                    </motion.span>
                                )}
                            </Link>

                            {/* User Menu */}
                            {userInfo ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-full font-medium text-sm transition-all ${scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white/90 hover:bg-white/20'
                                            }`}
                                    >
                                        <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-forest-600 text-white border-2 border-forest-100 shadow-sm">
                                            {userInfo.picture ? (
                                                <img src={userInfo.picture} alt={userInfo.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-xs font-bold">{userInfo.name?.charAt(0)?.toUpperCase()}</span>
                                            )}
                                        </div>
                                        <span className="hidden md:block max-w-20 truncate">{userInfo.name?.split(' ')[0]}</span>
                                    </button>
                                    <AnimatePresence>
                                        {userMenuOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                                className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
                                                onMouseLeave={() => setUserMenuOpen(false)}
                                            >
                                                <div className="px-4 py-3 bg-forest-50 border-b border-forest-100">
                                                    <p className="font-semibold text-forest-800 text-sm truncate">{userInfo.name}</p>
                                                    <p className="text-xs text-gray-500 truncate">{userInfo.email}</p>
                                                </div>
                                                {userInfo.role === 'admin' && (
                                                    <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-forest-50 hover:text-forest-700 transition-colors">
                                                        <FiSettings className="w-4 h-4" /> Admin Panel
                                                    </Link>
                                                )}
                                                <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-forest-50 hover:text-forest-700 transition-colors">
                                                    <FiUser className="w-4 h-4" /> My Profile
                                                </Link>
                                                <Link to="/profile/orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-forest-50 hover:text-forest-700 transition-colors">
                                                    <FiPackage className="w-4 h-4" /> My Orders
                                                </Link>
                                                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100">
                                                    <FiLogOut className="w-4 h-4" /> Sign Out
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <div className="hidden md:flex items-center gap-2">
                                    <Link to="/login" className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${scrolled ? 'text-forest-700 hover:bg-forest-50' : 'text-white/90 hover:bg-white/20'}`}>
                                        Login
                                    </Link>
                                    <Link to="/signup" className="px-4 py-2 bg-forest-600 hover:bg-forest-700 text-white text-sm font-semibold rounded-full transition-all shadow-md hover:shadow-glow">
                                        Sign Up
                                    </Link>
                                </div>
                            )}

                            {/* Mobile menu button */}
                            <button
                                onClick={() => setMobileOpen(!mobileOpen)}
                                className={`md:hidden p-2 rounded-full transition-all ${scrolled ? 'text-gray-600 hover:bg-gray-100' : 'text-white/90 hover:bg-white/20'}`}
                            >
                                {mobileOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="md:hidden bg-white border-t border-gray-100 shadow-lg overflow-hidden"
                        >
                            <div className="page-container py-4 flex flex-col gap-1">
                                {navLinks.map((link) => (
                                    <NavLink
                                        key={link.to}
                                        to={link.to}
                                        end={link.to === '/'}
                                        onClick={() => setMobileOpen(false)}
                                        className={({ isActive }) =>
                                            `px-4 py-3 rounded-xl font-medium text-sm transition-all ${isActive ? 'bg-forest-600 text-white' : 'text-gray-700 hover:bg-forest-50'
                                            }`
                                        }
                                    >
                                        {link.label}
                                    </NavLink>
                                ))}
                                {!userInfo && (
                                    <div className="flex gap-2 mt-2 pt-2 border-t border-gray-100">
                                        <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 btn-secondary text-center text-sm py-2.5">Login</Link>
                                        <Link to="/signup" onClick={() => setMobileOpen(false)} className="flex-1 btn-primary text-center text-sm py-2.5">Sign Up</Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* Search Overlay */}
            <AnimatePresence>
                {searchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-start justify-center pt-24"
                        onClick={() => setSearchOpen(false)}
                    >
                        <motion.form
                            initial={{ scale: 0.95, y: -20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: -20 }}
                            onSubmit={handleSearch}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-xl mx-4"
                        >
                            <div className="relative">
                                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    autoFocus
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search for Ayurvedic products…"
                                    className="w-full pl-12 pr-16 py-4 bg-white rounded-2xl text-gray-800 text-lg shadow-2xl outline-none focus:ring-2 focus:ring-forest-400"
                                />
                                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 btn-primary py-2 px-4 text-sm">
                                    Search
                                </button>
                            </div>
                        </motion.form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
