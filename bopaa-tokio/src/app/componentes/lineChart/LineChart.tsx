import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { toZonedTime } from "date-fns-tz";
import clienteAxios from "@/app/services/Axios";
import { baseURL } from "@/app/services/Axios";

import "./LineChart.css";

type LineChartProps = {
  cod: string;
  onClose: () => void;
};

const processLineCotizations = (data: any[]) => {
  return data.map((item) => {
    const datetime = `${item.fecha}T${item.hora}:00`; 
    const zonedDate = toZonedTime(datetime, 'Asia/Tokyo'); 
    return {
      x: zonedDate,
      y: parseFloat(item.cotizacion),
    };
  });
};


const filterDataByRange = (
  data: any[],
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

const downsampleData = (data: any[], step: number) => {
  return data.filter((_, index) => index % step === 0);
};

const LineChart: React.FC<LineChartProps> = ({ cod, onClose }) => {
  const [range, setRange] = useState<"1d" | "3d" | "1w" | "1m" | "all">("1d");
  const [processedData, setProcessedData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCotizations = async () => {
      setLoading(true);

      try {
        const response = await clienteAxios.get(
          `${baseURL}/cotizaciones/allCotizacionEmpByCod/${cod}`
        );
        const processed = processLineCotizations(response.data);
        console.log('response:',response.data)
        setProcessedData(processed);
        console.log('processed:',processed)
        setFilteredData(filterDataByRange(processed, range));
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCotizations();
  }, [cod]);

  useEffect(() => {
    let dataToDisplay = range === "all" 
      ? downsampleData(processedData, Math.max(Math.floor(processedData.length / 1000), 1))
      : filterDataByRange(processedData, range);
    setFilteredData(dataToDisplay);
  }, [range, processedData]);

  const options: ApexOptions = {
    chart: {
      type: "line",
      height: 250,
      toolbar: {
        show: false,
      },
      background: "#121212",
    },
    title: {
      text: `Cotización del Mercado De ${cod}`,
      align: "center",
      style: {
        color: "#ffffff",
      },
    },
    xaxis: {
      type: "datetime",
      labels: {
        format: "dd/MM HH:mm",
        style: {
          colors: "#aaaaaa",
        },
      },
      axisBorder: {
        color: "#555555",
      },
      axisTicks: {
        color: "#555555",
      },
    },
    yaxis: {
      labels: {
        formatter: (val) => val.toFixed(2),
        style: {
          colors: "#aaaaaa",
        },
      },
    },
    markers: {
      size: 5,
      colors: filteredData.map((point, index) => {
        if (index === 0 || !filteredData[index - 1]) return "#00c8ff";

        const prevPoint = filteredData[index - 1]?.y;
        if (prevPoint === undefined || isNaN(prevPoint)) return "#00c8ff";

        const difference = point.y - prevPoint;
        const percentChange = (difference / prevPoint) * 100;

        return Math.abs(percentChange) > 0.1
          ? percentChange > 0
            ? "#00ff00" 
            : "#ff0000" 
          : "#00c8ff";
      }),
    },
    stroke: {
      curve: "smooth",
      width: 1,
      colors: ["#00c8ff"],
    },
    tooltip: {
      theme: "dark",
      x: {
        format: "dd/MM/yyyy HH:mm",
      },
    },
  };

  const series = [
    {
      name: "Cotización",
      data: filteredData,
    },
  ];

  return (
    <div className="chartContainer">
      <div style={{ marginBottom: "10px", textAlign: "center" }}>
        <button
          className={`rangeButton ${range === "1d" ? "rangeButtonActive" : ""}`}
          onClick={() => setRange("1d")}
        >
          1 Día
        </button>
        <button
          className={`rangeButton ${range === "3d" ? "rangeButtonActive" : ""}`}
          onClick={() => setRange("3d")}
        >
          3 Días
        </button>
        <button
          className={`rangeButton ${range === "1w" ? "rangeButtonActive" : ""}`}
          onClick={() => setRange("1w")}
        >
          1 Semana
        </button>
        <button
          className={`rangeButton ${range === "1m" ? "rangeButtonActive" : ""}`}
          onClick={() => setRange("1m")}
        >
          1 Mes
        </button>
        <button
          className={`rangeButton ${range === "all" ? "rangeButtonActive" : ""}`}
          onClick={() => setRange("all")}
        >
          Todo
        </button>
      </div>

      {loading ? (
        <p className="loadingText">Cargando datos...</p>
      ) : (
        <ReactApexChart options={options} series={series} type="line" height={350} />
      )}

      <button onClick={onClose} className="closeButton">
        Cerrar
      </button>
    </div>
  );
};

export default LineChart;
