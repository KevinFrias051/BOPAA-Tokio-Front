// eslint-disable-next-line react-hooks/exhaustive-deps
"use client";

import React, { useEffect, useState } from "react";
import "./cardCotizacion.css";
import clienteAxios, { baseURL } from "@/app/services/Axios";
import LineChart from "../lineChart/LineChart";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useTranslation } from "react-i18next";

interface ICotizacionCard {
  codEmpresa: string;
  nombreEmpresa: string;
  valorActual: number;
  fluctuacion: number;
}

interface CardCotizacionProps {
  codEmpresa: string;
  currency: 'USD' | 'YEN'; 
  exchangeRate: number; 
}

export const CardCotizacion: React.FC<CardCotizacionProps> = ({ codEmpresa, currency, exchangeRate }) => {
  const { t } = useTranslation();
  const [cotizacion, setCotizacion] = useState<ICotizacionCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await clienteAxios.get<ICotizacionCard>(
          `${baseURL}/cotizaciones/lastCotizacionEmpByCod/${codEmpresa}`
        );
        setCotizacion(response.data);
      } catch (err) {
        setError(t("errorLoading"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [codEmpresa, t]);

  if (loading) return <p>{t("loading")}</p>;
  if (error) return <p>{error}</p>;
  if (!cotizacion) return <p>{t("noData")}</p>;

  const { nombreEmpresa, valorActual, fluctuacion } = cotizacion;

  const value =
    currency === "USD" ? valorActual : valorActual * exchangeRate;
  const convertedValue = Number(value);

  return (
    <div className="cardCotizacion">
      <div className="nombresEmpresa">
        <p className="codigo">{codEmpresa}</p>
        <p className="nombre">{nombreEmpresa}</p>
      </div>
      <div className="informacion">
        <div className="flecha">
          {fluctuacion > 0 ? (
            <span style={{ color: "#00c853" }}>
              <i className="bi bi-arrow-up-short icon-large"></i>
            </span>
          ) : fluctuacion < 0 ? (
            <span style={{ color: "#d50000" }}>
              <i className="bi bi-arrow-down-short icon-large"></i>
            </span>
          ) : (
            <span style={{ color: "#546e7a" }}>
              <i className="bi bi-arrow-right-short icon-large"></i>
            </span>
          )}
        </div>
        <div className="valor">
          <p>
            {currency === "USD" ? "$" : "¥"} {convertedValue.toFixed(2)}
          </p>
          <p
            className={`porcentaje ${
              fluctuacion > 0 ? "" : fluctuacion < 0 ? "negativo" : "neutro"
            }`}
          >
            {fluctuacion.toFixed(2)}%
          </p>
        </div>
      </div>
      <div className="boton">
        <button className="btn-grafico" onClick={() => setShowModal(true)}>
          {t("viewChart")}
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowModal(false)}>
              ×
            </button>
            <LineChart
              cod={codEmpresa}
              onClose={() => setShowModal(false)}
              currency={currency} // Pasa la moneda seleccionada
              exchangeRate={exchangeRate} // Pasa el tipo de cambio
            />
          </div>
        </div>
      )}
    </div>
  );
};
