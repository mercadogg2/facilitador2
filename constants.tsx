
import { Car, BlogPost } from './types';

export const MOCK_CARS: Car[] = [
  {
    id: '1',
    brand: 'BMW',
    model: '320i M Sport',
    year: 2024,
    price: 320000,
    mileage: 0,
    fuel: 'Gasolina',
    transmission: 'Automático',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800',
    description: 'Sedã de luxo com performance esportiva e tecnologia de ponta. Inclui Pack M Sport, teto de abrir panorâmico e sistema de som Harman Kardon.',
    stand_name: 'Auto Premium Lisboa',
    verified: true,
    location: 'Lisboa',
    category: 'Sedan',
    subdomain: 'bmw-320i-lisboa'
  }
];

export const MOCK_BLOG: BlogPost[] = [
  {
    id: 'b1',
    title: 'Como comprar carro usado com segurança em 2026',
    excerpt: 'Dicas essenciais para evitar fraudes e garantir o melhor negócio no mercado de usados.',
    content: `Conteúdo do blog...`,
    author: 'Facilitador Car Team',
    date: '2024-05-15',
    image: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=800',
    reading_time: '5 min'
  }
];

export const TRANSLATIONS = {
  pt: {
    nav: { home: 'Início', vehicles: 'Veículos', about: 'Sobre', blog: 'Blog', dashboard: 'Stand', client: 'Cliente', admin: 'Admin', login: 'Entrar' },
    home: {
      hero: 'O Facilitador Car simplifica a sua compra.',
      subHero: 'Compre com segurança em stands verificados e com o apoio de quem entende.',
      searchPlaceholder: 'Marca, modelo ou ano...',
      featured: 'Veículos em Destaque',
      viewAll: 'Ver Todos',
      whyUs: 'Porquê nós?',
      credibility: 'Credibilidade que faz a diferença na sua escolha.',
      whyUsDesc: 'No Facilitador Car, não somos apenas mais um marketplace. Filtramos rigorosamente os nossos parceiros para garantir que cada negócio seja transparente e seguro.',
      benefits: [
        { title: 'Certificação de Stands', desc: 'Apenas lojistas com histórico impecável.' },
        { title: 'Apoio de Influenciadores', desc: 'Parceiros que testam e aprovam os veículos.' },
        { title: 'Negociação Transparente', desc: 'Canal direto via WhatsApp para agilidade.' }
      ]
    },
    auth: {
      loginTitle: 'Bem-vindo de volta',
      registerTitle: 'Crie a sua conta',
      loginSubtitle: 'Aceda à sua área personalizada Facilitador Car.',
      registerSubtitle: 'Junte-se à maior rede de stands verificados.',
      email: 'Email',
      password: 'Palavra-passe',
      name: 'Nome Completo',
      standName: 'Nome do Stand',
      userType: 'Eu sou um...',
      typeBuyer: 'Comprador / Particular',
      typeStand: 'Stand / Profissional',
      submitLogin: 'Entrar',
      submitRegister: 'Criar Conta',
      noAccount: 'Não tem conta? Registe-se',
      hasAccount: 'Já tem conta? Entre aqui',
      forgotPassword: 'Esqueceu-se da palavra-passe?',
      successLogin: 'Login efetuado com sucesso!',
      successRegister: 'Conta criada com sucesso!',
      forgotPasswordTitle: 'Recuperar Acesso',
      forgotPasswordSubtitle: 'Enviaremos um link de recuperação para o seu email.',
      resetPasswordTitle: 'Nova Palavra-passe',
      resetPasswordSubtitle: 'Escolha uma nova senha segura para a sua conta.',
      sendResetLink: 'Enviar Link de Recuperação',
      updatePassword: 'Atualizar Palavra-passe',
      checkEmail: 'Verifique o seu email para redefinir a senha.',
      resetSuccess: 'Palavra-passe alterada com sucesso!'
    },
    common: {
      price: 'Preço',
      year: 'Ano',
      km: 'Km',
      fuel: 'Combustível',
      contact: 'Contactar Stand',
      verified: 'Stand Verificado',
      leads: 'Gestão de Leads',
      search: 'Pesquisar',
      filters: 'Filtros',
      brand: 'Marca',
      category: 'Tipo de Veículo',
      maxPrice: 'Preço Máximo',
      clearFilters: 'Limpar Filtros',
      noResults: 'Nenhum veículo encontrado',
      found: 'Veículos encontrados',
      sortBy: 'Ordenar por',
      recent: 'Mais recentes',
      back: 'Voltar',
      share: 'Partilhar'
    },
    detail: {
      characteristics: 'Características',
      description: 'Descrição do Veículo',
      dealerInfo: 'Informações do Stand',
      contactTitle: 'Fale com o Stand Agora',
      callButton: 'Ligar para o Stand',
      location: 'Localização',
      relatedTitle: 'Veículos Relacionados',
      verifiedReason: 'Este stand passou por 12 pontos de verificação rigorosa do Facilitador Car, garantindo histórico limpo e atendimento de qualidade.'
    },
    createAd: {
      title: 'Criar Novo Anúncio',
      subtitle: 'Preencha os dados do veículo para começar a receber leads qualificados.',
      basicInfo: 'Informação Básica',
      technicalSpecs: 'Detalhes Técnicos',
      commercial: 'Comercial e Fotos',
      marketing: 'Marketing e Link Personalizado',
      publish: 'Publicar Anúncio',
      success: 'Anúncio publicado com sucesso!',
      error: 'Erro ao publicar. Verifique os campos.',
      upload: 'Upload de Foto (URL)',
      subdomainTitle: 'Subdomínio do Anúncio',
      subdomainDesc: 'Crie uma landing page exclusiva para este veículo.',
      subdomainPlaceholder: 'ex: toyota-yaris-sport',
      fields: {
        brand: 'Marca',
        model: 'Modelo',
        year: 'Ano',
        category: 'Categoria',
        mileage: 'Quilometragem',
        fuel: 'Combustível',
        transmission: 'Transmissão',
        price: 'Preço (€)',
        location: 'Localização (Cidade)',
        description: 'Descrição Detalhada'
      }
    },
    editProfile: {
      title: 'Editar Perfil',
      subtitle: 'Mantenha os seus dados atualizados para uma melhor experiência.',
      personalInfo: 'Informação Pessoal',
      security: 'Segurança e Acesso',
      saveChanges: 'Guardar Alterações',
      success: 'Perfil atualizado com sucesso!',
      changePhoto: 'Alterar Foto',
      fields: {
        name: 'Nome Completo',
        email: 'Endereço de Email',
        phone: 'Telemóvel',
        location: 'Localização Principal',
        currentPassword: 'Palavra-passe Atual',
        newPassword: 'Nova Palavra-passe'
      }
    },
    about: {
      mission: 'A Nossa Missão',
      title: 'Democratizar a confiança no mercado automóvel.',
      desc: 'O Facilitador Car nasceu para resolver um problema antigo: a insegurança na compra de carros usados. A nossa plataforma liga compradores exigentes a stands criteriosamente verificados.',
      values: [
        { title: 'Rigor', desc: 'Apenas 10% dos stands que solicitam entrada são aprovados na nossa rede.' },
        { title: 'Transparência', desc: 'Informação clara, histórico verificado e contacto direto sem intermediários.' },
        { title: 'Inovação', desc: 'Tecnologia de ponta para busca avançada e gestão de leads em tempo real.' }
      ],
      historyTitle: 'Próxima Paragem: Fevereiro de 2026',
      historyDesc: 'Atualmente estamos em fase de beta privada, selecionando os melhores parceiros em Portugal e Espanha para o lançamento oficial.',
      stats: ['Stands Certificados', 'Segurança']
    },
    blog: {
      title: 'Blog Automobilístico',
      subtitle: 'Dicas, notícias e guias para ajudar você a fazer o melhor negócio com segurança.',
      readMore: 'Ler Artigo Completo',
      newsletterTitle: 'Não perca nenhuma novidade',
      newsletterDesc: 'Subscreva a nossa newsletter para receber as melhores oportunidades e guias de segurança no seu email.',
      subscribe: 'Subscrever',
      placeholder: 'Seu melhor email',
      related: 'Artigos Relacionados',
      reading_time: 'Tempo de leitura'
    },
    dashboard: {
      title: 'Dashboard Stand',
      subtitle: 'Stand Verificado',
      newAd: 'Novo Anúncio',
      weeklyPerformance: 'Performance Semanal',
      recentLeads: 'Leads Recentes',
      viewAll: 'Ver tudo',
      manageLeads: 'Gestão de Leads Avançada',
      stats: ['Leads Totais', 'Visualizações', 'Veículos Ativos', 'Tempo Resposta']
    },
    admin: {
      title: 'Painel Administrativo',
      subtitle: 'Visão Geral da Plataforma',
      stats: ['Usuários', 'Stands Ativos', 'Anúncios', 'Leads Mensais'],
      standsManagement: 'Gestão de Parceiros',
      approve: 'Aprovar',
      reject: 'Rejeitar',
      verified: 'Verificado',
      pending: 'Pendente',
      platformGrowth: 'Crescimento da Plataforma'
    },
    userArea: {
      greeting: 'Olá, Utilizador',
      memberSince: 'Membro desde',
      contactsDone: 'contactos realizados',
      editProfile: 'Editar Perfil',
      logout: 'Sair',
      myFavorites: 'Os Meus Favoritos',
      emptyTitle: 'Ainda não guardou nenhum veículo',
      emptyDesc: 'Explore o mercado e guarde os carros que mais gosta.',
      explore: 'Explorar Veículos'
    },
    footer: {
      desc: 'O marketplace que traz segurança e credibilidade para a compra do seu próximo veículo através de stands verificados.',
      links: 'Links',
      legal: 'Legal',
      rights: 'Todos os direitos reservados. Lançamento previsto para Fevereiro 2026.'
    }
  },
  en: {
    nav: { home: 'Home', vehicles: 'Vehicles', about: 'About', blog: 'Blog', dashboard: 'Stand', client: 'Client', admin: 'Admin', login: 'Login' },
    home: {
      hero: 'Facilitador Car simplifies your purchase.',
      subHero: 'Buy safely in verified dealerships with expert support.',
      searchPlaceholder: 'Make, model or year...',
      featured: 'Featured Vehicles',
      viewAll: 'View All',
      whyUs: 'Why us?',
      credibility: 'Credibility that makes the difference in your choice.',
      whyUsDesc: 'At Facilitador Car, we are not just another marketplace. We rigorously filter our partners to ensure that every deal is transparent and safe.',
      benefits: [
        { title: 'Dealership Certification', desc: 'Only retailers with an impeccable track record.' },
        { title: 'Influencer Support', desc: 'Partners who test and approve vehicles.' },
        { title: 'Direct WhatsApp channel for speed.' }
      ]
    },
    auth: {
      loginTitle: 'Welcome back',
      registerTitle: 'Create your account',
      loginSubtitle: 'Access your personalized Facilitador Car area.',
      registerSubtitle: 'Join the largest network of verified dealerships.',
      email: 'Email',
      password: 'Password',
      name: 'Full Name',
      standName: 'Dealership Name',
      userType: 'I am a...',
      typeBuyer: 'Buyer / Individual',
      typeStand: 'Dealership / Professional',
      submitLogin: 'Login',
      submitRegister: 'Create Account',
      noAccount: "Don't have an account? Register",
      hasAccount: 'Already have an account? Login here',
      forgotPassword: 'Forgot password?',
      successLogin: 'Login successful!',
      successRegister: 'Account created successfully!',
      forgotPasswordTitle: 'Recover Access',
      forgotPasswordSubtitle: 'We will send a recovery link to your email.',
      resetPasswordTitle: 'New Password',
      resetPasswordSubtitle: 'Choose a new secure password for your account.',
      sendResetLink: 'Send Recovery Link',
      updatePassword: 'Update Password',
      checkEmail: 'Check your email to reset your password.',
      resetSuccess: 'Password changed successfully!'
    },
    common: {
      price: 'Price',
      year: 'Year',
      km: 'Km',
      fuel: 'Fuel',
      contact: 'Contact Stand',
      verified: 'Verified Stand',
      leads: 'Lead Management',
      search: 'Search',
      filters: 'Filters',
      brand: 'Make',
      category: 'Vehicle Type',
      maxPrice: 'Max Price',
      clearFilters: 'Clear Filters',
      noResults: 'No vehicles found',
      found: 'Vehicles found',
      sortBy: 'Sort by',
      recent: 'Most recent',
      back: 'Back',
      share: 'Share'
    },
    detail: {
      characteristics: 'Key Features',
      description: 'Vehicle Description',
      dealerInfo: 'Dealership Information',
      contactTitle: 'Contact Dealer Now',
      callButton: 'Call Dealer',
      location: 'Location',
      relatedTitle: 'Related Vehicles',
      verifiedReason: 'This dealer has passed Facilitador Car’s 12-point rigorous verification, ensuring clean history and high-quality service.'
    },
    createAd: {
      title: 'Create New Ad',
      subtitle: 'Enter vehicle data to start receiving qualified leads.',
      basicInfo: 'Basic Information',
      technicalSpecs: 'Technical Specs',
      commercial: 'Commercial and Photos',
      marketing: 'Marketing and Custom Link',
      publish: 'Publish Ad',
      success: 'Ad published successfully!',
      error: 'Error publishing. Check the fields.',
      upload: 'Photo Upload (URL)',
      subdomainTitle: 'Ad Subdomain',
      subdomainDesc: 'Create an exclusive landing page for this vehicle.',
      subdomainPlaceholder: 'ex: toyota-yaris-sport',
      fields: {
        brand: 'Brand',
        model: 'Model',
        year: 'Year',
        category: 'Category',
        mileage: 'Mileage',
        fuel: 'Fuel',
        transmission: 'Transmission',
        price: 'Price (€)',
        location: 'Location (City)',
        description: 'Detailed Description'
      }
    },
    editProfile: {
      title: 'Edit Profile',
      subtitle: 'Keep your details up to date for a better experience.',
      personalInfo: 'Personal Information',
      security: 'Security and Access',
      saveChanges: 'Save Changes',
      success: 'Profile updated successfully!',
      changePhoto: 'Change Photo',
      fields: {
        name: 'Full Name',
        email: 'Email Address',
        phone: 'Phone Number',
        location: 'Main Location',
        currentPassword: 'Current Password',
        newPassword: 'New Password'
      }
    },
    about: {
      mission: 'Our Mission',
      title: 'Democratizing trust in the automotive market.',
      desc: 'Facilitador Car was born to solve an old problem: insecurity when buying used cars. Our platform connects demanding buyers to strictly verified dealerships.',
      values: [
        { title: 'Rigor', desc: 'Only 10% of dealerships that apply are approved in our network.' },
        { title: 'Transparency', desc: 'Clear information, verified history, and direct contact without intermediaries.' },
        { title: 'Innovation', desc: 'Cutting-edge technology for advanced search and real-time lead management.' }
      ],
      historyTitle: 'Next Stop: February 2026',
      historyDesc: 'We are currently in private beta, selecting the best partners in Portugal and Spain for the official launch.',
      stats: ['Certified Stands', 'Security']
    },
    blog: {
      title: 'Automotive Blog',
      subtitle: 'Tips, news, and guides to help you make the best deal safely.',
      readMore: 'Read Full Article',
      newsletterTitle: "Don't miss any updates",
      newsletterDesc: 'Subscribe to our newsletter to receive the best opportunities and safety guides in your email.',
      subscribe: 'Subscribe',
      placeholder: 'Your best email',
      related: 'Related Articles',
      reading_time: 'Reading time'
    },
    dashboard: {
      title: 'Dealer Dashboard',
      subtitle: 'Verified Dealership',
      newAd: 'New Listing',
      weeklyPerformance: 'Weekly Performance',
      recentLeads: 'Recent Leads',
      viewAll: 'View all',
      manageLeads: 'Advanced Lead Management',
      stats: ['Total Leads', 'Views', 'Active Vehicles', 'Response Time']
    },
    admin: {
      title: 'Admin Panel',
      subtitle: 'Platform Overview',
      stats: ['Users', 'Active Stands', 'Listings', 'Monthly Leads'],
      standsManagement: 'Partner Management',
      approve: 'Approve',
      reject: 'Reject',
      verified: 'Verified',
      pending: 'Pending',
      platformGrowth: 'Platform Growth'
    },
    userArea: {
      greeting: 'Hello, User',
      memberSince: 'Member since',
      contactsDone: 'contacts made',
      editProfile: 'Edit Profile',
      logout: 'Logout',
      myFavorites: 'My Favorites',
      emptyTitle: "You haven't saved any vehicles yet",
      emptyDesc: 'Explore the market and save the car you like best.',
      explore: 'Explore Vehicles'
    },
    footer: {
      desc: 'The marketplace that brings security and credibility to your next vehicle purchase through verified dealerships.',
      links: 'Links',
      legal: 'Legal',
      rights: 'All rights reserved. Launch scheduled for February 2026.'
    }
  }
};
