import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MOCK_ANALYTICS, MOCK_PRODUCTS, MOCK_VENDORS, MOCK_PURCHASE_ORDERS } from '../constants';
import { 
  TrendingUp, Package, Clock, Truck, Search, 
  LayoutDashboard, Box, ShieldCheck, Activity, ClipboardList,
  Lock, ArrowUpRight, ArrowDownRight, RefreshCcw, Layers, Zap,
  Handshake, ShoppingCart, Factory, FileText, Plus, Star, MoreVertical,
  CheckCircle2, XCircle, ExternalLink, Trash2, Edit2, X, Phone, Mail, MapPin,
  // Fix: Added missing icon imports to resolve "Cannot find name" errors
  User, ArrowRight
} from 'lucide-react';
import { Order, AuditLog, Vendor, PurchaseOrder } from '../types';

interface DashboardProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: Order['status']) => void;
  onDispense: (orderId: string) => void;
  auditLogs: AuditLog[];
}

const NavItem = ({ active, onClick, icon, label, badge }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
      active ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
    }`}
  >
    <div className="flex items-center gap-4">
      {icon}
      <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
    </div>
    {badge !== undefined && (
      <span className={`text-[9px] font-black px-2 py-1 rounded-lg ${active ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
        {badge}
      </span>
    )}
  </button>
);

const StatCard = ({ label, value, icon, color, trend }: any) => (
  <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm group hover:border-indigo-500 transition-all">
    <div className="flex justify-between items-start mb-6">
      <div className={`p-4 ${color} text-white rounded-2xl shadow-lg`}>
        {icon}
      </div>
      {trend && (
        <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-3 py-1 rounded-lg flex items-center gap-1">
          {trend}
        </span>
      )}
    </div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-3xl font-black text-slate-900 tracking-tighter">{value}</p>
  </div>
);

const StaffDashboard: React.FC<DashboardProps> = ({ orders, onUpdateStatus, onDispense, auditLogs }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'verification' | 'inventory' | 'vendors' | 'purchases' | 'audit'>('overview');
  const [vendorList, setVendorList] = useState<Vendor[]>(MOCK_VENDORS);
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);

  const pendingOrders = orders.filter(o => o.status === 'confirmed');
  const verificationQueue = orders.filter(o => o.status === 'prescription_pending');
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const lowStockItems = MOCK_PRODUCTS.filter(p => p.stock < 50);

  const handleSaveVendor = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newVendor: Vendor = {
      id: editingVendor?.id || Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
      contactPerson: formData.get('contactPerson') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      reliabilityScore: parseFloat(formData.get('reliabilityScore') as string) || 5.0,
      categories: (formData.get('categories') as string).split(',').map(s => s.trim()),
      status: 'active'
    };

    if (editingVendor) {
      setVendorList(vendorList.map(v => v.id === editingVendor.id ? newVendor : v));
    } else {
      setVendorList([...vendorList, newVendor]);
    }
    setIsVendorModalOpen(false);
    setEditingVendor(null);
  };

  const handleDeleteVendor = (id: string) => {
    if (confirm('Are you sure you want to remove this vendor node?')) {
      setVendorList(vendorList.filter(v => v.id !== id));
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] bg-[#FDFDFF]">
      <aside className="w-full lg:w-80 bg-white border-r border-slate-100 p-8 space-y-3 z-10 flex flex-col">
        <div className="mb-12 px-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
              <Lock size={20} />
            </div>
            <div>
              <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Staff Node</h2>
              <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">Pharmacist Auth</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 space-y-2">
          <NavItem active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<LayoutDashboard size={20} />} label="Operational Meta" />
          <NavItem active={activeTab === 'verification'} onClick={() => setActiveTab('verification')} icon={<ShieldCheck size={20} />} label="RX Verification" badge={verificationQueue.length} />
          <NavItem active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} icon={<Truck size={20} />} label="Fulfillment" badge={pendingOrders.length} />
          <NavItem active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} icon={<Box size={20} />} label="Inventory Node" badge={lowStockItems.length > 0 ? 'Low' : undefined} />
          <div className="h-[1px] bg-slate-100 my-4 mx-2 opacity-50"></div>
          <NavItem active={activeTab === 'vendors'} onClick={() => setActiveTab('vendors')} icon={<Handshake size={20} />} label="Vendor Registry" badge={vendorList.length} />
          <NavItem active={activeTab === 'purchases'} onClick={() => setActiveTab('purchases')} icon={<ShoppingCart size={20} />} label="Purchase Orders" />
          <NavItem active={activeTab === 'audit'} onClick={() => setActiveTab('audit')} icon={<ClipboardList size={20} />} label="Dispensing Logs" />
        </nav>
        
        <div className="mt-auto pt-10">
          <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <Zap size={24} className="text-indigo-200 mb-4" />
              <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">System Health</p>
              <p className="text-lg font-black tracking-tight">Optimized</p>
            </div>
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-700">
              <Activity size={80} />
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-8 lg:p-14 overflow-y-auto custom-scrollbar bg-slate-50/30">
        {activeTab === 'overview' && (
          <div className="max-w-7xl mx-auto space-y-12 animate-fadeIn">
            <header className="flex justify-between items-end">
              <div>
                <h1 className="text-6xl font-black text-slate-900 tracking-tighter">Ops Surveillance</h1>
                <p className="text-slate-500 font-bold text-lg mt-2 italic">Real-time pharmaceutical flow telemetry.</p>
              </div>
              <div className="flex gap-4">
                 <button className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm text-slate-400"><RefreshCcw size={20} /></button>
                 <button className="bg-slate-900 text-white px-10 py-5 rounded-3xl font-black uppercase text-xs tracking-widest">Download Report</button>
              </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
              <StatCard label="Total Settlement" value={`₹${totalRevenue.toLocaleString()}`} icon={<TrendingUp size={24} />} color="bg-emerald-500" trend={<><ArrowUpRight size={14} /> 14%</>} />
              <StatCard label="Dispense Cycle" value="12m" icon={<Clock size={24} />} color="bg-indigo-500" trend={<><ArrowDownRight size={14} /> 2m</>} />
              <StatCard label="Unit Inventory" value="4.2k" icon={<Layers size={24} />} color="bg-teal-500" trend="Sufficient" />
              <StatCard label="Active Nodes" value="03" icon={<Activity size={24} />} color="bg-rose-500" trend="Live" />
            </div>

            <div className="grid xl:grid-cols-3 gap-12">
               <div className="xl:col-span-2 bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm">
                  <div className="flex justify-between items-center mb-12">
                    <h3 className="text-2xl font-black">Supply Chain Velocity</h3>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={MOCK_ANALYTICS}>
                        <defs>
                          <linearGradient id="staffArea" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                        <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }} />
                        <Area type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={4} fill="url(#staffArea)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
               </div>
               <div className="space-y-8">
                  <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white">
                    <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-6">Stock Health</h4>
                    <div className="space-y-6">
                      {lowStockItems.map(p => (
                        <div key={p.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                            <span className="text-sm font-bold truncate max-w-[120px]">{p.name}</span>
                          </div>
                          <span className="text-[10px] font-black text-rose-400 bg-rose-400/10 px-3 py-1 rounded-lg">Only {p.stock} units</span>
                        </div>
                      ))}
                      <button onClick={() => setActiveTab('inventory')} className="w-full py-4 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all mt-4">Restock Protocol</button>
                    </div>
                  </div>
                  <div className="bg-emerald-500 p-10 rounded-[3.5rem] text-white">
                    <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Fulfillment Rate</h4>
                    <p className="text-5xl font-black tracking-tighter">98.4%</p>
                    <p className="text-[10px] font-bold mt-4 opacity-80 uppercase tracking-widest">0.2% improvement from prev. node</p>
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'vendors' && (
          <div className="max-w-7xl mx-auto space-y-12 animate-fadeIn">
            <header className="flex flex-col md:flex-row justify-between items-end gap-6">
              <div>
                <h1 className="text-6xl font-black text-slate-900 tracking-tighter">Vendor Registry</h1>
                <p className="text-slate-500 font-bold text-lg mt-2 italic">Strategic supply chain partners and compliance ratings.</p>
              </div>
              <button 
                onClick={() => { setEditingVendor(null); setIsVendorModalOpen(true); }}
                className="bg-slate-900 text-white px-10 py-5 rounded-3xl font-black uppercase text-xs tracking-widest flex items-center gap-3 hover:bg-indigo-600 transition-all shadow-xl"
              >
                 <Plus size={18} /> Add Supplier Node
              </button>
            </header>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
               {vendorList.map((vendor: Vendor) => (
                 <div key={vendor.id} className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm hover:border-indigo-500 transition-all flex flex-col h-full relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
                       <Factory size={120} />
                    </div>
                    <div className="flex justify-between items-start mb-8 relative z-10">
                       <div className="bg-indigo-50 text-indigo-600 p-5 rounded-3xl"><Handshake size={32} /></div>
                       <div className="flex gap-2">
                          <button 
                            onClick={() => { setEditingVendor(vendor); setIsVendorModalOpen(true); }}
                            className="p-2 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-xl transition-all"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteVendor(vendor.id)}
                            className="p-2 bg-slate-50 text-slate-400 hover:text-rose-600 rounded-xl transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                       </div>
                    </div>
                    <div className="relative z-10 flex-1 space-y-4">
                       <h3 className="text-2xl font-black text-slate-900 tracking-tight">{vendor.name}</h3>
                       <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
                          <MapPin size={14} className="text-slate-300" />
                          <span className="truncate">{vendor.address}</span>
                       </div>
                       <div className="flex flex-wrap gap-2 pt-4">
                          {vendor.categories.map(c => (
                            <span key={c} className="bg-slate-50 text-slate-500 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-slate-100">
                               {c}
                            </span>
                          ))}
                       </div>
                    </div>
                    <div className="mt-10 pt-8 border-t border-slate-50 relative z-10 space-y-4">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white text-[10px] font-black uppercase">
                                {vendor.contactPerson.charAt(0)}
                             </div>
                             <div>
                                <p className="text-xs font-black text-slate-900">{vendor.contactPerson}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{vendor.phone}</p>
                             </div>
                          </div>
                          <div className="flex flex-col items-end">
                             <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Reliability</p>
                             <div className="flex items-center gap-1 text-amber-500 font-black text-xs">
                                <Star size={12} fill="currentColor" /> {vendor.reliabilityScore}
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {activeTab === 'purchases' && (
          <div className="max-w-7xl mx-auto space-y-12 animate-fadeIn">
            <header className="flex flex-col md:flex-row justify-between items-end gap-6">
              <div>
                <h1 className="text-6xl font-black text-slate-900 tracking-tighter">Purchase Orders</h1>
                <p className="text-slate-500 font-bold text-lg mt-2 italic">Active procurement lifecycle and fulfillment surveillance.</p>
              </div>
              <button className="bg-indigo-600 text-white px-10 py-5 rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl flex items-center gap-3">
                 <ShoppingCart size={18} /> New PO Node
              </button>
            </header>
            <div className="bg-white rounded-[4rem] shadow-sm border border-slate-100 overflow-hidden">
               <table className="w-full text-left">
                  <thead>
                     <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="px-10 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">PO Node ID</th>
                        <th className="px-10 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">Vendor / Source</th>
                        <th className="px-10 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">Settlement</th>
                        <th className="px-10 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">Lifecycle Status</th>
                        <th className="px-10 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] text-right">Execution</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {MOCK_PURCHASE_ORDERS.map((po: PurchaseOrder) => (
                       <tr key={po.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-10 py-10">
                             <div className="flex items-center gap-4">
                                <div className="p-3 bg-slate-900 text-white rounded-xl">
                                   <FileText size={18} />
                                </div>
                                <div>
                                   <p className="font-black text-slate-900 text-lg tracking-tighter">#{po.id}</p>
                                   <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Date: {po.orderDate}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-10 py-10">
                             <p className="font-black text-slate-900">{po.vendorName}</p>
                             <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1">{po.items.length} Units Manifested</p>
                          </td>
                          <td className="px-10 py-10">
                             <p className="text-xl font-black text-slate-900">₹{po.totalAmount.toLocaleString()}</p>
                             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Units Reserved</span>
                          </td>
                          <td className="px-10 py-10">
                             <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 w-fit ${
                                po.status === 'received' ? 'bg-emerald-50 text-emerald-600' : 
                                po.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-500'
                             }`}>
                                {po.status === 'received' ? <CheckCircle2 size={12} /> : po.status === 'pending' ? <Clock size={12} /> : <XCircle size={12} />}
                                {po.status}
                             </span>
                          </td>
                          <td className="px-10 py-10 text-right">
                             <button className="p-3 text-slate-400 hover:text-slate-900 bg-slate-50 rounded-xl transition-all mr-2"><ExternalLink size={18} /></button>
                             <button className="p-3 text-slate-400 hover:text-slate-900 bg-slate-50 rounded-xl transition-all"><MoreVertical size={18} /></button>
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          </div>
        )}

        {activeTab === 'verification' && (
           <div className="max-w-7xl mx-auto space-y-12 animate-fadeIn">
              <h2 className="text-4xl font-black tracking-tighter">Prescription Verification Node</h2>
              <div className="grid gap-6">
                {verificationQueue.length > 0 ? verificationQueue.map(order => (
                  <div key={order.id} className="bg-white p-8 rounded-3xl border border-slate-100 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                         <Search size={24} />
                      </div>
                      <div>
                        <p className="font-black text-slate-900">{order.customerName}</p>
                        <p className="text-[10px] font-black uppercase text-slate-400">Order ID: {order.id}</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                       <button onClick={() => onUpdateStatus(order.id, 'confirmed')} className="bg-emerald-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Approve</button>
                       <button onClick={() => onUpdateStatus(order.id, 'cancelled')} className="bg-rose-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Reject</button>
                    </div>
                  </div>
                )) : (
                  <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100">
                    <p className="text-slate-400 font-bold">Verification queue is clear.</p>
                  </div>
                )}
              </div>
           </div>
        )}

        {activeTab === 'orders' && (
          <div className="max-w-7xl mx-auto space-y-12 animate-fadeIn">
            <h2 className="text-4xl font-black tracking-tighter">Order Fulfillment</h2>
            <div className="grid gap-6">
              {orders.length > 0 ? orders.map(order => (
                <div key={order.id} className="bg-white p-8 rounded-3xl border border-slate-100 flex items-center justify-between shadow-sm">
                  <div>
                    <p className="font-black text-slate-900">{order.customerName}</p>
                    <p className="text-xs text-slate-400 font-bold tracking-widest">{order.id}</p>
                    <p className="text-[10px] font-black uppercase text-emerald-600 mt-1">₹{order.total.toFixed(2)} • {order.paymentMethod}</p>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => onDispense(order.id)} className="bg-emerald-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Dispense</button>
                    <button onClick={() => onUpdateStatus(order.id, 'out_for_delivery')} className="bg-slate-900 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Ship</button>
                  </div>
                </div>
              )) : (
                <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100">
                  <p className="text-slate-400 font-bold">No active orders in fulfillment queue.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="max-w-7xl mx-auto space-y-12 animate-fadeIn">
            <h2 className="text-4xl font-black tracking-tighter">Dispensing Audit Logs</h2>
            <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Timestamp</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Action</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Entity</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Details</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Hash</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map(log => (
                      <tr key={log.id} className="border-b border-slate-50 last:border-none hover:bg-slate-50 transition-colors">
                        <td className="px-8 py-6 text-[11px] font-bold text-slate-500 whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                        <td className="px-8 py-6">
                           <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                             log.action === 'DISPENSE' ? 'bg-emerald-50 text-emerald-600' : 
                             log.action === 'LOGIN' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-600'
                           }`}>
                             {log.action}
                           </span>
                        </td>
                        <td className="px-8 py-6 text-[11px] font-black text-slate-900">{log.entityId}</td>
                        <td className="px-8 py-6 text-[11px] font-bold text-slate-500">{log.details}</td>
                        <td className="px-8 py-6 text-[9px] font-mono text-slate-300 truncate max-w-[100px]">{log.securityHash}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="max-w-7xl mx-auto space-y-12 animate-fadeIn">
            <header className="flex flex-col md:flex-row justify-between items-end gap-6">
              <div>
                <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Inventory Node</h2>
                <p className="text-slate-400 font-bold mt-2">Manage pharmaceutical batches and stock levels.</p>
              </div>
              <div className="flex gap-4">
                 <div className="relative">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="text" placeholder="Search batch..." className="bg-white border-2 border-slate-100 rounded-3xl py-4 pl-14 pr-6 font-bold text-sm w-80 shadow-sm focus:border-indigo-500 outline-none transition-all" />
                 </div>
                 <button className="bg-indigo-600 text-white px-10 py-5 rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl">Manual Audit</button>
              </div>
            </header>
            <div className="grid gap-6">
               {MOCK_PRODUCTS.map(product => (
                 <div key={product.id} className="bg-white p-8 rounded-3xl border border-slate-100 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-6">
                       <img src={product.image} className="w-16 h-16 rounded-2xl object-cover" alt="" />
                       <div>
                          <p className="font-black text-slate-900">{product.name}</p>
                          <p className="text-[10px] font-black uppercase text-slate-400">Batch: {product.batchNumber} • Exp: {product.expiryDate}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-12">
                       <div className="text-right">
                          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">In Stock</p>
                          <p className={`text-2xl font-black tracking-tighter ${product.stock < 50 ? 'text-rose-500' : 'text-emerald-500'}`}>{product.stock}</p>
                       </div>
                       <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest">Adjust</button>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}
      </main>

      {/* Vendor Add/Edit Modal */}
      {isVendorModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
           <div className="bg-white w-full max-w-2xl rounded-[4rem] shadow-3xl overflow-hidden animate-slideUp">
              <div className="p-12 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                 <div className="flex items-center gap-4">
                    <div className="p-4 bg-slate-900 text-white rounded-2xl"><Handshake size={24} /></div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
                       {editingVendor ? 'Edit Vendor Node' : 'Initialize New Vendor'}
                    </h2>
                 </div>
                 <button onClick={() => setIsVendorModalOpen(false)} className="p-4 text-slate-400 hover:text-rose-500 transition-colors">
                    <X size={24} />
                 </button>
              </div>
              <form onSubmit={handleSaveVendor} className="p-12 space-y-8">
                 <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Company Legal Name</label>
                       <div className="relative">
                          <Factory className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                          <input required name="name" defaultValue={editingVendor?.name} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-14 pr-6 font-bold text-sm focus:bg-white focus:border-indigo-500 outline-none transition-all" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Lead</label>
                       <div className="relative">
                          {/* Fix: Icon now properly imported from lucide-react */}
                          <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                          <input required name="contactPerson" defaultValue={editingVendor?.contactPerson} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-14 pr-6 font-bold text-sm focus:bg-white focus:border-indigo-500 outline-none transition-all" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Link</label>
                       <div className="relative">
                          <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                          <input required name="phone" defaultValue={editingVendor?.phone} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-14 pr-6 font-bold text-sm focus:bg-white focus:border-indigo-500 outline-none transition-all" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Official Email</label>
                       <div className="relative">
                          <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                          <input required type="email" name="email" defaultValue={editingVendor?.email} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-14 pr-6 font-bold text-sm focus:bg-white focus:border-indigo-500 outline-none transition-all" />
                       </div>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Node Address</label>
                    <div className="relative">
                       <MapPin className="absolute left-5 top-4 text-slate-300" size={18} />
                       <textarea required name="address" defaultValue={editingVendor?.address} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-14 pr-6 font-bold text-sm focus:bg-white focus:border-indigo-500 outline-none transition-all h-24 resize-none" />
                    </div>
                 </div>
                 <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Categories (comma separated)</label>
                       <input required name="categories" defaultValue={editingVendor?.categories.join(', ')} placeholder="Antibiotics, Cardiac..." className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 font-bold text-sm focus:bg-white focus:border-indigo-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reliability Score (0-5)</label>
                       <input required type="number" step="0.1" max="5" min="0" name="reliabilityScore" defaultValue={editingVendor?.reliabilityScore || 5.0} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 font-bold text-sm focus:bg-white focus:border-indigo-500 outline-none transition-all" />
                    </div>
                 </div>
                 <div className="pt-6">
                    <button type="submit" className="w-full bg-slate-900 text-white py-6 rounded-[2.5rem] font-black uppercase text-xs tracking-widest hover:bg-emerald-600 shadow-2xl transition-all flex items-center justify-center gap-3">
                       {/* Fix: ArrowRight icon now properly imported from lucide-react */}
                       {editingVendor ? 'Apply Updates' : 'Initialize Node'} <ArrowRight size={18} />
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;