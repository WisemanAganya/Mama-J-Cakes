import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, MapPin, Sparkles, ArrowUpRight, Heart, Phone } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-vanilla relative overflow-hidden pt-32 pb-20 border-t border-slate-100 font-sans">
      {/* Background Ambience (Multi-Color) */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-royal-purple/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[30vw] h-[30vw] bg-emerald/5 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-20 pb-20">
           {/* Brand Identity */}
           <div className="md:col-span-5 space-y-10">
              <Link to="/" className="flex flex-col space-y-4 group">
                 <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-white-gold" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400">Mama J's Private Collection</span>
                 </div>
                 <h2 className="text-4xl font-serif font-bold italic tracking-tighter text-slate-900 group-hover:text-emerald transition-colors">
                    The Art of Pâtisserie
                 </h2>
              </Link>
              <p className="text-lg text-slate-400 font-light leading-relaxed max-w-sm italic">
                 "Redefining the architecture of taste through mathematical precision and artisanal devotion."
              </p>
              <div className="flex items-center space-x-6">
                 {[
                   { Icon: Instagram, color: 'hover:text-vibrant-pink hover:border-vibrant-pink' },
                   { Icon: Facebook, color: 'hover:text-royal-blue hover:border-royal-blue' },
                   { Icon: Twitter, color: 'hover:text-emerald hover:border-emerald' }
                 ].map((social, i) => (
                   <a key={i} href="#" className={`w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 transition-all ${social.color}`}>
                      <social.Icon className="w-5 h-5" />
                   </a>
                 ))}
              </div>
           </div>

           {/* Navigation Links */}
           <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
              <div className="space-y-8">
                 <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-300">The Vault</h4>
                 <ul className="space-y-4">
                    {[
                      { name: 'Wedding', color: 'hover:text-white-gold' },
                      { name: 'Artisan', color: 'hover:text-emerald' },
                      { name: 'Legacy', color: 'hover:text-royal-purple' },
                      { name: 'About', color: 'hover:text-ruby', path: '/about' },
                      { name: 'Contact', color: 'hover:text-royal-blue', path: '/contact' }
                    ].map(item => (
                      <li key={item.name}>
                         <Link to={item.path || "/catalog"} className={`text-slate-500 text-sm font-medium transition-colors flex items-center group ${item.color}`}>
                            {item.name}
                            <ArrowUpRight className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-all" />
                         </Link>
                      </li>
                    ))}
                 </ul>
              </div>

              <div className="space-y-8">
                 <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-300">Academy</h4>
                 <ul className="space-y-4">
                    {[
                      { name: 'Masterclass', color: 'hover:text-royal-purple' },
                      { name: 'Sculpting', color: 'hover:text-emerald' },
                      { name: 'Chemistry', color: 'hover:text-royal-blue' }
                    ].map(item => (
                      <li key={item.name}>
                         <Link to="/training" className={`text-slate-500 text-sm font-medium transition-colors flex items-center group ${item.color}`}>
                            {item.name}
                            <ArrowUpRight className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-all" />
                         </Link>
                      </li>
                    ))}
                 </ul>
              </div>

              <div className="space-y-8">
                 <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-300">Contact</h4>
                 <ul className="space-y-6">
                    <li className="flex items-start space-x-4">
                       <MapPin className="w-4 h-4 text-emerald flex-shrink-0 mt-1" />
                       <span className="text-sm text-slate-500 font-medium italic">Kilimani, Nairobi</span>
                    </li>
                    <li className="flex items-start space-x-4">
                       <Mail className="w-4 h-4 text-ruby flex-shrink-0 mt-1" />
                       <span className="text-sm text-slate-500 font-medium italic">hello@mamajs.com</span>
                    </li>
                 </ul>
              </div>
           </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-12 border-t border-slate-100 gap-8">
           <div className="text-[9px] font-bold uppercase tracking-[0.5em] text-slate-300 flex items-center">
              © {currentYear} Mama J's. Handcrafted with passion <Heart className="w-3 h-3 ml-2 text-ruby fill-current animate-pulse" />
           </div>
           <div className="flex items-center space-x-8">
              <Link to="/login" className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-300 hover:text-royal-purple transition-colors">Portal Access</Link>
              <div className="w-1.5 h-1.5 bg-white-gold rounded-full" />
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-300">Multi-Color v4.0</span>
           </div>
        </div>
      </div>
    </footer>
  );
}
