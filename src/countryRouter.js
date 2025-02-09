// utils/countryRouter.js
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const COUNTRY_ROUTES = {
  IN: '/in',
  GB: '/uk',
  US: '', 
};

const DEFAULT_ROUTE = '';

export const useCountryRedirect = () => {
    const navigate = useNavigate();
    const location = useLocation();
  
    useEffect(() => {
      const detectCountryAndRedirect = async () => {
        const storedCountryCode = localStorage.getItem('country_code');
  
        if (storedCountryCode) {
          handleRedirect(storedCountryCode);
          return;
        }
  
        try {
          const response = await fetch('https://ipapi.co/json/');
          const data = await response.json();
          const countryCode = data.country_code;
  
          localStorage.setItem('country_code', countryCode);
          handleRedirect(countryCode);
        } catch (error) {
          console.error('Error detecting country:', error);
        }
      };
  
      const handleRedirect = (countryCode) => {
        const targetRoute = COUNTRY_ROUTES[countryCode] || DEFAULT_ROUTE;
        if (location.pathname === '/' && targetRoute) {
          navigate(targetRoute, { replace: true });
        }
      };
  
      if (location.pathname === '/' &&
          !location.pathname.includes('/dashboard') &&
          !location.pathname.includes('/profile') &&
          !location.pathname.includes('/login')) {
        detectCountryAndRedirect();
      }
    }, [navigate, location]);
  };
  

// Helper function to get country-specific base URL
export const getCountryBaseUrl = (countryCode) => {
  const route = COUNTRY_ROUTES[countryCode] || DEFAULT_ROUTE;
  return `https://opiniomea.com${route}`;
};