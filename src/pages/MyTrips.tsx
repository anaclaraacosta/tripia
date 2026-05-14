import { Link } from "react-router-dom";
import { MapPin, Users, Calendar } from "lucide-react";
import { useTrips } from "../contexts/useTrips";

export default function MyTrips() {
  const { trips } = useTrips();

  return (
    <div className="flex flex-col w-full relative pt-32 pb-16 px-4 md:px-12 items-center">
      <div className="w-full max-w-[1280px]">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-[40px] md:text-[48px] font-semibold text-foreground leading-[1.1]">My Trips</h1>
            <p className="text-[16px] text-muted-foreground mt-2">All your past and upcoming adventures.</p>
          </div>
          <Link to="/trips/create" className="bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-orange-600 transition-colors">
            + New Trip
          </Link>
        </div>

        {trips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trips.map((trip) => (
              <Link to={`/trip/${trip.id}`} key={trip.id} className="group flex flex-col bg-white rounded-[32px] overflow-hidden shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-orange-50 hover:-translate-y-1 transition-transform">
                <div className="relative h-[240px] overflow-hidden">
                  <img src={trip.imageUrl || trip.image || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80"} alt={trip.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 text-[12px] font-semibold text-slate-700">
                    <Users size={14} /> {trip.travelersCount}
                  </div>
                </div>
                <div className="p-6 flex flex-col gap-2">
                  <h3 className="text-[20px] font-semibold text-foreground group-hover:text-primary transition-colors">{trip.title}</h3>
                  <div className="flex items-center gap-2 text-muted-foreground text-[14px]">
                    <Calendar size={16} />
                    <span>{trip.startDate} - {trip.endDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground text-[14px]">
                    <MapPin size={16} />
                    <span>{trip.destinationCity || "Multiple Locations"}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center text-primary mb-6">
              <MapPin size={40} />
            </div>
            <h2 className="text-[28px] font-semibold text-foreground mb-3">You don't have any trips yet.</h2>
            <p className="text-muted-foreground max-w-[400px] mb-8 text-[16px]">
              Ready to start your next adventure? Create a new trip manually or use our AI to plan the perfect itinerary.
            </p>
            <Link to="/trips/create" className="bg-primary text-white px-8 py-4 rounded-full font-medium hover:bg-orange-600 transition-colors shadow-md hover:-translate-y-1">
              Create a new trip
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
