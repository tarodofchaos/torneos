import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TournamentCard from '../TournamentCard';

// Mock i18n
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, options) => {
      if (key === 'tournament.spotsAvailable') {
        return `${options.count} spots available`;
      }
      return key;
    }
  })
}));

describe('TournamentCard', () => {
  const mockTournament = {
    id: '1',
    name: 'Commander Night',
    type: 'Commander',
    date: '2025-11-15T18:00:00.000Z',
    startTime: '18:00',
    location: 'Local Game Store',
    maxPlayers: 16,
    status: 'OPEN',
    _count: { signups: 5 }
  };

  it('should render tournament information', () => {
    render(<TournamentCard tournament={mockTournament} />);

    expect(screen.getByText('Commander Night')).toBeInTheDocument();
    expect(screen.getByText('Commander')).toBeInTheDocument();
    expect(screen.getByText('Local Game Store')).toBeInTheDocument();
  });

  it('should display available spots', () => {
    render(<TournamentCard tournament={mockTournament} />);

    expect(screen.getByText(/11 spots available/i)).toBeInTheDocument();
  });

  it('should call onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<TournamentCard tournament={mockTournament} onClick={handleClick} />);

    await user.click(screen.getByText('Commander Night'));

    expect(handleClick).toHaveBeenCalledWith(mockTournament);
  });

  it('should show tournament as full when maxPlayers reached', () => {
    const fullTournament = {
      ...mockTournament,
      _count: { signups: 16 }
    };

    render(<TournamentCard tournament={fullTournament} />);

    expect(screen.getByText(/0 spots available/i)).toBeInTheDocument();
  });
});

