import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../lib/api';
import { useApp } from './AppContext';

const AuthContext = createContext(null);
const STORAGE_KEY = 'primebets-auth';

export function AuthProvider({ children }) {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
  const [token, setToken] = useState(saved?.token || '');
  const [user, setUser] = useState(saved?.user || null);
  const [settings, setSettings] = useState(saved?.settings || null);
  const [loading, setLoading] = useState(Boolean(saved?.token));
  const { setLanguage, setTheme } = useApp();

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    apiRequest('/auth/me', { token })
      .then((data) => {
        setUser(data.user);
        setSettings(data.settings);
        setLanguage(data.settings.language);
        setTheme(data.settings.theme);
      })
      .catch(() => {
        localStorage.removeItem(STORAGE_KEY);
        setToken('');
        setUser(null);
        setSettings(null);
      })
      .finally(() => setLoading(false));
  }, [token, setLanguage, setTheme]);

  function persistAuth(nextToken, nextUser, nextSettings) {
    setToken(nextToken);
    setUser(nextUser);
    setSettings(nextSettings);
    setLanguage(nextSettings.language);
    setTheme(nextSettings.theme);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ token: nextToken, user: nextUser, settings: nextSettings })
    );
  }

  async function login(payload) {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    persistAuth(data.token, data.user, data.settings);
    return data;
  }

  async function register(payload) {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    persistAuth(data.token, data.user, data.settings);
    return data;
  }

  function logout() {
    setToken('');
    setUser(null);
    setSettings(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  function updateAuth(nextUser, nextSettings = settings) {
    setUser(nextUser);
    setSettings(nextSettings);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ token, user: nextUser, settings: nextSettings })
    );
  }

  const value = useMemo(
    () => ({
      token,
      user,
      settings,
      loading,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout,
      updateAuth,
    }),
    [token, user, settings, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
