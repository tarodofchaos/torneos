import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Calendar, Shield } from 'lucide-react';

const Header = ({ view, setView, setUser, user }) => {
  const { t } = useTranslation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { api } = await import('../lib/api');
        const userData = await api.getMe();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setUser(null);
      }
    };

    if (user === undefined) {
      fetchUser();
    }
  }, [setUser, user]);

  const handleLogin = () => {
    const API_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || 'http://localhost:4000';
    window.location.href = `${API_URL}/auth/google`;
  };

  const handleLogout = () => {
    const API_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || 'http://localhost:4000';
    window.location.href = `${API_URL}/logout`;
  };

  const navItems = [
    { key: 'Calendar', icon: Calendar, translation: 'nav.calendar' },
    { key: 'AdminPanel', icon: Shield, translation: 'nav.admin' }
  ];

  return (
    <header className="sticky top-0 z-50 glass-effect border-b border-white/20">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full mtg-gradient flex items-center justify-center animate-float">
                <span className="text-2xl font-bold text-white">🎲</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-mtg-blue via-mtg-gold to-mtg-red bg-clip-text text-transparent">
                  {t('app.title')}
                </h1>
                <p className="text-sm text-mtg-white/70">{t('app.tagline')}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ key, icon: Icon, translation }) => (
              <button
                key={key}
                onClick={() => setView(key)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                  view === key 
                    ? 'bg-gradient-to-r from-mtg-blue to-blue-600 text-white shadow-lg' 
                    : 'text-mtg-white/80 hover:text-mtg-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                {t(translation)}
              </button>
            ))}
          </nav>

          {/* User Section */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-mtg-blue to-mtg-gold flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {(user.display || user.email).charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-mtg-white">
                    {user.display || user.email}
                  </span>
                </div>
                <button 
                  className="btn-danger text-sm" 
                  onClick={handleLogout}
                >
                  {t('auth.logout')}
                </button>
              </>
            ) : (
              <button 
                className="btn-primary text-sm" 
                onClick={handleLogin}
              >
                {t('auth.login')}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden mt-4 flex gap-2">
          {navItems.map(({ key, icon: Icon, translation }) => (
            <button
              key={key}
              onClick={() => setView(key)}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                view === key 
                  ? 'bg-gradient-to-r from-mtg-blue to-blue-600 text-white shadow-lg' 
                  : 'text-mtg-white/80 hover:text-mtg-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-4 h-4" />
              {t(translation)}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

Header.propTypes = {
  view: PropTypes.string.isRequired,
  setView: PropTypes.func.isRequired,
  setUser: PropTypes.func.isRequired,
  user: PropTypes.shape({
    email: PropTypes.string,
    display: PropTypes.string,
    isAdmin: PropTypes.bool
  })
};

export default Header;

