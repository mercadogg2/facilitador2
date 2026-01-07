
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Language, UserRole } from '../types';

interface AdminLoginProps {
  lang: Language;
  onLogin: (role: UserRole) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ lang, onLogin }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulação de login administrativo
    setTimeout(() => {
      onLogin(UserRole.ADMIN);
      navigate('/admin');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16"></div>
        
        <div className="relative">
          <div className="flex justify-center flex-col items-center">
            <div className="bg-indigo-600 text-white p-4 rounded-2xl shadow-xl shadow-indigo-200 mb-6">
              <i className="fas fa-shield-alt text-3xl"></i>
            </div>
            <h2 className="text-center text-3xl font-black text-slate-900 tracking-tight">
              {lang === 'pt' ? 'Painel de Controlo' : 'Control Panel'}
            </h2>
            <p className="mt-2 text-center text-sm text-slate-500 font-medium">
              {lang === 'pt' ? 'Acesso restrito a administradores Facilitador Car' : 'Restricted access for Facilitador Car administrators'}
            </p>
          </div>

          <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                  {lang === 'pt' ? 'Email Corporativo' : 'Corporate Email'}
                </label>
                <div className="relative">
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium"
                    placeholder="admin@facilitadorcar.pt"
                  />
                  <i className="fas fa-envelope absolute right-5 top-1/2 -translate-y-1/2 text-slate-300"></i>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                  {lang === 'pt' ? 'Palavra-passe' : 'Password'}
                </label>
                <div className="relative">
                  <input
                    required
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium"
                    placeholder="••••••••"
                  />
                  <i className="fas fa-lock absolute right-5 top-1/2 -translate-y-1/2 text-slate-300"></i>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded-lg" />
                <label htmlFor="remember-me" className="ml-2 block text-xs text-slate-500 font-bold">
                  {lang === 'pt' ? 'Lembrar neste dispositivo' : 'Remember me'}
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center py-5 px-4 rounded-2xl shadow-xl font-black text-lg text-white transition-all ${
                isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'
              }`}
            >
              {isSubmitting ? (
                <i className="fas fa-circle-notch animate-spin"></i>
              ) : (
                lang === 'pt' ? 'Autenticar Sistema' : 'Authenticate'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-50 text-center">
            <Link to="/login" className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors">
              <i className="fas fa-arrow-left mr-2"></i>
              {lang === 'pt' ? 'Voltar ao Login de Utilizador' : 'Back to User Login'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
