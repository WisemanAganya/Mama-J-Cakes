import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Smartphone, CheckCircle2, ChevronLeft, Loader2, Calendar, MapPin, User, Package, Sparkles, Heart, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

import { doc, getDoc } from 'firebase/firestore';
import { WebsiteSettings } from '../types';

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentOption, setPaymentOption] = useState<'deposit' | 'full'>('full');
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    eventDate: '',
    eventTime: '',
    eventType: 'Birthday'
  });
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card'>('mpesa');
  const [deliveryLocation, setDeliveryLocation] = useState<'nairobi' | 'outside'>('nairobi');
  const [fees, setFees] = useState({ nairobi: 500, outsideNairobi: 1500 });

  React.useEffect(() => {
    const fetchFees = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'settings', 'global'));
        if (docSnap.exists()) {
          const data = docSnap.data() as WebsiteSettings;
          if (data.deliveryFees) {
            setFees(data.deliveryFees);
          }
        }
      } catch (err) {
        console.error("Error fetching fees:", err);
      }
    };
    fetchFees();
  }, []);

  const deliveryFee = deliveryLocation === 'nairobi' ? fees.nairobi : fees.outsideNairobi;
  const grandTotal = total + deliveryFee;
  const depositAmount = Math.round(grandTotal * 0.5); // 50% deposit
  const amountToPay = paymentOption === 'full' ? grandTotal : depositAmount;

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate network latency for premium feel
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const orderData: any = {
        ...form,
        items,
        total: grandTotal,
        deposit: amountToPay,
        deliveryFee,
        deliveryLocation,
        status: 'pending',
        paymentStatus: 'unpaid',
        paymentMethod,
        paymentOption,
        createdAt: serverTimestamp(),
        type: 'order'
      };

      await addDoc(collection(db, 'orders'), orderData);
      setStep(3);
      clearCart();
    } catch (err) {
      console.error(err);
      alert('Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && step !== 3) {
    return (
      <div className="pt-60 pb-40 text-center px-4 max-w-xl mx-auto min-h-screen bg-parchment font-sans">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-20 rounded-[4rem] shadow-2xl border border-slate-100"
        >
          <div className="w-32 h-32 bg-vanilla rounded-full flex items-center justify-center mx-auto mb-10 border border-slate-100">
             <Package className="w-12 h-12 text-slate-300" />
          </div>
          <h1 className="text-5xl font-serif font-bold text-slate-900 mb-6 tracking-tighter italic">Your Vault is Empty</h1>
          <p className="text-slate-500 mb-12 font-light text-xl italic">Our masterpieces are waiting to be part of your celebration.</p>
          <Link to="/catalog" className="inline-flex items-center px-12 py-6 bg-slate-900 text-white font-bold uppercase tracking-[0.3em] text-[10px] rounded-full shadow-2xl hover:bg-emerald transition-all group">
             <span>Browse The Vault</span>
             <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-48 pb-40 min-h-screen bg-vanilla relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-royal-purple/5 rounded-full blur-[150px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-emerald/5 rounded-full blur-[150px] -z-10" />

      <div className="max-w-7xl mx-auto px-12">
        {/* Progress Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end mb-24">
           <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center space-x-3 text-royal-purple">
                <Sparkles className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-[0.5em]">The Final Step</span>
              </div>
              <h1 className="text-7xl md:text-8xl font-serif font-bold text-slate-900 tracking-tighter leading-none italic">
                Confirm Your <br /><span className="text-emerald">Celebration</span>
              </h1>
           </div>
           <div className="lg:col-span-4">
              <div className="flex items-center justify-between bg-white p-5 rounded-[2rem] border border-slate-100 shadow-xl">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center group">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-500 ${
                      step >= s ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' : 'bg-vanilla text-slate-300'
                    }`}>
                      {step > s ? <CheckCircle2 className="w-6 h-6" /> : s}
                    </div>
                    {s < 3 && <div className={`w-10 md:w-16 h-1 mx-2 rounded-full transition-all duration-700 ${step > s ? 'bg-emerald' : 'bg-slate-100'}`} />}
                  </div>
                ))}
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: -30 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: 30 }}
                  className="space-y-12"
                >
                  <div className="space-y-4">
                     <h2 className="text-4xl font-serif font-bold text-slate-900 italic">Event Dossier</h2>
                     <p className="text-slate-500 text-lg font-light italic">"Every detail matters for your bespoke creation."</p>
                  </div>
                  
                  <form className="space-y-10" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 ml-2">Full Name</label>
                        <div className="relative group">
                          <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald transition-colors" />
                          <input 
                            required
                            placeholder="Hon. Guest Name"
                            className="w-full pl-16 pr-8 py-6 bg-white border border-slate-100 rounded-3xl focus:ring-4 focus:ring-emerald/5 outline-none font-medium transition-all shadow-xl shadow-slate-100/50 text-lg" 
                            value={form.name}
                            onChange={e => setForm({...form, name: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 ml-2">Email Address</label>
                        <div className="relative group">
                          <CreditCard className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald transition-colors" />
                          <input 
                            required
                            type="email"
                            placeholder="guest@celebration.com"
                            className="w-full pl-16 pr-8 py-6 bg-white border border-slate-100 rounded-3xl focus:ring-4 focus:ring-emerald/5 outline-none font-medium transition-all shadow-xl shadow-slate-100/50 text-lg" 
                            value={form.email}
                            onChange={e => setForm({...form, email: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 ml-2">M-Pesa Number</label>
                        <div className="relative group">
                          <Smartphone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-ruby transition-colors" />
                          <input 
                            required
                            placeholder="2547XXXXXXXX"
                            className="w-full pl-16 pr-8 py-6 bg-white border border-slate-100 rounded-3xl focus:ring-4 focus:ring-ruby/5 outline-none font-medium transition-all shadow-xl shadow-slate-100/50 text-lg" 
                            value={form.phone}
                            onChange={e => setForm({...form, phone: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 ml-2">Event Type</label>
                        <select 
                          className="w-full px-8 py-6 bg-white border border-slate-100 rounded-3xl focus:ring-4 focus:ring-royal-blue/5 outline-none font-medium transition-all shadow-xl shadow-slate-100/50 text-lg appearance-none"
                          value={form.eventType}
                          onChange={e => setForm({...form, eventType: e.target.value})}
                        >
                          <option>Wedding</option>
                          <option>Birthday</option>
                          <option>Engagement</option>
                          <option>Baby Shower</option>
                          <option>Corporate</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 ml-2">Reservation Date</label>
                        <div className="relative group">
                          <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-royal-blue transition-colors" />
                          <input 
                            required
                            type="date"
                            className="w-full pl-16 pr-8 py-6 bg-white border border-slate-100 rounded-3xl focus:ring-4 focus:ring-royal-blue/5 outline-none font-medium transition-all shadow-xl shadow-slate-100/50 text-lg" 
                            value={form.eventDate}
                            onChange={e => setForm({...form, eventDate: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 ml-2">Delivery Time</label>
                        <div className="relative group">
                          <Package className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-royal-blue transition-colors" />
                          <input 
                            required
                            type="time"
                            className="w-full pl-16 pr-8 py-6 bg-white border border-slate-100 rounded-3xl focus:ring-4 focus:ring-royal-blue/5 outline-none font-medium transition-all shadow-xl shadow-slate-100/50 text-lg" 
                            value={form.eventTime}
                            onChange={e => setForm({...form, eventTime: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 ml-2">Delivery Zone</label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setDeliveryLocation('nairobi')}
                          className={`p-6 rounded-2xl border transition-all text-left ${
                            deliveryLocation === 'nairobi' ? 'border-emerald bg-emerald/5 shadow-lg' : 'border-slate-100 hover:border-slate-200'
                          }`}
                        >
                          <p className="text-sm font-bold text-slate-900">Nairobi & Environs</p>
                          <p className="text-[10px] text-emerald font-bold uppercase tracking-widest mt-1">KES 500</p>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeliveryLocation('outside')}
                          className={`p-6 rounded-2xl border transition-all text-left ${
                            deliveryLocation === 'outside' ? 'border-emerald bg-emerald/5 shadow-lg' : 'border-slate-100 hover:border-slate-200'
                          }`}
                        >
                          <p className="text-sm font-bold text-slate-900">Outside Nairobi</p>
                          <p className="text-[10px] text-emerald font-bold uppercase tracking-widest mt-1">KES 1,500</p>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 ml-2">Delivery Address</label>
                      <div className="relative group">
                        <MapPin className="absolute left-6 top-8 w-5 h-5 text-slate-300 group-focus-within:text-royal-purple transition-colors" />
                        <textarea 
                          required
                          placeholder="Where shall we deliver this masterpiece? (Specific building, street, or landmark)"
                          className="w-full pl-16 pr-8 py-8 bg-white border border-slate-100 rounded-[2rem] focus:ring-4 focus:ring-royal-purple/5 outline-none font-medium transition-all shadow-xl shadow-slate-100/50 h-40 resize-none text-lg" 
                          value={form.address}
                          onChange={e => setForm({...form, address: e.target.value})}
                        />
                      </div>
                    </div>

                    <button type="submit" className="w-full py-8 bg-slate-900 text-white font-bold uppercase tracking-[0.3em] text-[10px] rounded-full shadow-2xl hover:bg-emerald transition-all active:scale-95 flex items-center justify-center space-x-6 group">
                      <span>Secure Reservation</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </button>
                  </form>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: -30 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: 30 }}
                  className="space-y-12"
                >
                  <div className="space-y-4">
                     <button 
                      onClick={() => setStep(1)}
                      className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 hover:text-emerald transition-colors flex items-center mb-6"
                     >
                       <ChevronLeft className="w-4 h-4 mr-1" /> Back to details
                     </button>
                     <h2 className="text-4xl font-serif font-bold text-slate-900 italic">Payment Strategy</h2>
                     <p className="text-slate-500 text-lg font-light italic">Select how you wish to finalize this transaction.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div 
                      onClick={() => setPaymentOption('full')}
                      className={`p-10 rounded-[3rem] border transition-all duration-500 cursor-pointer group relative overflow-hidden ${
                        paymentOption === 'full' ? 'border-emerald bg-white shadow-2xl scale-105' : 'border-slate-100 bg-white/50 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2 italic">Full Payment</h3>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-6">Total Settlement Now</p>
                      <p className="text-4xl font-serif font-bold text-emerald">KES {grandTotal.toLocaleString()}</p>
                      {paymentOption === 'full' && <motion.div layoutId="activePay" className="absolute top-8 right-8 w-3 h-3 bg-emerald rounded-full shadow-[0_0_20px_rgba(16,185,129,0.8)]" />}
                    </div>

                    <div 
                      onClick={() => setPaymentOption('deposit')}
                      className={`p-10 rounded-[3rem] border transition-all duration-500 cursor-pointer group relative overflow-hidden ${
                        paymentOption === 'deposit' ? 'border-royal-purple bg-white shadow-2xl scale-105' : 'border-slate-100 bg-white/50 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2 italic">Secure Deposit</h3>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-6">50% Commitment Fee</p>
                      <p className="text-4xl font-serif font-bold text-royal-purple">KES {depositAmount.toLocaleString()}</p>
                      {paymentOption === 'deposit' && <motion.div layoutId="activePay" className="absolute top-8 right-8 w-3 h-3 bg-royal-purple rounded-full shadow-[0_0_20px_rgba(139,92,246,0.8)]" />}
                    </div>
                  </div>

                  <div className="bg-slate-900 p-12 rounded-[3rem] text-white relative overflow-hidden flex flex-col items-center text-center">
                     <div className="absolute top-0 right-0 w-80 h-80 bg-ruby/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
                     <ShieldCheck className="w-16 h-16 text-white-gold mb-10 animate-pulse" />
                     <h3 className="text-3xl font-serif font-bold mb-4 italic">Confirm Authorization</h3>
                     <p className="text-slate-400 font-light text-xl mb-12 max-w-sm leading-relaxed italic">
                       An M-Pesa STK push for <strong>KES {amountToPay.toLocaleString()}</strong> will be sent to <strong>{form.phone}</strong>.
                     </p>
                     
                     <button 
                      disabled={loading}
                      onClick={handleOrder}
                      className="w-full py-8 bg-white text-slate-900 font-bold uppercase tracking-[0.3em] text-[10px] rounded-full shadow-2xl hover:bg-ruby hover:text-white transition-all disabled:opacity-50 flex items-center justify-center space-x-4"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-6 h-6 animate-spin" />
                          <span>Establishing Link...</span>
                        </>
                      ) : (
                        <>
                          <span>Transmit Authorization</span>
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ scale: 0.9, opacity: 0 }} 
                  animate={{ scale: 1, opacity: 1 }} 
                  className="bg-white p-20 rounded-[4rem] text-center shadow-3xl border border-slate-100"
                >
                  <div className="w-40 h-40 bg-emerald/10 text-emerald rounded-full flex items-center justify-center mx-auto mb-12">
                    <CheckCircle2 className="w-20 h-20" />
                  </div>
                  <h2 className="text-6xl font-serif font-bold mb-6 text-slate-900 tracking-tighter italic">Order Secured</h2>
                  <p className="text-slate-500 mb-16 max-w-md mx-auto text-xl font-light leading-relaxed italic">
                    Your request has entered our production queue. 
                    We have transmitted your receipt and delivery tracking to <strong>{form.phone}</strong>.
                  </p>
                  <Link to="/catalog" className="inline-flex items-center px-16 py-7 bg-slate-900 text-white font-bold uppercase tracking-[0.3em] text-[10px] rounded-full shadow-2xl hover:bg-royal-purple transition-all">
                    Return to The Vault
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar: Summary */}
          <div className="lg:col-span-5 relative">
             <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="sticky top-40 bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100 space-y-12"
             >
                <div className="flex items-center justify-between pb-8 border-b border-vanilla">
                   <h3 className="text-3xl font-serif font-bold text-slate-900 italic">Vault Pack</h3>
                   <span className="px-4 py-2 bg-vanilla rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-400 border border-slate-100">
                     {items.length} Masterpieces
                   </span>
                </div>
                
                <div className="space-y-8 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                   {items.map((item, idx) => (
                     <div key={idx} className="flex space-x-8 group">
                        <div className="w-24 h-24 rounded-[2rem] bg-vanilla overflow-hidden relative group-hover:scale-105 transition-transform duration-500 shadow-md">
                          <img referrerPolicy="no-referrer" src={item.imageUrl} alt={item.cakeName} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow py-2">
                           <div className="flex justify-between items-start mb-2">
                              <h4 className="text-xl font-serif font-bold text-slate-900 italic">{item.cakeName}</h4>
                              <span className="text-lg font-serif font-bold text-slate-900">KES {(item.price * item.quantity).toLocaleString()}</span>
                           </div>
                           <div className="flex flex-wrap gap-2 mb-2">
                              <span className="text-[8px] font-bold text-emerald uppercase tracking-widest bg-emerald/5 px-2 py-1 rounded">{item.weight}kg</span>
                              <span className="text-[8px] font-bold text-royal-purple uppercase tracking-widest bg-royal-purple/5 px-2 py-1 rounded">{item.flavor}</span>
                              {item.themeColors?.map(c => (
                                <span key={c} className="text-[8px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded">{c}</span>
                              ))}
                           </div>
                           {item.customMessage && (
                             <p className="text-[9px] text-slate-400 italic">"{item.customMessage}"</p>
                           )}
                        </div>
                     </div>
                   ))}
                </div>

                <div className="pt-10 space-y-6">
                   <div className="flex justify-between items-center text-slate-400">
                      <span className="text-[10px] font-bold uppercase tracking-widest">Subtotal Valued</span>
                      <span className="text-xs font-bold text-slate-900 uppercase tracking-widest italic">KES {total.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between items-center text-slate-400">
                      <span className="text-[10px] font-bold uppercase tracking-widest">White-Glove Delivery</span>
                      <span className="text-xs font-bold text-emerald uppercase tracking-widest italic">KES {deliveryFee.toLocaleString()}</span>
                   </div>
                   <div className="pt-10 border-t border-vanilla">
                      <div className="flex justify-between items-end">
                        <div>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] mb-3">Total Valuation</p>
                           <span className="text-6xl font-serif font-bold text-slate-900 tracking-tighter">
                              <span className="text-xl font-sans text-emerald mr-3 uppercase">KES</span>
                              {grandTotal.toLocaleString()}
                           </span>
                        </div>
                        <Heart className="w-10 h-10 text-ruby/10 fill-current" />
                      </div>
                   </div>
                   
                   {paymentOption === 'deposit' && (
                     <div className="p-6 bg-royal-purple/5 rounded-2xl border border-royal-purple/10">
                        <p className="text-[10px] font-bold text-royal-purple uppercase tracking-widest mb-2 text-center">Due Today (Deposit)</p>
                        <p className="text-3xl font-serif font-bold text-slate-900 text-center italic">KES {depositAmount.toLocaleString()}</p>
                     </div>
                   )}
                </div>
             </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

