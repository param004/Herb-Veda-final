import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { GiHerbsBundle } from 'react-icons/gi';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../services/api';
import toast from 'react-hot-toast';

const Signup = () => {
    return (
        <div className="min-h-[80vh] flex items-center justify-center px-6 bg-cream">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md text-center">
                <div className="card p-12 space-y-8 shadow-2xl border border-forest-100 flex flex-col items-center bg-white/80 backdrop-blur-sm">
                    <div className="w-24 h-24 bg-forest-50 rounded-[2.5rem] flex items-center justify-center mb-2 shadow-inner">
                        <GiHerbsBundle className="text-forest-600 text-5xl" />
                    </div>
                    
                    <div className="space-y-3">
                        <h1 className="text-4xl font-display font-bold text-forest-900 tracking-tight">Join Herb & Veda</h1>
                        <p className="text-gray-500 text-lg leading-relaxed">Experience ancient wellness with modern convenience.</p>
                    </div>

                    <div className="w-full pt-4">
                        <p className="text-sm text-sage-600 font-medium mb-6 uppercase tracking-widest">Simplified Joining Process</p>
                        <Link to="/login" className="w-full btn-primary py-5 text-lg font-bold flex items-center justify-center gap-3 shadow-glow group">
                            Continue to Google Sign-In
                            <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>→</motion.span>
                        </Link>
                    </div>

                    <p className="text-sm text-gray-500 pt-6 border-t border-gray-100 w-full">
                        Already have an account? <Link to="/login" className="text-forest-600 font-bold hover:underline">Sign In</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Signup;
