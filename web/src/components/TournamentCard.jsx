import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, Users } from 'lucide-react';

const TournamentCard = ({ tournament, onClick }) => {
  const { t } = useTranslation();
  const spotsAvailable = tournament.maxPlayers - (tournament._count?.signups || 0);
  const isFull = spotsAvailable <= 0;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <div 
      onClick={() => onClick?.(tournament)}
      className="card cursor-pointer hover:scale-105 transition-transform"
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-bold text-mtg-white">{tournament.name}</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            isFull ? 'bg-mtg-red/20 text-mtg-red' : 'bg-mtg-green/20 text-mtg-green'
          }`}>
            {tournament.status}
          </span>
        </div>

        <div className="flex items-center gap-2 text-mtg-white/70">
          <span className="px-2 py-1 rounded bg-mtg-blue/20 text-mtg-blue text-sm font-medium">
            {tournament.type}
          </span>
        </div>

        <div className="flex flex-col gap-2 text-sm text-mtg-white/80">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(tournament.date)} - {tournament.startTime}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{tournament.location}</span>
          </div>

          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>
              {tournament._count?.signups || 0}/{tournament.maxPlayers} - {' '}
              {t('tournament.spotsAvailable', { count: spotsAvailable })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

TournamentCard.propTypes = {
  tournament: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    startTime: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    maxPlayers: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    _count: PropTypes.shape({
      signups: PropTypes.number
    })
  }).isRequired,
  onClick: PropTypes.func
};

export default TournamentCard;

