import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';
import { FiInstagram, FiTwitter, FiYoutube, FiFacebook, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
    return (
        <footer className="bg-forest-900 text-white">
            {/* Newsletter Banner */}
            <div className="bg-gradient-to-r from-forest-700 to-sage-600 py-12">
                <div className="page-container text-center">
                    <h3 className="font-display text-3xl font-semibold mb-2">Join the Wellness Journey</h3>
                    <p className="text-white/80 mb-6">Get exclusive offers, Ayurvedic tips, and early access to new products.</p>
                    <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-5 py-3 rounded-full bg-white/20 backdrop-blur text-white placeholder-white/60 border border-white/30 outline-none focus:ring-2 focus:ring-white/50"
                        />
                        <button type="submit" className="px-6 py-3 bg-white text-forest-700 font-semibold rounded-full hover:bg-forest-50 transition-colors whitespace-nowrap">
                            Subscribe →
                        </button>
                    </form>
                </div>
            </div>

            {/* Main Footer */}
            <div className="page-container py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center p-1">
                                <img src={logo} alt="Herb & Veda" className="w-full h-full object-contain" />
                            </div>
                            <span className="font-display text-xl font-bold">Herb & Veda</span>
                        </div>
                        <p className="text-white/60 text-sm leading-relaxed mb-6">
                            Rooted in ancient Ayurvedic wisdom, crafted for modern living. Pure, natural, and sustainable wellness for your mind, body & soul.
                        </p>
                        <div className="flex gap-3">
                            {[
                                { Icon: FiInstagram, href: '#' },
                                { Icon: FiTwitter, href: '#' },
                                { Icon: FiYoutube, href: '#' },
                                { Icon: FiFacebook, href: '#' },
                            ].map(({ Icon, href }, i) => (
                                <a key={i} href={href} className="w-9 h-9 bg-white/10 hover:bg-forest-600 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110">
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-sm uppercase tracking-wider text-white/50 mb-4">Quick Links</h4>
                        <ul className="space-y-2.5">
                            {[
                                { to: '/', label: 'Home' },
                                { to: '/products', label: 'All Products' },
                                { to: '/products?category=Body+Care', label: 'Body Care' },
                                { to: '/products?category=Skin+Care', label: 'Skin Care' },
                                { to: '/products?category=Lip+Care', label: 'Lip Care' },
                                { to: '/products?category=Wax+%26+Baby+Care', label: 'Wax & Baby Care' },
                                { to: '/products?category=Hair+Care', label: 'Hair Care' },
                            ].map((link) => (
                                <li key={link.to}>
                                    <Link to={link.to} className="text-white/60 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-semibold text-sm uppercase tracking-wider text-white/50 mb-4">Company</h4>
                        <ul className="space-y-2.5">
                            {['About Us', 'Our Story', 'Sustainability', 'Press', 'Careers', 'Contact Us'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-white/60 hover:text-white text-sm transition-colors">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold text-sm uppercase tracking-wider text-white/50 mb-4">Contact</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-sm text-white/60">
                                <FiMapPin className="w-4 h-4 mt-0.5 text-sage-400 shrink-0" />
                                <span>42 Herbal Lane, Ayurveda Nagar<br />Mumbai, India 400001</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-white/60">
                                <FiPhone className="w-4 h-4 text-sage-400 shrink-0" />
                                <a href="tel:+918001234567" className="hover:text-white transition-colors">+91 800 123 4567</a>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-white/60">
                                <FiMail className="w-4 h-4 text-sage-400 shrink-0" />
                                <a href="mailto:hello@herbveda.com" className="hover:text-white transition-colors">hello@herbveda.com</a>
                            </li>
                        </ul>
                        <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
                            <p className="text-xs text-white/50">🌿 Free shipping on orders above ₹999</p>
                            <p className="text-xs text-white/50 mt-1">📦 COD available nationwide</p>
                            <p className="text-xs text-white/50 mt-1">♻️ Eco-friendly packaging</p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-white/40 text-sm">© 2024 Herb & Veda. All rights reserved.</p>
                    <div className="flex gap-6 text-sm text-white/40">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">Refund Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
