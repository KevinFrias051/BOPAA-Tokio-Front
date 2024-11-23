"use client";
import './home.css';
import React, { useEffect, useState } from 'react';
import { Header } from '@/app/componentes/header/header';
import { ChartComponent } from '@/app/componentes/graficos/ChartComponent';
import clienteAxios, { baseURL } from '@/app/services/Axios';

import LineChart from '@/app/componentes/lineChart/LineChart';
import { CardCotizacion } from '@/app/componentes/cardCotizacion/cardCotizacion';


export default function Home2() {


  return (
    <>
      <Header/>

      <div>
      <h1>Stock Chart</h1>
      <CardCotizacion codEmpresa={'nvda'}
    />
    </div>
    
      
    </>
  );
}
