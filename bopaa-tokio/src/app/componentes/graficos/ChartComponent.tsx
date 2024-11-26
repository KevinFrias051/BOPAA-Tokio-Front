'use client';
import React from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useTranslation } from "react-i18next"; // Importar el hook de traducción
import './ChartComponent.css';

interface ChartComponentProps {
  data: [string, number][]; // Datos para el gráfico
  selectedType: "DIA" | "MES"; // Tipo seleccionado
}

export const ChartComponent: React.FC<ChartComponentProps> = ({ data, selectedType }) => {
  const { t } = useTranslation(); // Inicializar traducción

  const options: ApexOptions = {
    chart: {
      type: "pie",
      background: "transparent",
      foreColor: "#000000",
    },
    labels: data.map(item => item[0]), 
    title: {
      text: t('chart.title', { type: t(`chart.type.${selectedType}`) }), 
      align: "center",
      style: {
        fontSize: "24px",
        fontWeight: "bold",
        color: "#ffffff",
      },
      offsetY: 0,
    },
    legend: {
      position: "right",
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
      <ReactApexChart options={options} series={series} type="pie" width="900px" height="900px" />
    </div>
  );
};
