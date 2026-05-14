import { createContext, useContext } from 'react';

export type Participant = {
  id: string;
  name: string;
  email?: string;
};

export type Expense = {
  id: string;
  title: string;
  amount: number;
  paidBy: string;
  description?: string;
  createdAt: string;
};

export type ItineraryItem = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
};

export type TransportItem = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
};

export type UserTrip = {
  id: string;
  title: string;
  summary?: string;
  origin: string;
  destination: string;
  destinationCity: string;
  destinationCountry: string;
  imageUrl: string;
  image?: string;
  startDate: string;
  endDate: string;
  tripType: "solo" | "couple" | "group" | "family" | "friends";
  travelersCount: number;
  participants: Participant[];
  expenses: Expense[];
  itinerary: ItineraryItem[];
  transportation: TransportItem[];
  createdAt: string;
  isMock?: boolean;
  generatedByAI?: boolean;
  ownerEmail?: string;
};

export interface TripsContextType {
  trips: UserTrip[];
  addTrip: (trip: Omit<UserTrip, 'id' | 'createdAt'>) => string;
  getTrip: (id: string) => UserTrip | undefined;
  updateTrip: (id: string, updates: Partial<UserTrip>) => void;
  addParticipant: (tripId: string, participant: Omit<Participant, 'id'>) => void;
  addExpense: (tripId: string, expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  addItineraryItem: (tripId: string, item: Omit<ItineraryItem, 'id' | 'createdAt'>) => void;
  addTransportItem: (tripId: string, item: Omit<TransportItem, 'id' | 'createdAt'>) => void;
  updateParticipant: (tripId: string, id: string, updates: Partial<Participant>) => void;
  deleteParticipant: (tripId: string, id: string) => void;
  updateItineraryItem: (tripId: string, id: string, updates: Partial<ItineraryItem>) => void;
  deleteItineraryItem: (tripId: string, id: string) => void;
  updateExpense: (tripId: string, id: string, updates: Partial<Expense>) => void;
  deleteExpense: (tripId: string, id: string) => void;
  updateTransportItem: (tripId: string, id: string, updates: Partial<TransportItem>) => void;
  deleteTransportItem: (tripId: string, id: string) => void;
}

export const TripsContext = createContext<TripsContextType | undefined>(undefined);

export function useTrips() {
  const context = useContext(TripsContext);
  if (context === undefined) {
    throw new Error('useTrips must be used within a TripsProvider');
  }
  return context;
}
