"use client";
import "./home.css";
import React, { useEffect, useState } from "react";
import { ChartComponent } from "@/app/componentes/graficos/ChartComponent";
import clienteAxios, { baseURL } from "@/app/services/Axios";
import { CardCotizacion } from "@/app/componentes/cardCotizacion/cardCotizacion";
import { useTranslation } from "react-i18next";
import { CurrencySelector } from "@/app/componentes/CurrencySelector/currencySelector";

interface DataItem {
  empresa: string;
  participacion: number;
  tipo: string;
}

interface EmpresaData {
  codEmpresa: string;
  nombreEmpresa: string;
  cotizationInicial: string;
  cantidadAcciones: string;
}

const arrCodigosEmpresas = ["GOOGL", "NVDA", "NESN.SW", "KO", "BA", "WMT", "SHEL"];

const fetchData = async (): Promise<{ cotizaciones: DataItem[]; empresas: EmpresaData[] }> => {
  const [cotizacionesRes, empresasRes] = await Promise.all([
    clienteAxios.get(`${baseURL}/cotizaciones/participacionBolsa`),
    clienteAxios.get(`${baseURL}/empresas/buscar/db`),
  ]);

  return {
    cotizaciones: cotizacionesRes.data,
    empresas: empresasRes.data,
  };
};

const transformData = (
  cotizaciones: DataItem[],
  empresas: EmpresaData[]
): DataItem[] => {
  const empresaMap = empresas.reduce<Record<string, string>>((map, empresa) => {
    map[empresa.codEmpresa] = empresa.nombreEmpresa;
    return map;
  }, {});

  return cotizaciones.map((item) => ({
    ...item,
    empresa: empresaMap[item.empresa] || item.empresa,
  }));
};

const filterAndTransform = (data: DataItem[], tipo: string): [string, number][] =>
  data
    .filter((item) => item.tipo === tipo)
    .map((item) => [item.empresa, item.participacion]);

export default function Home() {
  const { t } = useTranslation();
  const [chartData, setChartData] = useState<[string, number][]>([]);
  const [selectedType, setSelectedType] = useState<"DIA" | "MES">("DIA");
  const [allData, setAllData] = useState<DataItem[]>([]);
  const [currency, setCurrency] = useState<"USD" | "YEN">("USD");
  const [exchangeRate, setExchangeRate] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const { cotizaciones, empresas } = await fetchData();
        const transformedData = transformData(cotizaciones, empresas);
        setAllData(transformedData);
        setChartData(filterAndTransform(transformedData, selectedType));
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    setExchangeRate(currency === "YEN" ? 150 : 1); // 1 USD = 150 Yen 
  }, [currency]);


  useEffect(() => {
    if (allData.length > 0) {
      setChartData(filterAndTransform(allData, selectedType));
    }
  }, [selectedType, allData]);

  return (
    <div className="home">

      <div className="cardsContainer">
        <CurrencySelector currency={currency} onChange={setCurrency} />
        {arrCodigosEmpresas.map((cod) => (
          <CardCotizacion
            key={cod}
            codEmpresa={cod}
            currency={currency}
            exchangeRate={exchangeRate}
          />
        ))}
      </div>

      <div className="graficoContainer">
        {loading ? (
          <div className="text-center">
            <p>{t("loading")}</p>
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : (
          <>
            <ChartComponent data={chartData} selectedType={selectedType} />
            <div className="button-group text-center">
              <button
                className={`btn ${selectedType === "DIA" ? "btn-primary active" : "btn-outline-primary"} me-2`}
                onClick={() => setSelectedType("DIA")}
              >
                {t("chart.type.DIA")}
              </button>
              <button
                className={`btn ${selectedType === "MES" ? "btn-primary active" : "btn-outline-secondary"}`}
                onClick={() => setSelectedType("MES")}
              >
                {t("chart.type.MES")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
