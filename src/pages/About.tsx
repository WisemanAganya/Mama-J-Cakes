import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, MapPin, Award, Users, Utensils, Star, ShieldCheck } from 'lucide-react';

export default function About() {
  const milestones = [
    { year: '2012', event: 'The First Oven in Kilimani', icon: Sparkles, color: 'text-emerald' },
    { year: '2015', event: 'Awarded East Africa\'s Artisan of the Year', icon: Award, color: 'text-ruby' },
    { year: '2018', event: 'Opening the Nairobi Culinary Vault', icon: MapPin, color: 'text-royal-blue' },
    { year: '2023', event: 'Launching the Pan-African Academy', icon: Users, color: 'text-royal-purple' },
  ];

  return (
    <div className="bg-vanilla min-h-screen font-sans pt-24">
      {/* Editorial Hero */}
      <section className="relative py-32 px-12 overflow-hidden">
        <div className="absolute top-0 right-0 text-[30vw] font-serif font-bold italic text-slate-100/40 leading-none -translate-y-1/4 pointer-events-none">Legacy</div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
          <div className="space-y-12">
            <div className="space-y-4">
              <span className="text-emerald text-[10px] font-bold uppercase tracking-[0.5em]">The African Narrative</span>
              <h1 className="text-7xl md:text-9xl font-serif font-bold text-slate-950 tracking-tighter leading-[0.8] italic">
                Our <br /> <span className="text-ruby">Heritage</span>
              </h1>
            </div>
            <p className="text-2xl text-slate-500 font-light leading-relaxed italic">
              "Mama J's Cakes was born from a singular vision: to translate the vibrant soul of East Africa into architectural masterpieces of taste."
            </p>
            <div className="flex items-center space-x-8">
               <div className="w-16 h-16 rounded-full bg-white-gold flex items-center justify-center shadow-xl">
                  <Heart className="w-8 h-8 text-white fill-current" />
               </div>
               <div>
                  <h4 className="text-xl font-serif font-bold italic text-slate-900">Handcrafted in Nairobi</h4>
                  <p className="text-sm text-slate-400">Distributed across the continent.</p>
               </div>
            </div>
          </div>
          <div className="relative">
              <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-3xl border-8 border-white">
                <img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover" alt="Artisan at work" referrerPolicy="no-referrer" />
              </div>
             <div className="absolute -bottom-12 -right-12 bg-white p-12 rounded-[3rem] shadow-2xl space-y-4 max-w-sm border border-slate-50">
                <Sparkles className="w-10 h-10 text-emerald" />
                <h3 className="text-2xl font-serif font-bold italic text-slate-900">The Mama J Method</h3>
                <p className="text-sm text-slate-500 leading-relaxed italic">"We believe in the math of flavor and the physics of beauty. Every cake is a structural engineering project made of joy."</p>
             </div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-40 bg-white">
         <div className="max-w-7xl mx-auto px-12">
            <div className="text-center mb-24 space-y-6">
               <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-royal-purple">Foundational Truths</span>
               <h2 className="text-6xl font-serif font-bold italic tracking-tighter text-slate-900">Built on Excellence</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               {[
                 { title: 'Local Sourcing', desc: 'Partnering with Rift Valley farmers for the world\'s finest organic ingredients.', icon: Utensils, color: 'text-emerald', bg: 'bg-emerald/10' },
                 { title: 'Elite Artistry', desc: 'Each designer is a master of structural confectionery and sensory balance.', icon: Star, color: 'text-ruby', bg: 'bg-ruby/10' },
                 { title: 'Pan-African Vision', desc: 'Redefining luxury pastry across East Africa and beyond.', icon: ShieldCheck, color: 'text-royal-blue', bg: 'bg-royal-blue/10' }
               ].map((v, i) => (
                 <div key={i} className="p-16 rounded-[4rem] bg-vanilla border border-slate-50 hover:shadow-2xl transition-all duration-700">
                    <div className={`w-20 h-20 ${v.bg} ${v.color} rounded-3xl flex items-center justify-center mb-10`}>
                       <v.icon className="w-10 h-10" />
                    </div>
                    <h3 className="text-3xl font-serif font-bold italic text-slate-900 mb-6">{v.title}</h3>
                    <p className="text-slate-500 font-light leading-relaxed italic">{v.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Timeline Section */}
      <section className="py-40 px-12 bg-vanilla">
         <div className="max-w-5xl mx-auto">
            <div className="space-y-20 relative">
               <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 -translate-x-1/2 hidden md:block" />
               {milestones.map((m, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   className={`flex flex-col md:flex-row items-center gap-12 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                 >
                    <div className="flex-1 text-center md:text-left space-y-4">
                       <span className={`text-4xl font-serif font-bold italic ${m.color}`}>{m.year}</span>
                       <h3 className="text-2xl font-serif font-bold text-slate-950">{m.event}</h3>
                    </div>
                    <div className="w-20 h-20 rounded-full bg-white shadow-xl flex items-center justify-center relative z-10 border-4 border-vanilla">
                       <m.icon className={`w-8 h-8 ${m.color}`} />
                    </div>
                    <div className="flex-1" />
                 </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 px-12 bg-slate-950 text-center relative overflow-hidden">
         <div className="absolute inset-0 opacity-10 premium-gradient blur-[150px]" />
         <div className="relative z-10 space-y-12">
            <h2 className="text-7xl md:text-8xl font-serif font-bold italic text-white tracking-tighter">Become Part of the <br /> <span className="text-white-gold">Legacy</span></h2>
            <div className="flex items-center justify-center">
               <Link to="/catalog" className="px-16 py-8 bg-white-gold text-slate-900 rounded-full text-[12px] font-bold uppercase tracking-[0.5em] shadow-3xl hover:scale-105 transition-all">
                  Join The Experience
               </Link>
            </div>
         </div>
      </section>
    </div>
  );
}
