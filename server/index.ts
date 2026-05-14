import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { destinations } from '../src/lib/destinations.js';
import { resolveTripImageUrl, ensureImageExists } from '../src/lib/tripImages.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../.env') });

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.API_PORT || 8787;
const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY;

// Fallback search using local data
function searchLocalDestinations(query: string) {
  const q = query.toLowerCase().trim();
  const filtered = destinations.filter(d => 
    d.displayName.toLowerCase().includes(q) || 
    d.aliases.some(a => a.toLowerCase().includes(q))
  );

  return filtered.slice(0, 8).map(d => ({
    id: d.id,
    name: d.city,
    city: d.city,
    country: d.country,
    latitude: 0,
    longitude: 0,
    displayName: d.displayName,
    imageUrl: d.imageUrl,
    source: "local"
  }));
}

app.get('/api/destinations/search', async (req, res) => {
  const q = req.query.q as string || '';
  if (q.length < 2) {
    return res.json([]);
  }

  if (!GEOAPIFY_API_KEY) {
    return res.json(searchLocalDestinations(q));
  }

  try {
    const response = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(q)}&type=city&limit=10&apiKey=${GEOAPIFY_API_KEY}`);
    
    if (!response.ok) {
      console.warn('Geoapify API failed, falling back to local');
      return res.json(searchLocalDestinations(q));
    }

    const data = await response.json();
    const results = data.features.map((f: { properties: Record<string, unknown> }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const p = f.properties as any;
      return {
        id: p.place_id,
        name: p.city || p.name,
        city: p.city || p.name,
        country: p.country,
        countryCode: p.country_code,
        latitude: p.lat,
        longitude: p.lon,
        displayName: p.formatted,
        source: "geoapify"
      };
    }).filter((r: { city: string }) => r.city); // Filter out if city is missing

    if (results.length === 0) {
      return res.json(searchLocalDestinations(q));
    }

    res.json(results);
  } catch (err) {
    console.error('Error fetching destinations:', err);
    res.json(searchLocalDestinations(q));
  }
});

async function fetchGeoapifyPlaces(lat: string | number, lon: string | number, preferences: string) {
  if (!GEOAPIFY_API_KEY || !lat || !lon) {
    return [];
  }

  const prefStr = (preferences || '').toLowerCase();
  const categories = ['tourism', 'entertainment', 'leisure', 'natural'];
  
  if (prefStr.includes('food') || prefStr.includes('eat') || prefStr.includes('restaurant')) {
    categories.push('catering');
  }
  if (prefStr.includes('museum') || prefStr.includes('culture') || prefStr.includes('art')) {
    categories.push('entertainment.museum', 'entertainment.culture');
  }
  if (prefStr.includes('history') || prefStr.includes('heritage') || prefStr.includes('architecture')) {
    categories.push('heritage', 'tourism.sights');
  }
  if (prefStr.includes('park') || prefStr.includes('nature') || prefStr.includes('quiet')) {
    categories.push('leisure.park', 'natural');
  }
  if (prefStr.includes('shop')) {
    categories.push('commercial');
  }

  const categoryString = categories.join(',');

  try {
    const response = await fetch(`https://api.geoapify.com/v2/places?categories=${categoryString}&filter=circle:${lon},${lat},5000&limit=20&apiKey=${GEOAPIFY_API_KEY}`);
    
    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.features
      .filter((f: { properties: { name: string } }) => f.properties.name) // Prefer places with names
      .map((f: { properties: Record<string, unknown> }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const p = f.properties as any;
        return {
          id: p.place_id,
          name: p.name,
          categories: p.categories || [],
          description: p.formatted,
          latitude: p.lat,
          longitude: p.lon,
          source: "geoapify"
        };
      });
  } catch (err) {
    console.error('Error fetching places:', err);
    return [];
  }
}

app.get('/api/places/search', async (req, res) => {
  const { lat, lon, preferences } = req.query;
  const results = await fetchGeoapifyPlaces(lat as string, lon as string, preferences as string);
  res.json(results);
});

// Gemini Endpoint
app.post('/api/ai/generate-trip', async (req, res) => {
  const { origin, destination, startDate, endDate, tripType, travelersCount, budgetLevel, preferences, currentUser } = req.body;

  if (!origin || !destination || !startDate || !endDate) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  if (end < start) {
    return res.status(400).json({ error: 'endDate cannot be before startDate' });
  }
  const diffDays = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  const geminiKeyPresent = !!process.env.GEMINI_API_KEY;
  console.log(`[AI Planner] Request received for ${typeof destination === 'string' ? destination : destination.city}. GEMINI_API_KEY present: ${geminiKeyPresent}`);

  if (!geminiKeyPresent) {
    console.log("[AI Planner] No GEMINI_API_KEY found, returning fallback flag.");
    return res.json({ fallbackUsed: true });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let places: any[] = [];
    const destName = typeof destination === 'string' ? destination : destination.displayName;
    const destCity = typeof destination === 'string' ? destination.split(',')[0] : destination.city;
    const destCountry = typeof destination === 'string' ? '' : destination.country;

    if (typeof destination === 'object' && destination.latitude && destination.longitude) {
      places = await fetchGeoapifyPlaces(destination.latitude, destination.longitude, preferences);
    }
    
    console.log(`[AI Planner] Gemini generation attempted. Passing ${places.length} Geoapify places to Gemini.`);

    const prompt = `
      Act as a professional travel planner.
      Create a detailed trip itinerary.
      Respond strictly in valid JSON format matching this schema. Do not include markdown formatting, backticks, or extra text.
      {
        "title": "string",
        "summary": "string",
        "itinerary": [{ "title": "string", "description": "string", "day": "number" }],
        "expenses": [{ "title": "string", "amount": "number", "category": "string" }],
        "transportation": [{ "title": "string", "description": "string" }]
      }

      Trip Details:
      Origin: ${typeof origin === 'string' ? origin : origin.displayName}
      Destination: ${destName}
      Dates: ${startDate} to ${endDate} (${diffDays} days)
      Trip Type: ${tripType}
      Travelers: ${travelersCount}
      Budget: ${budgetLevel}
      Preferences: ${preferences || 'General tourist highlights'}

      Use these real places to build the itinerary if relevant (limit to realistic daily plans):
      ${JSON.stringify(places.map(p => ({ name: p.name, categories: p.categories })), null, 2)}

      Guidelines:
      - Include daily itinerary items mentioning specific places when available.
      - Generate realistic estimated expenses based on the budget level.
      - Include basic transportation logistics.
    `;

    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const responseText = response.text || '';
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    // Format for frontend
    const participants = [{ id: "owner", name: currentUser?.name || "You", email: currentUser?.email }];
    for (let i = 1; i < travelersCount; i++) {
      participants.push({ id: `p-${i}`, name: `Traveler ${i + 1}` });
    }

    const resolvedImageUrl = resolveTripImageUrl({
      destination,
      destinationCity: destCity || (typeof destination === 'string' ? destination.split(',')[0] : ''),
      destinationCountry: destCountry,
      destinationObj: typeof destination === 'object' ? destination : null,
      realPlaces: places
    });
    
    const finalImageUrl = await ensureImageExists(resolvedImageUrl);

    const formattedTrip = {
      title: parsed.title || `Trip to ${destCity}`,
      summary: parsed.summary || "",
      origin: typeof origin === 'string' ? origin : origin.displayName,
      destination: destName,
      destinationCity: destCity,
      destinationCountry: destCountry,
      startDate,
      endDate,
      tripType,
      travelersCount,
      participants,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expenses: (parsed.expenses || []).map((e: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        title: e.title,
        amount: Number(e.amount),
        category: e.category,
        paidBy: "You",
        createdAt: new Date().toISOString()
      })),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      itinerary: (parsed.itinerary || []).map((i: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        title: i.title,
        description: i.description,
        createdAt: new Date().toISOString()
      })),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transportation: (parsed.transportation || []).map((t: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        title: t.title,
        description: t.description,
        createdAt: new Date().toISOString()
      })),
      imageUrl: finalImageUrl,
      generatedByAI: true
    };

    console.log("[AI Planner] Gemini succeeded.");
    res.json({
      trip: formattedTrip,
      source: "gemini",
      fallbackUsed: false,
      placesUsed: places.length
    });

  } catch (err) {
    console.error("[AI Planner] Gemini Generation Error:", err);
    console.log("[AI Planner] Fallback used due to Gemini error.");
    res.json({ fallbackUsed: true });
  }
});

app.listen(PORT, () => {
  console.log(`API Server running on port ${PORT}`);
});
