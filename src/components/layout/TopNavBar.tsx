import { Link, useLocation } from "react-router-dom";
import { User } from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuth } from "../../contexts/useAuth";

export default function TopNavBar() {
  const location = useLocation();
  const { user } = useAuth();

  const links = [
    { name: "Home", path: "/" },
    { name: "My Trips", path: "/trips" },
    { name: "Plan with AI", path: "/trips/ai" },
    { name: "Create Trip", path: "/trips/create" },
  ];

  return (
    <header className="absolute top-0 left-0 w-full z-50 px-4 md:px-12 py-6 flex justify-center">
      <div className="max-w-[1280px] w-full flex items-center bg-white/70 backdrop-blur-md shadow-[0px_1px_2px_0px_rgba(249,115,22,0.05)] rounded-full px-6 md:px-8 py-3">
        <div className="flex-1 flex items-center gap-4 md:gap-12">
          <Link to="/" className="text-primary text-[24px] md:text-[30px] font-bold tracking-[-1.5px]">
            Tripia
          </Link>
          <nav className="flex-1 hidden md:flex items-center justify-center gap-8">
            {links.map((link) => {
              const isActive = location.pathname === link.path || (link.path !== "/" && location.pathname.startsWith(link.path));
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    "text-[14px] tracking-[0.35px] pb-1.5 border-b-2 transition-colors",
                    isActive 
                      ? "text-primary border-primary font-semibold" 
                      : "text-slate-600 border-transparent font-medium hover:text-primary"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center justify-end flex-1 md:flex-none">
            <Link to="/profile" className="w-10 h-10 rounded-full bg-orange-100 overflow-hidden flex items-center justify-center text-primary hover:bg-orange-200 transition-colors shadow-sm">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={20} />
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
