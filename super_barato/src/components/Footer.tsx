import React from 'react';
import { APP_COLORS } from '../../constants';

const Footer: React.FC = () => {
  return (
    <footer className={`${APP_COLORS.neutral700} bg-gray-200 text-white py-8 mt-12`}>
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-gray-700">&copy; {new Date().getFullYear()} SuperBarato. Todos los derechos reservados.</p>
        <p className="text-xs text-gray-500 mt-1">Comparando precios para tu ahorro.</p>
      </div>
    </footer>
  );
};

export default Footer;
