"use client"; // Marcado como componente cliente

import { metadata } from './metadata'; // Importa metadata aquí

import { ReactNode } from 'react';
import './globals.css';
import { Header } from './componentes/header/header';
import './../i18n'; // Importa la configuración de i18n
import { I18nextProvider } from 'react-i18next';
import i18n from './../i18n';


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <I18nextProvider i18n={i18n}>
          <Header />
          {children}
        </I18nextProvider>
      </body>
    </html>
  );
}
