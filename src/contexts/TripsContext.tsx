import { useState, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import { TripsContext, type UserTrip, type Participant, type Expense, type ItineraryItem, type TransportItem } from './useTrips';
import { useAuth } from './useAuth';

export function TripsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [trips, setTrips] = useState<UserTrip[]>(() => {
    const saved = localStorage.getItem('tripia_user_trips');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('tripia_user_trips', JSON.stringify(trips));
  }, [trips]);

  // Filter trips for the active user
  const userTrips = useMemo(() => {
    if (!user) return [];
    return trips.filter(t => t.ownerEmail === user.email);
  }, [trips, user]);

  const addTrip = (tripData: Omit<UserTrip, 'id' | 'createdAt'>) => {
    const finalImageUrl = tripData.imageUrl || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80";

    const newTrip: UserTrip = {
      ...tripData,
      imageUrl: finalImageUrl,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      ownerEmail: user?.email,
    };
    setTrips(prev => [newTrip, ...prev]);
    return newTrip.id;
  };

  const getTrip = (id: string) => {
    return userTrips.find(t => t.id === id);
  };

  const updateTrip = (id: string, updates: Partial<UserTrip>) => {
    setTrips(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  // Participant methods
  const addParticipant = (tripId: string, participant: Omit<Participant, 'id'>) => {
    setTrips(prev => prev.map(t => {
      if (t.id === tripId) {
        return {
          ...t,
          participants: [...t.participants, { ...participant, id: Math.random().toString(36).substr(2, 9) }],
          travelersCount: t.travelersCount + 1
        };
      }
      return t;
    }));
  };
  const updateParticipant = (tripId: string, id: string, updates: Partial<Participant>) => {
    setTrips(prev => prev.map(t => {
      if (t.id === tripId) return { ...t, participants: t.participants.map(p => p.id === id ? { ...p, ...updates } : p) };
      return t;
    }));
  };
  const deleteParticipant = (tripId: string, id: string) => {
    setTrips(prev => prev.map(t => {
      if (t.id === tripId) {
        const newParts = t.participants.filter(p => p.id !== id);
        return { ...t, participants: newParts, travelersCount: newParts.length };
      }
      return t;
    }));
  };

  // Expense methods
  const addExpense = (tripId: string, expense: Omit<Expense, 'id' | 'createdAt'>) => {
    setTrips(prev => prev.map(t => {
      if (t.id === tripId) {
        return {
          ...t,
          expenses: [...t.expenses, { ...expense, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString() }]
        };
      }
      return t;
    }));
  };
  const updateExpense = (tripId: string, id: string, updates: Partial<Expense>) => {
    setTrips(prev => prev.map(t => {
      if (t.id === tripId) return { ...t, expenses: t.expenses.map(e => e.id === id ? { ...e, ...updates } : e) };
      return t;
    }));
  };
  const deleteExpense = (tripId: string, id: string) => {
    setTrips(prev => prev.map(t => {
      if (t.id === tripId) return { ...t, expenses: t.expenses.filter(e => e.id !== id) };
      return t;
    }));
  };

  // Itinerary methods
  const addItineraryItem = (tripId: string, item: Omit<ItineraryItem, 'id' | 'createdAt'>) => {
    setTrips(prev => prev.map(t => {
      if (t.id === tripId) {
        return {
          ...t,
          itinerary: [...t.itinerary, { ...item, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString() }]
        };
      }
      return t;
    }));
  };
  const updateItineraryItem = (tripId: string, id: string, updates: Partial<ItineraryItem>) => {
    setTrips(prev => prev.map(t => {
      if (t.id === tripId) return { ...t, itinerary: t.itinerary.map(i => i.id === id ? { ...i, ...updates } : i) };
      return t;
    }));
  };
  const deleteItineraryItem = (tripId: string, id: string) => {
    setTrips(prev => prev.map(t => {
      if (t.id === tripId) return { ...t, itinerary: t.itinerary.filter(i => i.id !== id) };
      return t;
    }));
  };

  // Transport methods
  const addTransportItem = (tripId: string, item: Omit<TransportItem, 'id' | 'createdAt'>) => {
    setTrips(prev => prev.map(t => {
      if (t.id === tripId) {
        return {
          ...t,
          transportation: [...t.transportation, { ...item, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString() }]
        };
      }
      return t;
    }));
  };
  const updateTransportItem = (tripId: string, id: string, updates: Partial<TransportItem>) => {
    setTrips(prev => prev.map(t => {
      if (t.id === tripId) return { ...t, transportation: t.transportation.map(tr => tr.id === id ? { ...tr, ...updates } : tr) };
      return t;
    }));
  };
  const deleteTransportItem = (tripId: string, id: string) => {
    setTrips(prev => prev.map(t => {
      if (t.id === tripId) return { ...t, transportation: t.transportation.filter(tr => tr.id !== id) };
      return t;
    }));
  };

  return (
    <TripsContext.Provider value={{ 
      trips: userTrips, 
      addTrip, getTrip, updateTrip, 
      addParticipant, updateParticipant, deleteParticipant,
      addExpense, updateExpense, deleteExpense,
      addItineraryItem, updateItineraryItem, deleteItineraryItem,
      addTransportItem, updateTransportItem, deleteTransportItem
    }}>
      {children}
    </TripsContext.Provider>
  );
}
