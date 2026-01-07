
import React, { useState, useEffect, useMemo } from 'react';
import { Language, Car, Lead } from '../types';
import { TRANSLATIONS } from '../constants';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '../lib/supabase';

interface AdminDashboardProps {
  lang: Language;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang].admin;
  const tc = TRANSLATIONS[lang].common;

  const [activeTab, setActiveTab] = useState<'overview' | 'ads' | 'stands'>('overview');
  const [loading, setLoading] = useState(true);
  const [ads, setAds] = useState<Car[]>([]);
  const [leadsCount, setLeadsCount] = useState(0);
  const [adSearch, setAdSearch] = useState('');

  // Estados reais buscados do Supabase
  useEffect(() => {
    const fetchPlatformData = async () => {
      setLoading(true);
      
      // Contagem de Carros
      const { data: carsData } = await supabase.from('cars').select('*');
      if (carsData) setAds(carsData);

      // Contagem de Leads
      const { count: lCount } = await supabase.from('leads').select('*', { count: 'exact', head: true });
      if (lCount !== null) setLeadsCount(lCount);

      setLoading(false);
    };
    fetchPlatformData();
  }, []);

  const growthData = [
    { name: 'Jan', ads: 120, leads: 400 },
    { name: 'Fev', ads: 150, leads: 520 },
    { name: 'Mar', ads: 180, leads: 610 },
    { name: 'Abr', ads: 240, leads: 800 },
    { name: 'Mai', ads: 320, leads: 1200 },
    { name: 'Jun', ads: 450, leads: 1500 },
  ];

  const filteredAds = useMemo(() => 
    ads.filter(a => a.brand.toLowerCase().includes(adSearch.toLowerCase()) || a.model.toLowerCase().includes(adSearch.toLowerCase())),
  [ads, adSearch]);

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
                <p className="text-gray-500 text-sm font-medium">{t.stats[2]}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">{loading ? '...' : ads.length}</h3>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-gray-500 text-sm font-medium">{t.stats[3]}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">{loading ? '...' : leadsCount}</h3>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-8">{t.platformGrowth}</h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={growthData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Area type="monotone" dataKey="leads" stroke="#2563eb" fill="#2563eb" fillOpacity={0.1} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ads' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
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
