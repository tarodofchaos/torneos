import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Header from './components/Header';
import Calendar from './pages/Calendar';
import AdminPanel from './pages/AdminPanel';

export default function App() {
  const { t } = useTranslation();
  const [view, setView] = useState('Calendar');
  const [user, setUser] = useState(undefined);
  
  const CurrentView = useMemo(() => {
    return { Calendar, AdminPanel }[view] || Calendar;
  }, [view]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header view={view} setView={setView} setUser={setUser} user={user} />
      
      <main className="flex-1">
        <CurrentView user={user} />
      </main>
      
      <footer className="bg-white/5 backdrop-blur-sm border-t border-white/10 mt-16">
        <div className="max-w-7xl mx-auto p-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full mtg-gradient flex items-center justify-center">
                <span className="text-white font-bold">🎲</span>
              </div>
              <span className="text-lg font-bold text-mtg-white">{t('app.title')}</span>
            </div>
            <p className="text-mtg-white/60 text-sm max-w-2xl mx-auto">
              {t('footer.disclaimer')}
            </p>
            <div className="mt-4 text-xs text-mtg-white/50">
              {t('footer.copyright')}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

