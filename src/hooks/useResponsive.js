// src/hooks/useResponsive.js
import { useState, useEffect } from 'react';
import { theme } from '../styles/theme';

const useResponsive = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return {
    isMobile: windowWidth < 650,
    isTablet: windowWidth >= 650 && windowWidth < 1100,
    isDesktop: windowWidth >= 1100,
    windowWidth
  };
};

export default useResponsive;