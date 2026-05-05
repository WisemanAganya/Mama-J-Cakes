import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Sparkles, Send, MessageSquare, Clock, Globe } from 'lucide-react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const hubs = [
    { name: 'Nairobi Flagship', location: 'Kilimani, Nairobi', phone: '+254 700 000000', email: 'kilimani@mamajs.com', color: 'text-emerald', bg: 'bg-emerald/10' },
    { name: 'Coast Concierge', location: 'Nyali, Mombasa', phone: '+254 711 111111', email: 'coast@mamajs.com', color: 'text-ruby', bg: 'bg-ruby/10' },
    { name: 'Rift Experience', location: 'Nakuru, Kenya', phone: '+254 722 222222', email: 'rift@mamajs.com', color: 'text-royal-blue', bg: 'bg-royal-blue/10' },
  ];

  return (
    <div className="bg-vanilla min-h-screen font-sans pt-24">
      {/* Cinematic Header */}
      <section className="relative py-32 px-12 overflow-hidden text-center">
        <div className="absolute top-0 left-0 text-[30vw] font-serif font-bold italic text-slate-100/40 leading-none -translate-y-1/4 pointer-events-none">Connect</div>
        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          <span className="text-royal-purple text-[10px] font-bold uppercase tracking-[0.5em]">The Elite Concierge</span>
          <h1 className="text-7xl md:text-9xl font-serif font-bold text-slate-950 tracking-tighter leading-none italic">
             Inquire <br /> <span className="text-white-gold">Directly</span>
          </h1>
          <p className="text-2xl text-slate-500 font-light italic max-w-2xl mx-auto">
             "Our artisans are standing by to manifest your celebration. Reach out to our regional hubs across East Africa."
          </p>
        </div>
      </section>

      {/* Contact & Form Grid */}
      <section className="py-24 px-12">
         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20">
            {/* Contact Details */}
            <div className="lg:col-span-5 space-y-12">
               <div className="space-y-4">
                  <h3 className="text-4xl font-serif font-bold italic text-slate-900">Regional Hubs</h3>
                  <p className="text-slate-500 italic">Experience the heritage in person at our physical galleries.</p>
               </div>
               <div className="space-y-8">
                  {hubs.map((hub, i) => (
                    <div key={i} className="p-10 bg-white rounded-[3rem] shadow-xl border border-slate-50 hover:-translate-y-2 transition-all duration-500">
                       <h4 className={`text-2xl font-serif font-bold italic mb-6 ${hub.color}`}>{hub.name}</h4>
                       <div className="space-y-4">
                          <div className="flex items-center space-x-4 text-slate-500">
                             <MapPin className="w-5 h-5 flex-shrink-0" />
                             <span className="text-sm font-medium">{hub.location}</span>
                          </div>
                          <div className="flex items-center space-x-4 text-slate-500">
                             <Phone className="w-5 h-5 flex-shrink-0" />
                             <span className="text-sm font-medium">{hub.phone}</span>
                          </div>
                          <div className="flex items-center space-x-4 text-slate-500">
                             <Mail className="w-5 h-5 flex-shrink-0" />
                             <span className="text-sm font-medium">{hub.email}</span>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Inquiry Form */}
            <div className="lg:col-span-7">
               <div className="bg-white p-12 md:p-20 rounded-[4rem] shadow-3xl border border-slate-50 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-60 h-60 bg-royal-purple/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
                  
                  {submitted ? (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20 space-y-10">
                       <div className="w-24 h-24 bg-emerald/10 text-emerald rounded-full flex items-center justify-center mx-auto">
                          <Send className="w-10 h-10" />
                       </div>
                       <h2 className="text-5xl font-serif font-bold italic text-slate-900">Message Received</h2>
                       <p className="text-xl text-slate-500 font-light italic">"Our lead curator will contact you within 24 hours to begin the manifestation process."</p>
                       <button onClick={() => setSubmitted(false)} className="px-12 py-5 bg-slate-950 text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-2xl">Send Another Inquiry</button>
                    </motion.div>
                  ) : (
                    <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-10">
                       <div className="space-y-8">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                             <div className="space-y-4">
                                <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400 ml-2">Your Identity</label>
                                <input required placeholder="Full Name" className="w-full px-8 py-6 bg-vanilla/50 border border-slate-100 rounded-3xl outline-none focus:ring-4 focus:ring-royal-purple/5 transition-all text-sm font-bold" />
                             </div>
                             <div className="space-y-4">
                                <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400 ml-2">Communication Channel</label>
                                <input required type="email" placeholder="Email Address" className="w-full px-8 py-6 bg-vanilla/50 border border-slate-100 rounded-3xl outline-none focus:ring-4 focus:ring-ruby/5 transition-all text-sm font-bold" />
                             </div>
                          </div>

                          <div className="space-y-4">
                             <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400 ml-2">The Nature of Celebration</label>
                             <select className="w-full px-8 py-6 bg-vanilla/50 border border-slate-100 rounded-3xl outline-none focus:ring-4 focus:ring-emerald/5 transition-all text-sm font-bold appearance-none">
                                <option>Wedding Masterpiece</option>
                                <option>Executive Event</option>
                                <option>Private Commission</option>
                                <option>Academy Inquiry</option>
                             </select>
                          </div>

                          <div className="space-y-4">
                             <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400 ml-2">The Vision Details</label>
                             <textarea required placeholder="Tell us about your architectural dream..." className="w-full px-8 py-8 bg-vanilla/50 border border-slate-100 rounded-[2.5rem] outline-none focus:ring-4 focus:ring-royal-purple/5 transition-all text-sm font-bold h-48 resize-none" />
                          </div>
                       </div>

                       <button type="submit" className="w-full py-8 bg-slate-950 text-white rounded-full text-[12px] font-bold uppercase tracking-[0.5em] shadow-3xl hover:bg-emerald transition-all flex items-center justify-center space-x-4 group">
                          <span>Transmit Inquiry</span>
                          <Send className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                       </button>
                    </form>
                  )}
               </div>
            </div>
         </div>
      </section>

      {/* Global Presence Banner */}
      <section className="py-24 bg-white border-y border-slate-50 overflow-hidden">
         <div className="flex animate-marquee whitespace-nowrap space-x-20">
            {[
              { label: 'NAIROBI', icon: MapPin },
              { label: 'MOMBASA', icon: MapPin },
              { label: 'KAMPALA', icon: Globe },
              { label: 'DAR ES SALAAM', icon: Globe },
              { label: 'KIGALI', icon: Globe }
            ].map((city, i) => (
              <div key={i} className="flex items-center space-x-6 text-slate-200">
                 <city.icon className="w-10 h-10" />
                 <span className="text-8xl font-serif font-bold italic tracking-tighter">{city.label}</span>
              </div>
            ))}
         </div>
      </section>
    </div>
  );
}
