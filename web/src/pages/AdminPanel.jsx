import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../lib/api';
import { Plus, Edit, Trash, Users } from 'lucide-react';
import TournamentForm from '../components/TournamentForm';
import SignupManagementModal from '../components/SignupManagementModal';

const AdminPanel = () => {
  const { t } = useTranslation();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTournament, setEditingTournament] = useState(null);
  const [managingSignups, setManagingSignups] = useState(null);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      const data = await api.getTournaments();
      setTournaments(data);
    } catch (err) {
      console.error('Failed to fetch tournaments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingTournament(null);
    setShowForm(true);
  };

  const handleEdit = (tournament) => {
    setEditingTournament(tournament);
    setShowForm(true);
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingTournament) {
        await api.updateTournament(editingTournament.id, formData);
      } else {
        await api.createTournament(formData);
      }
      setShowForm(false);
      setEditingTournament(null);
      await fetchTournaments();
    } catch (err) {
      throw new Error(err.message || t('admin.failedSave'));
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTournament(null);
  };

  const handleManageSignups = (tournament) => {
    setManagingSignups(tournament);
  };

  const handleCloseSignups = () => {
    setManagingSignups(null);
  };

  const handleDelete = async (id) => {
    if (!confirm(t('admin.confirmDelete'))) return;
    
    try {
      await api.deleteTournament(id);
      await fetchTournaments();
    } catch (err) {
      alert(t('admin.failedDelete'));
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center text-mtg-white/70">{t('admin.loading')}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-mtg-white">
          {t('admin.title')}
        </h2>
        <button 
          className="btn-primary flex items-center gap-2"
          onClick={handleCreate}
        >
          <Plus className="w-5 h-5" />
          {t('admin.createTournament')}
        </button>
      </div>

      <div className="card">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-4 text-mtg-white/70">{t('admin.name')}</th>
              <th className="text-left py-3 px-4 text-mtg-white/70">{t('admin.type')}</th>
              <th className="text-left py-3 px-4 text-mtg-white/70">{t('admin.date')}</th>
              <th className="text-left py-3 px-4 text-mtg-white/70">{t('admin.signups')}</th>
              <th className="text-right py-3 px-4 text-mtg-white/70">{t('admin.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {tournaments.map((tournament) => (
              <tr key={tournament.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="py-3 px-4 text-mtg-white">{tournament.name}</td>
                <td className="py-3 px-4 text-mtg-white">{tournament.type}</td>
                <td className="py-3 px-4 text-mtg-white">
                  {new Date(tournament.date).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 text-mtg-white">
                  {tournament._count?.signups || 0}/{tournament.maxPlayers}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      className="p-2 rounded hover:bg-mtg-green/20 text-mtg-green transition"
                      onClick={() => handleManageSignups(tournament)}
                      title={t('admin.viewSignups')}
                    >
                      <Users className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 rounded hover:bg-mtg-blue/20 text-mtg-blue transition"
                      onClick={() => handleEdit(tournament)}
                      title={t('admin.editTournament')}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 rounded hover:bg-mtg-red/20 text-mtg-red transition"
                      onClick={() => handleDelete(tournament.id)}
                      title={t('admin.deleteTournament')}
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <TournamentForm
          tournament={editingTournament}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      {managingSignups && (
        <SignupManagementModal
          tournament={managingSignups}
          onClose={handleCloseSignups}
          onUpdate={fetchTournaments}
        />
      )}
    </div>
  );
};

export default AdminPanel;

