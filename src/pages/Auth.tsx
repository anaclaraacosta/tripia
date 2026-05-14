import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Plane, ArrowRight } from "lucide-react";
import { useAuth } from "../contexts/useAuth";

const AuthLayout = ({ children, image, title, subtitle }: { children: React.ReactNode, image: string, title: string, subtitle: string }) => (
  <div className="min-h-screen w-full flex bg-[#fcf8f5]">
    {/* Image Side */}
    <div className="hidden lg:flex w-[45%] relative p-6">
      <div className="w-full h-full relative rounded-[48px] overflow-hidden shadow-2xl">
        <img src={image} className="absolute inset-0 w-full h-full object-cover" alt="Travel background" />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(164,60,18,0.9)] via-[rgba(164,60,18,0.2)] to-transparent mix-blend-multiply" />
        <div className="absolute bottom-16 left-16 right-16 z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-accent shadow-lg">
              <Plane size={24} />
            </div>
            <span className="text-white text-3xl font-bold tracking-tight italic">Tripia</span>
          </div>
          <h2 className="text-[40px] xl:text-[48px] font-extrabold text-white leading-[1.15] tracking-[-0.96px] drop-shadow-md">
            {title}
          </h2>
          <p className="text-white/90 text-[18px] mt-4 font-medium max-w-md drop-shadow-sm">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
    
    {/* Form Side */}
    <div className="w-full lg:w-[55%] flex flex-col justify-center items-center p-8 md:p-24 relative">
      <Link to="/" className="absolute top-10 right-10 text-muted-foreground hover:text-accent font-medium text-[15px] transition-colors border-b border-transparent hover:border-accent">
        Back to Home
      </Link>
      
      <div className="w-full max-w-[440px]">
        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center gap-3 mb-12 justify-center">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white shadow-lg">
            <Plane size={24} />
          </div>
          <span className="text-foreground text-3xl font-bold tracking-tight italic">Tripia</span>
        </div>

        {children}
      </div>
    </div>
  </div>
);

export function Login() {
  const { login, isAuthenticated } = useAuth();
  const [error, setError] = useState<string | null>(null);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
    const password = (e.currentTarget.elements.namedItem('password') as HTMLInputElement).value;
    
    const result = login(email, password);
    if (result !== true) {
      setError(result);
    }
  };

  return (
    <AuthLayout 
      image="https://images.unsplash.com/photo-1522881451255-f59ad836fdfb?auto=format&fit=crop&q=80"
      title="The Joy of Shared Discovery."
      subtitle="Log in to continue planning your trips with your favorite people."
    >
      <div className="mb-8 text-center lg:text-left">
        <h1 className="text-[36px] font-bold text-foreground leading-[1.2] mb-3">Welcome Back</h1>
        <p className="text-muted-foreground text-[16px]">Enter your credentials to access your trips.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-[14px] rounded-2xl flex items-center gap-2">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
          <input 
            name="email"
            type="email" 
            placeholder="name@example.com" 
            className="bg-white rounded-[20px] px-5 py-4 outline-none focus:ring-4 ring-primary/10 transition-all border border-orange-50 focus:border-primary/40 shadow-sm text-[16px] text-foreground" 
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-bold text-slate-700 uppercase tracking-wider">Password</label>
          <input 
            name="password"
            type="password" 
            placeholder="Enter your password" 
            className="bg-white rounded-[20px] px-5 py-4 outline-none focus:ring-4 ring-primary/10 transition-all border border-orange-50 focus:border-primary/40 shadow-sm text-[16px] text-foreground" 
            required
          />
          <div className="flex justify-end mt-1">
            <a href="#" className="text-[14px] text-primary font-medium hover:underline">Forgot password?</a>
          </div>
        </div>
        
        <button type="submit" className="group mt-4 w-full bg-primary hover:bg-[#e06510] text-white py-4 rounded-full font-bold text-[16px] transition-all hover:-translate-y-1 shadow-[0_8px_20px_rgba(249,115,22,0.25)] flex items-center justify-center gap-2">
          Log In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </form>

      <p className="text-center lg:text-left text-muted-foreground mt-10 text-[15px]">
        Don't have an account? <Link to="/register" className="text-accent font-bold hover:underline">Sign up</Link>
      </p>
    </AuthLayout>
  );
}

export function Register() {
  const { register, isAuthenticated } = useAuth();
  const [error, setError] = useState<string | null>(null);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const name = (e.currentTarget.elements.namedItem('name') as HTMLInputElement).value;
    const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
    const password = (e.currentTarget.elements.namedItem('password') as HTMLInputElement).value;
    
    const result = register(name, email, password);
    if (result !== true) {
      setError(result);
    }
  };

  return (
    <AuthLayout 
      image="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80"
      title="Start your next chapter."
      subtitle="Join Tripia and start writing your next adventure together."
    >
      <div className="mb-8 text-center lg:text-left">
        <h1 className="text-[36px] font-bold text-foreground leading-[1.2] mb-3">Create Account</h1>
        <p className="text-muted-foreground text-[16px]">It's completely free to join and start planning.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-[14px] rounded-2xl flex items-center gap-2">
          {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-bold text-slate-700 uppercase tracking-wider">Full Name</label>
          <input 
            name="name"
            type="text" 
            placeholder="Sarah Jenkins" 
            className="bg-white rounded-[20px] px-5 py-4 outline-none focus:ring-4 ring-primary/10 transition-all border border-orange-50 focus:border-primary/40 shadow-sm text-[16px] text-foreground" 
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
          <input 
            name="email"
            type="email" 
            placeholder="name@example.com" 
            className="bg-white rounded-[20px] px-5 py-4 outline-none focus:ring-4 ring-primary/10 transition-all border border-orange-50 focus:border-primary/40 shadow-sm text-[16px] text-foreground" 
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-bold text-slate-700 uppercase tracking-wider">Password</label>
          <input 
            name="password"
            type="password" 
            placeholder="Create a strong password" 
            className="bg-white rounded-[20px] px-5 py-4 outline-none focus:ring-4 ring-primary/10 transition-all border border-orange-50 focus:border-primary/40 shadow-sm text-[16px] text-foreground" 
            required
          />
        </div>
        
        <button type="submit" className="group mt-4 w-full bg-[#00b5c0] hover:bg-[#009ca6] text-white py-4 rounded-full font-bold text-[16px] transition-all hover:-translate-y-1 shadow-[0_8px_20px_rgba(0,181,192,0.25)] flex items-center justify-center gap-2">
          Sign Up <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </form>

      <p className="text-center lg:text-left text-muted-foreground mt-10 text-[15px]">
        Already have an account? <Link to="/login" className="text-[#006970] font-bold hover:underline">Log in</Link>
      </p>
    </AuthLayout>
  );
}
