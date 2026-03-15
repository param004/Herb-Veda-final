import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminLayout from './pages/admin/AdminLayout';
import MainLayout from './components/MainLayout';

const App = () => {
    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <Router>
                <AuthProvider>
                    <CartProvider>
                        <Toaster
                            position="top-right"
                            toastOptions={{
                                style: { background: '#fff', color: '#1e501e', border: '1px solid #dcf5dc', borderRadius: '12px', fontFamily: 'Inter, sans-serif', fontSize: '14px' },
                                success: { iconTheme: { primary: '#3a9e3a', secondary: '#fff' } },
                            }}
                        />
                        <Routes>
                            {/* Admin routes */}
                            <Route
                                path="/admin"
                                element={
                                    <ProtectedRoute adminOnly>
                                        <AdminLayout />
                                    </ProtectedRoute>
                                }
                            >
                                <Route index element={<AdminDashboard />} />
                                <Route path="products" element={<AdminProducts />} />
                                <Route path="orders" element={<AdminOrders />} />
                                <Route path="users" element={<AdminUsers />} />
                            </Route>

                            {/* Main routes */}
                            <Route path="/" element={<MainLayout />}>
                                <Route index element={<Home />} />
                                <Route path="products" element={<Products />} />
                                <Route path="products/:id" element={<ProductDetail />} />
                                <Route path="login" element={<Login />} />
                                <Route path="signup" element={<Signup />} />
                                <Route path="cart" element={<Cart />} />
                                <Route
                                    path="profile"
                                    element={<ProtectedRoute><Profile /></ProtectedRoute>}
                                />
                                <Route
                                    path="profile/orders"
                                    element={<ProtectedRoute><Profile tab="orders" /></ProtectedRoute>}
                                />
                                <Route
                                    path="checkout"
                                    element={<ProtectedRoute><Checkout /></ProtectedRoute>}
                                />
                                <Route
                                    path="order-confirmation/:id"
                                    element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>}
                                />
                            </Route>
                        </Routes>
                    </CartProvider>
                </AuthProvider>
            </Router>
        </GoogleOAuthProvider>
    );
};

export default App;
