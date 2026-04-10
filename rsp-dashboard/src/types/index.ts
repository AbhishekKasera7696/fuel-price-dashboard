export type FuelType = "Petrol" | "Diesel";

export interface DataItem {
  city: string;
  fuel: FuelType;
  year: number;
  month: string;
  price: number;
}