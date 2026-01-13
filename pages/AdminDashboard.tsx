
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Language, Car, UserProfile, UserRole, BlogPost } from '../types';
import { TRANSLATIONS } from '../constants';
import { supabase } from '../lib/supabase';

interface AdminDashboardProps {
  lang: Language;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ lang }) => {
  const navigate = useNavigate();
  const t = TRANSLATIONS[lang].admin;
  const tc = TRANSLATIONS[lang].common;

  const [activeTab, setActiveTab] = useState<'overview' | 'ads' | 'stands' | 'users' | 'blog'>('overview');
  const [loading, setLoading] = useState(true);
  const [ads, setAds] = useState<Car[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [articles, setArticles] = useState<BlogPost[]>([]);
  const [leadsCount, setLeadsCount] = useState(0);
  
  const [adSearch, setAdSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  
  // Article Creation State
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [isCreatingArticle, setIsCreatingArticle] = useState(false);
  const [newArticle, setNewArticle] = useState({
    title: '',
    author: 'Equipa Facilitador Car',
    reading_time: '5 min',
    image: '',
    excerpt: '',
    content: ''
  });

  useEffect(() => {
    const verifyAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.user_metadata?.role !== UserRole.ADMIN) {
        navigate('/admin/login');
        return;
      }
      fetchPlatformData();
    };
    verifyAdmin();
  }, [navigate]);

  const fetchPlatformData = async () => {
    setLoading(true);
    try {
      // Contagem de Carros
      const { data: carsData } = await supabase.from('cars').select('*');
      if (carsData) setAds(carsData);

      // Contagem de Leads
      const { count: lCount } = await supabase.from('leads').select('*', { count: 'exact', head: true });
      if (lCount !== null) setLeadsCount(lCount);

      // Busca de Usuários (Profiles)
      const { data: userData } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (userData) setUsers(userData);

      // Busca de Artigos
      const { data: blogData } = await supabase.from('blog_posts').select('*').order('date', { ascending: false });
      if (blogData) setArticles(blogData);
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAd = async (id: string) => {
    if (!window.confirm(tc.confirmDelete)) return;
    const { error } = await supabase.from('cars').delete().eq('id', id);
    if (!error) setAds(prev => prev.filter(ad => ad.id !== id));
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm(tc.confirmDelete)) return;
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (!error) setUsers(prev => prev.filter(user => user.id !== id));
  };

  const handleDeleteArticle = async (id: string) => {
    if (!window.confirm(tc.confirmDelete)) return;
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (!error) setArticles(prev => prev.filter(art => art.id !== id));
  };

  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingArticle(true);
    
    const { data, error } = await supabase.from('blog_posts').insert([{
      ...newArticle,
      date: new Date().toISOString().split('T')[0]
    }]).select();

    if (!error && data) {
      setArticles(prev => [data[0], ...prev]);
      setShowArticleModal(false);
      setNewArticle({
        title: '',
        author: 'Equipa Facilitador Car',
        reading_time: '5 min',
        image: '',
        excerpt: '',
        content: ''
      });
    } else {
      alert("Erro ao criar artigo");
    }
    setIsCreatingArticle(false);
  };

  const filteredAds = useMemo(() => 
    ads.filter(a => a.brand.toLowerCase().includes(adSearch.toLowerCase()) || a.model.toLowerCase().includes(adSearch.toLowerCase())),
  [ads, adSearch]);

  const filteredUsers = useMemo(() => 
    users.filter(u => u.full_name?.toLowerCase().includes(userSearch.toLowerCase()) || u.email?.toLowerCase().includes(userSearch.toLowerCase())),
  [users, userSearch]);

  const getRoleBadge = (role: UserRole) => {
    switch(role) {
      case UserRole.ADMIN: return <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-[10px] font-bold uppercase">Staff</span>;
      case UserRole.STAND: return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-[10px] font-bold uppercase">Stand</span>;
      default: return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-[10px] font-bold uppercase">Visitor</span>;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
            <p className="text-gray-500">{t.subtitle}</p>
          </div>
          
          <nav className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
            {[
              { id: 'overview', icon: 'fa-chart-pie', label: lang === 'pt' ? 'Visão Geral' : 'Overview' },
              { id: 'ads', icon: 'fa-ad', label: lang === 'pt' ? 'Anúncios' : 'Ads' },
              { id: 'users', icon: 'fa-users', label: lang === 'pt' ? 'Usuários' : 'Users' },
              { id: 'blog', icon: 'fa-newspaper', label: lang === 'pt' ? 'Blog' : 'Blog' },
              { id: 'stands', icon: 'fa-store', label: lang === 'pt' ? 'Parceiros' : 'Stands' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <i className={`fas ${tab.icon}`}></i>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </header>

        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-gray-500 text-sm font-medium">{t.stats[0]}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">{loading ? '...' : users.length}</h3>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-gray-500 text-sm font-medium">{t.stats[2]}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">{loading ? '...' : ads.length}</h3>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-gray-500 text-sm font-medium">{t.stats[3]}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">{loading ? '...' : leadsCount}</h3>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'blog' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-500">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold">{t.blogManagement}</h3>
              <button 
                onClick={() => setShowArticleModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-100"
              >
                <i className="fas fa-plus mr-2"></i>
                {t.newArticle}
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-[11px] uppercase font-bold tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Título</th>
                    <th className="px-6 py-4">Autor</th>
                    <th className="px-6 py-4">Data</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {articles.map(article => (
                    <tr key={article.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-sm text-gray-900">{article.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{article.author}</td>
                      <td className="px-6 py-4 text-xs text-gray-400">{article.date}</td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDeleteArticle(article.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal Artigo */}
        {showArticleModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in duration-300">
              <div className="p-8 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <h2 className="text-2xl font-bold text-gray-900">{t.newArticle}</h2>
                <button onClick={() => setShowArticleModal(false)} className="text-gray-400 hover:text-gray-900">
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
              <form onSubmit={handleCreateArticle} className="p-8 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t.articleTitle}</label>
                  <input 
                    required 
                    value={newArticle.title} 
                    onChange={e => setNewArticle({...newArticle, title: e.target.value})}
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{t.articleAuthor}</label>
                    <input 
                      required 
                      value={newArticle.author} 
                      onChange={e => setNewArticle({...newArticle, author: e.target.value})}
                      className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{t.articleReadingTime}</label>
                    <input 
                      required 
                      value={newArticle.reading_time} 
                      onChange={e => setNewArticle({...newArticle, reading_time: e.target.value})}
                      className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t.articleImage}</label>
                  <input 
                    required 
                    value={newArticle.image} 
                    onChange={e => setNewArticle({...newArticle, image: e.target.value})}
                    placeholder="https://exemplo.com/imagem.jpg"
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t.articleExcerpt}</label>
                  <textarea 
                    required 
                    value={newArticle.excerpt} 
                    onChange={e => setNewArticle({...newArticle, excerpt: e.target.value})}
                    rows={2}
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t.articleContent}</label>
                  <textarea 
                    required 
                    value={newArticle.content} 
                    onChange={e => setNewArticle({...newArticle, content: e.target.value})}
                    rows={8}
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm resize-none"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isCreatingArticle}
                  className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all"
                >
                  {isCreatingArticle ? <i className="fas fa-circle-notch animate-spin"></i> : t.createArticle}
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-500">
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
              <h3 className="text-xl font-bold">{t.usersManagement}</h3>
              <div className="relative w-full md:w-64">
                <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input 
                  type="text" 
                  placeholder={tc.search} 
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-[11px] uppercase font-bold tracking-wider">
                  <tr>
                    <th className="px-6 py-4">{t.userList.name}</th>
                    <th className="px-6 py-4">{t.userList.email}</th>
                    <th className="px-6 py-4">{t.userList.role}</th>
                    <th className="px-6 py-4">{t.userList.date}</th>
                    <th className="px-6 py-4 text-right">{t.userList.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-400">A carregar usuários...</td></tr>
                  ) : filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                      <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                              {user.full_name?.[0] || 'U'}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 text-sm">{user.full_name}</p>
                              {user.stand_name && <p className="text-[10px] text-gray-400">{user.stand_name}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                        <td className="px-6 py-4">
                          {getRoleBadge(user.role)}
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-500">
                          {new Date(user.created_at).toLocaleDateString(lang === 'pt' ? 'pt-PT' : 'en-US')}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            title={tc.delete}
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-400">Nenhum usuário encontrado.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'ads' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-500">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold">{lang === 'pt' ? 'Anúncios Ativos' : 'Active Ads'}</h3>
              <input 
                type="text" 
                placeholder={tc.search} 
                className="pl-4 pr-4 py-2 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={adSearch}
                onChange={(e) => setAdSearch(e.target.value)}
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                  <tr>
                    <th className="px-6 py-4">Veículo</th>
                    <th className="px-6 py-4">Stand</th>
                    <th className="px-6 py-4">Preço</th>
                    <th className="px-6 py-4 text-right">{tc.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAds.map(ad => (
                    <tr key={ad.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 font-bold text-sm">{ad.brand} {ad.model}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{ad.stand_name}</td>
                      <td className="px-6 py-4 font-bold text-blue-600">
                        {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(ad.price)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDeleteAd(ad.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title={tc.delete}
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
