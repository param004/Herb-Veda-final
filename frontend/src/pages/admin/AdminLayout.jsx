import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FiGrid, FiPackage, FiShoppingBag, FiUsers, FiLogOut, FiExternalLink } from 'react-icons/fi';
import logo from '../../assets/logo.svg';
import { useAuth } from '../../context/AuthContext';

const navItems = [
    { to: '/admin', icon: FiGrid, label: 'Dashboard' },
    { to: '/admin/products', icon: FiPackage, label: 'Products' },
    { to: '/admin/orders', icon: FiShoppingBag, label: 'Orders' },
    { to: '/admin/users', icon: FiUsers, label: 'Users' },
];

const AdminLayout = () => {
    const { userInfo, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => { logout(); navigate('/'); };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-forest-900 flex flex-col shrink-0">
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center p-1">
                            <img src={logo} alt="Herb & Veda" className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <div className="font-display font-bold text-white text-sm">Herb & Veda</div>
                            <div className="text-white/50 text-xs">Admin Panel</div>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map(({ to, icon: Icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={to === '/admin'}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-forest-600 text-white shadow-md' : 'text-white/60 hover:bg-white/10 hover:text-white'
                                }`
                            }
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/10 space-y-1">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-forest-600 text-white border border-white/20 shadow-sm">
                            {userInfo?.picture ? (
                                <img src={userInfo.picture} alt={userInfo.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-xs font-bold">{userInfo?.name?.charAt(0)?.toUpperCase()}</span>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-white truncate">{userInfo?.name}</p>
                            <p className="text-[10px] text-white/40 truncate">{userInfo?.email}</p>
                        </div>
                    </div>
                    <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/60 hover:bg-white/10 hover:text-white transition-all">
                        <FiExternalLink className="w-4 h-4" /> View Store
                    </a>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-all">
                        <FiLogOut className="w-4 h-4" /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
