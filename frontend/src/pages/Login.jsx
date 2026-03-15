import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiGlobe } from 'react-icons/fi';
import { GiHerbsBundle } from 'react-icons/gi';
import { useAuth } from '../context/AuthContext';
import { googleLogin } from '../services/api';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleGoogleSuccess = async (credentialResponse) => {
        setLoading(true);
        try {
            const { data } = await googleLogin(credentialResponse.credential);
            login(data);
            toast.success(`Welcome back, ${data.name}! 🌿`);
            navigate(data.role === 'admin' ? '/admin' : '/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Google login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Panel */}
            <div className="hidden lg:flex flex-1 items-center justify-center bg-hero-gradient relative overflow-hidden">
                <div className="absolute inset-0 bg-nature-pattern" />
                <div className="relative z-10 text-center px-12">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <GiHerbsBundle className="text-white text-4xl" />
                    </div>
                    <h2 className="text-5xl font-display font-bold text-white mb-4">Herb & Veda</h2>
                    <p className="text-white/70 text-lg">Ancient wisdom for modern wellness.</p>
                    <div className="mt-8 flex flex-col gap-3">
                        {['🌿 100% Natural Products', '✨ Premium Ayurvedic Formulas', '🌍 Sustainably Sourced'].map((t) => (
                            <div key={t} className="px-4 py-2 bg-white/10 rounded-full text-white text-sm backdrop-blur">{t}</div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 bg-cream">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Welcome Back</h1>
                        <p className="text-gray-500">Sign in to your account</p>
                    </div>

                    <div className="card p-10 space-y-8 flex flex-col items-center shadow-xl border border-forest-100">
                        <div className="w-16 h-16 bg-forest-50 rounded-2xl flex items-center justify-center mb-2">
                            <FiGlobe className="text-forest-600 text-3xl" />
                        </div>
                        
                        <div className="text-center space-y-2">
                            <h3 className="text-xl font-bold text-forest-900">Sign in with Google</h3>
                            <p className="text-sm text-gray-500">Secure and fast access to your wellness journey.</p>
                        </div>

                        <div className="w-full flex justify-center py-4">
                            {loading ? (
                                <div className="flex items-center gap-3 text-forest-600 font-medium animate-pulse">
                                    <div className="w-5 h-5 border-2 border-forest-600 border-t-transparent rounded-full animate-spin" />
                                    Authenticating...
                                </div>
                            ) : (
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={() => toast.error('Google Sign-In was interrupted')}
                                    useOneTap
                                    shape="circle"
                                    theme="filled_blue"
                                    size="large"
                                    width="100%"
                                />
                            )}
                        </div>

                        <div className="pt-6 border-t border-gray-100 w-full text-center">
                            <p className="text-sm text-gray-500">
                                By signing in, you agree to our{' '}
                                <Link to="/terms" className="text-forest-600 hover:underline">Terms of Service</Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
