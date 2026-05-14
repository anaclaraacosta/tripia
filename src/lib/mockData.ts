export interface Trip {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  image: string;
  participants: number;
}

export const recentTrips: Trip[] = [
  {
    id: "1",
    title: "Vibrant Venice Escape",
    startDate: "AUG 12",
    endDate: "19, 2024",
    image: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&q=80",
    participants: 4
  },
  {
    id: "2",
    title: "Bali Spirit Retreat",
    startDate: "JUN 04",
    endDate: "15, 2024",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80",
    participants: 3
  },
  {
    id: "3",
    title: "Rocky Mountain Hike",
    startDate: "FEB 21",
    endDate: "28, 2024",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80",
    participants: 6
  }
];

export const allTrips: Trip[] = [
  ...recentTrips,
  {
    id: "4",
    title: "Patagonia Escape",
    startDate: "NOV 10",
    endDate: "22, 2024",
    image: "https://images.unsplash.com/photo-1518182170546-076616fd4aa6?auto=format&fit=crop&q=80",
    participants: 8
  },
  {
    id: "5",
    title: "Rio Weekend",
    startDate: "DEC 01",
    endDate: "05, 2024",
    image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&q=80",
    participants: 5
  },
  {
    id: "6",
    title: "Buenos Aires Food Tour",
    startDate: "JAN 15",
    endDate: "20, 2025",
    image: "https://images.unsplash.com/photo-1589923158776-cb4485d99fd6?auto=format&fit=crop&q=80",
    participants: 4
  }
];

export const agendaItems = [
  {
    id: "1",
    date: "TOMORROW, 09:00 AM",
    title: "Flight to Barcelona",
    description: "Terminal 4, Gate B22. Check-in opens at 06:00 AM.",
    color: "accent"
  },
  {
    id: "2",
    date: "FRIDAY, OCT 25",
    title: "Dinner at Los Caracoles",
    description: 'Reservation for 6 people under "Julian".',
    color: "turquoise"
  },
  {
    id: "3",
    date: "SUNDAY, OCT 27",
    title: "Gaudí Architecture Tour",
    description: "Meeting point: Pl. de Catalunya fountain.",
    color: "turquoise-mid"
  }
];

export const expenses = [
  { id: "1", title: "Flight to Barcelona", amount: 450.00, category: "transport", paidBy: "Julian", date: "2024-10-10" },
  { id: "2", title: "Airbnb 5 nights", amount: 1200.00, category: "accommodation", paidBy: "Maria", date: "2024-10-12" },
  { id: "3", title: "Dinner at Los Caracoles", amount: 240.00, category: "food", paidBy: "Julian", date: "2024-10-25" },
  { id: "4", title: "Gaudí Tour Tickets", amount: 150.00, category: "activities", paidBy: "Alex", date: "2024-10-27" },
];
