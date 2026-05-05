import React, { useState } from 'react';
import { auth, db } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Chrome, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      const userRef = doc(db, 'users', result.user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          name: result.user.displayName,
          email: result.user.email,
          role: 'customer',
          createdAt: new Date().toISOString()
        });
      }
      
      navigate('/');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans">
      {/* Visual Identity Side */}
      <div className="hidden md:flex md:w-1/2 bg-slate-900 relative items-center justify-center overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 1.2 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0"
        >
          <img referrerPolicy="no-referrer" 
            src="https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&q=80&w=1000" 
            alt="Elite Bakery" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-transparent to-slate-950" />
        </motion.div>
        
        <div className="relative z-10 p-20 max-w-xl text-center md:text-left space-y-12">
           <motion.div
             initial={{ opacity: 0, x: -50 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.5 }}
           >
             <Sparkles className="w-16 h-16 text-white-gold mb-8 mx-auto md:mx-0" />
             <h2 className="text-6xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight italic tracking-tighter">
               The Art of <br /><span className="text-emerald font-normal">Celebration</span>
             </h2>
             <p className="text-xl text-slate-400 font-light leading-relaxed italic">
               "Access your exclusive portal to the pinnacle of architectural pastry and sensory innovation."
             </p>
           </motion.div>
           
           <div className="grid grid-cols-2 gap-8 pt-12 border-t border-white/10">
              <div className="space-y-2">
                 <div className="text-3xl font-serif font-bold text-white italic">5k+</div>
                 <div className="text-[10px] font-bold uppercase tracking-widest text-emerald">Global Patrons</div>
              </div>
              <div className="space-y-2">
                 <div className="text-3xl font-serif font-bold text-white italic">24/7</div>
                 <div className="text-[10px] font-bold uppercase tracking-widest text-ruby">Concierge Elite</div>
              </div>
           </div>
        </div>
        
        <div className="absolute bottom-12 left-12 text-[10px] font-bold uppercase tracking-[0.5em] text-slate-700">
           Mama J's Culinary Legacy © 2024
        </div>
      </div>

      {/* Authentication Side */}
      <div className="flex-grow flex items-center justify-center p-12 md:p-24 bg-vanilla relative">
        {/* Mobile Logo Visibility */}
        <div className="md:hidden absolute top-12 left-1/2 -translate-x-1/2 text-center">
           <h1 className="text-4xl font-serif font-bold text-slate-950 italic">Mama J's</h1>
           <span className="text-[9px] font-bold uppercase tracking-widest text-emerald">Executive Portal</span>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-12"
        >
          <div className="space-y-6">
             <span className="inline-block px-4 py-1 bg-slate-900 text-white text-[9px] font-bold uppercase tracking-widest rounded-full">Secure Gateway</span>
             <h1 className="text-5xl md:text-6xl font-serif font-bold text-slate-900 tracking-tighter italic">Identity Verification</h1>
             <p className="text-slate-500 font-light italic">Re-establish your connection to the archives of luxury confectionery.</p>
          </div>

          <div className="space-y-8">
            <button 
              onClick={handleGoogleLogin}
              disabled={loading}
              className="group w-full flex items-center justify-between p-6 bg-white border border-slate-100 rounded-[2.5rem] hover:border-emerald transition-all duration-500 shadow-sm hover:shadow-xl"
            >
              <div className="flex items-center space-x-6">
                 <div className="w-14 h-14 bg-slate-900 rounded-[1.25rem] flex items-center justify-center text-white group-hover:bg-emerald transition-colors">
                    <Chrome className="w-7 h-7" />
                 </div>
                 <div className="text-left">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Authenticate Via</div>
                    <div className="text-sm font-bold text-slate-900">Google Executive Cloud</div>
                 </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-emerald group-hover:translate-x-2 transition-all" />
            </button>

            <div className="relative py-4">
               <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
               <div className="relative flex justify-center text-[9px] font-bold uppercase tracking-[0.4em]"><span className="bg-vanilla px-8 text-slate-300">Internal Credentials</span></div>
            </div>

            <div className="space-y-4 opacity-40 select-none grayscale cursor-not-allowed">
               <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input readOnly placeholder="Corporate Identifier" className="w-full pl-16 pr-6 py-5 bg-white border border-slate-50 rounded-[1.5rem] outline-none text-xs font-bold" />
               </div>
               <div className="relative">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input readOnly type="password" placeholder="Pass-key" className="w-full pl-16 pr-6 py-5 bg-white border border-slate-50 rounded-[1.5rem] outline-none text-xs font-bold" />
               </div>
               <button disabled className="w-full py-5 bg-slate-100 text-slate-400 rounded-full text-[10px] font-bold uppercase tracking-widest">Initiate Manual Uplink</button>
            </div>
          </div>

          <div className="pt-12 border-t border-slate-100 flex items-center justify-between">
             <div className="flex items-center space-x-2 text-emerald">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[9px] font-bold uppercase tracking-widest">SSL Encrypted 256-bit</span>
             </div>
             <p className="text-[9px] font-bold uppercase tracking-widest text-slate-300 space-x-6">
                <span className="hover:text-slate-900 cursor-pointer transition-colors">Protocol</span>
                <span className="hover:text-slate-900 cursor-pointer transition-colors">Legal</span>
             </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
