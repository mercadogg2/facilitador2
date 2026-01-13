
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Language, Car, UserProfile, UserRole, BlogPost } from '../types';
import { TRANSLATIONS } from '../constants';
import { supabase } from '../lib/supabase';

interface AdminDashboardProps {
  lang: Language;
  role: UserRole;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ lang, role }) => {
  const navigate = useNavigate();
  const t = TRANSLATIONS[lang].admin;
  const tc = TRANSLATIONS[lang].common;

  const [activeTab, setActiveTab] = useState<'overview' | 'ads' | 'stands' | 'users' | 'blog'>('users');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{message: string, isTableMissing: boolean} | null>(null);
  const [ads, setAds] = useState<Car[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [articles, setArticles] = useState<BlogPost[]>([]);
  const [leadsCount, setLeadsCount] = useState(0);
  
  const [adSearch, setAdSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');

  useEffect(() => {
    if (role !== UserRole.ADMIN) {
      navigate('/admin/login');
      return;
    }
    fetchPlatformData();
  }, [role, navigate]);

  const fetchPlatformData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Buscar Perfis (A tabela que lista os usuários)
      const { data: userData, error: userErr } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (userErr) {
        const isMissing = userErr.message.includes('profiles') || userErr.code === 'PGRST104';
        setError({ message: userErr.message, isTableMissing: isMissing });
      } else {
        setUsers(userData || []);
      }

      // 2. Outros dados em paralelo
      const [carsRes, leadsRes, blogRes] = await Promise.all([
        supabase.from('cars').select('*'),
        supabase.from('leads').select('*', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('*').order('date', { ascending: false })
      ]);

      if (carsRes.data) setAds(carsRes.data);
      if (leadsRes.count !== null) setLeadsCount(leadsRes.count);
      if (blogRes.data) setArticles(blogRes.data);

    } catch (err: any) {
      setError({ message: err.message, isTableMissing: false });
    } finally {
      setLoading(false);
    }
  };

  const sqlFix = `-- 1. CRIAR TABELA DE PERFIS SE NÃO EXISTIR
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  role TEXT DEFAULT 'visitor',
  stand_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. FUNÇÃO DE SINCRONIZAÇÃO AUTOMÁTICA PARA NOVOS REGISTOS
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role, stand_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Utilizador Novo'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'visitor'),
    NEW.raw_user_meta_data->>'stand_name'
  ) ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. GATILHO (TRIGGER) PARA FUTUROS UTILIZADORES
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. SINCRONIZAR MANUALMENTE UTILIZADORES JÁ EXISTENTES
INSERT INTO public.profiles (id, full_name, email, role, stand_name, created_at)
SELECT 
  id, 
  COALESCE(raw_user_meta_data->>'full_name', 'Utilizador Antigo'),
  email,
  COALESCE(raw_user_meta_data->>'role', 'visitor'),
  raw_user_meta_data->>'stand_name',
  created_at
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- 5. PERMISSÕES RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Leitura Pública" ON public.profiles;
CREATE POLICY "Leitura Pública" ON public.profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin All" ON public.profiles;
CREATE POLICY "Admin All" ON public.profiles FOR ALL USING (true);`;

  const filteredUsers = useMemo(() => 
    users.filter(u => 
      (u.full_name || '').toLowerCase().includes(userSearch.toLowerCase()) || 
      (u.email || '').toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.stand_name || '').toLowerCase().includes(userSearch.toLowerCase())
    ),
  [users, userSearch]);

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Painel Admin</h1>
            <p className="text-gray-500 font-medium">Gestão de Utilizadores e Conteúdo</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={fetchPlatformData} className="p-3 bg-white text-gray-400 hover:text-blue-600 rounded-2xl border border-gray-100 shadow-sm transition-all active:scale-95">
              <i className={`fas fa-sync-alt ${loading ? 'animate-spin' : ''}`}></i>
            </button>
            <nav className="flex bg-white p-1.5 rounded-[22px] shadow-sm border border-gray-100 overflow-x-auto no-scrollbar">
              {['users', 'ads', 'blog', 'overview'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${
                    activeTab === tab ? 'bg-gray-900 text-white shadow-xl' : 'text-gray-400 hover:text-gray-900'
                  }`}
                >
                  {tab === 'users' ? 'Utilizadores' : tab === 'ads' ? 'Anúncios' : tab === 'blog' ? 'Blog' : 'Geral'}
                </button>
              ))}
            </nav>
          </div>
        </header>

        {error?.isTableMissing ? (
          <div className="bg-amber-50 border-2 border-amber-200 rounded-[40px] p-10 animate-in fade-in slide-in-from-top-4 shadow-xl shadow-amber-100/20">
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="w-16 h-16 bg-amber-500 text-white rounded-[24px] flex items-center justify-center shrink-0 shadow-lg animate-pulse">
                <i className="fas fa-tools text-3xl"></i>
              </div>
              <div className="flex-grow">
                <h3 className="text-2xl font-black text-amber-900 mb-3">Tabela 'profiles' Não Encontrada</h3>
                <p className="text-amber-800 text-base mb-8 leading-relaxed opacity-90">
                  Para que os utilizadores apareçam nesta lista, precisa de criar a tabela e o gatilho automático no Supabase. 
                  Este script agora inclui um passo para **importar utilizadores já registados**.
                </p>
                <div className="relative group">
                  <pre className="bg-gray-950 text-indigo-400 p-8 rounded-[32px] text-sm font-mono overflow-x-auto shadow-2xl leading-relaxed border border-gray-800/50">
                    {sqlFix}
                  </pre>
                  <button 
                    onClick={() => { navigator.clipboard.writeText(sqlFix); alert("SQL Copiado!"); }}
                    className="absolute top-6 right-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-90"
                  >
                    <i className="fas fa-copy mr-2"></i> Copiar Script
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'users' && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
                    <h3 className="text-2xl font-black text-gray-900">Utilizadores Registados</h3>
                    <div className="relative w-full md:w-80">
                      <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-gray-300"></i>
                      <input 
                        type="text" 
                        placeholder="Pesquisar utilizador..." 
                        className="w-full pl-12 pr-6 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold transition-all"
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50/50 text-gray-400 text-[10px] uppercase font-black tracking-widest border-b border-gray-50">
                        <tr>
                          <th className="px-8 py-5">Perfil</th>
                          <th className="px-8 py-5">Organização</th>
                          <th className="px-8 py-5">Nível</th>
                          <th className="px-8 py-5">Data</th>
                          <th className="px-8 py-5 text-right">Ação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {loading ? (
                          [1,2,3].map(i => (
                            <tr key={i} className="animate-pulse">
                              <td colSpan={5} className="px-8 py-6"><div className="h-6 bg-gray-100 rounded-xl w-full"></div></td>
                            </tr>
                          ))
                        ) : filteredUsers.length > 0 ? (
                          filteredUsers.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50/30 transition-colors group">
                              <td className="px-8 py-6">
                                <div className="flex items-center gap-4">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shadow-sm ${user.role === UserRole.STAND ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                    {(user.full_name || 'U').charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="font-bold text-gray-900 text-[15px]">{user.full_name}</p>
                                    <p className="text-xs text-gray-400 font-medium">{user.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-8 py-6">
                                {user.stand_name ? (
                                  <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                                    <i className="fas fa-store mr-2 opacity-50"></i>{user.stand_name}
                                  </span>
                                ) : <span className="text-xs text-gray-300">Particular</span>}
                              </td>
                              <td className="px-8 py-6">
                                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${
                                  user.role === UserRole.ADMIN ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                                  user.role === UserRole.STAND ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 
                                  'bg-gray-50 text-gray-400 border-gray-100'
                                }`}>
                                  {user.role}
                                </span>
                              </td>
                              <td className="px-8 py-6 text-xs text-gray-500 font-bold">
                                {new Date(user.created_at).toLocaleDateString()}
                              </td>
                              <td className="px-8 py-6 text-right">
                                <button className="w-10 h-10 rounded-xl text-gray-300 hover:text-red-600 hover:bg-red-50 transition-all">
                                  <i className="fas fa-trash-alt"></i>
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="px-8 py-20 text-center">
                              <div className="max-w-lg mx-auto space-y-6">
                                <div className="w-20 h-20 bg-gray-50 text-gray-200 rounded-[28px] flex items-center justify-center mx-auto text-3xl shadow-inner">
                                  <i className="fas fa-user-secret"></i>
                                </div>
                                hide-scrollbar
                                <div>
                                  <h4 className="text-xl font-black text-gray-900">Nenhum utilizador visível</h4>
                                  <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                                    Se já existem utilizadores registados mas não aparecem aqui, é provável que a tabela <strong>profiles</strong> precise de ser sincronizada manualmente com os dados do <strong>Supabase Auth</strong>.
                                  </p>
                                </div>
                                <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 text-left">
                                  <p className="text-blue-800 text-xs font-bold uppercase tracking-widest mb-4 flex items-center">
                                    <i className="fas fa-info-circle mr-2"></i> Solução de Sincronização
                                  </p>
                                  <p className="text-blue-700 text-xs leading-relaxed mb-4 font-medium">
                                    Copie o script abaixo e execute-o no <strong>SQL Editor</strong> do Supabase para importar todos os utilizadores existentes para esta visualização.
                                  </p>
                                  <pre className="bg-white/50 p-4 rounded-xl text-[10px] font-mono text-blue-600 overflow-x-auto border border-blue-200">
                                    {`INSERT INTO public.profiles (id, full_name, email, role, stand_name, created_at)\nSELECT id, COALESCE(raw_user_meta_data->>'full_name', 'Utilizador'), email, COALESCE(raw_user_meta_data->>'role', 'visitor'), raw_user_meta_data->>'stand_name', created_at\nFROM auth.users\nON CONFLICT (id) DO NOTHING;`}
                                  </pre>
                                  <button 
                                    onClick={() => { navigator.clipboard.writeText(sqlFix); alert("Script SQL completo copiado!"); }}
                                    className="mt-4 w-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                                  >
                                    Copiar Script de Reparação Total
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in duration-500">
                <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
                  <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-2">Utilizadores</p>
                  <h4 className="text-5xl font-black text-gray-900">{users.length}</h4>
                </div>
                <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
                  <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-2">Anúncios</p>
                  <h4 className="text-5xl font-black text-gray-900">{ads.length}</h4>
                </div>
                <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
                  <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-2">Leads</p>
                  <h4 className="text-5xl font-black text-gray-900">{leadsCount}</h4>
                </div>
              </div>
            )}
            
            {activeTab === 'ads' && (
              <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden animate-in fade-in">
                <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                  <h3 className="text-2xl font-black text-gray-900">Gestão de Inventário</h3>
                  <input 
                    type="text" 
                    placeholder="Pesquisar veículos..." 
                    className="pl-6 pr-6 py-3 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold"
                    value={adSearch}
                    onChange={(e) => setAdSearch(e.target.value)}
                  />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50/50 text-gray-400 text-[10px] uppercase font-black tracking-widest">
                      <tr>
                        <th className="px-8 py-5">Veículo</th>
                        <th className="px-8 py-5">Stand</th>
                        <th className="px-8 py-5">Preço</th>
                        <th className="px-8 py-5 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {ads.filter(a => a.brand.toLowerCase().includes(adSearch.toLowerCase())).map(ad => (
                        <tr key={ad.id} className="hover:bg-gray-50/20 transition-colors">
                          <td className="px-8 py-6 font-bold text-gray-900">{ad.brand} {ad.model}</td>
                          <td className="px-8 py-6 text-sm text-gray-500">{ad.stand_name}</td>
                          <td className="px-8 py-6 font-black text-blue-600">{new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(ad.price)}</td>
                          <td className="px-8 py-6 text-right">
                             <button className="p-2 text-gray-300 hover:text-red-600 transition-colors"><i className="fas fa-trash-alt"></i></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
