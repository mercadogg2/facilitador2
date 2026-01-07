
import React, { useState } from 'react';
import { Car, Language } from '../types';
import { supabase } from '../lib/supabase';

interface LeadFormProps {
  car: Car;
  lang: Language;
  onClose: () => void;
}

const LeadForm: React.FC<LeadFormProps> = ({ car, lang, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: lang === 'pt' 
      ? `Olá! Estou interessado no ${car.brand} ${car.model} (${car.year}). Poderia me dar mais informações?`
      : `Hi! I'm interested in the ${car.brand} ${car.model} (${car.year}). Could you provide more information?`
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Guardar o lead na base de dados para gestão futura do stand
      const { error } = await supabase.from('leads').insert([{
        car_id: car.id,
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        message: formData.message,
        status: 'Pendente'
      }]);

      if (error) throw error;

      // 2. Redirecionar para WhatsApp para conversão imediata
      const whatsappMsg = encodeURIComponent(`${formData.message}\n\nDe: ${formData.name}\nTel: ${formData.phone}`);
      window.open(`https://wa.me/351912345678?text=${whatsappMsg}`, '_blank');
      onClose();
    } catch (err) {
      console.error("Erro ao guardar lead:", err);
      alert(lang === 'pt' ? "Erro ao enviar pedido. Tente novamente." : "Error sending request. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="relative h-32 bg-blue-600 p-8 flex flex-col justify-center">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
          <h2 className="text-2xl font-bold text-white">{lang === 'pt' ? 'Contactar Stand' : 'Contact Dealer'}</h2>
          <p className="text-blue-100 text-sm">Interesse em: {car.brand} {car.model}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">{lang === 'pt' ? 'Nome Completo' : 'Full Name'}</label>
            <input 
              required
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Ex: João Silva"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input 
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="email@exemplo.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{lang === 'pt' ? 'Telemóvel' : 'Phone'}</label>
              <input 
                required
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="+351 900 000 000"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">{lang === 'pt' ? 'Mensagem' : 'Message'}</label>
            <textarea 
              rows={3}
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
            />
          </div>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-green-100 flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <i className="fas fa-circle-notch animate-spin"></i>
            ) : (
              <>
                <i className="fab fa-whatsapp text-xl"></i>
                <span>{lang === 'pt' ? 'Enviar Mensagem via WhatsApp' : 'Send via WhatsApp'}</span>
              </>
            )}
          </button>
          <p className="text-[10px] text-gray-400 text-center">
            {lang === 'pt' 
              ? 'Ao clicar em enviar, você concorda com nossos Termos de Uso e Política de Privacidade.'
              : 'By clicking send, you agree to our Terms of Use and Privacy Policy.'}
          </p>
        </form>
      </div>
    </div>
  );
};

export default LeadForm;
