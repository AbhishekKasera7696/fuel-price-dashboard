import { useEffect, useState } from "react";
import Dropdown from "./components/Dropdown";
import Chart from "./components/Chart";
import { calculateMonthlyAverage } from "./utils/calculateAverage";
import { loadCSV } from "./utils/loadCSV";
import type { DataItem } from "./types";

const App = () => {
  const [dataset, setDataset] = useState<DataItem[]>([]);
  const [city, setCity] = useState("");
  const [fuel, setFuel] = useState("");
  const [year, setYear] = useState("");

  useEffect(() => {
    loadCSV().then((data) => {
      setDataset(data);

      const cities = [...new Set(data.map((d) => d.city))].filter(Boolean).sort();
      const fuels = [...new Set(data.map((d) => d.fuel))].filter(Boolean).sort();
      const years = [
        ...new Set(data.map((d) => d.year.toString())),
      ]
        .filter((y) => y !== "NaN")
        .sort((a, b) => Number(b) - Number(a)); // newest first

      setCity(cities[0] ?? "");
      setFuel(fuels[0] ?? "");
      setYear(years[0] ?? "");
    });
  }, []);

  if (!dataset.length)
    return (
      <div style={{ padding: "40px", fontSize: "18px" }}>Loading data…</div>
    );

  const cities = [...new Set(dataset.map((d) => d.city))].filter(Boolean).sort();
  const fuels = [...new Set(dataset.map((d) => d.fuel))].filter(Boolean).sort();
  const years = [...new Set(dataset.map((d) => d.year.toString()))]
    .filter((y) => y !== "NaN")
    .sort((a, b) => Number(b) - Number(a));

  const { months, result } = calculateMonthlyAverage(
    dataset,
    city,
    fuel,
    Number(year)
  );

  return (
    <div style={{ padding: "24px", fontFamily: "sans-serif", maxWidth: "960px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "20px" }}>⛽ Fuel Price Dashboard</h2>

      <div style={{ display: "flex", gap: "24px", marginBottom: "28px", flexWrap: "wrap" }}>
        <Dropdown label="City" options={cities} value={city} onChange={setCity} />
        <Dropdown label="Fuel Type" options={fuels} value={fuel} onChange={setFuel} />
        <Dropdown label="Year" options={years} value={year} onChange={setYear} />
      </div>

      <Chart months={months} data={result} city={""} fuel={""} year={""} />
    </div>
  );
};

export default App;
