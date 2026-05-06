import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy, limit, doc, getDoc, setDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, ShoppingBag, Users, BarChart3, Settings, 
  Search, Bell, LogOut, Plus, MoreVertical, TrendingUp, 
  ArrowUpRight, ArrowDownRight, Package, Calendar, DollarSign, Sparkles,
  Save, Trash2, Upload, Globe, Image as ImageIcon, MapPin, Phone, Mail
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { HeroSlide, WebsiteSettings, Cake, Order } from '../types';

export default function ManagementPortal() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [isEditingCake, setIsEditingCake] = useState<Cake | null>(null);
  const [showCakeForm, setShowCakeForm] = useState(false);
  
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  
  // New Cake Form State
  const [formData, setFormData] = useState<Partial<Cake>>({
    name: '',
    description: '',
    price: 0,
    category: 'Wedding',
    eventCategories: [],
    imageUrl: '',
    artisanDetailUrl: '',
    servings: '',
    flavors: [],
    availableWeights: [1, 2, 3],
    colorOptions: [],
    rating: 5
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orderSnap = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc')));
        setOrders(orderSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));

        const cakeSnap = await getDocs(collection(db, 'cakes'));
        setCakes(cakeSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Cake)));

        const settingsSnap = await getDoc(doc(db, 'settings', 'global'));
        if (settingsSnap.exists()) {
          setSettings(settingsSnap.data() as WebsiteSettings);
        } else {
          // Default settings if none exist
          const defaultSettings: WebsiteSettings = {
            id: 'global',
            heroSlides: [
              { id: '1', title: "The Heart of Celebration", subtitle: "Mama J's Signature", desc: "Authentic Kenyan flavors meets artisanal craftsmanship. Our signature Vanilla Sponge with fresh tropical fruit filling.", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=1200", color: "text-white-gold", accent: "bg-white-gold" },
              { id: '2', title: "Nairobi's Finest", subtitle: "Metropolitan Soul", desc: "Vibrant designs reflecting the energy of our city. From weddings in Karen to birthdays in Westlands, we bring the magic.", image: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&q=80&w=1200", color: "text-vibrant-pink", accent: "bg-vibrant-pink" },
              { id: '3', title: "Coastal Heritage", subtitle: "Mombasa Bliss", desc: "Infused with pure coastal coconut and bourbon vanilla. A taste of the Indian Ocean in every bite.", image: "https://images.unsplash.com/photo-1562233228-5079a255f5c6?auto=format&fit=crop&q=80&w=1200", color: "text-royal-blue", accent: "bg-royal-blue" }
            ],
            deliveryFees: { nairobi: 500, outsideNairobi: 1500 },
            contactInfo: { phone: "+254 700 000 000", email: "hello@mamajscakes.com", address: "Nairobi, Kenya" },
            homeContent: { heroTitle: "Mama J's Cakes", heroSubtitle: "Bespoke Masterpieces", aboutTitle: "Our Story", aboutText: "Handcrafting joy since..." }
          };
          setSettings(defaultSettings);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const saveSettings = async () => {
    if (!settings) return;
    setIsSavingSettings(true);
    try {
      await setDoc(doc(db, 'settings', 'global'), settings);
      alert('Settings updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save settings.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleSaveCake = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const cakeId = isEditingCake?.id || doc(collection(db, 'cakes')).id;
      const finalData = { ...formData, id: cakeId };
      await setDoc(doc(db, 'cakes', cakeId), finalData);
      
      // Update local state
      if (isEditingCake) {
        setCakes(cakes.map(c => c.id === cakeId ? (finalData as Cake) : c));
      } else {
        setCakes([...cakes, finalData as Cake]);
      }
      
      setShowCakeForm(false);
      setIsEditingCake(null);
      alert('Masterpiece archived successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save masterpiece.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCake = async (id: string) => {
    if (!confirm('Are you sure you want to delete this masterpiece from the archives?')) return;
    try {
      await setDoc(doc(db, 'cakes', id), { ...cakes.find(c => c.id === id), deleted: true }); // Soft delete or actual delete
      // Actually let's use deleteDoc if we want to be thorough
      // But let's stick to state for now to avoid accidental data loss if they don't have backups
      setCakes(cakes.filter(c => c.id !== id));
      alert('Masterpiece removed.');
    } catch (err) {
      console.error(err);
    }
  };

  const stats = [
    { 
      title: 'Gross Revenue', 
      value: `KES ${(orders.reduce((acc, o) => acc + (o.total || 0), 0) / 1000000).toFixed(1)}M`, 
      change: '+12.5%', icon: DollarSign, color: 'text-emerald', bg: 'bg-emerald/10' 
    },
    { 
      title: 'Total Orders', 
      value: orders.length.toString(), 
      change: '+18.2%', icon: ShoppingBag, color: 'text-ruby', bg: 'bg-ruby/10' 
    },
    { 
      title: 'Cake Inventory', 
      value: cakes.length.toString(), 
      change: '+5.4%', icon: Package, color: 'text-royal-blue', bg: 'bg-royal-blue/10' 
    },
    { 
      title: 'Pending Action', 
      value: orders.filter(o => o.status === 'pending').length.toString(), 
      change: '-1.2%', icon: Bell, color: 'text-royal-purple', bg: 'bg-royal-purple/10' 
    },
  ];

  const chartData = [
    { name: 'Mon', revenue: 4000 },
    { name: 'Tue', revenue: 3000 },
    { name: 'Wed', revenue: 5000 },
    { name: 'Thu', revenue: 2780 },
    { name: 'Fri', revenue: 6890 },
    { name: 'Sat', revenue: 9390 },
    { name: 'Sun', revenue: 4490 },
  ];

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50 font-sans">
       <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-royal-purple/20 border-t-royal-purple rounded-full animate-spin mx-auto" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Synchronizing Vault Data...</p>
       </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Material Pro Sidebar */}
      <aside className="w-80 bg-slate-950 text-white flex flex-col p-8 space-y-12 shrink-0">
         <div className="flex items-center space-x-4 px-2">
            <div className="w-12 h-12 bg-white-gold rounded-2xl flex items-center justify-center text-slate-900 shadow-xl">
               <Sparkles className="w-6 h-6" />
            </div>
            <div>
               <h1 className="text-xl font-serif font-bold italic tracking-tight">Mama J's</h1>
               <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500">Authority CMS V3.0</span>
            </div>
         </div>

         <nav className="flex-grow space-y-2">
            {[
              { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard, color: 'text-emerald' },
              { id: 'orders', label: 'Order Dossier', icon: ShoppingBag, color: 'text-ruby' },
              { id: 'inventory', label: 'Vault Inventory', icon: Package, color: 'text-royal-blue' },
              { id: 'site-settings', label: 'Site Settings', icon: Settings, color: 'text-white-gold' },
              { id: 'analytics', label: 'Market Intel', icon: BarChart3, color: 'text-royal-purple' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-4 p-4 rounded-2xl transition-all group ${
                  activeTab === item.id ? 'bg-white/10 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className={`w-5 h-5 ${activeTab === item.id ? item.color : 'group-hover:' + item.color}`} />
                <span className="text-[11px] font-bold uppercase tracking-widest">{item.label}</span>
              </button>
            ))}
         </nav>

         <div className="pt-8 border-t border-white/5">
            <button className="w-full flex items-center space-x-4 p-4 rounded-2xl text-slate-500 hover:text-ruby hover:bg-ruby/5 transition-all">
               <LogOut className="w-5 h-5" />
               <span className="text-[11px] font-bold uppercase tracking-widest">Terminate Session</span>
            </button>
         </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow overflow-y-auto p-12 bg-slate-50/50">
         {/* Top Header */}
         <header className="flex items-center justify-between mb-12">
            <div className="relative w-96">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
               <input placeholder="Search dossiers..." className="w-full pl-14 pr-8 py-4 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-royal-purple/5 transition-all text-sm font-medium" />
            </div>
            <div className="flex items-center space-x-6">
               <div className="relative">
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-ruby rounded-full border-2 border-slate-50" />
                  <Bell className="w-6 h-6 text-slate-400 hover:text-slate-950 transition-colors cursor-pointer" />
               </div>
               <div className="h-10 w-px bg-slate-200 mx-2" />
               <div className="flex items-center space-x-4">
                  <div className="text-right">
                     <p className="text-sm font-bold text-slate-950">Director Jane</p>
                     <p className="text-[9px] font-bold text-emerald uppercase tracking-widest">Master Artisan</p>
                  </div>
                  <div className="w-12 h-12 bg-slate-200 rounded-2xl overflow-hidden border-2 border-white shadow-lg">
                     <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200" alt="Avatar" referrerPolicy="no-referrer" />
                  </div>
               </div>
            </div>
         </header>

         <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                        <div className="flex justify-between items-start mb-8">
                          <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                              <stat.icon className="w-6 h-6" />
                          </div>
                          <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-[10px] font-bold ${stat.change.startsWith('+') ? 'bg-emerald/10 text-emerald' : 'bg-ruby/10 text-ruby'}`}>
                              {stat.change.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                              <span>{stat.change}</span>
                          </div>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{stat.title}</p>
                        <h3 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">{stat.value}</h3>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                      <div className="flex items-center justify-between mb-12">
                        <div>
                            <h3 className="text-xl font-serif font-bold italic text-slate-900">Revenue Trajectory</h3>
                            <p className="text-xs text-slate-400 font-medium">Weekly performance overview</p>
                        </div>
                      </div>
                      <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                              <defs>
                                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                  </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94A3B8'}} dy={10} />
                              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94A3B8'}} />
                              <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }} />
                              <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                      </div>
                  </div>

                  <div className="bg-slate-900 p-10 rounded-[3rem] text-white relative overflow-hidden flex flex-col">
                      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
                      <div className="relative z-10 flex-grow space-y-8">
                        <h3 className="text-2xl font-serif font-bold italic">Active Events</h3>
                        <div className="space-y-6">
                            {[
                              { label: 'Wedding Season', value: '85%', color: 'bg-emerald' },
                              { label: 'Corporate Gala', value: '42%', color: 'bg-white-gold' },
                              { label: 'Birthday Bash', value: '68%', color: 'bg-ruby' }
                            ].map(item => (
                              <div key={item.label} className="space-y-2">
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                    <span>{item.label}</span>
                                    <span>{item.value}</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className={`h-full ${item.color} rounded-full`} style={{ width: item.value }} />
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div 
                key="orders"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm"
              >
                <div className="flex items-center justify-between mb-12">
                   <h3 className="text-xl font-serif font-bold italic text-slate-900">Order Dossier</h3>
                   <div className="flex space-x-4">
                      <button className="px-6 py-2 bg-slate-50 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-slate-100 transition-all">Filter: All</button>
                      <button className="px-6 py-2 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-emerald transition-all">Export Archive</button>
                   </div>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead>
                         <tr className="border-b border-slate-50">
                            <th className="pb-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Patron</th>
                            <th className="pb-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Event</th>
                            <th className="pb-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Valuation</th>
                            <th className="pb-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Payment</th>
                            <th className="pb-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                            <th className="pb-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Dossier</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                         {orders.map((order) => (
                           <tr key={order.id} className="group hover:bg-slate-50/50 transition-colors">
                              <td className="py-6">
                                 <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs uppercase">
                                       {order.name?.charAt(0)}
                                    </div>
                                    <div>
                                       <p className="text-sm font-bold text-slate-950">{order.name}</p>
                                       <p className="text-[10px] text-slate-400">{order.phone}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="py-6">
                                 <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{order.eventType}</p>
                                 <p className="text-[9px] text-slate-400 italic">{order.eventDate}</p>
                              </td>
                              <td className="py-6 text-sm font-bold text-slate-950">
                                 KES {order.total?.toLocaleString()}
                              </td>
                              <td className="py-6">
                                 <span className={`px-4 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-widest ${
                                   order.paymentStatus === 'fully-paid' ? 'bg-emerald/10 text-emerald' : 'bg-ruby/10 text-ruby'
                                 }`}>
                                    {order.paymentStatus}
                                 </span>
                              </td>
                              <td className="py-6">
                                 <span className={`px-4 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-widest bg-slate-100 text-slate-600`}>
                                    {order.status}
                                 </span>
                              </td>
                              <td className="py-6 text-right">
                                 <button className="p-2 text-slate-300 hover:text-slate-950 transition-colors">
                                    <MoreVertical className="w-5 h-5" />
                                 </button>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'inventory' && (
              <motion.div 
                key="inventory"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-12"
              >
                <div className="flex items-center justify-between bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                   <div>
                      <h3 className="text-2xl font-serif font-bold italic text-slate-900">Vault Inventory</h3>
                      <p className="text-xs text-slate-400 font-medium">Manage your artisanal cake collection</p>
                   </div>
                   <button 
                    onClick={() => setShowCakeForm(true)}
                    className="flex items-center space-x-3 px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-emerald transition-all shadow-xl"
                   >
                      <Plus className="w-4 h-4" />
                      <span>Add Masterpiece</span>
                   </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {cakes.map(cake => (
                     <div key={cake.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                        <div className="relative h-60">
                           <img src={cake.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" alt={cake.name} referrerPolicy="no-referrer" />
                           <div className="absolute top-4 right-4 flex space-x-2">
                              <button 
                                onClick={() => {
                                  setIsEditingCake(cake);
                                  setFormData(cake);
                                  setShowCakeForm(true);
                                }}
                                className="w-8 h-8 bg-white/90 backdrop-blur rounded-lg flex items-center justify-center text-slate-600 hover:text-emerald transition-colors shadow-lg"
                              >
                                 <Settings className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteCake(cake.id)}
                                className="w-8 h-8 bg-white/90 backdrop-blur rounded-lg flex items-center justify-center text-slate-600 hover:text-ruby transition-colors shadow-lg"
                              >
                                 <Trash2 className="w-4 h-4" />
                              </button>
                           </div>
                        </div>
                        <div className="p-8 space-y-4">
                           <div className="flex justify-between items-start">
                              <h4 className="text-xl font-serif font-bold italic text-slate-900">{cake.name}</h4>
                              <span className="text-sm font-bold text-emerald">KES {cake.price?.toLocaleString()}</span>
                           </div>
                           <div className="flex flex-wrap gap-2">
                              {cake.eventCategories?.slice(0, 3).map(evt => (
                                <span key={evt} className="text-[8px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md">{evt}</span>
                              ))}
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
              </motion.div>
            )}
            
            {activeTab === 'site-settings' && settings && (
              <motion.div 
                key="site-settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12 pb-20"
              >
                <div className="flex items-center justify-between bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                   <div>
                      <h3 className="text-2xl font-serif font-bold italic text-slate-900">Site Configuration</h3>
                      <p className="text-xs text-slate-400 font-medium">Manage global content and business rules</p>
                   </div>
                   <button 
                    onClick={saveSettings}
                    disabled={isSavingSettings}
                    className="flex items-center space-x-3 px-8 py-4 bg-emerald text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-emerald/90 transition-all shadow-xl disabled:opacity-50"
                   >
                      {isSavingSettings ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                      <span>Save All Changes</span>
                   </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                   {/* Hero Slides Management */}
                   <div className="lg:col-span-8 space-y-8">
                      <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                         <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center space-x-4">
                               <div className="w-12 h-12 bg-white-gold/10 text-white-gold rounded-2xl flex items-center justify-center">
                                  <ImageIcon className="w-6 h-6" />
                               </div>
                               <h4 className="text-xl font-serif font-bold italic">Hero Banner Slides</h4>
                            </div>
                            <button 
                              onClick={() => {
                                const newSlide: HeroSlide = {
                                  id: Date.now().toString(),
                                  title: "New Celebration",
                                  subtitle: "Special Moment",
                                  desc: "Describe this amazing masterpiece...",
                                  image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
                                  color: "text-white-gold",
                                  accent: "bg-white-gold"
                                };
                                setSettings({...settings, heroSlides: [...settings.heroSlides, newSlide]});
                              }}
                              className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-all"
                            >
                               <Plus className="w-5 h-5" />
                            </button>
                         </div>

                         <div className="space-y-6">
                            {settings.heroSlides.map((slide, idx) => (
                              <div key={slide.id} className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 group">
                                 <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                                    <div className="md:col-span-4 relative h-40 rounded-2xl overflow-hidden shadow-lg">
                                       <img src={slide.image} className="w-full h-full object-cover" alt="Slide" referrerPolicy="no-referrer" />
                                       <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                          <button className="p-3 bg-white text-slate-900 rounded-xl shadow-2xl">
                                             <Upload className="w-5 h-5" />
                                          </button>
                                       </div>
                                    </div>
                                    <div className="md:col-span-8 space-y-4">
                                       <div className="flex justify-between items-start">
                                          <input 
                                            value={slide.title}
                                            onChange={e => {
                                              const newSlides = [...settings.heroSlides];
                                              newSlides[idx].title = e.target.value;
                                              setSettings({...settings, heroSlides: newSlides});
                                            }}
                                            className="bg-transparent border-b border-slate-200 focus:border-emerald outline-none font-serif font-bold text-xl w-full mr-4" 
                                          />
                                          <button 
                                            onClick={() => {
                                              const newSlides = settings.heroSlides.filter(s => s.id !== slide.id);
                                              setSettings({...settings, heroSlides: newSlides});
                                            }}
                                            className="text-slate-300 hover:text-ruby transition-colors"
                                          >
                                             <Trash2 className="w-5 h-5" />
                                          </button>
                                       </div>
                                       <input 
                                          value={slide.subtitle}
                                          onChange={e => {
                                            const newSlides = [...settings.heroSlides];
                                            newSlides[idx].subtitle = e.target.value;
                                            setSettings({...settings, heroSlides: newSlides});
                                          }}
                                          placeholder="Subtitle"
                                          className="bg-transparent border-b border-slate-200 focus:border-emerald outline-none text-[10px] font-bold uppercase tracking-widest text-slate-400 w-full" 
                                       />
                                       <textarea 
                                          value={slide.desc}
                                          onChange={e => {
                                            const newSlides = [...settings.heroSlides];
                                            newSlides[idx].desc = e.target.value;
                                            setSettings({...settings, heroSlides: newSlides});
                                          }}
                                          className="bg-transparent border-b border-slate-200 focus:border-emerald outline-none text-sm text-slate-500 w-full h-20 resize-none font-light italic" 
                                       />
                                       <input 
                                          value={slide.image}
                                          onChange={e => {
                                            const newSlides = [...settings.heroSlides];
                                            newSlides[idx].image = e.target.value;
                                            setSettings({...settings, heroSlides: newSlides});
                                          }}
                                          placeholder="Image URL"
                                          className="bg-transparent border-b border-slate-200 focus:border-emerald outline-none text-[10px] text-slate-300 w-full" 
                                       />
                                    </div>
                                 </div>
                              </div>
                            ))}
                         </div>
                      </div>
                   </div>

                   {/* Right Sidebar: Delivery & Contact */}
                   <div className="lg:col-span-4 space-y-8">
                      <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
                         <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-emerald/10 text-emerald rounded-2xl flex items-center justify-center">
                               <MapPin className="w-6 h-6" />
                            </div>
                            <h4 className="text-xl font-serif font-bold italic">Delivery Fees</h4>
                         </div>
                         <div className="space-y-6">
                            <div className="space-y-2">
                               <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Nairobi & Environs (KES)</label>
                               <input 
                                 type="number"
                                 value={settings.deliveryFees.nairobi}
                                 onChange={e => setSettings({...settings, deliveryFees: {...settings.deliveryFees, nairobi: parseInt(e.target.value)}})}
                                 className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald/5 font-bold"
                               />
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Outside Nairobi (KES)</label>
                               <input 
                                 type="number"
                                 value={settings.deliveryFees.outsideNairobi}
                                 onChange={e => setSettings({...settings, deliveryFees: {...settings.deliveryFees, outsideNairobi: parseInt(e.target.value)}})}
                                 className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald/5 font-bold"
                               />
                            </div>
                         </div>
                      </div>

                      <div className="bg-slate-900 p-10 rounded-[3rem] text-white space-y-8 relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-40 h-40 bg-white-gold/10 blur-[50px] rounded-full translate-x-1/2 -translate-y-1/2" />
                         <div className="relative z-10 space-y-8">
                            <div className="flex items-center space-x-4">
                               <div className="w-12 h-12 bg-white/10 text-white-gold rounded-2xl flex items-center justify-center border border-white/10">
                                  <Phone className="w-6 h-6" />
                               </div>
                               <h4 className="text-xl font-serif font-bold italic">Contact Node</h4>
                            </div>
                            <div className="space-y-6">
                               <div className="space-y-2">
                                  <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">Phone Hotline</label>
                                  <input 
                                    value={settings.contactInfo.phone}
                                    onChange={e => setSettings({...settings, contactInfo: {...settings.contactInfo, phone: e.target.value}})}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-white-gold text-sm"
                                  />
                               </div>
                               <div className="space-y-2">
                                  <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">Email Address</label>
                                  <input 
                                    value={settings.contactInfo.email}
                                    onChange={e => setSettings({...settings, contactInfo: {...settings.contactInfo, email: e.target.value}})}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-white-gold text-sm"
                                  />
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}
         </AnimatePresence>

          {/* Cake Management Modal */}
          <AnimatePresence>
            {showCakeForm && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowCakeForm(false)}
                  className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
                />
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-3xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                  <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                      <h2 className="text-3xl font-serif font-bold italic text-slate-900">
                        {isEditingCake ? 'Refine Masterpiece' : 'New Creation'}
                      </h2>
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Vault Entry Dossier</p>
                    </div>
                    <button onClick={() => setShowCakeForm(false)} className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-ruby transition-all shadow-sm">
                      <Plus className="w-6 h-6 rotate-45" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveCake} className="flex-grow overflow-y-auto p-12 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Name of Creation</label>
                        <input 
                          required
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                          className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-royal-purple/5 font-serif font-bold text-lg" 
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Base Valuation (KES)</label>
                        <input 
                          type="number"
                          required
                          value={formData.price}
                          onChange={e => setFormData({...formData, price: parseInt(e.target.value)})}
                          className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald/5 font-bold text-lg" 
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Artistic Description</label>
                      <textarea 
                        required
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        className="w-full px-8 py-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-royal-purple/5 text-sm h-32 resize-none font-light italic" 
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Primary Image URL</label>
                        <div className="flex space-x-4">
                          <div className="flex-grow">
                            <input 
                              required
                              value={formData.imageUrl}
                              onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                              className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald/5 text-xs font-mono" 
                            />
                          </div>
                          {formData.imageUrl && (
                            <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200">
                              <img src={formData.imageUrl} className="w-full h-full object-cover" alt="Preview" referrerPolicy="no-referrer" />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Artisan Detail URL (Zoomed Texture)</label>
                        <div className="flex space-x-4">
                          <div className="flex-grow">
                            <input 
                              value={formData.artisanDetailUrl}
                              onChange={e => setFormData({...formData, artisanDetailUrl: e.target.value})}
                              placeholder="Optional high-detail image..."
                              className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-ruby/5 text-xs font-mono" 
                            />
                          </div>
                          {formData.artisanDetailUrl && (
                            <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200">
                              <img src={formData.artisanDetailUrl} className="w-full h-full object-cover" alt="Detail Preview" referrerPolicy="no-referrer" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-6">
                      <button 
                        type="button"
                        onClick={() => setShowCakeForm(false)}
                        className="py-5 bg-slate-50 text-slate-500 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-100 transition-all"
                      >
                        Abort Entry
                      </button>
                      <button 
                        type="submit"
                        className="md:col-span-2 py-5 bg-slate-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald transition-all shadow-2xl flex items-center justify-center space-x-3"
                      >
                        <Save className="w-4 h-4" />
                        <span>Archive Masterpiece to Vault</span>
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
      </main>
    </div>
  );
}
