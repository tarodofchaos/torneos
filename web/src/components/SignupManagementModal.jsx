import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { X, Users, Mail, MessageCircle, Trash2, Check, DollarSign } from 'lucide-react';
import { api } from '../lib/api';

const SignupManagementModal = ({ tournament, onClose, onUpdate }) => {
  const { t } = useTranslation();
  const [signups, setSignups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSignups();
  }, []);

  const fetchSignups = async () => {
    try {
      setLoading(true);
      const data = await api.getSignups(tournament.id);
      setSignups(data);
    } catch (err) {
      console.error('Failed to fetch signups:', err);
    } finally {
      setLoading(false);
    }
  };

  const togglePaid = async (signup) => {
    try {
      await api.updateSignup(signup.id, { paid: !signup.paid });
      await fetchSignups();
      onUpdate?.();
    } catch (err) {
      alert(t('manage.failedUpdate'));
    }
  };

  const handleRemove = async (signup) => {
    if (!confirm(t('manage.confirmRemove', { name: signup.playerName }))) return;
    
    try {
      await api.cancelSignup(signup.id);
      await fetchSignups();
      onUpdate?.();
    } catch (err) {
      alert(t('manage.failedRemove'));
    }
  };

  const handleEmail = (email) => {
    if (!email) {
      alert(t('manage.noEmail'));
      return;
    }
    window.open(`mailto:${email}?subject=${encodeURIComponent(`Tournament: ${tournament.name}`)}`);
  };

  const handleWhatsApp = (phone) => {
    if (!phone) {
      alert(t('manage.noPhone'));
      return;
    }
    // Remove spaces and special characters
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(t('manage.whatsAppMessage', { tournament: tournament.name }))}`);
  };

  const paidCount = signups.filter(s => s.paid).length;
  const unpaidCount = signups.length - paidCount;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6 sticky top-0 bg-neutral-800/95 backdrop-blur-sm -m-6 p-6 border-b border-white/10">
          <div>
            <h3 className="text-2xl font-bold text-mtg-white flex items-center gap-2">
              <Users className="w-6 h-6" />
              {t('manage.title')}
            </h3>
            <p className="text-sm text-mtg-white/70 mt-1">
              {tournament.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition"
          >
            <X className="w-6 h-6 text-mtg-white" />
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-mtg-blue/10 border border-mtg-blue/20 rounded-lg">
            <p className="text-sm text-mtg-white/70">{t('manage.totalSignups')}</p>
            <p className="text-2xl font-bold text-mtg-blue">{signups.length}/{tournament.maxPlayers}</p>
          </div>
          <div className="p-4 bg-mtg-green/10 border border-mtg-green/20 rounded-lg">
            <p className="text-sm text-mtg-white/70">{t('manage.paid')}</p>
            <p className="text-2xl font-bold text-mtg-green">{paidCount}</p>
          </div>
          <div className="p-4 bg-mtg-red/10 border border-mtg-red/20 rounded-lg">
            <p className="text-sm text-mtg-white/70">{t('manage.unpaid')}</p>
            <p className="text-2xl font-bold text-mtg-red">{unpaidCount}</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 text-mtg-white/70">
            {t('manage.loading')}
          </div>
        ) : signups.length === 0 ? (
          <div className="text-center py-8 text-mtg-white/70">
            {t('manage.noSignups')}
          </div>
        ) : (
          <div className="space-y-3">
            {signups.map((signup, index) => (
              <div
                key={signup.id}
                className={`p-4 rounded-lg border transition ${
                  signup.paid
                    ? 'bg-mtg-green/5 border-mtg-green/20'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-mtg-white/50">#{index + 1}</span>
                      <h4 className="text-lg font-bold text-mtg-white">{signup.playerName}</h4>
                      {signup.paid && (
                        <span className="px-2 py-0.5 bg-mtg-green/20 text-mtg-green text-xs rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          {t('manage.paid')}
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-2 space-y-1">
                      {signup.email && (
                        <p className="text-sm text-mtg-white/70">
                          📧 {signup.email}
                        </p>
                      )}
                      {signup.phone && (
                        <p className="text-sm text-mtg-white/70">
                          📱 {signup.phone}
                        </p>
                      )}
                      {signup.notes && (
                        <p className="text-sm text-mtg-white/60 italic">
                          💬 {signup.notes}
                        </p>
                      )}
                      <p className="text-xs text-mtg-white/50">
                        {t('manage.signedUp')}: {new Date(signup.signedUpAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => togglePaid(signup)}
                      className={`p-2 rounded-lg transition ${
                        signup.paid
                          ? 'bg-mtg-green/20 text-mtg-green hover:bg-mtg-green/30'
                          : 'bg-white/10 text-mtg-white/70 hover:bg-mtg-green/20 hover:text-mtg-green'
                      }`}
                      title={signup.paid ? t('manage.markAsUnpaid') : t('manage.markAsPaid')}
                    >
                      <DollarSign className="w-4 h-4" />
                    </button>

                    {signup.email && (
                      <button
                        onClick={() => handleEmail(signup.email)}
                        className="p-2 rounded-lg bg-white/10 text-mtg-white/70 hover:bg-mtg-blue/20 hover:text-mtg-blue transition"
                        title={t('manage.sendEmail')}
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                    )}

                    {signup.phone && (
                      <button
                        onClick={() => handleWhatsApp(signup.phone)}
                        className="p-2 rounded-lg bg-white/10 text-mtg-white/70 hover:bg-mtg-green/20 hover:text-mtg-green transition"
                        title={t('manage.sendWhatsApp')}
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => handleRemove(signup)}
                      className="p-2 rounded-lg bg-white/10 text-mtg-white/70 hover:bg-mtg-red/20 hover:text-mtg-red transition"
                      title={t('manage.removeSignup')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-white/10">
          <button
            onClick={onClose}
            className="btn-secondary w-full"
          >
            {t('manage.close')}
          </button>
        </div>
      </div>
    </div>
  );
};

SignupManagementModal.propTypes = {
  tournament: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    maxPlayers: PropTypes.number.isRequired
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func
};

export default SignupManagementModal;

