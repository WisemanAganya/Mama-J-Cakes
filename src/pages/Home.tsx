import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Play, ChevronLeft, ChevronRight, Utensils, ShieldCheck, ArrowRight, Heart, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { WebsiteSettings, HeroSlide } from '../types';

const defaultSlides: HeroSlide[] = [
  {
    id: '1',
    title: "The Heart of Celebration",
    subtitle: "Mama J's Signature",
    desc: "Authentic Kenyan flavors meets artisanal craftsmanship. Our signature Vanilla Sponge with fresh tropical fruit filling.",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=1200", color: "text-white-gold", accent: "bg-white-gold"
  },
  {
    id: '2',
    title: "Nairobi's Finest",
    subtitle: "Metropolitan Soul",
    desc: "Vibrant designs reflecting the energy of our city. From weddings in Karen to birthdays in Westlands, we bring the magic.",
    image: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&q=80&w=1200", color: "text-vibrant-pink", accent: "bg-vibrant-pink"
  },
  {
    id: '3',
    title: "Coastal Heritage",
    subtitle: "Mombasa Bliss",
    desc: "Infused with pure coastal coconut and bourbon vanilla. A taste of the Indian Ocean in every bite.",
    image: "https://images.unsplash.com/photo-1562233228-5079a255f5c6?auto=format&fit=crop&q=80&w=1200", color: "text-royal-blue", accent: "bg-royal-blue"
  }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<HeroSlide[]>(defaultSlides);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'settings', 'global'));
        if (docSnap.exists()) {
          const data = docSnap.data() as WebsiteSettings;
          if (data.heroSlides && data.heroSlides.length > 0) {
            setSlides(data.heroSlides);
          }
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
      }
    };
    fetchSettings();

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const services = [
    {
      id: '01',
      title: "Wedding Masterpieces",
      desc: "Bespoke architectural cakes designed for Kenya's most prestigious celebrations.",
      icon: Sparkles,
      color: "text-emerald",
      bg: "bg-emerald/10"
    },
    {
      id: '02',
      title: "Local Ingredients",
      desc: "Sourcing high-altitude organic ingredients from the heart of the Rift Valley.",
      icon: Utensils,
      color: "text-ruby",
      bg: "bg-ruby/10"
    },
    {
      id: '03',
      title: "Nairobi Delivery",
      desc: "Careful white-glove delivery across Nairobi and surrounding areas, ensuring perfection.",
      icon: ShieldCheck,
      color: "text-royal-purple",
      bg: "bg-royal-purple/10"
    }
  ];

  return (
    <div className="bg-vanilla min-h-screen font-sans" ref={containerRef}>
      {/* Cinematic Hero Slider */}
      <section className="relative h-screen overflow-hidden bg-slate-950">
         {/* Center Brand Overlay */}
         <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none px-6 text-center">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-4 mb-4"
            >
               <span className="w-8 md:w-16 h-[1px] bg-white-gold/60" />
               <Sparkles className="w-6 h-6 text-white-gold animate-pulse" />
               <span className="w-8 md:w-16 h-[1px] bg-white-gold/60" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              className="text-6xl md:text-9xl font-serif font-bold italic tracking-tighter text-white-gold mb-6 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
            >
               Mama J's Cakes
            </motion.h1>
            
            <motion.div
              key={`content-${currentSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl space-y-8"
            >
               <p className="text-xl md:text-2xl text-white font-light italic leading-relaxed drop-shadow-lg">
                 "{slides[currentSlide].desc}"
               </p>
               
               <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-4 pointer-events-auto">
                  <Link to="/catalog" className="px-12 py-5 bg-white-gold text-slate-950 rounded-full text-[12px] font-bold uppercase tracking-[0.3em] hover:bg-white hover:scale-105 transition-all shadow-2xl">
                     Order Your Cake
                  </Link>
                  <Link to="/contact" className="px-12 py-5 border border-white/30 text-white rounded-full text-[12px] font-bold uppercase tracking-[0.3em] hover:bg-white/10 transition-all backdrop-blur-sm">
                     Get in Touch
                  </Link>
               </div>
            </motion.div>
         </div>

         <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0"
            >
               <motion.img 
                 initial={{ scale: 1.2 }}
                 animate={{ scale: 1.1 }}
                 transition={{ duration: 10, ease: "linear" }}
                 src={slides[currentSlide].image} 
                 className="w-full h-full object-cover opacity-60" 
                 alt={slides[currentSlide].title} 
                 referrerPolicy="no-referrer"
               />
               {/* Vignette Overlay for better contrast */}
               <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950/90" />
            </motion.div>
         </AnimatePresence>

         {/* Slider Indicators */}
         <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center space-x-4 z-20">
            <button onClick={prevSlide} className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-all">
               <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex space-x-2">
               {slides.map((_, i) => (
                 <button 
                  key={i} 
                  onClick={() => setCurrentSlide(i)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${currentSlide === i ? 'w-12 bg-white-gold' : 'w-2 bg-white/30 hover:bg-white/50'}`} 
                 />
               ))}
            </div>
            <button onClick={nextSlide} className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-all">
               <ChevronRight className="w-5 h-5" />
            </button>
         </div>
      </section>

      {/* Structural Showcase (Local Focus) */}
      <section className="py-40 px-12 relative overflow-hidden bg-vanilla">
         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
            <div className="lg:col-span-5 space-y-12">
               <div className="space-y-4">
                  <span className="text-emerald text-[10px] font-bold uppercase tracking-[0.5em]">The East African Ethos</span>
                  <h2 className="text-[10vw] lg:text-[7vw] font-serif font-bold italic leading-none tracking-tighter text-slate-900">
                    Pure <br /> <span className="text-emerald/30">Heritage</span>
                  </h2>
               </div>
               <p className="text-xl text-slate-400 font-light leading-relaxed italic">
                  "From the slopes of Mt. Kenya to the white sands of Watamu, we source the soul of our continent to create edible poetry."
               </p>
               <div className="grid grid-cols-2 gap-12">
                  <div className="space-y-4">
                     <div className="text-4xl font-serif font-bold text-royal-purple italic">100%</div>
                     <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Local Sourcing</p>
                  </div>
                  <div className="space-y-4">
                     <div className="text-4xl font-serif font-bold text-ruby italic">12</div>
                     <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Regional Centers</p>
                  </div>
               </div>
            </div>

            <div className="lg:col-span-7">
               <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-8 mt-20">
                     <div className="aspect-[3/4] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white-gold/20">
                        <img 
                          src="https://images.unsplash.com/photo-1535254973040-607b474cb8c2?auto=format&fit=crop&q=80&w=800" 
                          className="w-full h-full object-cover" 
                          alt="Artisan detail" 
                          referrerPolicy="no-referrer"
                        />
                     </div>
                     <div className="bg-royal-blue/5 p-12 rounded-[3rem] space-y-4 border border-royal-blue/10">
                        <Heart className="w-8 h-8 text-royal-blue" />
                        <h4 className="text-2xl font-serif font-bold italic text-royal-blue">Devotion</h4>
                        <p className="text-sm text-slate-500">Every layer is a tribute to our Kenyan ancestors' mastery of sensory balance.</p>
                     </div>
                  </div>
                  <div className="space-y-8">
                     <div className="bg-ruby p-12 rounded-[3rem] text-white space-y-4 shadow-xl shadow-ruby/20">
                        <Zap className="w-8 h-8" />
                        <h4 className="text-2xl font-serif font-bold italic">Power</h4>
                        <p className="text-sm text-white/60">Flavors that roar with the passion of the Great Rift Valley.</p>
                     </div>
                     <div className="aspect-[3/4] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-vibrant-pink/20">
                        <img 
                          src="https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&q=80&w=800" 
                          className="w-full h-full object-cover" 
                          alt="Artisan detail" 
                          referrerPolicy="no-referrer"
                        />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Services Grid (Local Excellence) */}
      <section className="py-40 bg-white">
         <div className="max-w-7xl mx-auto px-12">
            <div className="text-center mb-24 space-y-6">
               <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-royal-purple">Regional Excellence</span>
               <h2 className="text-6xl md:text-8xl font-serif font-bold italic tracking-tighter text-slate-900">
                  Kenya's <span className="text-emerald">Finest</span> <br /> 
                  East Africa's Choice
               </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               {services.map((service, i) => (
                 <div key={i} className="group relative bg-vanilla p-16 rounded-[4rem] border border-slate-100 hover:shadow-3xl transition-all duration-700">
                    <div className={`w-20 h-20 ${service.bg} ${service.color} rounded-3xl flex items-center justify-center mb-12 group-hover:scale-110 transition-transform`}>
                       <service.icon className="w-10 h-10" />
                    </div>
                    <h3 className="text-3xl font-serif font-bold italic text-slate-900 mb-6">{service.title}</h3>
                    <p className="text-slate-500 font-light leading-relaxed italic">{service.desc}</p>
                    <div className={`mt-10 flex items-center text-[10px] font-bold uppercase tracking-widest ${service.color}`}>
                       Explore Service <ArrowRight className="ml-4 w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 px-12 bg-slate-900 relative overflow-hidden text-center">
         <div className="absolute inset-0 opacity-10 premium-gradient blur-[150px]" />
         <div className="relative z-10 space-y-12">
            <h2 className="text-7xl md:text-[10vw] font-serif font-bold italic text-white tracking-tighter leading-none">
               Experience <span className="text-white-gold">Legacy?</span>
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
               <Link to="/catalog" className="px-20 py-10 bg-white-gold text-slate-900 rounded-full text-[12px] font-bold uppercase tracking-[0.5em] hover:scale-105 transition-all shadow-3xl">
                  Order in Nairobi
               </Link>
               <Link to="/contact" className="px-20 py-10 border border-white/20 text-white rounded-full text-[12px] font-bold uppercase tracking-[0.5em] hover:bg-white/5 transition-all">
                  Regional Inquiries
               </Link>
            </div>
         </div>
      </section>
    </div>
  );
}
