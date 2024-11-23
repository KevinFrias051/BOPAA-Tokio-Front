import React from "react";
import { Chart } from "react-google-charts";
import './ChartComponent.css'
interface ChartComponentProps {
  data: [string, number][]; // Datos para el gráfico
  selectedType: "DIA" | "MES"; // Tipo seleccionado
}

export const ChartComponent: React.FC<ChartComponentProps> = ({ data, selectedType }) => {
  const options = {
    title: `Participación de Empresas (${selectedType})`,
    pieHole: 0.4,
    is3D: false,
  };

  return (
    <div className="chart-container mb-4">
      <Chart
        chartType="PieChart"
        data={[["Empresa", "Participación"], ...data]}
        options={options}
        width={"90%"}
        height={"400px"}
      />
    </div>
  );
};
