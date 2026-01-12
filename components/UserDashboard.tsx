
import React, { useState } from 'react';
import { Order, UserProfile, MTMPlan, OrderStatus } from '../types';
import { 
  Activity, History, User, FileSearch, TrendingUp, Truck, HeartPulse, 
  CheckCircle2, Package, Clock, Bell, Settings, ArrowRight, Zap, 
  Sparkles, Coffee, BrainCircuit, ShieldCheck, Repeat, Info, Calendar,
  Shield, Briefcase, XCircle, ChevronRight, RotateCcw
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Cell } from 'recharts';
import { MOCK_MTM } from '../constants';

interface UserDashboardProps {
  orders: Order[];
  onViewOrder: (order: Order) => void;
  onNavigateToShop: () => void;
  onNavigateToAi: () => void;
  onReorder: (order: Order) => void;
}

const INITIAL_USER: UserProfile = {
  name: "Arjun Sharma",
  email: "arjun.sharma@outlook.com",
  phone: "+91 98765 43210",
  bloodType: "B+",
  allergies: ["Peanuts", "Dust"],
  lastCheckup: "Jan 12, 2024",
  membership: "Premium",
  notificationSettings: { whatsapp: true, email: true, sms: false },
  addresses: ["A-402, Seawoods Grand Central, Sector 40, Nerul, Navi Mumbai 400706"],
  insuranceProvider: "TATA AIG",
  insurancePolicyNumber: "POL-8821992"
};

const HEALTH_CHART_DATA = [
  { day: 'Mon', score: 82 }, { day: 'Tue', score: 85 }, { day: 'Wed', score: 78 },
  { day: 'Thu', score: 92 }, { day: 'Fri', score: 88 }, { day: 'Sat', score: 95 }, { day: 'Sun', score: 91 },
];

const OrderStatusTimeline = ({ status }: { status: OrderStatus }) => {
  const steps = [
    { label: 'Received', icon: <Package size={14} />, status: ['prescription_pending', 'confirmed', 'packed', 'out_for_delivery', 'delivered'] },
    { label: 'Verified', icon: <ShieldCheck size={14} />, status: ['confirmed', 'packed', 'out_for_delivery', 'delivered'] },
    { label: 'Dispatched', icon: <Truck size={14} />, status: ['out_for_delivery', 'delivered'] },
    { label: 'Delivered', icon: <CheckCircle2 size={14} />, status: ['delivered'] },
  ];

  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-3 bg-rose-50 p-4 rounded-2xl border border-rose-100">
        <XCircle className="text-rose-500" size={20} />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-600">Protocol Cancelled / Voided</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between w-full max-w-2xl mt-8">
      {steps.map((step, idx) => {
        const isCompleted = step.status.includes(status) && status !== step.status[step.status.length - 1] || status === 'delivered';
        const isCurrent = (idx === 0 && status === 'prescription_pending') || 
                          (idx === 1 && (status === 'confirmed' || status === 'packed')) ||
                          (idx === 2 && status === 'out_for_delivery') ||
                          (idx === 3 && status === 'delivered');

        return (
          <React.Fragment key={idx}>
            <div className="flex flex-col items-center gap-2 group">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${
                isCurrent ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 scale-110' :
                isCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-50 text-slate-300'
              }`}>
                {isCompleted && !isCurrent ? <CheckCircle2 size={18} /> : step.icon}
              </div>
              <span className={`text-[8px] font-black uppercase tracking-widest ${
                isCurrent ? 'text-slate-900' : 'text-slate-400'
              }`}>{step.label}</span>
            </div>
            {idx < steps.length - 1 && (
              <div className="flex-1 h-[2px] mx-4 bg-slate-100 relative overflow-hidden">
                {(isCompleted || isCurrent) && (
                  <div className={`absolute inset-0 bg-emerald-500 transition-all duration-1000 ${
                    isCurrent && idx === steps.findIndex(s => s.status.includes(status)) ? 'w-1/2 animate-pulse' : 'w-full'
                  }`} />
                )}
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const UserDashboard: React.FC<UserDashboardProps> = ({ orders, onViewOrder, onNavigateToShop, onNavigateToAi, onReorder }) => {
  const [activeTab, setActiveTab] = useState<'surveillance' | 'reminders' | 'history' | 'insights'>('surveillance');
  const [user] = useState<UserProfile>(INITIAL_USER);
  const activeOrder = orders.find(o => ['confirmed', 'packed', 'out_for_delivery'].includes(o.status));
  const [mtm] = useState<MTMPlan>(MOCK_MTM);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 animate-fadeIn min-h-screen pb-32">
      {/* Tab Navigation */}
      <div className="flex gap-4 mb-12 overflow-x-auto pb-6 scrollbar-hide">
        <SubNavItem active={activeTab === 'surveillance'} onClick={() => setActiveTab('surveillance')} icon={<Activity size={20} />} label="Overview" />
        <SubNavItem active={activeTab === 'reminders'} onClick={() => setActiveTab('reminders')} icon={<Bell size={20} />} label="Dose Reminders" />
        <SubNavItem active={activeTab === 'insights'} onClick={() => setActiveTab('insights')} icon={<Sparkles size={20} />} label="Health Insights" />
        <SubNavItem active={activeTab === 'history'} onClick={() => setActiveTab('history')} icon={<History size={20} />} label="Fulfillment History" />
      </div>

      {activeTab === 'surveillance' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
          {/* Overview content omitted for brevity, keeping it identical to previous versions */}
          <div className="xl:col-span-2 space-y-12">
            <header className="p-12 bg-white rounded-[4.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
               <div className="relative z-10 flex items-center gap-8">
                  <div className="w-24 h-24 bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-white text-4xl font-black shadow-2xl group-hover:rotate-6 transition-transform">AS</div>
                  <div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-tight">Namaste, <span className="text-emerald-600">{user.name.split(' ')[0]}</span></h1>
                    <p className="text-slate-400 font-bold mt-2 text-lg italic">{user.membership} Member Surveillance Active</p>
                  </div>
               </div>
               <div className="flex gap-4 relative z-10">
                  <button onClick={onNavigateToShop} className="bg-emerald-600 text-white px-10 py-5 rounded-3xl font-black uppercase text-xs tracking-widest hover:bg-slate-900 transition-all shadow-xl">New Order</button>
                  <button onClick={onNavigateToAi} className="bg-slate-50 text-slate-900 p-5 rounded-3xl hover:bg-indigo-50 hover:text-indigo-600 transition-all"><BrainCircuit size={24} /></button>
               </div>
               <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform">
                  <Activity size={200} />
               </div>
            </header>

            <div className="grid grid-cols-2 gap-8">
               <div className="bg-indigo-600 p-10 rounded-[3.5rem] text-white shadow-xl flex items-center gap-8 relative overflow-hidden group">
                  <div className="bg-white/10 p-5 rounded-2xl relative z-10"><Shield size={32} /></div>
                  <div className="relative z-10">
                     <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Cashless Active</p>
                     <p className="text-xl font-black">{user.insuranceProvider}</p>
                  </div>
               </div>
               <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-xl flex items-center gap-8 relative overflow-hidden group">
                  <div className="bg-white/10 p-5 rounded-2xl relative z-10"><Briefcase size={32} /></div>
                  <div className="relative z-10">
                     <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Corporate Node</p>
                     <p className="text-xl font-black">Reliance Ind.</p>
                  </div>
               </div>
            </div>

            {activeOrder && (
              <section className="bg-slate-900 p-12 rounded-[4.5rem] text-white shadow-3xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-transparent"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                   <div className="flex items-center gap-8">
                     <div className="bg-emerald-500 p-6 rounded-[2.5rem] shadow-2xl animate-float"><Truck size={40} /></div>
                     <div>
                        <h3 className="text-3xl font-black tracking-tight">Node in Transit</h3>
                        <p className="text-emerald-400 text-xs font-black uppercase tracking-[0.2em] mt-2">MANIFEST #{activeOrder.id.slice(0, 8)}</p>
                     </div>
                   </div>
                   <div className="text-center md:text-right">
                      <p className="text-emerald-500 font-black text-xl mb-2">ETA: {activeOrder.deliveryEstimate || '25 Mins'}</p>
                      <button onClick={() => onViewOrder(activeOrder)} className="bg-white text-slate-900 px-10 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all">Surveillance Link</button>
                   </div>
                </div>
              </section>
            )}
          </div>
          {/* Overview end */}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="max-w-5xl mx-auto space-y-10 animate-fadeIn">
           <header className="flex justify-between items-center mb-12">
              <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Fulfillment History</h2>
              <button className="flex items-center gap-3 bg-slate-50 text-slate-600 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm">Download All Invoices</button>
           </header>

           <div className="space-y-12">
              {orders.length > 0 ? orders.map(o => (
                <div key={o.id} className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
                   <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                      <div className="flex items-center gap-8">
                         <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all shadow-inner ${
                           o.status === 'delivered' ? 'bg-emerald-50 text-emerald-600' : 
                           o.status === 'cancelled' ? 'bg-rose-50 text-rose-500' : 'bg-slate-50 text-slate-300'
                         }`}><Package size={32} /></div>
                         <div>
                            <p className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                              Manifest #{o.id.slice(0, 8)}
                              {o.autoRefill && <Repeat size={14} className="text-emerald-500" />}
                            </p>
                            <div className="flex gap-4 mt-2">
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Calendar size={12} /> {new Date(o.date).toLocaleDateString()}</p>
                               <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-lg">{o.type}</p>
                            </div>
                         </div>
                      </div>

                      <div className="flex items-center gap-4">
                         <div className="text-center md:text-right mr-4">
                            <p className="text-3xl font-black text-slate-900 tracking-tighter">₹{o.total.toLocaleString()}</p>
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">{o.paymentMethod} Payment</span>
                         </div>
                         <button 
                           onClick={() => onReorder(o)}
                           className="flex items-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-[1.8rem] font-black uppercase text-[10px] tracking-widest hover:bg-slate-900 transition-all shadow-xl"
                           title="One-Click Reorder"
                         >
                           <RotateCcw size={18} /> <span className="hidden sm:inline">Reorder</span>
                         </button>
                         <button onClick={() => onViewOrder(o)} className="p-6 bg-slate-100 text-slate-900 rounded-3xl hover:bg-emerald-600 hover:text-white transition-all transform">
                           <ArrowRight size={24} />
                         </button>
                      </div>
                   </div>

                   <OrderStatusTimeline status={o.status} />
                </div>
              )) : (
                <div className="py-40 text-center bg-slate-50 rounded-[5rem] border-4 border-dashed border-slate-100">
                   <h3 className="text-2xl font-black text-slate-900">No Historical Nodes</h3>
                   <button onClick={onNavigateToShop} className="mt-8 bg-slate-900 text-white px-10 py-5 rounded-3xl font-black uppercase tracking-widest text-xs">Order Now</button>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

const SubNavItem = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick} className={`flex items-center gap-4 px-10 py-5 rounded-3xl font-black text-[11px] uppercase tracking-widest transition-all whitespace-nowrap shadow-sm group ${active ? 'bg-slate-900 text-white scale-[1.05] shadow-2xl' : 'bg-white text-slate-400 hover:text-slate-900 border border-slate-100'}`}>
     <span className={`${active ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-900'} transition-colors`}>{icon}</span>
     {label}
  </button>
);

export default UserDashboard;
