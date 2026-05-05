import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, Search, Sparkles, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

export default function Navbar() {
  const { items } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const navLinks = [
    { name: 'Home', path: '/', color: 'emerald' },
    { name: 'Cakes', path: '/catalog', color: 'emerald' },
    { name: 'Events', path: '/highlights', color: 'ruby' },
    { name: 'About', path: '/about', color: 'ruby' },
    { name: 'Contact', path: '/contact', color: 'ruby' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-[100] bg-vanilla/80 backdrop-blur-2xl border-b border-slate-100 px-6 md:px-12 h-24 flex items-center justify-between font-sans">
        {/* Brand - Left */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 bg-white-gold rounded-xl flex items-center justify-center text-slate-900 shadow-lg group-hover:scale-110 transition-transform">
             <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-xl font-serif font-bold italic text-slate-950">Mama J's</span>
        </Link>

        {/* Desktop Navigation - Right */}
        <div className="hidden md:flex items-center space-x-10">
           {navLinks.map(link => (
             <Link 
               key={link.path} 
               to={link.path} 
               className={`text-[10px] font-bold uppercase tracking-[0.3em] transition-all relative group ${
                 location.pathname === link.path ? `text-${link.color}` : 'text-slate-400 hover:text-slate-950'
               }`}
             >
               {link.name}
               <span className={`absolute -bottom-1 left-0 h-0.5 bg-${link.color} transition-all duration-500 ${location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'}`} />
             </Link>
           ))}
           
           <div className="flex items-center space-x-6 ml-4 pl-8 border-l border-slate-100">
              <Link to="/checkout" className="relative text-slate-400 hover:text-vibrant-pink transition-colors">
                 <ShoppingCart className="w-5 h-5" />
                 {items.length > 0 && (
                   <span className="absolute -top-2 -right-2 w-4 h-4 bg-vibrant-pink text-white text-[8px] font-bold flex items-center justify-center rounded-full">
                     {items.length}
                   </span>
                 )}
              </Link>
              <Link to="/login" className="text-slate-400 hover:text-emerald transition-colors">
                 <User className="w-5 h-5" />
              </Link>
           </div>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="md:hidden flex items-center space-x-4">
           <Link to="/checkout" className="relative text-slate-900">
              <ShoppingCart className="w-6 h-6" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-ruby text-white text-[8px] font-bold flex items-center justify-center rounded-full">
                  {items.length}
                </span>
              )}
           </Link>
           <button onClick={() => setIsMenuOpen(true)} className="p-2 text-slate-900">
              <Menu className="w-6 h-6" />
           </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed inset-0 z-[200] bg-vanilla p-12 flex flex-col font-sans"
          >
             <button onClick={() => setIsMenuOpen(false)} className="absolute top-8 right-8 p-4 text-slate-900">
                <X className="w-8 h-8" />
             </button>

             <div className="mt-20 space-y-12">
                {navLinks.map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-4xl font-serif font-bold italic text-slate-900 hover:text-white-gold transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
             </div>

             <div className="mt-auto pt-12 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Mama J's Cakes © 2024</div>
                <div className="flex space-x-6">
                   <Heart className="w-5 h-5 text-ruby fill-current" />
                   <Sparkles className="w-5 h-5 text-white-gold" />
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
