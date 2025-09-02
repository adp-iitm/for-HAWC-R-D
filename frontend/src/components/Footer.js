import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-12 border-t border-secondary-200">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-secondary-600">
        <div className="flex flex-col items-center space-y-2">
          <div style={{ width: 96, height: 4, background: 'linear-gradient(90deg, #FF9933, #FFFFFF, #138808)' }} className="rounded-full" />
          <p>Made in India 🇮🇳 — I am doing this as an interview task for HAWC R&D</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


