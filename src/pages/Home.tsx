import { useRef, useState, useMemo } from "react";
import { ArrowRight, Plane, Search, Receipt, Map, Zap, ChevronLeft, ChevronRight, MapPin, Calendar } from "lucide-react";
import { cn } from "../lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { Autocomplete, type AutocompleteDestination } from "../components/Autocomplete";
import { useTrips } from "../contexts/useTrips";

const AITemplates = [
  { id: 1, title: 'Hidden Gems in Kyoto', desc: 'Discover quiet zen gardens and authentic tea houses away from the crowds.', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80', param: '?idea=Hidden%20gems%20in%20Kyoto&destination=Kyoto', bg: 'from-[#ffdbcf] to-[rgba(255,127,80,0.2)]', textClass: 'text-[#6c2000]' },
  { id: 2, title: 'Group Travel Tip', desc: 'Try splitting costs in real-time with our new Shared Wallet feature to avoid awkward math.', icon: Receipt, param: '?tripType=Group%20(3-8)', bg: 'from-[#8ef4e9] to-[rgba(139,241,230,0.2)]', textClass: 'text-[#006f67]' },
  { id: 3, title: 'Weekend in Buenos Aires', desc: 'A food and tango focused quick escape for you.', img: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&q=80', param: '?idea=Weekend%20food%20trip%20in%20Buenos%20Aires&destination=Buenos%20Aires', bg: 'from-[#ffe8b3] to-[rgba(255,200,0,0.2)]', textClass: 'text-[#806600]' },
  { id: 4, title: 'Architecture Walk in Barcelona', desc: 'Explore Gaudi and modernisme masterpieces safely.', img: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&q=80', param: '?idea=Architecture%20walk&destination=Barcelona', bg: 'from-[#e0e7ff] to-[rgba(99,102,241,0.2)]', textClass: 'text-[#3730a3]' }
];

export default function Home() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { trips } = useTrips();
  const [destination, setDestination] = useState("");
  const [selectedDest, setSelectedDest] = useState<AutocompleteDestination | null>(null);

  const [suggestions] = useState(() => {
    const shuffled = [...AITemplates].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 2);
  });

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 400;
      carouselRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const handlePlanWithAI = () => {
    const destToPass = selectedDest ? selectedDest.displayName : destination;
    const url = destToPass 
      ? `/trips/ai?destination=${encodeURIComponent(destToPass)}`
      : `/trips/ai`;
    navigate(url);
  };

  const myRecentTrips = useMemo(() => trips.slice(0, 5), [trips]);

  const nearestTrip = useMemo(() => {
    if (trips.length === 0) return null;
    
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const upcoming = trips.filter(t => {
      const start = new Date(t.startDate);
      start.setHours(0, 0, 0, 0);
      return start >= now;
    }).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    
    if (upcoming.length > 0) return upcoming[0];
    
    const past = [...trips].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    return past[0];
  }, [trips]);

  return (
    <div className="flex flex-col w-full relative">
      <div className="absolute top-[250px] left-0 w-full h-[695px] bg-gradient-to-b from-transparent to-[#fff8f3] z-0 pointer-events-none" />
      
      <section className="w-full h-[500px] md:h-[580px] relative flex flex-col items-center">
        <div className="absolute inset-0 overflow-hidden rounded-b-[48px] md:rounded-b-[64px] z-0">
          <img 
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1121&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-90 object-center"
          />
        </div>
        
        <div className="relative z-50 flex flex-col items-center mt-[180px] md:mt-[200px]">
          <h1 className="text-[40px] md:text-[56px] font-extrabold italic tracking-[-0.96px] text-[#fff8f3] text-center drop-shadow-md px-4 leading-tight">
            The Joy of Shared Discovery.
          </h1>
          
          <div className="mt-[40px] md:mt-[84px] bg-white/80 backdrop-blur-[12px] p-2 rounded-full flex items-center shadow-[0px_10px_15px_-3px_rgba(164,60,18,0.05)] w-[90%] max-w-[672px]">
            <div className="pl-6 text-slate-500">
              <Search size={20} />
            </div>
            <Autocomplete 
              placeholder="Where are we going together?" 
              value={destination}
              onChange={(v) => {
                setDestination(v);
                setSelectedDest(null);
              }}
              onSelect={(d) => {
                setDestination(d.displayName);
                setSelectedDest(d);
              }}
              className="bg-transparent border-none px-4 py-4 text-[16px] text-slate-700 placeholder:text-slate-500"
              dropdownClassName="mt-4 rounded-3xl"
            />
            <button 
              onClick={handlePlanWithAI}
              className="bg-[#ff7f50] hover:bg-[#ff6b36] transition-colors text-[#6c2000] px-8 py-4 rounded-full text-[16px] font-medium flex items-center gap-2 shrink-0"
            >
              <Zap size={18} />
              Plan with AI
            </button>
          </div>
        </div>
      </section>

      <section className="relative z-20 w-[90%] max-w-[1280px] mx-auto -mt-[70px] md:-mt-[90px] bg-[#fbf2e8] border-2 border-[#fff8f3] rounded-[32px] p-8 md:p-12 drop-shadow-sm flex flex-wrap justify-center md:justify-around items-center gap-8 md:gap-16">
        {[
          { name: "Create Trip", icon: Plane, bg: "bg-[#ffdbcf]", path: "/trips/create" },
          { name: "Plan with AI", icon: Zap, bg: "bg-[#8bf1e6]", path: "/trips/ai" },
          { name: "Expenses", icon: Receipt, bg: "bg-[#7af4ff]", path: "/trips" },
          { name: "Itineraries", icon: Map, bg: "bg-[#ffb59c]", path: "/trips" },
        ].map((action) => (
          <Link to={action.path} key={action.name} className="group flex flex-col items-center gap-3 hover:-translate-y-2 transition-transform duration-300">
            <div className={cn("w-14 h-14 rounded-full flex items-center justify-center text-slate-700 shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300", action.bg)}>
              <action.icon size={20} />
            </div>
            <span className="text-[14px] font-medium text-muted-foreground tracking-[0.14px]">{action.name}</span>
          </Link>
        ))}
      </section>

      <section className="relative z-20 w-[90%] max-w-[1000px] mx-auto mt-8 overflow-hidden bg-white/40 backdrop-blur-md rounded-full border border-white/60 py-3 px-6 shadow-[0px_4px_20px_rgba(0,0,0,0.03)] flex items-center gap-4">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-accent shrink-0">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" /> Live Now
        </div>
        <div className="flex-1 overflow-hidden relative" style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
           <div className="animate-marquee flex whitespace-nowrap gap-12 text-[14px] text-slate-700 font-medium w-max">
             <span>✈️ Sarah just planned a trip to <span className="font-semibold text-slate-900">Tokyo</span></span>
             <span>🌟 45 people are exploring <span className="font-semibold text-slate-900">Patagonia</span> right now</span>
             <span>🍕 Mike added "Pizza Tour" to his <span className="font-semibold text-slate-900">Rome</span> itinerary</span>
             <span>🏔️ Alex booked a cabin in the <span className="font-semibold text-slate-900">Swiss Alps</span></span>
             <span aria-hidden="true">✈️ Sarah just planned a trip to <span className="font-semibold text-slate-900">Tokyo</span></span>
             <span aria-hidden="true">🌟 45 people are exploring <span className="font-semibold text-slate-900">Patagonia</span> right now</span>
             <span aria-hidden="true">🍕 Mike added "Pizza Tour" to his <span className="font-semibold text-slate-900">Rome</span> itinerary</span>
             <span aria-hidden="true">🏔️ Alex booked a cabin in the <span className="font-semibold text-slate-900">Swiss Alps</span></span>
           </div>
        </div>
      </section>

      <section className="relative z-10 w-[90%] max-w-[1280px] mx-auto mt-24 md:mt-32">
        <div className="absolute top-0 right-0 w-72 h-72 bg-orange-200/40 rounded-full mix-blend-multiply filter blur-[64px] animate-blob z-0" />
        <div className="absolute top-40 -left-20 w-72 h-72 bg-teal-200/40 rounded-full mix-blend-multiply filter blur-[64px] animate-blob z-0" style={{ animationDelay: '2s' }} />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between md:items-end mb-8 gap-4">
          <div>
            <h2 className="text-[32px] font-semibold text-foreground leading-[38.4px]">My Recent Trips</h2>
            <p className="text-[16px] text-muted-foreground mt-2">Beautiful moments captured together.</p>
          </div>
          {myRecentTrips.length > 0 && (
            <div className="flex items-center gap-4">
              <Link to="/trips" className="hidden md:block text-accent text-[16px] border-b border-accent/20 pb-1 hover:border-accent transition-colors mr-4">
                View all history
              </Link>
              <button onClick={() => scroll('left')} className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-orange-50 transition-colors">
                <ChevronLeft size={20} />
              </button>
              <button onClick={() => scroll('right')} className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-orange-50 transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
        
        {myRecentTrips.length > 0 ? (
          <div ref={carouselRef} className="relative z-10 flex overflow-x-auto gap-6 md:gap-8 pb-8 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {myRecentTrips.map((trip) => (
              <div key={trip.id} onClick={() => navigate(`/trip/${trip.id}`)} className="relative h-[400px] w-[85vw] md:w-[400px] shrink-0 snap-center rounded-[32px] overflow-hidden shadow-sm group cursor-pointer">
                <img src={trip.imageUrl || trip.image || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80"} alt={trip.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent via-black/20 opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#8bf1e6]/40 top-[60%] mix-blend-overlay" />
                
                <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col justify-end">
                  <p className="text-[12px] text-white/80 tracking-[1.2px] uppercase mb-2 font-medium">
                    {trip.startDate} - {trip.endDate}
                  </p>
                  <h3 className="text-[24px] font-medium text-white leading-[30px] drop-shadow-md">
                    {trip.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 bg-white/50 backdrop-blur-sm rounded-[32px] border border-orange-50 text-center">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center text-primary mb-4">
              <MapPin size={32} />
            </div>
            <h3 className="text-[24px] font-semibold text-foreground mb-2">No trips yet</h3>
            <p className="text-muted-foreground max-w-[300px] mb-6">Create a trip manually or let our AI build one for you.</p>
            <Link to="/trips/create" className="bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-orange-600 transition-colors shadow-sm">
              Create a new trip
            </Link>
          </div>
        )}
      </section>

      <section className="relative z-10 w-[90%] max-w-[1280px] mx-auto mt-24 md:mt-32 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="col-span-1 lg:col-span-5 bg-[#f6ece3] rounded-[32px] p-8">
          <h2 className="text-[24px] font-medium text-foreground mb-6">Upcoming Agenda</h2>
          <div className="flex flex-col gap-0">
            {!nearestTrip ? (
              <div className="text-center py-12 text-muted-foreground flex flex-col items-center">
                <Calendar size={32} className="mb-4 opacity-50" />
                <p>No upcoming agenda.</p>
                <p className="text-[14px]">Plan a trip to see your itinerary here!</p>
              </div>
            ) : nearestTrip.itinerary.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground flex flex-col items-center">
                <Calendar size={32} className="mb-4 opacity-50" />
                <p className="font-medium text-foreground mb-1">No itinerary items yet.</p>
                <button onClick={() => navigate(`/trip/${nearestTrip.id}`)} className="text-primary hover:underline text-[14px] font-medium mt-2">
                  Add items to "{nearestTrip.title}"
                </button>
              </div>
            ) : (
              nearestTrip.itinerary.slice(0, 3).map((item, index, array) => (
                <div key={item.id} onClick={() => navigate(`/trip/${nearestTrip.id}`)} className="group flex gap-6 relative hover:bg-white/60 p-4 -mx-4 rounded-3xl transition-all cursor-pointer">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "w-3 h-3 rounded-full mt-1.5 shrink-0 z-10 outline outline-4 outline-[#f6ece3]",
                      index % 3 === 0 ? "bg-accent" : index % 3 === 1 ? "bg-[#8bf1e6]" : "bg-[#00b5c0]"
                    )} />
                    {index !== array.length - 1 && (
                      <div className="w-px h-full bg-[#dec0b6] absolute top-6 bottom-0 left-5 md:left-[21.5px]" />
                    )}
                  </div>
                  <div className="flex flex-col gap-1 pb-4">
                    <span className={cn(
                      "text-[12px] uppercase font-semibold tracking-wide",
                      index % 3 === 0 ? "text-accent" : index % 3 === 1 ? "text-[#006a63]" : "text-[#006970]"
                    )}>
                      Day {index + 1}
                    </span>
                    <h4 className="text-[16px] font-semibold text-foreground">{item.title}</h4>
                    <p className="text-[14px] text-muted-foreground leading-relaxed line-clamp-2">{item.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="col-span-1 lg:col-span-7 flex flex-col gap-6">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="text-accent" size={24} />
            <h2 className="text-[24px] font-medium text-foreground">AI Crafted for You</h2>
          </div>
          
          {suggestions.map(s => {
            const Icon = s.icon;
            return (
              <div key={s.id} onClick={() => navigate(`/trips/ai${s.param}`)} className={`group bg-gradient-to-br ${s.bg} rounded-[32px] p-6 md:p-8 flex items-center justify-between shadow-sm cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all duration-300`}>
                <div className="flex-1 pr-6">
                  <h4 className={`text-[16px] font-medium mb-2 transition-colors ${s.textClass}`}>{s.title}</h4>
                  <p className="text-[16px] text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
                {s.img ? (
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-[40px] md:rounded-[48px] overflow-hidden shrink-0 shadow-md">
                    <img src={s.img} alt={s.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                ) : (
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-[40px] md:rounded-[48px] bg-white/40 flex items-center justify-center shrink-0 shadow-md">
                    {Icon && <Icon size={32} className={`${s.textClass} group-hover:scale-110 transition-transform duration-300`} />}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="relative z-10 w-[90%] max-w-[1280px] mx-auto mt-32 mb-16 rounded-[48px] overflow-hidden shadow-xl hover:shadow-[0px_20px_60px_rgba(249,115,22,0.3)] hover:-translate-y-2 transition-all duration-500 group bg-[#ff7f50]">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 blur-[32px] rounded-full" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-black/5 blur-[32px] rounded-full" />
        
        <div className="relative z-10 px-8 py-20 flex flex-col items-center text-center">
          <div className="px-5 py-2 rounded-full border border-white/40 bg-white/20 backdrop-blur-md text-white text-[12px] font-bold tracking-widest uppercase mb-8 shadow-sm group-hover:bg-white/30 transition-colors">
            Your Next Adventure Awaits
          </div>
          <h2 className="text-[40px] md:text-[56px] font-bold text-white mb-6 drop-shadow-sm leading-tight">
            Start your next chapter.
          </h2>
          <p className="text-[18px] text-white/90 max-w-[600px] mb-12 leading-relaxed font-medium">
            Every great story begins with a single step. Let Tripia help you write the next one with your favorite people.
          </p>
          <Link to="/trips/create" className="group/btn relative bg-white text-accent px-12 py-5 rounded-full text-[18px] font-bold shadow-[0px_10px_30px_rgba(0,0,0,0.15)] hover:scale-105 transition-all duration-300 flex items-center gap-3 overflow-hidden">
            <span className="relative z-10">Create a New Trip</span>
            <ArrowRight size={20} className="relative z-10 group-hover/btn:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-orange-50 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 z-0" />
          </Link>
          <p className="text-white/70 text-[14px] mt-6 font-medium">Join 100,000+ travelers exploring the world together.</p>
        </div>
      </section>

    </div>
  );
}
