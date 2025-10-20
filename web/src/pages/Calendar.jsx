import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import TournamentCard from '../components/TournamentCard';
import SignupModal from '../components/SignupModal';
import { api } from '../lib/api';

const Calendar = () => {
  const { t } = useTranslation();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTournament, setSelectedTournament] = useState(null);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      const data = await api.getTournaments();
      setTournaments(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const handleTournamentClick = (tournament) => {
    setSelectedTournament(tournament);
  };

  const handleSignup = async (signupData) => {
    try {
      await api.signup(selectedTournament.id, signupData);
      setSelectedTournament(null);
      await fetchTournaments(); // Refresh to show updated signup count
      alert(t('calendar.signupSuccess'));
    } catch (err) {
      throw err; // Let the modal handle the error
    }
  };

  const handleCloseModal = () => {
    setSelectedTournament(null);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center text-mtg-white/70">
          {t('calendar.loading')}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center text-mtg-red">
          {t('calendar.errorLoading')}: {error}
        </div>
      </div>
    );
  }

  if (tournaments.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center text-mtg-white/70">
          {t('calendar.noTournaments')}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h2 className="text-3xl font-bold text-mtg-white mb-6">
        {t('calendar.title')}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournaments.map((tournament) => (
          <TournamentCard
            key={tournament.id}
            tournament={tournament}
            onClick={handleTournamentClick}
          />
        ))}
      </div>

      {selectedTournament && (
        <SignupModal
          tournament={selectedTournament}
          onSubmit={handleSignup}
          onCancel={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Calendar;

