import type { DataItem } from "../types";

// Full month names as they appear in the CSV after parsing
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const calculateMonthlyAverage = (
  data: DataItem[],
  city: string,
  fuel: string,
  year: number
) => {
  const result: number[] = MONTHS.map((month) => {
    const filtered = data.filter(
      (item) =>
        item.city === city &&
        item.fuel === fuel &&
        item.year === year &&
        item.month === month
    );

    if (filtered.length === 0) return 0;

    const sum = filtered.reduce((acc, curr) => acc + curr.price, 0);
    return Number((sum / filtered.length).toFixed(2));
  });

  return { months: MONTHS, result };
};