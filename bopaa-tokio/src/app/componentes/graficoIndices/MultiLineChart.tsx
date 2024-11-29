"use client";
import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useTranslation } from 'react-i18next';
import "./MultiLineChart.css";

interface LineChartProps {
  data: { name: string; data: { x: string; y: number }[] }[];
}

const filterDataByRange = (
  data: { x: string; y: number }[],
  range: "1d" | "3d" | "1w" | "1m" | "all"
) => {
  if (range === "all") return data;

  const now = new Date();
  const ranges: { [key in "1d" | "3d" | "1w" | "1m"]: number } = {
    "1d": 1,
    "3d": 3,
    "1w": 7,
    "1m": 30,
  };

  const days = ranges[range];
  return data.filter((item) => {
    const itemDate = new Date(item.x);
    return now.getTime() - itemDate.getTime() <= days * 24 * 60 * 60 * 1000;
  });
};

export const MultiLineChart: React.FC<LineChartProps> = ({ data }) => {
  const [range, setRange] = useState<"1d" | "3d" | "1w" | "1m" | "all">("1d");
  const [filteredSeries, setFilteredSeries] = useState(
    data.map((serie) => ({
      ...serie,
      data: filterDataByRange(serie.data, "1d"),
    }))
  );

  const { t } = useTranslation();

  useEffect(() => {
    const updatedSeries = data.map((serie) => ({
      ...serie,
      data: filterDataByRange(serie.data, range),
    }));
    setFilteredSeries(updatedSeries);
  }, [range, data]);


  const rangeTranslation = t(`chart.type.${range}`);

  const options: ApexOptions = {
    chart: {
      type: "line",
      zoom: { enabled: true },
    },
    stroke: {
      width: 2,
      curve: "smooth",
    },
    title: {
      text: t('chart.title2'),
      align: "center",
    },
    xaxis: {
      type: "datetime",
      labels: {
        format: "yyyy-MM-dd HH:mm",
      },
    },
    yaxis: {
      title: {
        text: t('chart.yaxisTitle', { defaultValue: 'Valor del Índice' }), 
      },
    },
    tooltip: {
      theme: "dark",
      x: {
        format: "yyyy-MM-dd HH:mm",
      },
      style: {
        fontSize: "14px",
        fontFamily: "Arial, sans-serif",
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "center",
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: { width: "100%" },
          legend: { position: "bottom" },
        },
      },
    ],
  };

  return (
    <div className="chart-container">
      <div style={{ marginBottom: "10px", textAlign: "center" }}>
        {["1d", "3d", "1w", "1m", "all"].map((timeRange) => (
          <button
            key={timeRange}
            className={`rangeButton ${
              range === timeRange ? "rangeButtonActive" : ""
            }`}
            onClick={() => setRange(timeRange as typeof range)}
          >
            {t(`chart.button.${timeRange}`)}
          </button>
        ))}
      </div>
      <ReactApexChart
        options={options}
        series={filteredSeries}
        type="line"
        height="600px"
      />
    </div>
  );
};
