import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { User, Bell, Lock, Globe, ShieldAlert, Camera, LogOut, Trash2, Zap, ChevronRight } from "lucide-react";
import { cn } from "../lib/utils";
import { useAuth } from "../contexts/useAuth";

const Switch = ({ checked, onChange }: { checked: boolean, onChange: (v: boolean) => void }) => (
  <button 
    type="button"
    onClick={() => onChange(!checked)}
    className={cn(
      "w-11 h-6 rounded-full transition-colors relative",
      checked ? "bg-[#00b5c0]" : "bg-slate-200"
    )}
  >
    <span className={cn(
      "absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm",
      checked ? "translate-x-5" : "translate-x-0"
    )} />
  </button>
);

const Chip = ({ active, label, onClick }: { active: boolean, label: string, onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "px-4 py-2 rounded-full text-[14px] font-medium transition-colors border",
      active 
        ? "bg-[#ffdbcf] text-accent border-[#ffdbcf]" 
        : "bg-white text-muted-foreground border-border hover:border-primary/50 hover:text-primary"
    )}
  >
    {label}
  </button>
);

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateProfile, logout } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState(() => ({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
  }));
  const [showSuccess, setShowSuccess] = useState(false);

  const [preferences, setPreferences] = useState({
    style: "Adventure",
    transport: ["Flight", "Train"],
    reminders: true,
    updates: true,
    aiSuggestions: true,
    twoFactor: false,
    publicProfile: true
  });

  const togglePref = (key: keyof typeof preferences) => {
    if (typeof preferences[key] === 'boolean') {
      setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const toggleArray = (key: 'transport', val: string) => {
    setPreferences(prev => {
      const arr = prev[key];
      return { ...prev, [key]: arr.includes(val) ? arr.filter(i => i !== val) : [...arr, val] };
    });
  };

  return (
    <div className="flex flex-col w-full relative pt-32 pb-24 px-4 md:px-12 items-center min-h-screen bg-[#fcf8f5]">
      <div className="w-full max-w-[1000px]">
        {/* Header Section */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-[36px] md:text-[48px] font-bold text-foreground leading-[1.2] tracking-tight">Profile Settings</h1>
          <p className="text-[16px] text-muted-foreground mt-2">Manage your account and personalize your travel planning experience.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Overview & Personal Info */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            
            {/* Profile Overview */}
            <div className="bg-white rounded-[40px] p-8 shadow-[0px_10px_30px_rgba(164,60,18,0.03)] border border-orange-50 flex flex-col items-center text-center">
              <div className="relative mb-4 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md flex items-center justify-center bg-orange-100">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Profile" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <User size={48} className="text-primary/50" />
                  )}
                </div>
                <div className="absolute bottom-0 right-0 w-10 h-10 bg-primary rounded-full border-4 border-white flex items-center justify-center text-white shadow-sm hover:bg-orange-600 transition-colors">
                  <Camera size={18} />
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const base64String = reader.result as string;
                        updateProfile({ avatarUrl: base64String });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>
              <h2 className="text-[24px] font-bold text-foreground">{user?.name || 'Explorer'}</h2>
              <p className="text-muted-foreground text-[14px]">{user?.email}</p>
              <div className="mt-4 px-4 py-1.5 rounded-full bg-[#8bf1e6]/30 text-[#006970] text-[12px] font-bold tracking-widest uppercase">
                Pro Explorer
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-[40px] p-8 shadow-[0px_10px_30px_rgba(164,60,18,0.03)] border border-orange-50">
              <div className="flex items-center gap-3 mb-6">
                <User className="text-accent" size={24} />
                <h3 className="text-[20px] font-semibold text-foreground">Personal Info</h3>
              </div>
              <form 
                className="flex flex-col gap-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  updateProfile(formData);
                  setShowSuccess(true);
                  setTimeout(() => setShowSuccess(false), 3000);
                }}
              >
                <div className="flex flex-col gap-1.5">
                  <label className="text-[14px] font-semibold text-slate-700">Full Name</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-[#fcf8f5] rounded-2xl px-4 py-3 outline-none focus:ring-2 ring-primary/20 border border-transparent focus:border-primary/30 transition-all text-foreground" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[14px] font-semibold text-slate-700 flex justify-between items-center">
                    Email Address
                    <span className="text-[11px] font-normal text-muted-foreground bg-slate-100 px-2 py-0.5 rounded-full">Used for Trips</span>
                  </label>
                  <input disabled type="email" value={formData.email} className="bg-slate-50 rounded-2xl px-4 py-3 outline-none border border-transparent text-slate-500 cursor-not-allowed" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[14px] font-semibold text-slate-700">Phone Number</label>
                  <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="bg-[#fcf8f5] rounded-2xl px-4 py-3 outline-none focus:ring-2 ring-primary/20 border border-transparent focus:border-primary/30 transition-all text-foreground" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[14px] font-semibold text-slate-700">Location</label>
                  <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="bg-[#fcf8f5] rounded-2xl px-4 py-3 outline-none focus:ring-2 ring-primary/20 border border-transparent focus:border-primary/30 transition-all text-foreground" />
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <button type="submit" className="flex-1 bg-primary text-white py-3.5 rounded-full font-medium shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-center">
                    Save Changes
                  </button>
                  {showSuccess && (
                    <span className="text-green-600 font-medium text-[14px] animate-in fade-in slide-in-from-bottom-2 duration-300">
                      Profile updated!
                    </span>
                  )}
                </div>
              </form>
            </div>
            
          </div>

          {/* Right Column: Preferences, Security & Danger */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            
            {/* Travel Preferences */}
            <div className="bg-white rounded-[40px] p-8 shadow-[0px_10px_30px_rgba(164,60,18,0.03)] border border-orange-50">
              <div className="flex items-center gap-3 mb-6">
                <Globe className="text-[#00b5c0]" size={24} />
                <h3 className="text-[20px] font-semibold text-foreground">Travel Preferences</h3>
              </div>
              
              <div className="flex flex-col gap-6">
                <div>
                  <label className="text-[14px] font-semibold text-slate-700 block mb-3">Preferred Travel Style</label>
                  <div className="flex flex-wrap gap-2">
                    {["Adventure", "Relaxed", "Cultural", "Nightlife"].map(style => (
                      <Chip key={style} label={style} active={preferences.style === style} onClick={() => setPreferences(p => ({...p, style}))} />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[14px] font-semibold text-slate-700 block mb-3">Preferred Transport</label>
                  <div className="flex flex-wrap gap-2">
                    {["Flight", "Train", "Bus", "Roadtrip", "Cruise"].map(trans => (
                      <Chip key={trans} label={trans} active={preferences.transport.includes(trans)} onClick={() => toggleArray('transport', trans)} />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[14px] font-semibold text-slate-700">Avg Trip Budget</label>
                    <select className="bg-[#fcf8f5] rounded-2xl px-4 py-3 outline-none focus:ring-2 ring-primary/20 border border-transparent focus:border-primary/30 transition-all text-foreground appearance-none">
                      <option>Budget-Friendly</option>
                      <option>Moderate</option>
                      <option>Luxury</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[14px] font-semibold text-slate-700">Typical Duration</label>
                    <select className="bg-[#fcf8f5] rounded-2xl px-4 py-3 outline-none focus:ring-2 ring-primary/20 border border-transparent focus:border-primary/30 transition-all text-foreground appearance-none">
                      <option>Weekend Getaway</option>
                      <option>1-2 Weeks</option>
                      <option>1 Month+</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications & AI */}
            <div className="bg-white rounded-[40px] p-8 shadow-[0px_10px_30px_rgba(164,60,18,0.03)] border border-orange-50">
              <div className="flex items-center gap-3 mb-6">
                <Bell className="text-accent" size={24} />
                <h3 className="text-[20px] font-semibold text-foreground">Notifications & AI</h3>
              </div>
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-[15px] font-medium text-foreground">Trip Reminders</h4>
                    <p className="text-[13px] text-muted-foreground">Receive alerts for upcoming activities.</p>
                  </div>
                  <Switch checked={preferences.reminders} onChange={() => togglePref('reminders')} />
                </div>
                <div className="h-px w-full bg-border/40" />
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-[15px] font-medium text-foreground">Participant Updates</h4>
                    <p className="text-[13px] text-muted-foreground">Get notified when friends join or edit the trip.</p>
                  </div>
                  <Switch checked={preferences.updates} onChange={() => togglePref('updates')} />
                </div>
                <div className="h-px w-full bg-border/40" />
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-[15px] font-medium text-foreground flex items-center gap-2"><Zap size={16} className="text-accent"/> AI Suggestions</h4>
                    <p className="text-[13px] text-muted-foreground">Allow AI to proactively suggest activities.</p>
                  </div>
                  <Switch checked={preferences.aiSuggestions} onChange={() => togglePref('aiSuggestions')} />
                </div>
              </div>
            </div>

            {/* Privacy & Security */}
            <div className="bg-white rounded-[40px] p-8 shadow-[0px_10px_30px_rgba(164,60,18,0.03)] border border-orange-50">
              <div className="flex items-center gap-3 mb-6">
                <Lock className="text-[#006970]" size={24} />
                <h3 className="text-[20px] font-semibold text-foreground">Privacy & Security</h3>
              </div>
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-[15px] font-medium text-foreground">Two-Factor Authentication</h4>
                    <p className="text-[13px] text-muted-foreground">Add an extra layer of security to your account.</p>
                  </div>
                  <Switch checked={preferences.twoFactor} onChange={() => togglePref('twoFactor')} />
                </div>
                <div className="h-px w-full bg-border/40" />
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-[15px] font-medium text-foreground">Public Profile</h4>
                    <p className="text-[13px] text-muted-foreground">Allow other travelers to find your profile.</p>
                  </div>
                  <Switch checked={preferences.publicProfile} onChange={() => togglePref('publicProfile')} />
                </div>
                <div className="mt-4">
                  <button type="button" className="text-primary text-[14px] font-medium hover:underline flex items-center gap-2">
                    Change Password <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50/50 rounded-[40px] p-8 border border-red-100">
              <div className="flex items-center gap-3 mb-6">
                <ShieldAlert className="text-red-500" size={24} />
                <h3 className="text-[20px] font-semibold text-red-900">Danger Zone</h3>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button type="button" onClick={() => { logout(); navigate('/login'); }} className="flex items-center justify-center gap-2 bg-white text-slate-700 px-6 py-3 rounded-full font-medium shadow-sm hover:bg-slate-50 transition-colors border border-slate-200 w-full sm:w-auto">
                  <LogOut size={18} /> Log Out
                </button>
                <button type="button" className="flex items-center justify-center gap-2 bg-white text-red-600 px-6 py-3 rounded-full font-medium shadow-sm hover:bg-red-50 transition-colors border border-red-200 w-full sm:w-auto">
                  <Trash2 size={18} /> Delete Account
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
