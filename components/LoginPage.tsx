
import React, { useState, useEffect } from 'react';
import { ShieldCheck, User, Lock, ArrowRight, Activity, Smartphone, CheckCircle2 } from 'lucide-react';

interface LoginPageProps {
  onLogin: (role: 'user' | 'staff') => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<'user' | 'staff'>('user');
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('otp');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Email/Password states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Load remembered email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('healthhub_remembered_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loginMethod === 'otp') {
      if (!otpSent) {
        setOtpSent(true);
        return;
      }
    } else {
      // Email/Password login logic
      if (rememberMe) {
        localStorage.setItem('healthhub_remembered_email', email);
      } else {
        localStorage.removeItem('healthhub_remembered_email');
      }
    }
    
    onLogin(selectedRole);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 animate-fadeIn">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 bg-white rounded-[4rem] shadow-2xl overflow-hidden border border-slate-100">
        
        {/* Brand Side */}
        <div className="hidden lg:flex flex-col justify-between p-16 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-16" onClick={() => (window as any).location.reload()} style={{cursor: 'pointer'}}>
              <div className="bg-emerald-600 p-2 rounded-2xl"><Activity size={24} /></div>
              <span className="text-2xl font-black tracking-tight">HealthHub India</span>
            </div>
            <h2 className="text-5xl font-black leading-tight mb-8">Securing India's <br /><span className="text-emerald-400">Medical Future.</span></h2>
            <p className="text-slate-400 text-lg max-w-sm font-medium">Verified pharmacy oversight, batch transparency, and genuine medicine guarantee.</p>
          </div>
          <div className="relative z-10 flex items-center gap-4 text-emerald-400 font-black text-xs uppercase tracking-widest bg-white/5 p-4 rounded-2xl border border-white/5">
            <ShieldCheck size={20} /> Operational Node: Verified
          </div>
        </div>

        {/* Form Side */}
        <div className="p-10 lg:p-20">
          <header className="mb-12">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Portal Access</h1>
            <p className="text-slate-400 font-bold">Select login method to proceed.</p>
          </header>

          <div className="flex gap-4 mb-8">
            <button 
              onClick={() => setLoginMethod('otp')}
              className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 transition-all ${loginMethod === 'otp' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
            >
              Phone + OTP
            </button>
            <button 
              onClick={() => setLoginMethod('password')}
              className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 transition-all ${loginMethod === 'password' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
            >
              Email + Pass
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {loginMethod === 'otp' ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Mobile Number</label>
                  <div className="relative group">
                    <Smartphone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                    <input 
                      type="tel" 
                      required
                      value={phone}
                      disabled={otpSent}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-5 pl-14 pr-6 font-bold text-sm focus:bg-white focus:border-emerald-500/30 transition-all"
                    />
                  </div>
                </div>

                {otpSent && (
                  <div className="space-y-2 animate-slideUp">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Enter 6-Digit OTP</label>
                    <div className="relative group">
                      <CheckCircle2 className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500" size={20} />
                      <input 
                        type="text" 
                        required
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="0 0 0 0 0 0"
                        className="w-full bg-white border-2 border-emerald-500 rounded-2xl py-5 pl-14 pr-6 font-black text-lg tracking-[0.5em] focus:ring-4 focus:ring-emerald-500/5 transition-all"
                      />
                    </div>
                    <button type="button" onClick={() => setOtpSent(false)} className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Resend OTP</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Email</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@health.in" 
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-5 px-6 font-bold text-sm focus:bg-white focus:border-emerald-500/30 transition-all outline-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Password</label>
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-5 px-6 font-bold text-sm focus:bg-white focus:border-emerald-500/30 transition-all outline-none" 
                  />
                </div>
                <div className="flex items-center gap-3 px-1">
                  <button 
                    type="button"
                    onClick={() => setRememberMe(!rememberMe)}
                    className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center ${rememberMe ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 bg-slate-50'}`}
                  >
                    {rememberMe && <CheckCircle2 size={16} />}
                  </button>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest cursor-pointer select-none" onClick={() => setRememberMe(!rememberMe)}>Remember Me</span>
                </div>
              </div>
            )}

            <button 
              type="submit" 
              className="w-full py-6 bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-2xl flex items-center justify-center gap-3"
            >
              {otpSent || loginMethod === 'password' ? 'Initialize Session' : 'Request OTP'} <ArrowRight size={18} />
            </button>
          </form>
          
          <div className="mt-8 flex justify-center gap-8">
            <button 
              onClick={() => setSelectedRole('user')}
              className={`text-[10px] font-black uppercase tracking-[0.2em] pb-1 border-b-2 transition-all ${selectedRole === 'user' ? 'text-emerald-600 border-emerald-600' : 'text-slate-300 border-transparent'}`}
            >
              Patient Portal
            </button>
            <button 
              onClick={() => setSelectedRole('staff')}
              className={`text-[10px] font-black uppercase tracking-[0.2em] pb-1 border-b-2 transition-all ${selectedRole === 'staff' ? 'text-indigo-600 border-indigo-600' : 'text-slate-300 border-transparent'}`}
            >
              Staff Access
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
