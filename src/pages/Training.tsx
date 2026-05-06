import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, Award, ChevronRight, Play, Sparkles, Star, Heart } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Training() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', course: 'Masterclass' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const courses = [
    {
      id: 'masterclass',
      title: "The Masterclass",
      level: "Elite",
      duration: "12 Weeks",
      price: "150,000",
      description: "A comprehensive immersion into high-altitude baking and structural confectionery design.",
      image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80",
      color: "text-emerald",
      accent: "bg-emerald"
    },
    {
      id: 'sculpting',
      title: "Artisanal Sculpting",
      level: "Advanced",
      duration: "4 Weeks",
      price: "45,000",
      description: "Mastering the physics of sugar and chocolate to create edible architectural monuments.",
      image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80",
      color: "text-ruby",
      accent: "bg-ruby"
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'enrollments'), {
        studentName: formData.name,
        studentEmail: formData.email,
        studentPhone: formData.phone,
        courseId: formData.course,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setSubmitted(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-vanilla min-h-screen font-sans">
      <div className="snap-container h-screen">
        {/* Section 1: The Vision */}
        <section className="snap-section bg-vanilla text-slate-950">
           <div className="editorial-heading text-slate-200">Academy</div>
           <div className="max-w-7xl mx-auto px-12 w-full flex flex-col md:flex-row items-center gap-20 relative z-10">
              <div className="w-full md:w-1/2 space-y-12">
                 <div className="space-y-4">
                    <span className="text-emerald text-[10px] font-bold uppercase tracking-[0.5em]">Mama J's Culinary Arts</span>
                    <h1 className="text-7xl md:text-9xl font-serif font-bold tracking-tighter italic leading-[0.8] uppercase text-slate-950">
                       The Secret <br /> <span className="text-ruby/20">Geometry</span>
                    </h1>
                 </div>
                 <p className="text-2xl text-slate-500 font-light leading-relaxed max-w-xl italic">
                    "We don't just teach recipes. We transmit a legacy of architectural precision and sensory alchemy to those destined for greatness."
                 </p>
                 <div className="flex items-center space-x-12 pt-10 border-t border-slate-100">
                    <div className="text-center">
                       <h4 className="text-4xl font-serif font-bold italic mb-2 text-slate-900">500+</h4>
                       <p className="text-[9px] font-bold uppercase tracking-widest text-emerald">Graduates</p>
                    </div>
                    <div className="text-center">
                       <h4 className="text-4xl font-serif font-bold italic mb-2 text-slate-900">12</h4>
                       <p className="text-[9px] font-bold uppercase tracking-widest text-ruby">Master Courses</p>
                    </div>
                 </div>
              </div>
              <div className="w-full md:w-1/2">
                 <div className="relative aspect-square rounded-full overflow-hidden border-[20px] border-slate-50 group shadow-3xl">
                    <img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s]" alt="Academy" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/20 group-hover:bg-slate-950/40 transition-all">
                       <button className="w-24 h-24 bg-white text-slate-950 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all">
                          <Play className="w-8 h-8 fill-current ml-1 text-slate-900" />
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Section 2: The Curricula */}
        <section className="snap-section bg-white overflow-hidden">
           <div className="max-w-full mx-auto w-full flex h-full">
              {courses.map((course, idx) => (
                <div key={idx} className={`flex-1 group relative overflow-hidden transition-all duration-1000 hover:flex-[1.5] border-r border-slate-50`}>
                   <img src={course.image} className="absolute inset-0 w-full h-full object-cover opacity-10 group-hover:opacity-30 transition-opacity" alt={course.title} referrerPolicy="no-referrer" />
                   <div className="relative h-full p-16 md:p-24 flex flex-col justify-between">
                      <div className="space-y-4">
                         <span className={`px-6 py-2 ${course.accent} text-white rounded-xl text-[9px] font-bold uppercase tracking-widest`}>{course.level} Level</span>
                         <h3 className="text-6xl md:text-7xl font-serif font-bold italic leading-none text-slate-900">{course.title}</h3>
                      </div>
                      <div className="space-y-8">
                         <p className="text-xl text-slate-500 font-light max-w-md italic">{course.description}</p>
                         <div className="flex items-center space-x-10 text-[10px] font-bold uppercase tracking-widest text-slate-900">
                            <span className="flex items-center"><Star className={`w-4 h-4 mr-2 ${course.color} fill-current`} /> {course.duration}</span>
                            <span className="flex items-center"><Award className={`w-4 h-4 mr-2 ${course.color}`} /> Certification</span>
                         </div>
                         <div className={`text-4xl font-serif font-bold ${course.color} italic`}>KES {course.price}</div>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* Section 3: The Initiation (Form) */}
        <section className="snap-section bg-vanilla">
           <div className="absolute top-0 left-0 w-[40vw] h-[40vw] bg-emerald/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
           <div className="max-w-5xl mx-auto px-12 w-full relative z-10">
              <div className="bg-white p-20 rounded-[4rem] shadow-[0_100px_200px_-50px_rgba(16,185,129,0.1)] border border-slate-100">
                 {submitted ? (
                   <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-8 py-20">
                      <div className="w-24 h-24 bg-emerald/10 text-emerald rounded-full flex items-center justify-center mx-auto mb-10">
                        <Sparkles className="w-12 h-12" />
                      </div>
                      <h3 className="text-5xl font-serif font-bold italic text-slate-900">Application Transmitted</h3>
                      <p className="text-xl text-slate-500 font-light italic">The Council will review your credentials and reach out within 48 hours.</p>
                      <button onClick={() => setSubmitted(false)} className="px-12 py-5 bg-slate-950 text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl">Back to Academy</button>
                   </motion.div>
                 ) : (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                      <div className="space-y-10">
                         <h3 className="text-5xl font-serif font-bold italic leading-tight text-slate-900">Apply for <br /> <span className="text-royal-purple">Initiation</span></h3>
                         <p className="text-lg text-slate-500 font-light leading-relaxed italic">Secure your position in the upcoming cohort. Seats are strictly limited to ensure individual mentorship.</p>
                         <div className="space-y-6">
                            {[
                              { label: 'Mastery Certificate', color: 'bg-emerald' },
                              { label: 'Live Practice', color: 'bg-ruby' },
                              { label: 'Exclusive Toolset', color: 'bg-royal-blue' }
                            ].map(feat => (
                              <div key={feat.label} className="flex items-center space-x-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                 <div className={`w-2 h-2 ${feat.color} rounded-full`} />
                                 {feat.label}
                              </div>
                            ))}
                         </div>
                      </div>
                      <form onSubmit={handleSubmit} className="space-y-8">
                         <div className="space-y-4">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Full Name</label>
                            <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-8 py-5 rounded-2xl border border-slate-100 bg-slate-50/30 focus:bg-white focus:ring-4 focus:ring-emerald/5 outline-none transition-all" />
                         </div>
                         <div className="space-y-4">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Email Address</label>
                            <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-8 py-5 rounded-2xl border border-slate-100 bg-slate-50/30 focus:bg-white focus:ring-4 focus:ring-ruby/5 outline-none transition-all" />
                         </div>
                         <div className="space-y-4">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Course Selection</label>
                            <select value={formData.course} onChange={(e) => setFormData({...formData, course: e.target.value})} className="w-full px-8 py-5 rounded-2xl border border-slate-100 bg-slate-50/30 focus:bg-white focus:ring-4 focus:ring-royal-purple/5 outline-none transition-all appearance-none">
                               <option>Masterclass</option>
                               <option>Artisanal Sculpting</option>
                            </select>
                         </div>
                         <button disabled={isSubmitting} type="submit" className="w-full py-6 bg-slate-900 text-white rounded-full text-[10px] font-bold uppercase tracking-[0.4em] shadow-2xl hover:bg-emerald transition-all">
                            {isSubmitting ? 'Transmitting...' : 'Submit Application'}
                         </button>
                      </form>
                   </div>
                 )}
              </div>
           </div>
        </section>
      </div>
    </div>
  );
}
