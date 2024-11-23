import React, { useEffect, useState } from "react";
import "./cardCotizacion.css";
import clienteAxios, { baseURL } from "@/app/services/Axios";
import LineChart from "../lineChart/LineChart";

interface ICotizacionCard {
  codEmpresa: string;
  nombreEmpresa: string;
  valorActual: number;
  fluctuacion: number;
}

interface CardCotizacionProps {
  codEmpresa: string;
}

export const CardCotizacion: React.FC<CardCotizacionProps> = ({ codEmpresa }) => {
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
        setError("Error al cargar la cotización");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [codEmpresa]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;
  if (!cotizacion) return <p>No hay datos disponibles</p>;

  const { nombreEmpresa, valorActual, fluctuacion } = cotizacion;

  return (
    <div className="cardCotizacion">
      <div className="nombresEmpresa">
        <p className="codigo">{codEmpresa}</p>
        <p className="nombre">{nombreEmpresa}</p>
      </div>
      <div className="informacion">
        <div className="flecha">
          {fluctuacion > 0 ? (
            <span style={{ color: "#00c853" }}>↑</span> // Verde para positivo
          ) : fluctuacion < 0 ? (
            <span style={{ color: "#d50000" }}>↓</span> // Rojo para negativo
          ) : (
            <span style={{ color: "#546e7a" }}>→</span> // Gris para neutro
          )}
        </div>
        <div className="valor">
          <p>${valorActual}</p>
          <p
            className={`porcentaje ${
              fluctuacion > 0 ? "" : fluctuacion < 0 ? "negativo" : "neutro"
            }`}
          >
            {fluctuacion.toFixed(2)}%
          </p>
        </div>
      </div>
      {/* Botón para abrir el modal */}
      <button className="btn-grafico" onClick={() => setShowModal(true)}>
        Ver gráfico
      </button>

      {/* Modal con el gráfico */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowModal(false)}>
              ×
            </button>
            <LineChart cod={codEmpresa} onClose={() => setShowModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};
