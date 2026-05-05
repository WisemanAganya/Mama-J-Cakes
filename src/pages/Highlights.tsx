import React, { useState, useEffect, useRef } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { BlogPost } from '../types';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Calendar, User, ArrowRight, Share2, Sparkles, BookOpen, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Highlights() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, 'blogPosts'), orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        setPosts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost)));
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-vanilla font-sans">
      <div className="text-center space-y-6">
        <div className="w-20 h-20 border-2 border-emerald/20 border-t-emerald rounded-full animate-spin mx-auto" />
        <p className="text-emerald font-bold uppercase tracking-[0.5em] text-[10px]">Unrolling Chronicles...</p>
      </div>
    </div>
  );

  return (
    <div className="bg-vanilla min-h-screen overflow-hidden font-sans">
      <div className="relative h-screen flex flex-col">
        {/* Background Text */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full flex items-center justify-center overflow-hidden pointer-events-none opacity-[0.03]">
           <h1 className="text-[40vw] font-serif font-black tracking-tighter uppercase italic whitespace-nowrap text-slate-950">
             Chronicles Chronicles Chronicles
           </h1>
        </div>

        {/* Header Section */}
        <div className="relative pt-32 px-12 md:px-20 z-10">
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="space-y-4">
                 <span className="text-emerald text-[10px] font-bold uppercase tracking-[0.5em]">The Culinary Journal</span>
                 <h1 className="text-7xl md:text-9xl font-serif font-bold text-slate-950 tracking-tighter italic leading-none">
                    Heritage <br /> <span className="text-ruby/20">Stories</span>
                 </h1>
              </div>
              <p className="text-slate-400 text-xl font-light max-w-md leading-relaxed italic">
                 "Archived highlights of our architectural achievements and culinary breakthroughs."
              </p>
           </div>
        </div>

        {/* Horizontal Magazine Reel */}
        <div className="flex-grow flex items-center overflow-x-auto no-scrollbar snap-x snap-mandatory pt-20 pb-32 px-12 md:px-20 gap-16" ref={scrollRef}>
           {posts.map((post, idx) => {
             const colors = ['text-emerald', 'text-ruby', 'text-royal-blue', 'text-royal-purple', 'text-vibrant-pink'];
             const bgColors = ['hover:bg-emerald hover:border-emerald', 'hover:bg-ruby hover:border-ruby', 'hover:bg-royal-blue hover:border-royal-blue', 'hover:bg-royal-purple hover:border-royal-purple', 'hover:bg-vibrant-pink hover:border-vibrant-pink'];
             const accent = colors[idx % colors.length];
             const bgAccent = bgColors[idx % bgColors.length];
             
             return (
               <motion.div 
                 key={post.id}
                 initial={{ opacity: 0, x: 100 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: idx * 0.1, duration: 1 }}
                 className="flex-shrink-0 w-[85vw] md:w-[60vw] xl:w-[45vw] h-full snap-center group"
               >
                  <div className="h-full flex flex-col">
                     <div className="relative aspect-[16/10] rounded-[3rem] overflow-hidden shadow-2xl transition-all duration-700">
                        <img 
                          src={post.imageUrl} 
                          className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110" 
                          alt={post.title} 
                        />
                         <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                        
                        <div className="absolute top-10 right-10">
                           <div className={`w-16 h-16 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white border border-white/30 transition-all ${bgAccent}`}>
                              <Share2 className="w-6 h-6" />
                           </div>
                        </div>

                        <div className="absolute bottom-12 left-12 right-12">
                           <div className="flex items-center space-x-6 text-[10px] font-bold uppercase tracking-[0.3em] text-white/80 mb-6">
                              <div className="flex items-center space-x-2">
                                 <Calendar className={`w-4 h-4 ${accent}`} />
                                 <span>{new Date(post.date).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center space-x-2 border-l border-white/20 pl-6">
                                 <User className={`w-4 h-4 ${accent}`} />
                                 <span>By {post.author}</span>
                              </div>
                           </div>
                           <h3 className={`text-4xl md:text-5xl font-serif font-bold text-white italic leading-tight transition-colors`}>
                             {post.title}
                           </h3>
                        </div>
                     </div>

                     <div className="pt-10 space-y-8 flex-grow flex flex-col">
                        <p className="text-xl text-slate-500 font-light leading-relaxed line-clamp-3 italic">
                           {post.excerpt}
                        </p>
                        <div className="mt-auto">
                          <Link 
                            to={`/highlights/${post.id}`} 
                            className="inline-flex items-center space-x-6 text-slate-900 group/btn"
                          >
                             <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Read Full Chronicle</span>
                             <div className={`w-16 h-16 rounded-full border border-slate-200 flex items-center justify-center transition-all duration-500 group-hover/btn:scale-110 group-hover/btn:bg-slate-900 group-hover/btn:text-white`}>
                                <ArrowRight className="w-6 h-6" />
                             </div>
                          </Link>
                        </div>
                     </div>
                  </div>
               </motion.div>
             );
           })}

           {posts.length === 0 && (
              <div className="flex-shrink-0 w-full flex items-center justify-center py-40">
                 <div className="text-center space-y-6">
                    <BookOpen className="w-20 h-20 text-slate-800 mx-auto" />
                    <h3 className="text-4xl font-serif font-bold italic text-white/20">The Chronicles are silent</h3>
                 </div>
              </div>
           )}
        </div>

        {/* Progress Bar (Visual only) */}
        <div className="absolute bottom-12 left-20 right-20 h-px bg-white/10 overflow-hidden">
           <motion.div 
             className="h-full bg-white-gold w-1/3"
             animate={{ x: ['0%', '200%'] }}
             transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
           />
        </div>
      </div>
    </div>
  );
}
