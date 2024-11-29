'use client';
import React from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useTranslation } from "react-i18next"; 
import './ChartComponent.css';

interface ChartComponentProps {
  data: [string, number][];
  selectedType: "DIA" | "MES"; 
}

export const ChartComponent: React.FC<ChartComponentProps> = ({ data, selectedType }) => {
  const { t } = useTranslation(); 

  const options: ApexOptions = {
    chart: {
      type: "pie",
      background: "transparent",
      foreColor: "#000000",
    },
    labels: data.map(item => item[0]), 
    title: {
      text: t('chart.title', { type: t(`chart.type.${selectedType}`) }), 
      align: "left",
      style: {
        fontSize: "24px",
        fontWeight: "bold",
        color: "#ffffff",
      },
      offsetY: 0,
    },
    legend: {
      position: "bottom",
    },
    tooltip: {
      theme: "light",
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  const series = data.map(item => item[1]);

  return (
    <div className="chart-container">
      <ReactApexChart options={options} series={series} type="pie" width="800px" height="800px" />
    </div>
  );
};
