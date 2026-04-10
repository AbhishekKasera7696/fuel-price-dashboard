import * as echarts from "echarts";
import { useEffect, useRef } from "react";

interface Props {
  months: string[];
  data: number[];
  city: string;
  fuel: string;
  year: string;
}

const Chart = ({ months, data, city, fuel, year }: Props) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  // Initialize chart once
  useEffect(() => {
    if (!chartRef.current) return;
    chartInstance.current = echarts.init(chartRef.current);

    const handleResize = () => chartInstance.current?.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, []);

  // Update chart data whenever props change
  useEffect(() => {
    if (!chartInstance.current) return;

    chartInstance.current.setOption({
      title: {
        text: `Monthly Average RSP — ${city} · ${fuel} · ${year}`,
        textStyle: { fontSize: 14 },
      },
      tooltip: {
        trigger: "axis",
        formatter: (params: any) => {
          const p = params[0];
          return `${p.name}<br/>₹${p.value}/L`;
        },
      },
      xAxis: {
        type: "category",
        data: months,
        axisLabel: { rotate: 30 },
      },
      yAxis: {
        type: "value",
        name: "Price (₹/L)",
        axisLabel: { formatter: "₹{value}" },
        min: (val: { min: number }) => Math.max(0, Math.floor(val.min - 5)),
      },
      series: [
        {
          data,
          type: "bar",
          itemStyle: { color: "#4f86f7" },
          label: {
            show: true,
            position: "top",
            formatter: (p: any) => (p.value > 0 ? `₹${p.value}` : ""),
            fontSize: 11,
          },
        },
      ],
    });
  }, [months, data, city, fuel, year]);

  return <div ref={chartRef} style={{ width: "100%", height: "450px" }} />;
};

export default Chart;
