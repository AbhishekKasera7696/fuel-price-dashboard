# ⛽ Fuel Price Dashboard

> Interactive Retail Selling Price (RSP) Explorer for Petrol & Diesel across Indian Metro Cities (2017–2025)

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite)
![ECharts](https://img.shields.io/badge/Apache_ECharts-5-AA344D?style=flat)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=flat&logo=vercel)

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Live Demo](#-live-demo)
- [Tech Stack](#-tech-stack)
- [Folder Structure](#-folder-structure)
- [CSV Data Format](#-csv-data-format)
- [Bug Fixes Applied](#-bug-fixes-applied)
- [Getting Started Locally](#-getting-started-locally)
- [Deploying to Vercel](#-deploying-to-vercel)
- [How It Works](#-how-it-works)
- [Source File Reference](#-source-file-reference)
- [Troubleshooting](#-troubleshooting)

---

## 📌 Project Overview

The **Fuel Price Dashboard** is a fully static web application that visualises monthly average Retail Selling Price (RSP) data for **Petrol** and **Diesel** across four major Indian metro cities:

- 🏙️ Delhi
- 🏙️ Mumbai
- 🏙️ Chennai
- 🏙️ Kolkata

Users can filter the data interactively using three dropdowns — **City**, **Fuel Type**, and **Financial Year** — and the bar chart updates instantly.

**Highlights:**
- 📊 Monthly bar chart powered by Apache ECharts
- 🔽 Three linked dropdowns (City, Fuel Type, Year)
- 📂 23,000+ rows parsed client-side from CSV via PapaParse
- 🚀 Zero backend — fully static, deployable anywhere
- 🔒 Written entirely in TypeScript

---

## 🌐 Live Demo

> **[https://your-project-name.vercel.app](https://fuel-price-dashboard-xi.vercel.app/)**

---

## 🛠️ Tech Stack

| Library / Tool   | Version | Purpose                          |
|------------------|---------|----------------------------------|
| React            | 18      | UI framework                     |
| TypeScript       | 5       | Static typing                    |
| Vite             | 5       | Build tool & dev server          |
| Apache ECharts   | 5       | Interactive bar chart            |
| PapaParse        | 5       | Client-side CSV parsing          |

---

## 📁 Folder Structure

```
rsp-dashboard/
├── public/
│   └── rsp.csv                  ← CSV data file (served statically)
├── src/
│   ├── components/
│   │   ├── Chart.tsx            ← ECharts bar chart component
│   │   └── Dropdown.tsx         ← Reusable <select> dropdown
│   ├── types/
│   │   └── index.ts             ← Shared TypeScript types
│   ├── utils/
│   │   ├── loadCSV.ts           ← PapaParse CSV loader & column mapper
│   │   └── calculateAverage.ts  ← Monthly average calculator
│   ├── App.tsx                  ← Root component
│   └── main.tsx                 ← React entry point
├── vite.config.ts
└── package.json
```

---

## 📊 CSV Data Format

The file `public/rsp.csv` contains **23,360 rows** with the following columns:

| Column Name | Example Value | Description |
|---|---|---|
| `Country` | `India` | Always "India" |
| `Year` | `Financial Year (Apr - Mar), 2025` | Financial year label — the app extracts `2025` from the end |
| `Month` | `June, 2025` | Month + calendar year — the app extracts just `"June"` |
| `Calendar Day` | `16-Jun-2025` | Specific date — not used by the dashboard |
| `Products ` | `Petrol` / `Diesel` | Fuel type _(note the trailing space in the header)_ |
| `Metro Cities` | `Delhi` | City name |
| `Retail Selling Price (Rsp) Of Petrol And Diesel (UOM:INR/L(IndianRupeesperLitre)), Scaling Factor:1` | `94.77` | Price in INR per litre |

> ⚠️ The `Products` column has a **trailing space** in the CSV header. `loadCSV.ts` trims this automatically.

---

## 🐛 Bug Fixes Applied

The original project had three bugs that prevented data from loading and displaying. All have been fixed in this repo.

### Bug 1 — Wrong Column Names in `loadCSV.ts`

The original code referenced columns that don't exist in the CSV:

| Field | Original (broken) | Fixed |
|---|---|---|
| city | `row.city` | `row["Metro Cities"]` |
| year | `row.year` | Regex-extracted from `"Financial Year…, 2025"` → `2025` |
| month | `row.month` | Split from `"June, 2025"` → `"June"` |
| price | `row.price` | Full Retail Selling Price column name |

### Bug 2 — Wrong Month Names in `calculateAverage.ts`

The filter compared against short names (`"Jan"`, `"Feb"`) while the CSV produces full names (`"January"`, `"February"`). This meant every filter returned **zero results** and the chart was always empty.

**Fix:** Use full month names — `"January"` through `"December"`.

### Bug 3 — Chart Not Re-rendering on Dropdown Change

The ECharts instance was being created and destroyed inside a single `useEffect` that depended on data props. Every dropdown change disposed the chart and tried to recreate it, causing flickering or a blank canvas.

**Fix:** Two separate effects:
- **Effect 1** — runs once on mount, initialises the chart instance
- **Effect 2** — runs when data props change, calls `chart.setOption()` to update without recreating

---

## 🚀 Getting Started Locally

### Prerequisites

- Node.js **18+**
- npm **9+** (bundled with Node)

### 1. Clone the repo

```bash
git clone https://github.com/your-username/fuel-price-dashboard.git
cd fuel-price-dashboard/rsp-dashboard
```

### 2. Install dependencies

```bash
yarn add
```

### 3. Start the dev server

```bash
yarn dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for production

```bash
yarn build
```

Output goes into the `dist/` folder, ready to deploy.

---

## ☁️ Deploying to Vercel

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/your-username/repo-name.git
git push -u origin main
```

### Step 2 — Import on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New Project**
3. Select your repository → click **Import**

### Step 3 — Configure Build Settings

Because the app lives inside a subdirectory, set the **Root Directory**:

| Setting | Value |
|---|---|
| Root Directory | `fuel-price-dashboard/rsp-dashboard` |
| Framework Preset | `Vite` (auto-detected) |
| Build Command | `npm run build` |
| Output Directory | `dist` |

### Step 4 — Deploy

Click **Deploy**. Your live URL will be:

```
https://your-project-name.vercel.app
```

> ✅ Every `git push` to `main` triggers an automatic re-deploy.

---

## ⚙️ How It Works

### Data Loading — `loadCSV.ts`

On startup, PapaParse fetches `/rsp.csv` and parses it in the browser. Each row is mapped to a clean `DataItem` object:

```ts
{
  city:  row["Metro Cities"],         // "Delhi"
  fuel:  row["Products "].trim(),     // "Petrol" | "Diesel"
  year:  2025,                        // extracted from financial year label
  month: "June",                      // extracted from "June, 2025"
  price: 94.77,                       // from the long RSP column
}
```

### Filtering & Averaging — `calculateAverage.ts`

Given the selected city, fuel type, and year, it filters the 23,000-row dataset to matching records per calendar month and computes the mean price. Returns:

```ts
{ months: ["January", ..., "December"], result: [87.5, 88.2, ...] }
```

### Chart Rendering — `Chart.tsx`

Holds an ECharts instance in a `ref`. Two `useEffect` hooks:

1. **Init** (runs once): `echarts.init(div)` + window resize listener
2. **Update** (runs on prop change): `chart.setOption({ ... })` with new data

### Dropdown Cascade — `App.tsx`

Loads the full dataset once → derives unique sorted values for each dropdown → passes selected values to `calculateMonthlyAverage` → passes result to `<Chart />`.

---

## 📄 Source File Reference

| File | Responsibility |
|---|---|
| `src/App.tsx` | Root component — state, dropdown values, layout |
| `src/components/Chart.tsx` | ECharts bar chart with separate init / update effects |
| `src/components/Dropdown.tsx` | Generic controlled `<select>` wrapper |
| `src/utils/loadCSV.ts` | Fetches CSV, maps raw columns to `DataItem` type |
| `src/utils/calculateAverage.ts` | Filters dataset, computes monthly averages |
| `src/types/index.ts` | Shared types: `FuelType`, `DataItem` |
| `public/rsp.csv` | 23,360-row dataset — metro city fuel prices 2017–2025 |

---

## 🔧 Troubleshooting

| Problem | Solution |
|---|---|
| Chart is blank / all zeros | Use the fixed `calculateAverage.ts` with full month names |
| Dropdowns are empty | Use the fixed `loadCSV.ts` with correct CSV column names |
| `404` on `/src/data/rsp.csv` in production | Ensure `rsp.csv` is in `public/` and the path in `loadCSV.ts` is `/rsp.csv` |
| Chart flickers on dropdown change | Use the fixed `Chart.tsx` with two separate `useEffect` hooks |
| Vercel build fails | Set Root Directory to `fuel-price-dashboard/rsp-dashboard` in Vercel project settings |

---

## 📜 License

This project is open source. Data sourced from the **Government of India / PPAC**.

---

<p align="center">Built with ⚛️ React + ⚡ Vite + 📊 ECharts</p>
