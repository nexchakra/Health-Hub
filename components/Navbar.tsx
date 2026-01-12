
import React, { useState } from 'react';
import { ShoppingCart, User, Activity, Package, MessageSquareText, Building2, FlaskConical, Users, Languages, Type, HelpCircle, LogOut, BookOpen, ChevronDown } from 'lucide-react';
import { ViewState, Language } from '../types';

interface NavbarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  cartCount: number;
  userRole: 'user' | 'staff';
  isLoggedIn: boolean;
  onSignOut: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  isLargeFont: boolean;
  setIsLargeFont: (val: boolean) => void;
  isAssistedMode: boolean;
  setIsAssistedMode: (val: boolean) => void;
  accessibility: boolean;
  setAccessibility: (val: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  currentView, setView, cartCount, userRole, isLoggedIn, onSignOut, language, setLanguage, isLargeFont, setIsLargeFont, isAssistedMode, setIsAssistedMode, accessibility, setAccessibility 
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const translations = {
    en: { pharmacy: "Pharmacy", clinics: "Clinics", labs: "Labs", consult: "Consult", ai: "Ask AI", blog: "Health Base" },
    hi: { pharmacy: "फार्मेसी", clinics: "क्लीनिक", labs: "लैब", consult: "परामर्श", ai: "एआई से पूछें", blog: "स्वास्थ्य आधार" }
  };

  const t = translations[language];

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-[100] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 md:h-24 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('home')}>
          <div className="bg-emerald-600 p-2 rounded-2xl text-white shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
            <Activity size={24} />
          </div>
          <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            HealthHub
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden xl:flex items-center gap-1">
          <NavAction active={currentView === 'shop'} onClick={() => setView('shop')} icon={<Package size={18} />} label={t.pharmacy} />
          <NavAction active={currentView === 'clinics'} onClick={() => setView('clinics')} icon={<Building2 size={18} />} label={t.clinics} />
          <NavAction active={currentView === 'labs'} onClick={() => setView('labs')} icon={<FlaskConical size={18} />} label={t.labs} />
          <NavAction active={currentView === 'consult'} onClick={() => setView('consult')} icon={<Users size={18} />} label={t.consult} />
          <NavAction active={currentView === 'blog'} onClick={() => setView('blog')} icon={<BookOpen size={18} />} label={t.blog} />
          <NavAction active={currentView === 'ai-assistant'} onClick={() => setView('ai-assistant')} icon={<MessageSquareText size={18} />} label={t.ai} />
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2">
          {/* Senior/Assist Toggles */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 mr-2">
            <button 
              onClick={() => setIsLargeFont(!isLargeFont)}
              className={`p-2.5 rounded-xl transition-all flex items-center gap-2 ${isLargeFont ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-400 hover:text-slate-600'}`}
              title="Large Font Mode for Seniors"
            >
              <Type size={18} />
              <span className="text-[9px] font-black uppercase tracking-widest hidden lg:block">Large Text</span>
            </button>
            <button 
              onClick={() => setIsAssistedMode(!isAssistedMode)}
              className={`p-2.5 rounded-xl transition-all flex items-center gap-2 ${isAssistedMode ? 'bg-emerald-50 text-white shadow-lg shadow-emerald-200' : 'text-slate-400 hover:text-slate-600'}`}
              title="Assisted Ordering Mode"
            >
              <HelpCircle size={18} />
              <span className="text-[9px] font-black uppercase tracking-widest hidden lg:block">Assisted</span>
            </button>
          </div>

          <button 
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-2 p-2.5 bg-slate-50 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest"
          >
            <Languages size={18} /> {language.toUpperCase()}
          </button>

          <button onClick={() => setView('cart')} className="relative p-2.5 text-slate-600 hover:bg-slate-50 rounded-xl">
            <ShoppingCart size={22} />
            {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full ring-2 ring-white shadow-lg">{cartCount}</span>}
          </button>

          {isLoggedIn ? (
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 p-1.5 pr-4 bg-slate-50 rounded-xl border border-slate-100 hover:bg-white transition-colors group"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${userRole === 'staff' ? 'bg-indigo-600' : 'bg-emerald-600'}`}>
                  <User size={18} />
                </div>
                <span className="text-[11px] font-black text-slate-900 hidden lg:block">{userRole === 'staff' ? 'Staff Portal' : 'Arjun S.'}</span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
              </button>
              
              {showProfileMenu && (
                <div className="absolute top-full right-0 mt-3 w-56 bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-3 flex flex-col gap-1 overflow-hidden animate-slideUp">
                  <button 
                    onClick={() => { setView(userRole === 'staff' ? 'staff-dashboard' : 'user-dashboard'); setShowProfileMenu(false); }}
                    className="flex items-center gap-3 px-5 py-4 rounded-2xl hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-[11px] font-black uppercase tracking-widest transition-all"
                  >
                    <Activity size={18} /> Dashboard
                  </button>
                  <button 
                    onClick={() => { onSignOut(); setShowProfileMenu(false); }}
                    className="flex items-center gap-3 px-5 py-4 rounded-2xl hover:bg-rose-50 text-rose-500 text-[11px] font-black uppercase tracking-widest transition-all"
                  >
                    <LogOut size={18} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={() => setView('login')}
              className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

const NavAction = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all text-[11px] font-black uppercase tracking-widest ${
      active ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default Navbar;
