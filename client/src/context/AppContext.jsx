import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const translations = {
  en: {
    dashboard: 'Dashboard',
    matches: 'Matches',
    live: 'Live',
    myBets: 'My Bets',
    history: 'History',
    wallet: 'Wallet',
    profile: 'Profile',
    settings: 'Settings',
    admin: 'Admin',
    recentActivity: 'Recent Activity',
    quickBet: 'Quick Bet Panel',
    upcomingMatches: 'Upcoming Matches',
    liveMatches: 'Live Matches',
    favoriteMatches: 'Favorite Matches',
  },
  fr: {
    dashboard: 'Tableau de bord',
    matches: 'Matchs',
    live: 'En direct',
    myBets: 'Mes paris',
    history: 'Historique',
    wallet: 'Portefeuille',
    profile: 'Profil',
    settings: 'Parametres',
    admin: 'Admin',
    recentActivity: 'Activite recente',
    quickBet: 'Pari rapide',
    upcomingMatches: 'Matchs a venir',
    liveMatches: 'Matchs en direct',
    favoriteMatches: 'Matchs favoris',
  },
  ar: {
    dashboard: 'لوحة التحكم',
    matches: 'المباريات',
    live: 'مباشر',
    myBets: 'رهاناتي',
    history: 'السجل',
    wallet: 'المحفظة',
    profile: 'الملف الشخصي',
    settings: 'الإعدادات',
    admin: 'الإدارة',
    recentActivity: 'النشاط الأخير',
    quickBet: 'لوحة الرهان السريع',
    upcomingMatches: 'المباريات القادمة',
    liveMatches: 'المباريات المباشرة',
    favoriteMatches: 'المباريات المفضلة',
  },
};

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(localStorage.getItem('primebets-theme') || 'dark');
  const [language, setLanguage] = useState(localStorage.getItem('primebets-language') || 'en');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.body.classList.toggle('light-theme', theme === 'light');
    localStorage.setItem('primebets-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('primebets-language', language);
  }, [language]);

  function pushToast(toast) {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((current) => [...current, { id, ...toast }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 3200);
  }

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      language,
      setLanguage,
      t: translations[language],
      sidebarOpen,
      setSidebarOpen,
      toasts,
      pushToast,
    }),
    [theme, language, sidebarOpen, toasts]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
