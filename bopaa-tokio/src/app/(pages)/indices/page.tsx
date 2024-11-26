"use client";

import React, { useEffect, useState } from "react";
import { MultiLineChart } from "@/app/componentes/graficoIndices/MultiLineChart";
import clienteAxios, { baseURL } from "@/app/services/Axios";
import { useTranslation } from 'react-i18next'; // Importa el hook para la traducción

const Home2: React.FC = () => {
  const { t } = useTranslation(); // Hook de traducción
  const [chartData, setChartData] = useState<any[]>([]); // Chart data
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: codsIndice } = await clienteAxios.get(
          `${baseURL}/indice/getAllcodsIndice`
        );

        if (!Array.isArray(codsIndice)) {
          throw new Error(t("error.invalidCodsIndiceFormat")); // Traducción de error
        }
        const cotizacionesPromises = codsIndice.map((cod: string) =>
          clienteAxios.get(
            `${baseURL}/IndiceCotizacion/getAllIndiceCotizacionByCod/${cod}`
          )
        );

        const cotizacionesResponses = await Promise.all(cotizacionesPromises);
        const formattedData = cotizacionesResponses.map((response, index) => {
          const codIndice = codsIndice[index];
          const validData = response.data
            .filter((cotizacion: any) => {
              const fechaHora = `${cotizacion.fecha}T${cotizacion.hora}:00`;
              return !isNaN(new Date(fechaHora).getTime()); 
            })
            .map((cotizacion: any) => ({
              x: new Date(`${cotizacion.fecha}T${cotizacion.hora}:00`).toISOString(),
              y: parseFloat(cotizacion.indiceCotizacion),
            }));

          return {
            name: codIndice,
            data: validData,
          };
        });

        console.log("Formatted Data for Chart:", formattedData);
        setChartData(formattedData);
      } catch (error) {
        console.error(t("error.fetchingData"), error); // Traducción de error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [t]);

  return (
    <div>
      {loading ? <p>{t("loading")}</p> : <MultiLineChart data={chartData} />}
    </div>
  );
};

export default Home2;
