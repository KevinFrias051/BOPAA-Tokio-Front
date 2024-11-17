import './header.css'
import { useRouter, usePathname } from 'next/navigation'
import React, { useState, useEffect } from 'react'

import logoPng from '../../../../public/logos/logoPng.png'
import textLogo from '../../../../public/logos/textLogo.png'
import router from 'next/router'




export const Header = () => {
  const router = useRouter();
  const pathname = usePathname();

  const goHome = () => {
    if (pathname !== '/home')
      router.push('home')
  }

  return (
    <>
    <div className='container-Header'>
      <div className='HeaderLeft'>
        <img className='LogoHeader' src={logoPng.src} alt="CasaLindner" onClick={goHome}  />
        <img className='LogoHeader' src={textLogo.src} alt="CasaLindner" onClick={goHome} />
      </div>
      <div className="HeaderRighT">
        <div className="LanguageSelector">
        <select /* value={language} onChange={handleChangeLanguage} */>s
        <option value="en">English</option>
        <option value="es">Español</option>
        <option value="ja">日本語 (Japonés)</option>
      </select>
        </div>
      </div>

    </div>

    </>
  )
}