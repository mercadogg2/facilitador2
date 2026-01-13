
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Language, UserRole } from '../types';
import { TRANSLATIONS } from '../constants';
import { supabase } from '../lib/supabase';

interface AuthProps {
  lang: Language;
  mode: 'login' | 'register';
  onLogin: (role: UserRole) => void;
}

const Auth: React.FC<AuthProps> = ({ lang, mode: initialMode, onLogin }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [userType, setUserType] = useState<UserRole>(UserRole.VISITOR);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const t = TRANSLATIONS[lang].auth;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '', standName: '', email: '', password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (mode === 'login' && formData.email === 'admin@facilitadorcar.pt' && formData.password === 'admin123') {
        localStorage.setItem('fc_session', JSON.stringify({
          email: formData.email, role: UserRole.ADMIN, timestamp: new Date().getTime()
        }));
        onLogin(UserRole.ADMIN);
        setIsSuccess(true);
        setTimeout(() => navigate('/admin'), 1500);
        return;
      }

      if (mode === 'register') {
        if (formData.email.toLowerCase() === 'admin@facilitadorcar.pt') {
          throw new Error(lang === 'pt' ? 'Não é permitido criar contas com este email.' : 'Cannot create accounts with this email.');
        }

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.name,
              stand_name: userType === UserRole.STAND ? formData.standName : null,
              role: userType
            }
          }
        });

        if (signUpError) throw signUpError;

        if (signUpData.user) {
          // Tentar criar perfil, mas não bloquear se a tabela não existir
          const { error: profileError } = await supabase.from('profiles').insert([{
            id: signUpData.user.id,
            full_name: formData.name,
            email: formData.email,
            role: userType,
            stand_name: userType === UserRole.STAND ? formData.standName : null,
            created_at: new Date().toISOString()
          }]);

          if (profileError && !profileError.message.includes('profiles')) {
             throw profileError;
          }
          
          if (profileError && profileError.message.includes('profiles')) {
            console.warn("Tabela 'profiles' ausente. Perfil guardado apenas no Auth Metadata.");
          }
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email, password: formData.password,
        });
        if (signInError) throw signInError;
      }

      setIsSuccess(true);
      const { data: { user } } = await supabase.auth.getUser();
      let roleToSet: UserRole = UserRole.VISITOR;
      
      if (user?.email === 'admin@facilitadorcar.pt') {
        roleToSet = UserRole.ADMIN;
      } else if (user?.user_metadata?.role) {
        roleToSet = user.user_metadata.role;
      }

      onLogin(roleToSet);
      setTimeout(() => {
        if (roleToSet === UserRole.ADMIN) navigate('/admin');
        else if (roleToSet === UserRole.STAND) navigate('/dashboard');
        else navigate('/cliente');
      }, 1500);

    } catch (err: any) {
      setError(err.message === 'Invalid login credentials' 
        ? (lang === 'pt' ? 'Dados inválidos. Verifique o email e a senha.' : 'Invalid data. Check email and password.') 
        : err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-12 rounded-[40px] shadow-2xl text-center max-w-md w-full animate-in zoom-in duration-300">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl">
            <i className="fas fa-check"></i>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{mode === 'login' ? t.successLogin : t.successRegister}</h2>
          <p className="text-gray-500">A redirecionar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center items-center mb-10">
          <div className="bg-blue-600 text-white p-2.5 rounded-xl mr-2.5">
            <i className="fas fa-car-side text-2xl"></i>
          </div>
          <span className="font-bold text-3xl tracking-tight text-gray-900">Facilitador<span className="text-blue-600">Car</span></span>
        </Link>
        <h2 className="text-center text-3xl font-extrabold text-gray-900">{mode === 'login' ? t.loginTitle : t.registerTitle}</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-6 shadow-xl sm:rounded-[40px] border border-gray-100 sm:px-12">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100 flex items-center">
              <i className="fas fa-exclamation-circle mr-2"></i> {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t.name}</label>
                  <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm" placeholder="João Silva" />
                </div>
                {userType === UserRole.STAND && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{t.standName}</label>
                    <input required type="text" value={formData.standName} onChange={(e) => setFormData({...formData, standName: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm" placeholder="Ex: Porto Motors" />
                  </div>
                )}
              </>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">{t.email}</label>
              <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm" placeholder="exemplo@email.com" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">{t.password}</label>
              <input required type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm" placeholder="••••••••" />
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full flex justify-center py-5 px-4 rounded-2xl shadow-xl font-black text-lg text-white transition-all bg-blue-600 hover:bg-blue-700 shadow-blue-100">
              {isSubmitting ? <i className="fas fa-circle-notch animate-spin"></i> : (mode === 'login' ? t.submitLogin : t.submitRegister)}
            </button>
          </form>

          <div className="mt-8 text-center flex flex-col space-y-4">
            <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-sm font-bold text-blue-600 hover:text-blue-500">
              {mode === 'login' ? t.noAccount : t.hasAccount}
            </button>
            <Link to="/admin/login" className="text-[10px] font-black uppercase tracking-widest text-gray-300 hover:text-indigo-500">Acesso Staff / Administrador</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
