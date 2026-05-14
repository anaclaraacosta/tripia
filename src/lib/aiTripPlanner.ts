export type RealPlace = {
  id: string;
  name: string;
  categories: string[];
  description?: string;
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
};

export type GenerateTripParams = {
  destinationCity: string;
  tripType: string;
  travelersCount: number;
  budgetLevel: string;
  preferences: string;
  startDate: string;
  endDate: string;
  realPlaces?: RealPlace[];
  imageUrl?: string;
};

export function generateLocalAITrip(params: GenerateTripParams) {
  const { 
    destinationCity, 
    tripType, 
    travelersCount, 
    budgetLevel, 
    preferences, 
    startDate, 
    endDate, 
    realPlaces = [] 
  } = params;

  // Calculate duration
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive

  const itinerary = [];
  const expenses = [];
  const transportation = [];

  const prefStr = preferences.toLowerCase();
  
  // Basic transportation
  transportation.push({
    id: Math.random().toString(36).substr(2, 9),
    title: `Arrival at ${destinationCity}`,
    description: `Head to accommodation. (Budget: ${budgetLevel})`,
    createdAt: new Date().toISOString()
  });

  // Base multiplier for budget
  const budgetMult = budgetLevel === "Luxury" ? 3 : budgetLevel === "Moderate" ? 1.5 : 0.8;

  // Initial Expenses
  expenses.push({
    id: Math.random().toString(36).substr(2, 9),
    title: "Flights/Transport",
    amount: 300 * budgetMult * travelersCount,
    category: "transport",
    paidBy: "You",
    createdAt: new Date().toISOString()
  });
  expenses.push({
    id: Math.random().toString(36).substr(2, 9),
    title: "Accommodation",
    amount: 100 * budgetMult * diffDays,
    category: "accommodation",
    paidBy: "You",
    createdAt: new Date().toISOString()
  });

  // Simple heuristic: group places by category matching preferences
  const availablePlaces = [...realPlaces];

  for (let day = 1; day <= Math.min(diffDays, 7); day++) {
    // Pick 2-3 places per day
    const placesForDay = [];
    
    // Pick places based on preferences if available
    if (availablePlaces.length > 0) {
      if (prefStr.includes('museum') || prefStr.includes('culture')) {
        const p = availablePlaces.findIndex(p => p.categories.includes('entertainment.museum') || p.categories.includes('entertainment.culture'));
        if (p >= 0) placesForDay.push(availablePlaces.splice(p, 1)[0]);
      }
      if (prefStr.includes('park') || prefStr.includes('nature')) {
        const p = availablePlaces.findIndex(p => p.categories.includes('leisure.park') || p.categories.includes('natural'));
        if (p >= 0) placesForDay.push(availablePlaces.splice(p, 1)[0]);
      }
      if (prefStr.includes('food') || prefStr.includes('eat')) {
        const p = availablePlaces.findIndex(p => p.categories.includes('catering'));
        if (p >= 0) placesForDay.push(availablePlaces.splice(p, 1)[0]);
      }
      
      // Fill the rest with any place
      while (placesForDay.length < 3 && availablePlaces.length > 0) {
        placesForDay.push(availablePlaces.shift());
      }
    }

    if (placesForDay.length > 0) {
      itinerary.push({
        id: Math.random().toString(36).substr(2, 9),
        title: `Day ${day}: Explore ${destinationCity}`,
        description: `Visit ${placesForDay.map(p => p?.name).join(', ')}. ${tripType} friendly.`,
        createdAt: new Date().toISOString()
      });
      // Add expense for the day
      expenses.push({
        id: Math.random().toString(36).substr(2, 9),
        title: `Day ${day} Food & Activities`,
        amount: 80 * budgetMult * travelersCount,
        category: "activities",
        paidBy: "You",
        createdAt: new Date().toISOString()
      });
    } else {
      // Fallback if no real places left or available
      itinerary.push({
        id: Math.random().toString(36).substr(2, 9),
        title: `Day ${day}: Discover ${destinationCity}`,
        description: `Enjoy a local walk, try regional food, and relax. Budget: ${budgetLevel}. ${preferences ? `Keep in mind: ${preferences}.` : ''}`,
        createdAt: new Date().toISOString()
      });
    }
  }

  return {
    itinerary,
    expenses,
    transportation,
    imageUrl: params.imageUrl || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80"
  };
}
