import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';

const TournamentForm = ({ tournament, onSubmit, onCancel }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: tournament?.name || '',
    type: tournament?.type || 'Commander',
    date: tournament?.date ? new Date(tournament.date).toISOString().split('T')[0] : '',
    startTime: tournament?.startTime || '18:00',
    location: tournament?.location || '',
    maxPlayers: tournament?.maxPlayers || 16,
    description: tournament?.description || '',
    rules: tournament?.rules || '',
    prizes: tournament?.prizes || '',
    status: tournament?.status || 'OPEN'
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'maxPlayers' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (err) {
      alert('Failed to save tournament: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-mtg-white">
            {tournament ? t('admin.editTournament') : t('admin.createTournament')}
          </h3>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-white/10 rounded-lg transition"
          >
            <X className="w-6 h-6 text-mtg-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-mtg-white/80 mb-1">
              {t('form.name')} *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-mtg-white placeholder-mtg-white/40 focus:outline-none focus:ring-2 focus:ring-mtg-blue"
              placeholder={t('form.namePlaceholder')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-mtg-white/80 mb-1">
                {t('form.type')} *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-mtg-white focus:outline-none focus:ring-2 focus:ring-mtg-blue [&>option]:bg-slate-800 [&>option]:text-white"
              >
                <option value="Commander">Commander</option>
                <option value="2HG">Two-Headed Giant (2HG)</option>
                <option value="Standard">Standard</option>
                <option value="Modern">Modern</option>
                <option value="Legacy">Legacy</option>
                <option value="Pauper">Pauper</option>
                <option value="Draft">Draft</option>
                <option value="Sealed">Sealed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-mtg-white/80 mb-1">
                {t('form.maxPlayers')} *
              </label>
              <input
                type="number"
                name="maxPlayers"
                value={formData.maxPlayers}
                onChange={handleChange}
                required
                min="4"
                max="100"
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-mtg-white focus:outline-none focus:ring-2 focus:ring-mtg-blue"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-mtg-white/80 mb-1">
                {t('form.date')} *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-mtg-white focus:outline-none focus:ring-2 focus:ring-mtg-blue"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-mtg-white/80 mb-1">
                {t('form.startTime')} *
              </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-mtg-white focus:outline-none focus:ring-2 focus:ring-mtg-blue"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-mtg-white/80 mb-1">
              {t('form.location')} *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-mtg-white placeholder-mtg-white/40 focus:outline-none focus:ring-2 focus:ring-mtg-blue"
              placeholder={t('form.locationPlaceholder')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-mtg-white/80 mb-1">
              {t('form.description')}
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-mtg-white placeholder-mtg-white/40 focus:outline-none focus:ring-2 focus:ring-mtg-blue"
              placeholder={t('form.descriptionPlaceholder')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-mtg-white/80 mb-1">
              {t('form.rules')}
            </label>
            <textarea
              name="rules"
              value={formData.rules}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-mtg-white placeholder-mtg-white/40 focus:outline-none focus:ring-2 focus:ring-mtg-blue"
              placeholder={t('form.rulesPlaceholder')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-mtg-white/80 mb-1">
              {t('form.prizes')}
            </label>
            <textarea
              name="prizes"
              value={formData.prizes}
              onChange={handleChange}
              rows="2"
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-mtg-white placeholder-mtg-white/40 focus:outline-none focus:ring-2 focus:ring-mtg-blue"
              placeholder={t('form.prizesPlaceholder')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-mtg-white/80 mb-1">
              {t('form.status')} *
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-mtg-white focus:outline-none focus:ring-2 focus:ring-mtg-blue [&>option]:bg-slate-800 [&>option]:text-white"
            >
              <option value="OPEN">OPEN</option>
              <option value="FULL">FULL</option>
              <option value="CANCELLED">CANCELLED</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? t('form.saving') : tournament ? t('form.updateTournament') : t('form.createTournament')}
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
      </div>
    </div>
  );
};

TournamentForm.propTypes = {
  tournament: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default TournamentForm;

