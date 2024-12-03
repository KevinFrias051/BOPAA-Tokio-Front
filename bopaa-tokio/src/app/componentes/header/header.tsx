// eslint-disable-next-line react-hooks/exhaustive-deps
"use client";
import './header.css';
import { useRouter, usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import logoPng from '../../../../public/logos/logoPng.png';
import textLogo from '../../../../public/logos/textLogoW.png';

export const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { t, i18n } = useTranslation();

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
      router.push('/home');
    } else {
      router.push('/indices');
    }
  };

  return (
    <div className="container-Header">
      <div className="HeaderLeft">
        <img
          className="LogoHeader"
          src={logoPng.src}
          alt='TokyoStockExchange'
          onClick={goHome}
        />
        <img
          className="LogoHeader"
          src={textLogo.src}
          alt='TokyoStockExchange'
          onClick={goHome}
        />
      </div>

      <div className="MarketStatus">
        <p className={`MarketStatusText ${marketOpen ? 'open' : 'closed'}`}>
          {marketOpen
            ? t('header.marketOpen', { hours: '00 UTC - 06 UTC' })
            : t('header.marketClosed')}
        </p>
      </div>

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
