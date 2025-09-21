// src/data/storesData.ts
export type Store = {
  id: string;
  name: string;
  logo: string;
  owner: string;
  location: string;
  isOnline: boolean;
  categories: string[];
  followers: number;
  rating: number;
};

export const storesData: Store[] = [
  {
    id: "1",
    name: "My Grocery Store",
    logo: "https://via.placeholder.com/120",
    owner: "Aryan Kumar",
    location: "Delhi, India",
    isOnline: true,
    categories: ["Grocery", "Daily Needs"],
    followers: 1200,
    rating: 4.5,
  },
  {
    id: "2",
    name: "Car Service Hub",
    logo: "https://via.placeholder.com/120",
    owner: "Rahul Sharma",
    location: "Mumbai, India",
    isOnline: false,
    categories: ["Garage", "Services"],
    followers: 800,
    rating: 4.2,
  },
];
