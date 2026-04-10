import Papa from "papaparse";
import type { DataItem } from "../types";

const PRICE_COL =
  "Retail Selling Price (Rsp) Of Petrol And Diesel (UOM:INR/L(IndianRupeesperLitre)), Scaling Factor:1";

export const loadCSV = (): Promise<DataItem[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse("/src/data/rsp.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results: { data: any[] }) => {
        const data: DataItem[] = results.data
          .map((row: any) => {
            // CSV Month format: "June, 2025" → extract just "June"
            const rawMonth: string = (row["Month"] ?? "").trim();
            const monthName = rawMonth.split(",")[0].trim(); // "June"

            // CSV Year format: "Financial Year (Apr - Mar), 2025" → extract "2025"
            const rawYear: string = (row["Year"] ?? "").trim();
            const yearMatch = rawYear.match(/(\d{4})$/);
            const year = yearMatch ? Number(yearMatch[1]) : NaN;

            const price = Number(row[PRICE_COL]);

            return {
              city: (row["Metro Cities"] ?? "").trim(),
              fuel: (row["Products "] ?? "").trim() as "Petrol" | "Diesel",
              year,
              month: monthName,
              price: isNaN(price) ? 0 : price,
            };
          })
          .filter((d) => d.city && d.fuel && !isNaN(d.year));

        resolve(data);
      },
      error: (err: Error) => reject(err),
    });
  });
};