"use client"; // Marca este componente como un Client Component

import './header.css';
import { useRouter, usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next'; // Importa el hook para la traducción

import logoPng from '../../../../public/logos/logoPng.png';
import textLogo from '../../../../public/logos/textLogo.png';

export const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { t, i18n } = useTranslation(); // Hook de traducción

  // Función para cambiar el idioma
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const goHome = () => {
    if (pathname !== '/home') router.push('home');
  };

  const [marketOpen, setMarketOpen] = useState(false);

  const isMarketOpen = (): boolean => {
    const currentHourUTC = new Date().getUTCHours();
    return currentHourUTC >= 0 && currentHourUTC < 6;
  };

  useEffect(() => {
    setMarketOpen(isMarketOpen());
    const interval = setInterval(() => setMarketOpen(isMarketOpen()), 300000);
    return () => clearInterval(interval);
  }, []);

  const handleButtonClick = () => {
    if (pathname === '/indices') {
      // Si estamos en la ruta /indices, redirige a /home
      router.push('/home');
    } else {
      // De lo contrario, redirige a /indices
      router.push('/indices');
    }
  };

  return (
    <div className="container-Header">
      {/* Sección izquierda del header */}
      <div className="HeaderLeft">
        <img
          className="LogoHeader"
          src={logoPng.src}
          alt={t('header.logoAlt')} // Usamos la traducción para el texto alternativo
          onClick={goHome}
        />
        <img
          className="LogoHeader"
          src={textLogo.src}
          alt={t('header.textLogoAlt')}
          onClick={goHome}
        />
      </div>

      {/* Cartel de estado del mercado */}
      <div className="MarketStatus">
        <p className={`MarketStatusText ${marketOpen ? 'open' : 'closed'}`}>
          {marketOpen
            ? t('header.marketOpen', { hours: '00 UTC - 06 UTC' })
            : t('header.marketClosed')}
        </p>
      </div>

      {/* Sección derecha del header */}
      <div className="HeaderRight">
        <button className="IndicesButton" onClick={handleButtonClick}>
          {pathname === '/indices' ? t('header.viewCompanies') : t('header.viewIndices')}
        </button>

        <div className="LanguageSelector">
          <select
            onChange={(e) => changeLanguage(e.target.value)}
            defaultValue={i18n.language}
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="ja">日本語</option>
          </select>
        </div>
      </div>
    </div>
  );
};
