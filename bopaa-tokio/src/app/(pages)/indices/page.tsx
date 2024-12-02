"use client";

import React, { useEffect, useState } from "react";
import { MultiLineChart } from "@/app/componentes/graficoIndices/MultiLineChart";
import clienteAxios, { baseURL } from "@/app/services/Axios";
import { useTranslation } from "react-i18next";

const Home2: React.FC = () => {
  const { t } = useTranslation();
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: codsIndice } = await clienteAxios.get(
          `${baseURL}/indice/getAllcodsIndice`
        );

        if (!Array.isArray(codsIndice)) {
          throw new Error(t("error.invalidCodsIndiceFormat"));
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
        console.error(t("error.fetchingData"), error);
      } finally {
        setLoading(false);
        setIsRendered(true);
      }
    };

    fetchData();
  }, [t]);


  useEffect(() => {
    if (isRendered) {
      console.log("Component rendered, apply CSS adjustments.");
    }
  }, [isRendered]);

  return (
    <div>
      {loading ? <p>{t("loading")}</p> : <MultiLineChart data={chartData} />}
    </div>
  );
};

export default Home2;
