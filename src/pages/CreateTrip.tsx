import { useState } from "react";
import { Zap, MapPin, Calendar, Users, DollarSign, Plane } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { cn } from "../lib/utils";
import { destinations } from "../lib/destinations";
import { useTrips } from "../contexts/useTrips";
import { Autocomplete, type AutocompleteDestination } from "../components/Autocomplete";
import { generateLocalAITrip } from "../lib/aiTripPlanner";
import { resolveTripImageUrl, ensureImageExists } from "../lib/tripImages";

export default function CreateTrip({ isAI = false }: { isAI?: boolean }) {
  const { addTrip } = useTrips();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isGenerating, setIsGenerating] = useState(false);

  const [origin, setOrigin] = useState("");
  
  const [destination, setDestination] = useState(() => {
    return searchParams.get("destination") || "";
  });
  
  const [destinationObj, setDestinationObj] = useState<AutocompleteDestination | null>(() => {
    const destParam = searchParams.get("destination");
    if (!destParam) return null;
    const found = destinations.find(d => 
      d.displayName.toLowerCase() === destParam.toLowerCase() ||
      d.city.toLowerCase() === destParam.toLowerCase()
    );
    if (!found) return null;
    return {
      ...found,
      name: found.city,
      latitude: 0,
      longitude: 0,
      source: "local" as const
    };
  });

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [travelersCount, setTravelersCount] = useState(() => {
    const tt = searchParams.get("tripType");
    if (tt) return tt;
    return "Just me";
  });
  const [budgetLevel, setBudgetLevel] = useState("Moderate");
  const [preferences, setPreferences] = useState(() => {
    return searchParams.get("idea") || "";
  });

  // Removed useEffect that was causing lint error

  const handleCreate = async () => {
    if (!origin || !destination || !startDate || !endDate) {
      alert("Please fill all required fields (Origin, Destination, Dates)");
      return;
    }
    
    setIsGenerating(true);
    try {
      let count = 1;
      let tripType: "solo" | "couple" | "group" | "family" | "friends" = "solo";
      if (travelersCount === "Couple") { count = 2; tripType = "couple"; }
      if (travelersCount === "Group (3-8)") { count = 5; tripType = "group"; }
      if (travelersCount === "Large Group (8+)") { count = 10; tripType = "group"; }

      let finalTitle = `Trip to ${destinationObj?.city || destination.split(',')[0]}`;
      let finalSummary = "";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let finalParticipants: any[] = Array.from({ length: count }).map((_, i) => ({ id: `p-${i}`, name: i === 0 ? "You" : `Traveler ${i + 1}` }));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let finalExpenses: any[] = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let finalItinerary: any[] = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let finalTransportation: any[] = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let realPlaces: any[] = [];

      let resolvedBaseImage = resolveTripImageUrl({
        destination,
        destinationCity: destinationObj?.city || destination.split(',')[0],
        destinationCountry: destinationObj?.country || "",
        destinationObj,
        realPlaces
      });
      let finalImageUrl = await ensureImageExists(resolvedBaseImage);

      if (isAI) {
        try {
          const res = await fetch(`/api/ai/generate-trip`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              origin,
              destination: destinationObj || destination,
              startDate,
              endDate,
              tripType,
              travelersCount: count,
              budgetLevel,
              preferences,
            })
          });

          if (res.ok) {
            const data = await res.json();
            if (data.fallbackUsed) {
              console.log("Server fallback triggered, using local generator.");
              if (destinationObj && (destinationObj.latitude || destinationObj.longitude)) {
                try {
                  const pRes = await fetch(`/api/places/search?lat=${destinationObj.latitude}&lon=${destinationObj.longitude}&preferences=${encodeURIComponent(preferences)}`);
                  if (pRes.ok) realPlaces = await pRes.json();
                } catch (err) {
                  console.error("Failed to fetch places", err);
                }
              }
              const aiData = generateLocalAITrip({
                destinationCity: destinationObj?.city || destination.split(',')[0],
                tripType,
                travelersCount: count,
                budgetLevel,
                preferences,
                startDate,
                endDate,
                realPlaces,
                imageUrl: finalImageUrl
              });
              finalExpenses = aiData.expenses;
              finalItinerary = aiData.itinerary;
              finalTransportation = aiData.transportation;
              if (aiData.imageUrl) finalImageUrl = aiData.imageUrl;
            } else {
              finalExpenses = data.trip.expenses || [];
              finalItinerary = data.trip.itinerary || [];
              finalTransportation = data.trip.transportation || [];
              if (data.trip.title) finalTitle = data.trip.title;
              if (data.trip.summary) finalSummary = data.trip.summary;
              if (data.trip.participants) finalParticipants = data.trip.participants;
              if (data.trip.imageUrl) finalImageUrl = data.trip.imageUrl;
            }
          } else {
            throw new Error("Server returned error status");
          }
        } catch (err) {
          console.error("AI Generation Failed:", err);
          const aiData = generateLocalAITrip({
            destinationCity: destinationObj?.city || destination.split(',')[0],
            tripType,
            travelersCount: count,
            budgetLevel,
            preferences,
            startDate,
            endDate,
            realPlaces,
            imageUrl: finalImageUrl
          });
          finalExpenses = aiData.expenses;
          finalItinerary = aiData.itinerary;
          finalTransportation = aiData.transportation;
          if (aiData.imageUrl) finalImageUrl = aiData.imageUrl;
        }

        // Re-resolve the final image url using the robust helper, preferring server trip image if exists
        let resolvedImageUrl = resolveTripImageUrl({
          destination,
          destinationCity: destinationObj?.city || destination.split(',')[0],
          destinationCountry: destinationObj?.country || "",
          destinationObj: { ...(destinationObj || {}), imageUrl: finalImageUrl }, // Pass down any found image
          realPlaces
        });

        finalImageUrl = await ensureImageExists(resolvedImageUrl);
      }

      // Safety check: always guarantee a valid non-empty imageUrl
      if (!finalImageUrl || finalImageUrl.trim() === "") {
        finalImageUrl = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80";
      }

      const id = addTrip({
        title: finalTitle,
        summary: finalSummary,
        origin,
        destination,
        destinationCity: destinationObj?.city || destination.split(',')[0],
        destinationCountry: destinationObj?.country || "",
        imageUrl: finalImageUrl,
        startDate,
        endDate,
        tripType,
        travelersCount: count,
        participants: finalParticipants,
        expenses: finalExpenses,
        itinerary: finalItinerary,
        transportation: finalTransportation,
        generatedByAI: isAI
      });
      
      navigate(`/trip/${id}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col w-full relative pt-32 pb-16 px-4 md:px-12 items-center">
      <div className="w-full max-w-[800px] bg-white rounded-[48px] shadow-[0px_10px_40px_rgba(164,60,18,0.05)] border border-orange-50 p-8 md:p-12">
        <div className="flex items-center gap-4 mb-8">
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center shrink-0",
            isAI ? "bg-[#8bf1e6] text-[#006970]" : "bg-[#ffdbcf] text-accent"
          )}>
            {isAI ? <Zap size={32} /> : <Plane size={32} />}
          </div>
          <div>
            <h1 className="text-[32px] font-semibold text-foreground leading-[1.2]">
              {isAI ? "Plan with AI" : "Create New Trip"}
            </h1>
            <p className="text-muted-foreground">
              {isAI ? "Let Tripia's AI build the perfect itinerary for you." : "Start organizing your next great adventure."}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-semibold text-foreground flex items-center gap-2"><MapPin size={16}/> Origin</label>
              <Autocomplete 
                placeholder="Where are you leaving from?" 
                value={origin} 
                onChange={setOrigin} 
                onSelect={() => {}} 
                className="bg-background rounded-2xl px-4 py-3 focus:ring-2 ring-primary/20 border-transparent focus:border-primary/30"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-semibold text-foreground flex items-center gap-2"><MapPin size={16}/> Destination</label>
              <Autocomplete 
                placeholder="Where do you want to go?" 
                value={destination} 
                onChange={setDestination} 
                onSelect={setDestinationObj} 
                className="bg-background rounded-2xl px-4 py-3 focus:ring-2 ring-primary/20 border-transparent focus:border-primary/30"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-semibold text-foreground flex items-center gap-2"><Calendar size={16}/> Start Date</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-background rounded-2xl px-4 py-3 outline-none focus:ring-2 ring-primary/20 transition-all border border-transparent focus:border-primary/30" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-semibold text-foreground flex items-center gap-2"><Calendar size={16}/> End Date</label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-background rounded-2xl px-4 py-3 outline-none focus:ring-2 ring-primary/20 transition-all border border-transparent focus:border-primary/30" />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-[14px] font-semibold text-foreground flex items-center gap-2"><Users size={16}/> Travelers</label>
              <select value={travelersCount} onChange={e => setTravelersCount(e.target.value)} className="bg-background rounded-2xl px-4 py-3 outline-none focus:ring-2 ring-primary/20 transition-all border border-transparent focus:border-primary/30 appearance-none">
                <option>Just me</option>
                <option>Couple</option>
                <option>Group (3-8)</option>
                <option>Large Group (8+)</option>
              </select>
            </div>
          </div>

          {isAI && (
            <>
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-semibold text-foreground flex items-center gap-2"><DollarSign size={16}/> Budget Style</label>
                <div className="flex gap-4">
                  {['Budget', 'Moderate', 'Luxury'].map(style => (
                    <button 
                      key={style} 
                      onClick={() => setBudgetLevel(style)}
                      className={cn(
                        "flex-1 py-3 rounded-2xl border transition-all font-medium",
                        budgetLevel === style 
                          ? "bg-[#00b5c0] text-white border-[#00b5c0] shadow-md scale-[1.02]" 
                          : "border-border text-muted-foreground hover:border-primary hover:text-primary hover:bg-orange-50"
                      )}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-semibold text-foreground flex items-center gap-2"><Zap size={16}/> Preferences</label>
                <textarea 
                  rows={3} 
                  value={preferences}
                  onChange={e => setPreferences(e.target.value)}
                  placeholder="E.g., I love food tours, hiking, and I want to avoid crowded tourist traps." 
                  className="bg-background rounded-2xl px-4 py-3 outline-none focus:ring-2 ring-primary/20 transition-all border border-transparent focus:border-primary/30 resize-none" 
                />
              </div>
            </>
          )}
          
          <div className="mt-8 flex justify-end gap-4">
            <Link to="/trips" className="px-6 py-3 rounded-full text-muted-foreground font-medium hover:bg-background transition-colors" style={{ pointerEvents: isGenerating ? 'none' : 'auto', opacity: isGenerating ? 0.5 : 1 }}>
              Cancel
            </Link>
            <button 
              onClick={handleCreate} 
              disabled={isGenerating}
              className={cn(
              "px-8 py-3 rounded-full font-medium transition-transform hover:-translate-y-1 shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0",
              isAI ? "bg-[#00b5c0] text-white hover:bg-[#00a0a9]" : "bg-primary text-white hover:bg-orange-600"
            )}>
              {isGenerating ? (
                <><Zap size={18} className="animate-pulse" /> Generating...</>
              ) : isAI ? (
                <><Zap size={18} /> Generate Trip</>
              ) : (
                "Create Trip"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

