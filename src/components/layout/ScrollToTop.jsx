import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // "instant" makes it jump to top, "smooth" animates it
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant" 
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;