"use client"

import './home.css';

import React from 'react';
import { Header } from '@/app/componentes/header/header';
import LineChart from '@/app/componentes/graficos/ChartComponent';


const sampleData = [
  { id: '286882', fecha: '2024-11-14', hora: '15:00', cotizacion: '75.01', codEmpresa: 'TSE' },
  { id: '286883', fecha: '2024-11-14', hora: '16:00', cotizacion: '75.75', codEmpresa: 'TSE' },
  { id: '286884', fecha: '2024-11-14', hora: '17:00', cotizacion: '76.25', codEmpresa: 'TSE' },
  // Más datos aquí...
];

export default function Home() {
  return (
    <>
    <Header/>
    <div>
      <h1>Cotización de la Empresa</h1>
      <LineChart data={sampleData} />
    </div>
    </>
  );
}
