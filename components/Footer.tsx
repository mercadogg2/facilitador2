
import React from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface FooterProps {
  lang: Language;
}

const Footer: React.FC<FooterProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang].footer;
  const nav = TRANSLATIONS[lang].nav;

  return (
    <footer className="bg-gray-900 text-white py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">Facilitador<span className="text-blue-500">Car</span></h3>
            <p className="text-gray-400 mb-6 max-w-sm">{t.desc}</p>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase text-sm tracking-widest text-gray-500">{t.links}</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#/veiculos">{nav.vehicles}</a></li>
              <li><a href="#/sobre">{nav.about}</a></li>
              <li><a href="#/blog">{nav.blog}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase text-sm tracking-widest text-gray-500">{t.legal}</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#">{lang === 'pt' ? 'Privacidade' : 'Privacy'}</a></li>
              <li><a href="#">Cookies</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
          <p>© 2024 Facilitador Car. {t.rights}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
