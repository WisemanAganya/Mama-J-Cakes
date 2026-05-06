import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Cake } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ShoppingBag, ShieldCheck, Truck, Utensils, Sparkles, Heart, Share2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const [cake, setCake] = useState<Cake | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [selectedWeight, setSelectedWeight] = useState(1);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [customMessage, setCustomMessage] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  const calculatePrice = () => {
    if (!cake) return 0;
    const baseWeight = cake.availableWeights?.[0] || 1;
    const multiplier = selectedWeight / baseWeight;
    return Math.round(cake.price * multiplier);
  };

  const handleAddToCart = () => {
    if (!cake) return;
    
    const orderItem: OrderItem = {
      cakeId: cake.id,
      cakeName: cake.name,
      imageUrl: cake.imageUrl,
      quantity,
      price: calculatePrice(),
      weight: selectedWeight,
      flavor: selectedFlavor,
      themeColors: selectedColors,
      customMessage: customMessage
    };

    addToCart(orderItem);
    addToast(`${quantity}x ${cake.name} reserved in your vault`, 'success');
  };

  const toggleColor = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  useEffect(() => {
    const fetchCake = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const snap = await getDoc(doc(db, 'cakes', id));
        if (snap.exists()) {
          const data = { id: snap.id, ...snap.data() } as Cake;
          setCake(data);
          if (data.flavors?.length > 0) setSelectedFlavor(data.flavors[0]);
          if (data.availableWeights?.length > 0) setSelectedWeight(data.availableWeights[0]);
        } else {
           // Fallback for demo
           const demoCake: Cake = {
             id: '1', 
             name: 'Golden Wedding Dream', 
             description: 'A multi-tiered masterpiece with gold leaf accents.',
             price: 15000, 
             category: 'Wedding', 
             eventCategories: ['Wedding', 'Engagement'],
             imageUrl: 'https://images.unsplash.com/photo-1522770246533-245ad2b92e21?auto=format&fit=crop&q=80&w=800', 
             servings: '50-80', 
             rating: 5, 
             flavors: ['Vanilla', 'Lemon', 'Strawberry', 'Chocolate'],
             availableWeights: [1, 2, 3, 5, 10],
             colorOptions: ['Gold', 'White', 'Blush', 'Royal Blue', 'Emerald']
           };
           setCake(demoCake);
           setSelectedFlavor('Vanilla');
           setSelectedWeight(1);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCake();
  }, [id]);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-parchment font-sans">
      <div className="relative">
        <div className="w-24 h-24 border-2 border-white-gold/20 border-t-white-gold rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-white-gold animate-pulse" />
        </div>
      </div>
      <p className="mt-8 text-white-gold font-bold tracking-[0.4em] text-[10px] uppercase animate-pulse">Consulting the Artisan...</p>
    </div>
  );
  
  if (!cake) return (
    <div className="pt-40 text-center h-screen bg-parchment font-sans">
      <h2 className="text-3xl font-serif font-bold text-slate-900 italic">Creation Not Found</h2>
      <Link to="/catalog" className="mt-8 inline-block text-emerald font-bold underline">Return to Vault</Link>
    </div>
  );

  return (
    <div className="pt-48 pb-40 min-h-screen bg-vanilla relative overflow-hidden font-sans">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white-gold/10 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-12">
        <div className="mb-16">
          <button 
            onClick={() => navigate(-1)} 
            className="group flex items-center text-slate-400 hover:text-royal-purple transition-all font-bold uppercase text-[10px] tracking-[0.3em]"
          >
             <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mr-4 group-hover:bg-royal-purple group-hover:text-white transition-all">
                <ChevronLeft className="w-5 h-5" />
             </div>
             Back to Collection
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
          {/* Image Gallery Column */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-7 relative"
          >
            <div className="bg-white p-6 rounded-[3rem] shadow-2xl border border-white">
               <div className="relative aspect-square rounded-[2rem] overflow-hidden group/img">
                 <img referrerPolicy="no-referrer" 
                   src={cake.imageUrl} 
                   alt={cake.name} 
                   className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-1000" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity" />
                 
                 {/* Floating Actions */}
                 <div className="absolute top-6 right-6 flex flex-col space-y-3">
                   <button 
                    onClick={() => setIsLiked(!isLiked)}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-md transition-all shadow-xl ${isLiked ? 'bg-ruby text-white' : 'bg-white/80 text-slate-400 hover:text-ruby'}`}
                   >
                     <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                   </button>
                   <button className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-md text-slate-400 hover:text-royal-blue flex items-center justify-center transition-all shadow-xl">
                     <Share2 className="w-5 h-5" />
                   </button>
                 </div>
               </div>
            </div>
            
            {/* Artistic Badge */}
            <div className="absolute -bottom-8 -left-8 p-10 bg-white/80 backdrop-blur-xl rounded-[3rem] shadow-2xl max-w-[280px] hidden md:block border border-white">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-2 h-2 bg-emerald rounded-full animate-ping" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-950">Authentic Creation</span>
              </div>
              <p className="text-slate-900 font-serif italic text-lg leading-snug">"{cake.description}"</p>
            </div>
            
            {/* Artisan Detail Zoom (If available) */}
            {cake.artisanDetailUrl && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="absolute -bottom-20 -right-20 p-10 bg-white/90 backdrop-blur-2xl rounded-[3rem] shadow-3xl max-w-[320px] hidden xl:block border border-white group/zoom"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-2 h-2 bg-ruby rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-950">Artisan Perspective</span>
                </div>
                <div className="aspect-square rounded-2xl overflow-hidden mb-6 border border-slate-100">
                  <img 
                    src={cake.artisanDetailUrl} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/zoom:scale-125" 
                    alt="Detail Texture" 
                    referrerPolicy="no-referrer"
                  />
                </div>
                <p className="text-slate-400 font-sans text-[10px] leading-relaxed uppercase tracking-widest font-bold">
                  High-fidelity texture analysis of the hand-piped accents.
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Details Column */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="lg:col-span-5 space-y-12"
          >
             <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {cake.eventCategories?.map(evt => (
                      <span key={evt} className="px-4 py-2 bg-emerald/10 text-emerald text-[9px] font-bold uppercase tracking-[0.3em] rounded-lg">
                        {evt}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center space-x-1 text-white-gold">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-xs font-bold text-slate-950">{cake.rating}</span>
                  </div>
                </div>
                
                <h1 className="text-6xl md:text-7xl font-serif font-bold text-slate-950 leading-[0.9] tracking-tighter italic">
                  {cake.name}
                </h1>
                
                <div className="flex items-baseline space-x-4">
                  <span className="text-6xl font-serif font-bold text-slate-950 tracking-tighter">
                    <span className="text-xl font-sans text-ruby mr-2 uppercase">KES</span>
                    {calculatePrice().toLocaleString()}
                  </span>
                  <div className="border-l border-slate-200 pl-4">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Bespoke <br />Pricing</p>
                  </div>
                </div>
             </div>

             <div className="space-y-12">
                {/* Weight Selection */}
                <div className="space-y-6">
                  <label className="block text-[10px] font-bold uppercase text-slate-950 tracking-[0.4em]">Select Weight (kg)</label>
                  <div className="flex flex-wrap gap-3">
                    {cake.availableWeights?.map((w) => (
                      <button
                        key={w}
                        onClick={() => setSelectedWeight(w)}
                        className={`w-14 h-14 rounded-2xl text-sm font-bold transition-all duration-300 flex items-center justify-center ${
                          selectedWeight === w
                            ? 'bg-emerald text-white shadow-xl scale-110'
                            : 'bg-white text-slate-500 border border-slate-100 hover:border-emerald'
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Flavor Selection */}
                <div className="space-y-6">
                  <label className="block text-[10px] font-bold uppercase text-slate-950 tracking-[0.4em]">Signature Flavor</label>
                  <div className="flex flex-wrap gap-3">
                    {cake.flavors?.map((f, i) => {
                      const colors = ['hover:border-emerald hover:text-emerald', 'hover:border-ruby hover:text-ruby', 'hover:border-royal-blue hover:text-royal-blue'];
                      const active = ['bg-emerald', 'bg-ruby', 'bg-royal-blue'];
                      return (
                        <button
                          key={f}
                          onClick={() => setSelectedFlavor(f)}
                          className={`px-6 py-4 rounded-2xl text-[9px] font-bold uppercase tracking-[0.2em] transition-all duration-300 ${
                            selectedFlavor === f
                              ? `${active[i % 3]} text-white shadow-2xl scale-105`
                              : `bg-white text-slate-500 border border-slate-100 ${colors[i % 3]}`
                          }`}
                        >
                          {f}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Color Selection */}
                <div className="space-y-6">
                  <label className="block text-[10px] font-bold uppercase text-slate-950 tracking-[0.4em]">Theme Colors (Select Multiple)</label>
                  <div className="flex flex-wrap gap-3">
                    {cake.colorOptions?.map((color) => (
                      <button
                        key={color}
                        onClick={() => toggleColor(color)}
                        className={`px-5 py-3 rounded-xl text-[8px] font-bold uppercase tracking-widest transition-all ${
                          selectedColors.includes(color)
                            ? 'bg-slate-900 text-white shadow-lg'
                            : 'bg-slate-50 text-slate-400 border border-slate-100 hover:bg-white'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Message */}
                <div className="space-y-6">
                  <label className="block text-[10px] font-bold uppercase text-slate-950 tracking-[0.4em]">Personal Message (Optional)</label>
                  <textarea 
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="E.g., Happy Birthday Mama J!"
                    className="w-full p-6 bg-white border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald/5 outline-none font-medium transition-all text-sm h-32 resize-none italic"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-6 pt-6">
                   <div className="flex-shrink-0">
                      <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-[0.3em] mb-4">Quantity</label>
                      <div className="flex items-center bg-white rounded-2xl p-2 border border-slate-100 shadow-xl">
                         <button 
                           onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                           className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-50 text-slate-600 hover:bg-ruby hover:text-white transition-all"
                         >
                           -
                         </button>
                         <span className="w-16 text-center font-bold text-xl text-slate-950">{quantity}</span>
                         <button 
                           onClick={() => setQuantity(quantity + 1)} 
                           className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-50 text-slate-600 hover:bg-emerald hover:text-white transition-all"
                         >
                           +
                         </button>
                      </div>
                   </div>
                   
                   <div className="flex-grow flex flex-col justify-end">
                      <button 
                        onClick={handleAddToCart}
                        className="w-full py-6 bg-slate-900 text-white font-bold uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-2xl hover:bg-emerald transition-all flex items-center justify-center space-x-3 group active:scale-95"
                      >
                        <ShoppingBag className="w-5 h-5" />
                        <span>Reserve My Masterpiece</span>
                      </button>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12">
                {[
                  { icon: Truck, label: 'White Glove', desc: 'Elite Delivery', color: 'text-royal-blue' },
                  { icon: ShieldCheck, label: 'Vault Secure', desc: 'Protected', color: 'text-emerald' },
                  { icon: Utensils, label: 'Artisanal', desc: 'Pure Organic', color: 'text-ruby' }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center text-center p-6 rounded-3xl bg-white border border-slate-50 shadow-sm hover:shadow-xl transition-all group">
                     <div className={`w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-colors mb-4`}>
                        <item.icon className="w-6 h-6" />
                     </div>
                     <h4 className="text-[10px] font-bold uppercase text-slate-900 tracking-widest mb-1">{item.label}</h4>
                     <p className={`text-[9px] font-bold uppercase tracking-widest ${item.color}`}>{item.desc}</p>
                  </div>
                ))}
             </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

