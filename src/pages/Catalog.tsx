import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Cake } from '../types';
import { Search, Filter, SlidersHorizontal, Sparkles, ChevronRight, LayoutGrid, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Catalog() {
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState('All');

  const categories = ['All', 'Safari Couture', 'Nairobi Night', 'Coastal Bliss', 'Heritage'];
  const events = [
    'All', 'Wedding', 'Birthday', 'Engagement', 'Baby Shower', 
    'Graduation', 'Corporate Event', 'Funeral', 'Holiday', 'Everyday/Tea Cake'
  ];

  useEffect(() => {
    const fetchCakes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'cakes'));
        const cakesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Cake));
        setCakes(cakesData);
      } catch (error) {
        console.error("Error fetching cakes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCakes();
  }, []);

  const filteredCakes = cakes.filter(cake => {
    const matchesSearch = cake.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cake.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || cake.category === selectedCategory;
    const matchesEvent = selectedEvent === 'All' || cake.eventCategories?.includes(selectedEvent);
    return matchesSearch && matchesCategory && matchesEvent;
  });

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-parchment pl-0 md:pl-20 font-sans">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-white-gold/20 border-t-white-gold rounded-full animate-spin mx-auto" />
        <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-slate-400">Consulting the Vault...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-vanilla pl-0 md:pl-20 pb-32 font-sans">
      {/* Editorial Header */}
      <div className="relative pt-32 pb-20 px-8 overflow-hidden">
        <div className="absolute top-0 right-0 text-[20vw] font-serif font-bold italic text-slate-50 leading-none -translate-y-1/4 pointer-events-none">Archives</div>
        <div className="relative z-10 max-w-7xl mx-auto space-y-8 text-center md:text-left">
          <span className="text-emerald text-[10px] font-bold uppercase tracking-[0.5em]">The Confectionery Vault</span>
          <h1 className="text-8xl md:text-[8vw] font-serif font-bold text-slate-950 tracking-tighter leading-[0.8] italic">
             Curated <br /> <span className="text-royal-purple/20">Masterpieces</span>
          </h1>
          <p className="text-slate-500 max-w-2xl text-xl font-light italic leading-relaxed">
            Discover our collection of artisanal creations, handcrafted for life's most precious milestones.
          </p>
        </div>
      </div>

      {/* Spatial Controls */}
      <div className="sticky top-0 z-50 px-8 mb-20">
         <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-3xl p-6 md:p-8 rounded-[3rem] flex flex-col items-center gap-8 border border-white/50 shadow-2xl">
            <div className="flex flex-col md:flex-row w-full items-center justify-between gap-8">
              <div className="relative w-full md:w-96 group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald transition-colors" />
                <input 
                  type="text"
                  placeholder="Search the archives..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald/5 transition-all text-lg font-light italic"
                />
              </div>

              <div className="flex items-center space-x-4 overflow-x-auto w-full md:w-auto no-scrollbar pb-2">
                {categories.map((cat, i) => {
                  const colors = ['bg-emerald', 'bg-ruby', 'bg-royal-blue', 'bg-royal-purple', 'bg-vibrant-pink'];
                  const color = colors[i % colors.length];
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-8 py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap transition-all ${
                        selectedCategory === cat 
                          ? `${color} text-white shadow-xl` 
                          : 'bg-white border border-slate-100 text-slate-400 hover:border-white-gold hover:text-slate-950'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Event Filter Bar */}
            <div className="w-full border-t border-slate-100 pt-6">
              <div className="flex items-center space-x-3 mb-4">
                <Filter className="w-4 h-4 text-emerald" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Browse by Occasion</span>
              </div>
              <div className="flex items-center space-x-4 overflow-x-auto w-full no-scrollbar pb-2">
                {events.map((event) => (
                  <button
                    key={event}
                    onClick={() => setSelectedEvent(event)}
                    className={`px-6 py-3 rounded-full text-[9px] font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
                      selectedEvent === event 
                        ? 'bg-slate-950 text-white shadow-lg scale-105' 
                        : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    {event}
                  </button>
                ))}
              </div>
            </div>
         </div>
      </div>

      {/* Staggered Spatial Mosaic Architecture */}
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 auto-rows-[250px]">
          {filteredCakes.map((cake, idx) => {
            const isLarge = idx % 5 === 0;
            const isVertical = idx % 3 === 0 && !isLarge;
            const accentColors = ['text-emerald', 'text-ruby', 'text-royal-blue', 'text-royal-purple', 'text-vibrant-pink'];
            const accent = accentColors[idx % accentColors.length];
            
            return (
              <motion.div
                key={cake.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`group relative rounded-[3rem] overflow-hidden bg-white shadow-2xl border border-slate-50 transition-all duration-700 hover:-translate-y-4 hover:shadow-xl ${
                  isLarge ? 'lg:col-span-8 lg:row-span-2' : 
                  isVertical ? 'lg:col-span-4 lg:row-span-2' : 
                  'lg:col-span-4 lg:row-span-1'
                }`}
              >
                <img 
                  src={cake.imageUrl} 
                  className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110" 
                  alt={cake.name}
                  referrerPolicy="no-referrer"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="absolute bottom-0 left-0 w-full p-12 translate-y-full group-hover:translate-y-0 transition-transform duration-700">
                  <div className="space-y-4">
                    <div className={`flex items-center space-x-3 ${accent}`}>
                      <Sparkles className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.4em]">{cake.category} Selection</span>
                    </div>
                    <h3 className="text-4xl md:text-5xl font-serif font-bold text-white italic leading-tight">
                      {cake.name}
                    </h3>
                    <div className="flex items-center justify-between pt-6">
                       <div className="space-y-1">
                         <p className="text-2xl font-serif font-bold text-white">
                           <span className={`text-xs font-sans mr-2 ${accent} uppercase`}>From KES</span>
                           {cake.price.toLocaleString()}
                         </p>
                         <p className="text-[9px] text-white/50 font-bold uppercase tracking-widest">Base Weight: {cake.availableWeights?.[0] || 1}kg</p>
                       </div>
                       <Link 
                         to={`/cake/${cake.id}`}
                         className={`w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-950 hover:scale-110 transition-all shadow-xl`}
                       >
                         <ChevronRight className={`w-6 h-6 ${accent}`} />
                       </Link>
                    </div>
                  </div>
                </div>

                {/* Always visible event badge */}
                <div className="absolute top-8 left-8 flex flex-wrap gap-2 max-w-[80%] pointer-events-none">
                  {cake.eventCategories?.slice(0, 2).map((evt, i) => (
                    <div key={i} className="px-4 py-1.5 bg-white/20 backdrop-blur-xl border border-white/30 rounded-lg text-white text-[8px] font-bold uppercase tracking-widest italic shadow-lg">
                      {evt}
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredCakes.length === 0 && (
          <div className="py-60 text-center space-y-8">
             <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-xl">
                <Search className="w-10 h-10 text-slate-200" />
             </div>
             <h2 className="text-4xl font-serif font-bold text-slate-900 italic">The Vault is empty</h2>
             <p className="text-slate-400 text-lg font-light italic">No masterpieces found for this selection.</p>
          </div>
        )}
      </div>
    </div>
  );
}

