import { useState, useEffect } from 'react';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

const breakpoints: Record<Breakpoint, number> = {
  xs: 480,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600,
};

export const useScreenQuery = () => {
  const [screen, setScreen] = useState<Breakpoint>('xl');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < breakpoints.sm) setScreen('xs');
      else if (width < breakpoints.md) setScreen('sm');
      else if (width < breakpoints.lg) setScreen('md');
      else if (width < breakpoints.xl) setScreen('lg');
      else if (width < breakpoints.xxl) setScreen('xl');
      else setScreen('xxl');
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = screen === 'xs' || screen === 'sm';
  const isTablet = screen === 'md';

  return { screen, isMobile, isTablet };
};
