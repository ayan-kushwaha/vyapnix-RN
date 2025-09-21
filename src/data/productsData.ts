// src/data/productsData.ts
export type Product = {
  id: string;
  storeId: string;
  name: string;
  price: number;
  image: string;
};

export const productsData: Product[] = [
  { id: "p1", storeId: "1", name: "Milk 1L", price: 50, image: "https://via.placeholder.com/100" },
  { id: "p2", storeId: "1", name: "Rice 5kg", price: 300, image: "https://via.placeholder.com/100" },
  { id: "p3", storeId: "2", name: "Full Car Wash", price: 500, image: "https://via.placeholder.com/100" },
  { id: "p4", storeId: "2", name: "Engine Checkup", price: 1500, image: "https://via.placeholder.com/100" },
];
