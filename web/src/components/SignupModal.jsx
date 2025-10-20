import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { X, UserPlus } from 'lucide-react';

const SignupModal = ({ tournament, onSubmit, onCancel }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    playerName: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.playerName.trim()) {
      setError(t('signup.playerNameRequired'));
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.message || t('signup.failedSignup'));
      setLoading(false);
    }
  };

  const spotsLeft = tournament.maxPlayers - (tournament._count?.signups || 0);
  const isFull = spotsLeft <= 0;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-mtg-white flex items-center gap-2">
              <UserPlus className="w-6 h-6" />
              {t('tournament.signup')}
            </h3>
            <p className="text-sm text-mtg-white/70 mt-1">
              {tournament.name}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-white/10 rounded-lg transition"
          >
            <X className="w-6 h-6 text-mtg-white" />
          </button>
        </div>

        {isFull ? (
          <div className="text-center py-8">
            <p className="text-mtg-red text-lg font-semibold">
              {t('tournament.tournamentFull')}
            </p>
            <p className="text-mtg-white/70 mt-2">
              {t('signup.fullMessage')}
            </p>
            <button
              onClick={onCancel}
              className="btn-secondary mt-6"
            >
              {t('signup.close')}
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6 p-4 bg-mtg-blue/10 border border-mtg-blue/20 rounded-lg">
              <p className="text-sm text-mtg-white/80">
                {t('signup.spotsRemaining', { count: spotsLeft })}
              </p>
              <p className="text-xs text-mtg-white/60 mt-1">
                {new Date(tournament.date).toLocaleDateString()} • {tournament.startTime} • {tournament.location}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-mtg-white/80 mb-1">
                  {t('signup.playerName')} * <span className="text-xs text-mtg-white/50">({t('signup.required')})</span>
                </label>
                <input
                  type="text"
                  name="playerName"
                  value={formData.playerName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-mtg-white placeholder-mtg-white/40 focus:outline-none focus:ring-2 focus:ring-mtg-blue"
                  placeholder={t('signup.yourNamePlaceholder')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-mtg-white/80 mb-1">
                  {t('signup.email')} <span className="text-xs text-mtg-white/50">({t('signup.emailOptional')})</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-mtg-white placeholder-mtg-white/40 focus:outline-none focus:ring-2 focus:ring-mtg-blue"
                  placeholder={t('signup.emailPlaceholder')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-mtg-white/80 mb-1">
                  {t('signup.phone')} <span className="text-xs text-mtg-white/50">({t('signup.optional')})</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-mtg-white placeholder-mtg-white/40 focus:outline-none focus:ring-2 focus:ring-mtg-blue"
                  placeholder={t('signup.phonePlaceholder')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-mtg-white/80 mb-1">
                  {t('signup.notes')} <span className="text-xs text-mtg-white/50">({t('signup.optional')})</span>
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-mtg-white placeholder-mtg-white/40 focus:outline-none focus:ring-2 focus:ring-mtg-blue"
                  placeholder={t('signup.notesPlaceholder')}
                />
              </div>

              {error && (
                <div className="p-3 bg-mtg-red/20 border border-mtg-red/40 rounded-lg">
                  <p className="text-sm text-mtg-red">{error}</p>
                </div>
              )}

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1"
                >
                  {loading ? t('signup.signingUp') : t('tournament.signup')}
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  className="btn-secondary flex-1"
                >
                  {t('form.cancel')}
                </button>
              </div>
            </form>

            <p className="text-xs text-mtg-white/50 text-center mt-4">
              {t('signup.noAccountNeeded')}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

SignupModal.propTypes = {
  tournament: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    startTime: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    maxPlayers: PropTypes.number.isRequired,
    _count: PropTypes.shape({
      signups: PropTypes.number
    })
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default SignupModal;

