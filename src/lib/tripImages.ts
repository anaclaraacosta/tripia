import { destinations } from './destinations';

export interface ResolveImageParams {
  destination: string | { imageUrl?: string; [key: string]: unknown } | null;
  destinationCity: string;
  destinationCountry?: string;
  destinationObj?: { imageUrl?: string; [key: string]: unknown } | null;
  realPlaces?: { imageUrl?: string; [key: string]: unknown }[];
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80";

function isFallback(url?: string | null) {
  if (!url) return true;
  return url.includes("1469854523086-cc02fe5d8800");
}

export function resolveTripImageUrl({
  destination,
  destinationCity,
  destinationObj,
  realPlaces
}: ResolveImageParams): string {
  // 1. Destination object image
  if (destinationObj?.imageUrl && !isFallback(destinationObj.imageUrl)) {
    return destinationObj.imageUrl;
  }
  if (typeof destination === 'object' && destination !== null && 'imageUrl' in destination && typeof destination.imageUrl === 'string' && !isFallback(destination.imageUrl)) {
    return destination.imageUrl;
  }

  // 2. Local destinations match
  const normalizedDest = (destinationCity || (typeof destination === 'string' ? destination.split(',')[0] : '')).toLowerCase().trim();
  const match = destinations.find(d => 
    normalizedDest.includes(d.city.toLowerCase()) ||
    d.city.toLowerCase().includes(normalizedDest) ||
    d.aliases.some(a => normalizedDest.includes(a.toLowerCase()))
  );
  if (match?.imageUrl) {
    return match.imageUrl;
  }

  // 3. Geoapify places image (if available)
  if (realPlaces && realPlaces.length > 0) {
    const placeWithImage = realPlaces.find(p => p.imageUrl && typeof p.imageUrl === 'string' && !isFallback(p.imageUrl as string));
    if (placeWithImage?.imageUrl) {
      return placeWithImage.imageUrl as string;
    }
  }

  // 4. Fallback to known popular cities if not in destinations.ts
  const knownCities: Record<string, string> = {
    "madrid": "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&q=80",
    "barcelona": "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&q=80",
    "paris": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80",
    "rome": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80",
    "tokyo": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80",
    "london": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80",
    "new york": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80",
    "buenos aires": "https://images.unsplash.com/photo-1589923158776-cb4485d99fd6?auto=format&fit=crop&q=80"
  };

  if (normalizedDest) {
    const knownMatch = Object.keys(knownCities).find(city => normalizedDest.includes(city));
    if (knownMatch) {
      return knownCities[knownMatch];
    }
  }

  // 5. Destination-based Unsplash dynamic URL
  if (normalizedDest) {
    const query = encodeURIComponent(`${normalizedDest},travel,city`);
    return `https://source.unsplash.com/1200x800/?${query}`;
  }

  // 6. Stable fallback for completely unknown destinations with no name
  return FALLBACK_IMAGE;
}

export async function ensureImageExists(url: string, fallback: string = FALLBACK_IMAGE): Promise<string> {
  if (!url || url === fallback) return fallback;

  // In browser environment
  if (typeof window !== 'undefined' && typeof Image !== 'undefined') {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = () => resolve(fallback);
      img.src = url;
    });
  }

  // In Node environment
  try {
    const res = await fetch(url, { method: 'HEAD' });
    if (res.ok) {
      return res.url !== url ? res.url : url;
    }
    return fallback;
  } catch {
    return fallback;
  }
}
