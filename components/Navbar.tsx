
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Language, UserRole } from '../types';
import { TRANSLATIONS } from '../constants';

interface NavbarProps {
  lang: Language;
  role: UserRole;
  isLoggedIn: boolean;
  onToggleLang: () => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ lang, role, isLoggedIn, onToggleLang, onLogout }) => {
  const t = TRANSLATIONS[lang].nav;
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <div className="bg-blue-600 text-white p-2 rounded-lg mr-2 group-hover:bg-blue-700 transition-colors">
                <i className="fas fa-car-side text-lg"></i>
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900">
                Facilitador<span className="text-blue-600">Car</span>
              </span>
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
              <Link to="/" className={`${isActive('/') ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-900'} px-3 py-2 text-sm font-medium h-full flex items-center transition-all`}>
                {t.home}
              </Link>
              <Link to="/veiculos" className={`${isActive('/veiculos') ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-900'} px-3 py-2 text-sm font-medium h-full flex items-center transition-all`}>
                {t.vehicles}
              </Link>
              <Link to="/sobre" className={`${isActive('/sobre') ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-900'} px-3 py-2 text-sm font-medium h-full flex items-center transition-all`}>
                {t.about}
              </Link>
              <Link to="/blog" className={`${isActive('/blog') ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-900'} px-3 py-2 text-sm font-medium h-full flex items-center transition-all`}>
                {t.blog}
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={onToggleLang}
              className="px-2 py-1 text-xs font-bold border border-gray-200 rounded uppercase hover:bg-gray-50 transition-colors"
            >
              {lang}
            </button>
            
            {!isLoggedIn ? (
              <Link 
                to="/login" 
                className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all"
              >
                {t.login}
              </Link>
            ) : (
              <>
                {role === UserRole.ADMIN ? (
                  <Link to="/admin" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all">
                    <i className="fas fa-tools mr-2"></i>
                    {t.admin}
                  </Link>
                ) : role === UserRole.STAND ? (
                  <Link to="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 shadow-md shadow-blue-200 transition-all">
                    <i className="fas fa-chart-line mr-2"></i>
                    {t.dashboard}
                  </Link>
                ) : (
                  <Link to="/cliente" className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 shadow-md shadow-gray-200 transition-all">
                    <i className="fas fa-user mr-2"></i>
                    {t.client}
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
