
import React, { useState, useEffect } from 'react';
import { ViewState, Product, CartItem, Order, AuthState, PaymentMethod, Language, UserProfile, Pharmacist, Clinic, LabTest, AuditLog, OrderStatus, BlogArticle } from './types';
import { MOCK_PRODUCTS, MOCK_PHARMACISTS, MOCK_CLINICS, MOCK_LAB_TESTS, MOCK_BLOGS, MOCK_NEWS } from './constants';
import Navbar from './components/Navbar';
import StaffDashboard from './components/Dashboard';
import UserDashboard from './components/UserDashboard';
import LoginPage from './components/LoginPage';
import { 
  ShoppingBag, Activity, Package, X, Clock, ShieldCheck, HeartPulse, BrainCircuit, 
  CheckCircle2, FileText, ArrowRight, Trash2, Loader2, Zap, Stethoscope, Microscope, 
  Heart, AlertCircle, Info, Sparkles, User as UserIcon, QrCode, Search, Building2, 
  FlaskConical, Users, Mic, MicOff, Volume2, HelpCircle, ArrowLeft, Info as InfoIcon, 
  Stethoscope as DoctorIcon, UserCheck, Play, Repeat, Star, MapPin, Video, Phone,
  MessageSquareText, BadgeCheck, PhoneCall, Calendar, Truck, Store, Coffee,
  LogOut, Newspaper, BookOpen, RotateCcw
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getHealthAdvice } from './services/geminiService';

const INITIAL_USER: UserProfile = {
  name: "Arjun Sharma",
  email: "arjun.sharma@outlook.com",
  phone: "+91 98765 43210",
  bloodType: "B+",
  allergies: ["Paracetamol", "Dust"],
  lastCheckup: "Jan 12, 2024",
  membership: "Premium",
  notificationSettings: { whatsapp: true, email: true, sms: false },
  addresses: ["A-402, Seawoods Grand Central, Sector 40, Nerul, Navi Mumbai 400706"],
  weight: 75,
  age: 32,
  insuranceProvider: "TATA AIG",
  insurancePolicyNumber: "POL-8821992"
};

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(() => (localStorage.getItem('healthhub_last_view') as ViewState) || 'home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [auth, setAuth] = useState<AuthState>(() => {
    const saved = localStorage.getItem('healthhub_auth');
    return saved ? JSON.parse(saved) : { isLoggedIn: false, role: null };
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  
  const [isLargeFont, setIsLargeFont] = useState<boolean>(() => localStorage.getItem('healthhub_large_font') === 'true');
  const [isAssistedMode, setIsAssistedMode] = useState<boolean>(() => localStorage.getItem('healthhub_assisted_mode') === 'true');
  const [accessibility, setAccessibility] = useState<boolean>(() => localStorage.getItem('healthhub_accessibility') === 'true');
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem('healthhub_lang') as Language) || 'en');

  const [isListening, setIsListening] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiChat, setAiChat] = useState<{ role: 'user' | 'ai'; text: string }[]>([{ role: 'ai', text: 'Namaste! I am your HealthHub Assistant. How can I help you today?' }]);
  const [aiInput, setAiInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('UPI');
  const [orderType, setOrderType] = useState<'delivery' | 'takeaway'>('delivery');
  const [videoModal, setVideoModal] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('healthhub_last_view', view);
    localStorage.setItem('healthhub_large_font', isLargeFont.toString());
    localStorage.setItem('healthhub_assisted_mode', isAssistedMode.toString());
    localStorage.setItem('healthhub_accessibility', accessibility.toString());
    localStorage.setItem('healthhub_lang', language);
  }, [view, isLargeFont, isAssistedMode, accessibility, language]);

  useEffect(() => {
    const savedOrders = localStorage.getItem('healthhub_orders');
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    const savedLogs = localStorage.getItem('healthhub_audit_logs');
    if (savedLogs) setAuditLogs(JSON.parse(savedLogs));
  }, []);

  const createAuditLog = (action: AuditLog['action'], details: string, entityId: string) => {
    const newLog: AuditLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      action,
      staffId: 'STF- Sarah V.',
      entityId,
      details,
      securityHash: 'SHA256-' + Math.random().toString(36).substr(2, 9).toUpperCase()
    };
    const updated = [newLog, ...auditLogs];
    setAuditLogs(updated);
    localStorage.setItem('healthhub_audit_logs', JSON.stringify(updated));
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    const updated = orders.map(o => o.id === orderId ? { ...o, status } : o);
    setOrders(updated);
    localStorage.setItem('healthhub_orders', JSON.stringify(updated));
    createAuditLog('VERIFY_PRESCRIPTION', `Status updated to ${status}`, orderId);
  };

  const handleDispense = (orderId: string) => {
    const updated = orders.map(o => o.id === orderId ? { ...o, status: 'delivered' as OrderStatus, dispensedBy: 'STF- Sarah V.' } : o);
    setOrders(updated);
    localStorage.setItem('healthhub_orders', JSON.stringify(updated));
    createAuditLog('DISPENSE', 'Units dispensed.', orderId);
  };

  const handleLogin = (role: 'user' | 'staff') => {
    const newAuth: AuthState = { isLoggedIn: true, role };
    setAuth(newAuth);
    localStorage.setItem('healthhub_auth', JSON.stringify(newAuth));
    setView(role === 'user' ? 'user-dashboard' : 'staff-dashboard');
  };

  const handleSignOut = () => {
    const newAuth: AuthState = { isLoggedIn: false, role: null };
    setAuth(newAuth);
    localStorage.removeItem('healthhub_auth');
    setView('home');
  };

  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Voice search not supported.");
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      setSearchQuery(event.results[0][0].transcript);
      setView('shop');
    };
    recognition.start();
  };

  const handleAddToCart = (product: Product) => {
    const existing = cart.find(i => i.id === product.id);
    if (existing) {
      setCart(cart.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    setView('cart');
  };

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const newOrder: Order = {
        id: 'TRX-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        items: [...cart],
        total: cart.reduce((a, b) => a + b.price * b.quantity, 0) * 1.12 + 50,
        status: 'confirmed',
        type: orderType,
        date: new Date().toISOString(),
        customerName: INITIAL_USER.name,
        paymentMethod: selectedPayment,
        autoRefill: false,
        deliveryEstimate: orderType === 'delivery' ? '35 mins' : 'Ready in 10 mins'
      };
      const updated = [newOrder, ...orders];
      setOrders(updated);
      localStorage.setItem('healthhub_orders', JSON.stringify(updated));
      setCart([]);
      setIsProcessing(false);
      setView('user-dashboard');
    }, 1500);
  };

  const renderContent = () => {
    switch (view) {
      case 'home': return <HomeView setView={setView} startVoice={startVoiceSearch} isListening={isListening} isAssisted={isAssistedMode} />;
      case 'login': return <LoginPage onLogin={handleLogin} />;
      case 'shop': return <ShopView searchQuery={searchQuery} setSearchQuery={setSearchQuery} startVoice={startVoiceSearch} isListening={isListening} onAdd={handleAddToCart} onViewDetails={(p: Product) => { setSelectedProduct(p); setView('product-details'); }} isAssisted={isAssistedMode} />;
      case 'product-details': return selectedProduct ? <ProductDetailsView product={selectedProduct} setView={setView} onAdd={handleAddToCart} onViewDetails={(p: Product) => { setSelectedProduct(p); setView('product-details'); }} /> : null;
      case 'clinics': return <ClinicsView clinics={MOCK_CLINICS} />;
      case 'labs': return <LabsView labTests={MOCK_LAB_TESTS} />;
      case 'blog': return <BlogView blogs={MOCK_BLOGS} />;
      case 'consult': return <ConsultView pharmacists={MOCK_PHARMACISTS} onChat={() => setView('ai-assistant')} />;
      case 'cart': return <CartView cart={cart} setView={setView} updateQty={(id: string, d: number) => setCart(cart.map(i => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + d) } : i))} remove={(id: string) => setCart(cart.filter(i => i.id !== id))} orderType={orderType} setOrderType={setOrderType} />;
      case 'checkout': return <CheckoutView total={cart.reduce((a, b) => a + b.price * b.quantity, 0) * 1.12 + 50} onPay={handlePlaceOrder} isProcessing={isProcessing} paymentMethod={selectedPayment} setPaymentMethod={setSelectedPayment} orderType={orderType} />;
      case 'user-dashboard': return <UserDashboard orders={orders} onViewOrder={(o) => { setSelectedOrder(o); setView(o.status === 'delivered' ? 'smart-pack' : 'user-dashboard'); }} onNavigateToShop={() => setView('shop')} onNavigateToAi={() => setView('ai-assistant')} onReorder={(o) => { setCart(o.items); setView('cart'); }} />;
      case 'staff-dashboard': return <StaffDashboard orders={orders} onUpdateStatus={handleUpdateOrderStatus} onDispense={handleDispense} auditLogs={auditLogs} />;
      case 'smart-pack': return selectedOrder ? <SmartPackView order={selectedOrder} setView={setView} onRefill={handleAddToCart} onShowVideo={setVideoModal} /> : null;
      case 'ai-assistant': return <AiChatView chat={aiChat} setChat={setAiChat} input={aiInput} setInput={setAiInput} isLoading={isAiLoading} setLoading={setIsAiLoading} />;
      default: return <HomeView setView={setView} startVoice={startVoiceSearch} isListening={isListening} isAssisted={isAssistedMode} />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-500 ${isLargeFont ? 'large-font' : ''} ${accessibility ? 'grayscale' : ''}`}>
      <Navbar 
        currentView={view} 
        setView={setView} 
        cartCount={cart.length} 
        userRole={auth.role || 'user'} 
        isLoggedIn={auth.isLoggedIn}
        onSignOut={handleSignOut}
        language={language} 
        setLanguage={setLanguage} 
        isLargeFont={isLargeFont} 
        setIsLargeFont={setIsLargeFont} 
        isAssistedMode={isAssistedMode} 
        setIsAssistedMode={setIsAssistedMode} 
        accessibility={accessibility} 
        setAccessibility={setAccessibility} 
      />
      <main className="flex-1 bg-white">{renderContent()}</main>
      <Footer setView={setView} />
      {videoModal && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-xl">
          <div className="w-full max-w-4xl bg-black rounded-[4rem] overflow-hidden shadow-2xl relative aspect-video">
            <button onClick={() => setVideoModal(null)} className="absolute top-8 right-8 z-10 p-4 bg-white/10 text-white rounded-2xl hover:bg-white/20 transition-all"><X size={24} /></button>
            <iframe className="w-full h-full" src={videoModal} frameBorder="0" allowFullScreen title="Usage Guide"></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

const HomeView = ({ setView, startVoice, isListening }: any) => (
  <div className="animate-fadeIn">
    <section className="relative h-[90vh] flex items-center px-12 bg-slate-900 mx-8 mt-4 rounded-[5rem] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-600/30 via-slate-900 to-slate-900"></div>
      <div className="relative z-10 max-w-4xl">
         <h1 className="text-8xl lg:text-9xl font-black text-white leading-[0.85] tracking-tighter mb-12">Clinical <br /><span className="text-emerald-400">Excellence.</span></h1>
         <p className="text-slate-400 text-2xl font-bold mb-16 max-w-2xl leading-relaxed italic">Verified batches. Expert pharmacists. The most trusted pharmaceutical node in India.</p>
         <div className="flex flex-wrap gap-8">
            <button onClick={() => setView('shop')} className="bg-white text-slate-900 px-16 py-8 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-emerald-500 hover:text-white transition-all transform hover:-translate-y-2">Order Medicines</button>
            <button onClick={startVoice} className={`bg-indigo-600 text-white px-12 py-8 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl flex items-center gap-4 transition-all ${isListening ? 'scale-110 shadow-indigo-500/50' : 'hover:-translate-y-2'}`}>
               {isListening ? <MicOff /> : <Mic />} {isListening ? 'Listening...' : 'Voice Search'}
            </button>
         </div>
      </div>
      <div className="absolute right-[-10%] bottom-[-10%] opacity-10 animate-float hidden xl:block">
         <Activity size={800} strokeWidth={1} className="text-white" />
      </div>
    </section>

    {/* Medicine News Section */}
    <section className="max-w-7xl mx-auto px-8 py-32 space-y-16">
      <div className="flex justify-between items-end">
        <h2 className="text-6xl font-black tracking-tighter">Clinical News Feed</h2>
        <button onClick={() => setView('blog')} className="text-emerald-600 font-black uppercase text-xs tracking-widest flex items-center gap-2">View Archive <ArrowRight size={16} /></button>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        {MOCK_NEWS.map(news => (
          <div key={news.id} className="bg-slate-50 p-12 rounded-[4rem] border border-slate-100 group hover:bg-white hover:shadow-2xl transition-all">
            <div className="flex justify-between items-start mb-8">
              <span className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest">{news.tag}</span>
              <span className="text-slate-400 font-bold text-xs">{news.date}</span>
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-6 group-hover:text-indigo-600 transition-colors">{news.title}</h3>
            <p className="text-slate-500 font-medium leading-relaxed">{news.summary}</p>
          </div>
        ))}
      </div>
    </section>
  </div>
);

const BlogView = ({ blogs }: { blogs: BlogArticle[] }) => (
  <div className="max-w-7xl mx-auto px-8 py-20 animate-fadeIn space-y-16">
    <h1 className="text-7xl font-black text-slate-900 tracking-tighter">Clinical Knowledge Base</h1>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
      {blogs.map(blog => (
        <div key={blog.id} className="bg-white rounded-[4rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-3xl transition-all group cursor-pointer">
          <div className="h-64 overflow-hidden relative">
            <img src={blog.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="" />
            <div className="absolute top-6 left-6 bg-emerald-500 text-white px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg">{blog.category}</div>
          </div>
          <div className="p-10 space-y-6">
            <h3 className="text-2xl font-black text-slate-900 leading-tight group-hover:text-emerald-600 transition-colors">{blog.title}</h3>
            <p className="text-slate-500 font-bold italic line-clamp-3">{blog.excerpt}</p>
            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-[10px]">{blog.author.split(' ').map(n => n[0]).join('')}</div>
                <div>
                  <p className="text-xs font-black text-slate-900">{blog.author}</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{blog.date}</p>
                </div>
              </div>
              {blog.verifiedBy && <div className="flex items-center gap-1 text-emerald-500 font-black text-[9px] uppercase tracking-widest"><ShieldCheck size={12} /> {blog.verifiedBy}</div>}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ShopView = ({ searchQuery, setSearchQuery, startVoice, isListening, onAdd, onViewDetails }: any) => {
  const filtered = MOCK_PRODUCTS.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.activeIngredient.toLowerCase().includes(searchQuery.toLowerCase()));
  return (
    <div className="max-w-7xl mx-auto px-8 py-20 animate-fadeIn space-y-20">
      <div className="relative group max-w-3xl">
        <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search medicine or active salt..." className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] py-8 pl-16 pr-24 font-bold focus:border-indigo-400 focus:bg-white outline-none shadow-sm transition-all" />
        <button onClick={startVoice} className={`absolute right-4 top-1/2 -translate-y-1/2 p-4 rounded-full transition-all ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'}`}>{isListening ? <MicOff /> : <Mic />}</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
        {filtered.map(p => <ProductCard key={p.id} product={p} onAdd={onAdd} onViewDetails={onViewDetails} />)}
      </div>
    </div>
  );
};

const ProductCard = ({ product, onAdd, onViewDetails }: any) => (
  <div className="bg-white border border-slate-100 rounded-[3rem] overflow-hidden group hover:shadow-3xl transition-all duration-700 flex flex-col tilt-card">
    <div className="relative aspect-[4/5] overflow-hidden bg-slate-50 cursor-pointer" onClick={() => onViewDetails(product)}>
      <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="" />
      <div className="absolute top-6 right-6 p-4 bg-white/80 backdrop-blur-md rounded-2xl opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0"><Info size={24} className="text-slate-900" /></div>
      {product.requiresPrescription && <div className="absolute top-6 left-6 bg-rose-500 text-white px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg"><FileText size={12} /> RX Req.</div>}
    </div>
    <div className="p-8 flex-1 flex flex-col">
      <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-emerald-600 transition-colors">{product.name}</h3>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2"><FlaskConical size={12} /> {product.activeIngredient}</p>
      <div className="mt-auto flex items-center justify-between pt-8 border-t border-slate-50">
        <span className="text-3xl font-black text-slate-900">₹{product.price}</span>
        <button onClick={() => onAdd(product)} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-600 transition-all shadow-xl">Add</button>
      </div>
    </div>
  </div>
);

const ProductDetailsView = ({ product, setView, onAdd, onViewDetails }: any) => {
  const alternatives = MOCK_PRODUCTS.filter(p => p.activeIngredient === product.activeIngredient && p.id !== product.id);

  return (
    <div className="max-w-7xl mx-auto px-8 py-20 animate-fadeIn space-y-20">
      <button onClick={() => setView('shop')} className="flex items-center gap-3 text-slate-400 hover:text-slate-900 font-black text-[10px] uppercase tracking-widest transition-colors"><ArrowLeft size={18} /> Back to Shop Node</button>
      <div className="grid lg:grid-cols-2 gap-20 items-start">
        <div className="aspect-[4/5] bg-slate-50 rounded-[4rem] overflow-hidden shadow-2xl border border-slate-100"><img src={product.image} className="w-full h-full object-cover" alt="" /></div>
        <div className="space-y-12">
          <div className="space-y-4">
            <span className="bg-emerald-50 text-emerald-600 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest">{product.category}</span>
            <h1 className="text-7xl font-black text-slate-900 tracking-tighter leading-none">{product.name}</h1>
            <p className="text-2xl font-bold text-slate-400 italic">By {product.brand}</p>
          </div>
          <div className="p-12 bg-slate-900 rounded-[4rem] text-white flex justify-between items-center shadow-3xl relative overflow-hidden group">
            <div className="relative z-10"><p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Patient Price</p><p className="text-7xl font-black">₹{product.price}</p></div>
            <button onClick={() => onAdd(product)} className="relative z-10 bg-emerald-500 text-white px-16 py-8 rounded-[2.5rem] font-black uppercase tracking-widest shadow-2xl hover:bg-white hover:text-slate-900 transition-all transform hover:scale-105">Add to Basket</button>
            <Activity className="absolute bottom-[-50px] right-[-50px] opacity-10 w-64 h-64 group-hover:scale-125 transition-transform duration-1000" />
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <section className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm"><h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2"><Zap size={14} className="text-amber-500" /> Active Salt Node</h3><p className="text-2xl font-black text-slate-900">{product.activeIngredient}</p></section>
            <section className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm"><h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2"><Clock size={14} className="text-indigo-500" /> Expiry Surveil</h3><p className="text-2xl font-black text-slate-900">{product.expiryDate}</p></section>
          </div>
          <section className="space-y-6 bg-slate-50 p-10 rounded-[4rem] border border-slate-100"><h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><AlertCircle size={14} className="text-rose-500" /> Clinical Description</h3><p className="text-slate-500 font-bold leading-relaxed text-lg">{product.description}</p></section>
        </div>
      </div>

      {/* Alternative Medicines Section */}
      <section className="pt-20 space-y-12">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-5xl font-black tracking-tighter">Clinically Equivalent Alternatives</h2>
            <p className="text-slate-400 font-bold mt-2 italic text-xl">Swapping to potential generic or alternative nodes with the same active salt.</p>
          </div>
        </div>
        {alternatives.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {alternatives.map(alt => (
              <div key={alt.id} className="bg-white p-8 rounded-[3.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all flex items-center gap-6 group">
                <img src={alt.image} className="w-24 h-24 rounded-[2rem] object-cover shadow-lg group-hover:scale-105 transition-transform" alt="" />
                <div className="flex-1 space-y-1">
                  <h4 className="text-xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors">{alt.name}</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500">{alt.brand}</p>
                  <p className="text-2xl font-black text-slate-900 mt-2">₹{alt.price}</p>
                  <div className="flex gap-2 pt-2">
                    <button onClick={() => onViewDetails(alt)} className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-2xl font-black uppercase text-[9px] tracking-widest hover:bg-slate-200 transition-all">View Node</button>
                    <button onClick={() => onAdd(alt)} className="flex-1 bg-emerald-600 text-white py-3 rounded-2xl font-black uppercase text-[9px] tracking-widest hover:bg-slate-900 transition-all shadow-lg">Swap & Add</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200 text-center">
             <p className="text-slate-400 font-bold italic">No alternative salt nodes detected in the current inventory registry.</p>
          </div>
        )}
      </section>
      
      {product.clinicalInsights && (
        <section className="pt-32 border-t border-slate-100 animate-fadeIn">
          <h2 className="text-5xl font-black tracking-tighter mb-16">Clinical Telemetry</h2>
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="bg-white p-10 rounded-[4rem] border border-slate-100 shadow-sm flex flex-col items-center">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-10">Patient Sentiment Node</h4>
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={product.clinicalInsights.ratingStats}>
                    <XAxis dataKey="stars" tick={{fontSize: 10, fontWeight: 900}} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{borderRadius: '24px', border: 'none'}} />
                    <Bar dataKey="count" fill="#10b981" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white p-10 rounded-[4rem] border border-slate-100 shadow-sm flex flex-col items-center">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-10">Side Effect Frequency</h4>
               <div className="w-full h-64">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie data={product.clinicalInsights.sideEffectStats} dataKey="percentage" nameKey="effect" cx="50%" cy="50%" innerRadius={60} outerRadius={80}>
                       {product.clinicalInsights.sideEffectStats.map((_, i) => <Cell key={i} fill={['#10b981', '#6366f1', '#f59e0b', '#ef4444'][i % 4]} />)}
                     </Pie>
                     <Tooltip contentStyle={{borderRadius: '24px', border: 'none'}} />
                   </PieChart>
                 </ResponsiveContainer>
               </div>
            </div>
            <div className="bg-emerald-600 p-12 rounded-[4rem] text-white flex flex-col justify-center shadow-3xl">
               <div className="flex items-center gap-4 mb-8"><Stethoscope size={40} /><h4 className="text-xl font-black uppercase tracking-widest">Trust Index</h4></div>
               <p className="text-7xl font-black mb-4">{product.clinicalInsights.doctorApprovalRate}%</p>
               <p className="text-xs font-bold opacity-80 uppercase tracking-widest leading-relaxed">Verified doctor approval rate across {product.clinicalInsights.prescriptionsLastMonth.toLocaleString()} prescriptions last month.</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

const ClinicsView = ({ clinics }: any) => (
  <div className="max-w-7xl mx-auto px-8 py-20 animate-fadeIn space-y-16">
    <div className="flex flex-col md:flex-row justify-between items-end gap-6">
       <div><h1 className="text-7xl font-black text-slate-900 tracking-tighter">Clinical Nodes</h1><p className="text-slate-400 text-2xl font-bold mt-2 italic">Verified primary and specialized care directory.</p></div>
       <div className="flex gap-4"><button className="bg-slate-900 text-white px-8 py-4 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-xl">Nearest To Me</button></div>
    </div>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
      {clinics.map((c: Clinic) => (
        <div key={c.id} className="bg-white rounded-[4rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-3xl transition-all duration-700 group tilt-card">
          <div className="relative h-72 overflow-hidden"><img src={c.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="" /><div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 font-black text-xs text-slate-900"><Star size={16} fill="currentColor" className="text-amber-500" /> {c.rating}</div></div>
          <div className="p-10 space-y-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-xl border border-emerald-100">{c.specialty}</span>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">{c.name}</h3>
            <div className="flex items-center gap-4 text-slate-500 font-bold italic"><DoctorIcon size={20} className="text-slate-300" /> {c.doctorName}</div>
            <div className="flex items-center gap-4 text-slate-400 font-medium text-sm"><MapPin size={18} className="text-slate-200" /> {c.address}</div>
            <button className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black uppercase tracking-widest text-[10px] hover:bg-emerald-600 transition-all shadow-xl group-hover:-translate-y-2">Book Consultation</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const LabsView = ({ labTests }: any) => (
  <div className="max-w-7xl mx-auto px-8 py-20 animate-fadeIn space-y-16">
    <div className="flex flex-col md:flex-row justify-between items-end gap-6">
       <div><h1 className="text-7xl font-black text-slate-900 tracking-tighter">Lab Telemetry</h1><p className="text-slate-400 text-2xl font-bold mt-2 italic">Diagnostic nodes for baseline health monitoring.</p></div>
       <div className="flex gap-4"><button className="bg-indigo-600 text-white px-8 py-4 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-xl">Package Deals</button></div>
    </div>
    <div className="bg-white rounded-[4rem] border border-slate-100 overflow-hidden shadow-sm">
      <table className="w-full text-left">
        <thead className="bg-slate-50 border-b border-slate-100"><tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400"><th className="px-12 py-10">Test Manifest</th><th className="px-12 py-10">Partner Node</th><th className="px-12 py-10">Telemetry Time</th><th className="px-12 py-10">Settlement</th><th className="px-12 py-10">Action</th></tr></thead>
        <tbody className="divide-y divide-slate-100">
          {labTests.map((t: any) => (
            <tr key={t.id} className="hover:bg-slate-50 transition-colors group">
              <td className="px-12 py-10"><div><p className="text-xl font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">{t.name}</p><p className="text-xs font-bold text-slate-400 flex items-center gap-2 mt-1">{t.fastingRequired ? <span className="text-rose-500">Fasting Mandatory</span> : <span>No Fasting Req.</span>}</p></div></td>
              <td className="px-12 py-10 text-slate-500 font-bold italic">{t.partnerName}</td>
              <td className="px-12 py-10"><div className="flex items-center gap-2 text-slate-900 font-black text-xs uppercase tracking-widest"><Clock size={14} className="text-slate-400" /> {t.reportTime}</div></td>
              <td className="px-12 py-10 font-black text-2xl text-slate-900">₹{t.price}</td>
              <td className="px-12 py-10"><button className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-600 transition-all shadow-xl">Book Test Node</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const ConsultView = ({ pharmacists, onChat }: any) => (
  <div className="max-w-7xl mx-auto px-8 py-20 animate-fadeIn space-y-16">
    <div className="flex flex-col md:flex-row justify-between items-end gap-6">
       <div><h1 className="text-7xl font-black text-slate-900 tracking-tighter">Pharmacist Hub</h1><p className="text-slate-400 text-2xl font-bold mt-2 italic">Connect with verified experts for clinical guidance.</p></div>
    </div>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
      {pharmacists.map((p: Pharmacist) => (
        <div key={p.id} className="bg-white p-12 rounded-[4rem] border border-slate-100 flex flex-col items-center text-center shadow-sm hover:shadow-3xl transition-all duration-700 tilt-card">
          <div className="relative group">
            <img src={p.image} className="w-48 h-48 rounded-[3.5rem] object-cover border-8 border-slate-50 shadow-2xl group-hover:rotate-6 transition-transform duration-700" alt="" />
            <div className={`absolute bottom-4 right-4 w-10 h-10 rounded-2xl border-4 border-white shadow-lg ${p.available ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
          </div>
          <h3 className="text-4xl font-black mt-10 tracking-tight">{p.name}</h3>
          <p className="text-indigo-600 font-black uppercase tracking-widest text-[11px] mt-2 mb-6">{p.specialty}</p>
          <p className="text-slate-400 font-bold italic leading-relaxed mb-10">{p.bio}</p>
          <div className="flex gap-4 w-full">
            <button onClick={onChat} className="flex-1 bg-slate-900 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all shadow-xl"><MessageSquareText size={18} /> Chat Hub</button>
            <button className="flex-1 bg-emerald-600 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-slate-900 transition-all shadow-xl"><PhoneCall size={18} /> Call Hub</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SmartPackView = ({ order, setView, onRefill, onShowVideo }: any) => {
  const [selectedMed, setSelectedMed] = useState<Product | null>(order.items[0]);
  return (
    <div className="max-w-7xl mx-auto px-8 py-20 animate-fadeIn space-y-16">
      <header className="flex flex-col md:flex-row justify-between items-end gap-8">
        <div>
          <button onClick={() => setView('user-dashboard')} className="flex items-center gap-3 text-slate-400 hover:text-slate-900 font-black text-[10px] uppercase tracking-widest mb-6 transition-colors"><ArrowLeft size={18} /> Back to Surveillance Dashboard</button>
          <h1 className="text-7xl font-black text-slate-900 tracking-tighter">Smart QR Medicine Pack</h1>
          <p className="text-slate-400 text-2xl font-bold mt-2 italic">Interactive digital twin for Manifest #{order.id.slice(0, 8)}</p>
        </div>
        <div className="bg-emerald-50 text-emerald-600 p-8 rounded-[3rem] border border-emerald-100 flex items-center gap-6 shadow-xl animate-pulse-soft">
           <QrCode size={48} className="text-emerald-500" />
           <div><p className="text-[10px] font-black uppercase tracking-[0.2em]">Batch Surveillance Active</p><p className="text-xl font-black">All Units Verified</p></div>
        </div>
      </header>
      <div className="grid lg:grid-cols-3 gap-16">
        <div className="space-y-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 px-6">Pack Content Surveillance</h3>
          <div className="space-y-4">
            {order.items.map(item => (
              <button key={item.id} onClick={() => setSelectedMed(item)} className={`w-full p-8 rounded-[3.5rem] border-2 transition-all flex items-center gap-8 ${selectedMed?.id === item.id ? 'border-indigo-600 bg-indigo-50/50 shadow-2xl scale-[1.02]' : 'border-slate-100 bg-white hover:border-indigo-200'}`}>
                <img src={item.image} className="w-20 h-20 rounded-[2rem] object-cover shadow-lg" alt="" />
                <div className="text-left">
                  <p className="text-xl font-black text-slate-900 tracking-tight">{item.name}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Surveillance Qty: {item.quantity} Units</p>
                </div>
              </button>
            ))}
          </div>
        </div>
        {selectedMed && (
          <div className="lg:col-span-2 bg-white rounded-[4.5rem] border border-slate-100 p-16 space-y-16 shadow-3xl animate-slideUp relative overflow-hidden">
             <div className="flex flex-col md:flex-row justify-between items-start gap-8 relative z-10">
                <div className="space-y-4">
                  <h2 className="text-6xl font-black tracking-tighter text-slate-900 leading-none">{selectedMed.name}</h2>
                  <p className="text-2xl font-bold text-slate-400 italic">By {selectedMed.brand} Surveillance Node</p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="bg-rose-50 text-rose-500 p-4 rounded-3xl border border-rose-100 text-center"><p className="text-[9px] font-black uppercase tracking-widest opacity-60">Expiry Link</p><p className="text-xl font-black">{selectedMed.expiryDate}</p></div>
                </div>
             </div>
             <div className="grid md:grid-cols-2 gap-12 relative z-10">
                <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white space-y-8 shadow-2xl relative group cursor-pointer overflow-hidden" onClick={() => onShowVideo(selectedMed.usageVideo)}>
                   <div className="flex items-center gap-4 text-emerald-400 mb-4"><Video size={32} /><h3 className="text-xl font-black uppercase tracking-widest">Admin Tutorial</h3></div>
                   <div className="aspect-video bg-white/5 rounded-[2rem] flex items-center justify-center group-hover:bg-white/10 transition-all border border-white/10 relative overflow-hidden">
                      <img src={selectedMed.image} className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm group-hover:opacity-40 transition-opacity" alt="" />
                      <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-125 transition-all"><Play size={32} fill="currentColor" /></div>
                   </div>
                   <p className="text-[10px] font-bold text-slate-400 text-center italic">Digital twin demonstration for correct administration.</p>
                </div>
                <div className="bg-indigo-50 rounded-[3.5rem] p-12 border border-indigo-100 space-y-8 shadow-inner">
                   <div className="flex items-center gap-4 text-indigo-600 mb-4"><BadgeCheck size={32} /><h3 className="text-xl font-black uppercase tracking-widest">Dose Recovery</h3></div>
                   <div className="p-8 bg-white/60 rounded-3xl border border-indigo-100/50"><p className="text-slate-700 font-bold leading-relaxed">{selectedMed.missedDoseGuidance || "Consult a professional hub if you miss a dose node."}</p></div>
                   <button onClick={() => window.open('tel:+919876543210')} className="w-full bg-indigo-600 text-white py-6 rounded-[2rem] font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-slate-900 transition-all shadow-xl"><PhoneCall size={18} /> Emergency Clinical Hub</button>
                </div>
             </div>
             <div className="flex flex-col md:flex-row gap-8 pt-16 border-t border-slate-100 relative z-10">
                <button onClick={() => onRefill(selectedMed)} className="flex-1 bg-emerald-600 text-white py-8 rounded-[3rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-4 hover:bg-slate-900 transition-all shadow-3xl transform hover:scale-105 hover:-translate-y-2"><Repeat size={24} /> One-Click Refill Hub</button>
                <div className="flex-1 bg-slate-50 p-8 rounded-[3rem] flex items-center gap-6 border border-slate-100"><InfoIcon size={32} className="text-slate-400" /><p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-relaxed">Surveillance Batch: <span className="text-slate-900 font-black">{selectedMed.batchNumber}</span><br />Verified by HealthHub AI Node</p></div>
             </div>
             <Activity className="absolute bottom-[-100px] right-[-100px] opacity-[0.02] w-96 h-96 pointer-events-none" />
          </div>
        )}
      </div>
    </div>
  );
};

const CartView = ({ cart, setView, updateQty, remove, orderType, setOrderType }: any) => (
  <div className="max-w-7xl mx-auto px-8 py-20 animate-fadeIn space-y-16">
    <h1 className="text-7xl font-black text-slate-900 tracking-tighter">Basket Node</h1>
    {cart.length === 0 ? (
      <div className="text-center py-40 bg-slate-50 rounded-[5rem] border-4 border-dashed border-slate-100">
        <ShoppingBag size={100} className="mx-auto text-slate-200 mb-10" />
        <h3 className="text-3xl font-black text-slate-400 mb-10">Basket Node Empty</h3>
        <button onClick={() => setView('shop')} className="bg-slate-900 text-white px-12 py-6 rounded-[2.5rem] font-black uppercase tracking-widest text-xs hover:bg-emerald-600 transition-all shadow-xl">Explore Shop Hub</button>
      </div>
    ) : (
      <div className="grid lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-12">
          {/* Takeaway/Delivery Selector */}
          <div className="bg-white p-8 rounded-[3.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-6">
             <button 
               onClick={() => setOrderType('delivery')}
               className={`flex-1 p-8 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-4 ${orderType === 'delivery' ? 'bg-emerald-50 border-emerald-500' : 'bg-slate-50 border-transparent hover:border-slate-200'}`}
             >
                <div className={`p-4 rounded-2xl ${orderType === 'delivery' ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400'}`}>
                   <Truck size={32} />
                </div>
                <div className="text-center">
                   <p className="text-xl font-black text-slate-900">Home Delivery</p>
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">35-45 Mins Protocol</p>
                </div>
             </button>
             <button 
               onClick={() => setOrderType('takeaway')}
               className={`flex-1 p-8 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-4 ${orderType === 'takeaway' ? 'bg-indigo-50 border-indigo-500' : 'bg-slate-50 border-transparent hover:border-slate-200'}`}
             >
                <div className={`p-4 rounded-2xl ${orderType === 'takeaway' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400'}`}>
                   <Store size={32} />
                </div>
                <div className="text-center">
                   <p className="text-xl font-black text-slate-900">Takeaway Node</p>
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Ready in 10 Mins</p>
                </div>
             </button>
          </div>

          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 px-6">Manifested Units</h3>
            {cart.map((item: any) => (
              <div key={item.id} className="bg-white p-10 rounded-[4rem] border border-slate-100 flex flex-col sm:flex-row gap-8 items-center shadow-sm hover:shadow-xl transition-all group">
                <img src={item.image} className="w-32 h-32 rounded-[2.5rem] object-cover shadow-lg group-hover:scale-110 transition-transform duration-700" alt="" />
                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <h4 className="text-2xl font-black text-slate-900 tracking-tight">{item.name}</h4>
                  <p className="text-lg font-black text-emerald-600">₹{item.price}</p>
                </div>
                <div className="flex items-center gap-6 bg-slate-50 p-3 rounded-3xl border border-slate-100 shadow-inner">
                  <button onClick={() => updateQty(item.id, -1)} className="w-12 h-12 bg-white rounded-xl shadow-sm text-xl font-black hover:bg-rose-500 hover:text-white transition-all">-</button>
                  <span className="font-black text-xl w-6 text-center">{item.quantity}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="w-12 h-12 bg-white rounded-xl shadow-sm text-xl font-black hover:bg-emerald-500 hover:text-white transition-all">+</button>
                </div>
                <button onClick={() => remove(item.id)} className="p-5 text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"><Trash2 size={24} /></button>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-slate-900 p-16 rounded-[5rem] text-white shadow-3xl sticky top-32 h-fit overflow-hidden group">
          <h3 className="text-4xl font-black mb-16 tracking-tight">Summary Hub</h3>
          <div className="space-y-8 mb-16 border-b border-white/10 pb-12">
            <div className="flex justify-between font-bold text-slate-400 text-xl"><span>Subtotal</span><span>₹{cart.reduce((a,b)=>a+b.price*b.quantity, 0).toFixed(0)}</span></div>
            <div className="flex justify-between font-bold text-slate-400 text-xl"><span>Node Fee</span><span>₹50</span></div>
            <div className="flex justify-between text-4xl font-black text-white pt-8"><span>Total</span><span>₹{(cart.reduce((a,b)=>a+b.price*b.quantity, 0) * 1.12 + 50).toFixed(0)}</span></div>
          </div>
          <button onClick={() => setView('checkout')} className="w-full bg-emerald-500 text-white py-10 rounded-[3.5rem] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-emerald-600 transition-all transform hover:scale-105">Initialize Settlement</button>
          <Activity className="absolute top-[-50px] right-[-50px] opacity-[0.05] w-64 h-64 group-hover:scale-150 transition-transform duration-[3s]" />
        </div>
      </div>
    )}
  </div>
);

const CheckoutView = ({ total, onPay, isProcessing, paymentMethod, setPaymentMethod, orderType }: any) => (
  <div className="max-w-4xl mx-auto py-32 px-8 animate-fadeIn">
    <h1 className="text-7xl font-black text-slate-900 tracking-tighter mb-16">Settlement Terminal</h1>
    
    <div className="grid lg:grid-cols-2 gap-16">
       <div className="space-y-12">
          <section className="space-y-8">
             <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 px-4">Payment Protocol</h3>
             <div className="grid grid-cols-2 gap-4">
                {['UPI', 'Card', 'COD'].map((method) => (
                   <button 
                     key={method}
                     onClick={() => setPaymentMethod(method as PaymentMethod)}
                     className={`p-10 rounded-[3rem] border-2 transition-all flex flex-col items-center gap-4 ${paymentMethod === method ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-white border-slate-100 text-slate-400'}`}
                   >
                      <div className={`p-4 rounded-2xl ${paymentMethod === method ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-300'}`}>
                         {method === 'UPI' ? <Zap size={24} /> : method === 'Card' ? <ShieldCheck size={24} /> : <Coffee size={24} />}
                      </div>
                      <span className="font-black text-lg">{method}</span>
                   </button>
                ))}
             </div>
          </section>

          <div className="bg-emerald-50 p-10 rounded-[3.5rem] border border-emerald-100 flex items-center gap-8">
             <div className="p-5 bg-emerald-500 text-white rounded-[2rem] shadow-xl">
                {orderType === 'delivery' ? <Truck size={32} /> : <Store size={32} />}
             </div>
             <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Selected Node</p>
                <p className="text-2xl font-black text-slate-900">{orderType === 'delivery' ? 'Safe Delivery Hub' : 'Takeaway Store Node'}</p>
             </div>
          </div>
       </div>

       <div className="bg-slate-900 p-16 rounded-[6rem] text-white shadow-3xl relative overflow-hidden group">
          <div className="relative z-10 flex flex-col h-full">
             <p className="text-emerald-400 font-black uppercase tracking-[0.3em] text-xs mb-10 flex items-center gap-3"><ShieldCheck size={20} /> Encrypted Gateway Active</p>
             <div className="mb-auto">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Final Settlement Value</p>
                <p className="text-8xl font-black tracking-tighter">₹{total.toFixed(0)}</p>
             </div>
             <button onClick={onPay} disabled={isProcessing} className="w-full mt-16 bg-emerald-500 text-white py-10 rounded-[4rem] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-6 hover:bg-emerald-600 transition-all transform hover:scale-105 shadow-2xl">
                {isProcessing ? <Loader2 className="animate-spin" size={40} /> : 'Process Settlement'}
             </button>
          </div>
          <Activity className="absolute bottom-[-100px] left-[-100px] opacity-[0.03] w-[600px] h-[600px] pointer-events-none group-hover:rotate-12 transition-transform duration-[5s]" />
       </div>
    </div>
  </div>
);

const AiChatView = ({ chat, setChat, input, setInput, isLoading, setLoading }: any) => {
  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user' as const, text: input };
    setChat([...chat, userMsg]);
    setInput('');
    setLoading(true);
    const advice = await getHealthAdvice(input);
    setChat(prev => [...prev, { role: 'ai' as const, text: advice }]);
    setLoading(false);
  };
  return (
    <div className="max-w-5xl mx-auto px-8 py-20 animate-fadeIn h-[calc(100vh-100px)] flex flex-col">
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-10 pb-16 px-4">
        {chat.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-12 rounded-[4rem] shadow-sm border transition-all hover:shadow-xl ${msg.role === 'user' ? 'bg-indigo-600 text-white border-indigo-500 rounded-tr-none' : 'bg-white text-slate-900 border-slate-100 rounded-tl-none'}`}><p className="font-bold leading-relaxed text-lg italic">{msg.text}</p></div>
          </div>
        ))}
        {isLoading && <div className="flex justify-start"><div className="bg-white p-10 rounded-[4rem] border border-slate-100 shadow-inner"><Loader2 className="animate-spin text-slate-400" /></div></div>}
      </div>
      <div className="relative mt-8 group"><input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask the clinical AI node..." className="w-full bg-slate-50 border-2 border-slate-100 rounded-[3rem] py-10 pl-12 pr-28 font-black text-xl focus:border-indigo-400 focus:bg-white outline-none shadow-2xl transition-all" /><button onClick={handleSend} className="absolute right-6 top-1/2 -translate-y-1/2 bg-slate-900 text-white p-8 rounded-full hover:bg-indigo-600 transition-all shadow-xl group-hover:scale-110 active:scale-95"><ArrowRight size={32} /></button></div>
    </div>
  );
};

const Footer = ({ setView }: any) => (
  <footer className="bg-slate-900 text-white py-40 px-12 rounded-t-[8rem] mt-40 relative overflow-hidden text-center">
     <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex justify-center items-center gap-4 mb-12"><Activity className="text-emerald-500" size={40} /> <span className="text-5xl font-black tracking-tighter">HealthHub India</span></div>
        <p className="text-slate-500 font-bold max-w-2xl mx-auto text-2xl leading-relaxed italic mb-16">India's premium pharmaceutical surveillance node. Verified batches, live expert support, and digital twin medicine guidance.</p>
        <div className="flex flex-wrap justify-center gap-12 text-[11px] font-black uppercase tracking-[0.3em] text-slate-600"><button onClick={() => setView('shop')} className="hover:text-emerald-400 transition-colors">Pharmacy Hub</button><button onClick={() => setView('clinics')} className="hover:text-emerald-400 transition-colors">Clinic Hub</button><button onClick={() => setView('labs')} className="hover:text-emerald-400 transition-colors">Lab Hub</button><button onClick={() => setView('consult')} className="hover:text-emerald-400 transition-colors">Consult Hub</button></div>
     </div>
     <Activity className="absolute top-0 left-0 opacity-[0.02] w-full h-full pointer-events-none" />
  </footer>
);

export default App;
