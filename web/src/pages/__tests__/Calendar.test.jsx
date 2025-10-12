import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import * as apiModule from '../../lib/api';

// Mock the api module
vi.mock('../../lib/api', () => ({
  api: {
    getTournaments: vi.fn(),
  }
}));

// Mock i18n
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { language: 'en' }
  })
}));

describe('Calendar', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it('should render loading state initially', async () => {
    apiModule.api.getTournaments.mockImplementation(() => new Promise(() => {}));

    const Calendar = (await import('../Calendar')).default;
    render(<Calendar />);
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should render tournaments after loading', async () => {
    const mockTournaments = [
      {
        id: '1',
        name: 'Commander Night',
        type: 'Commander',
        date: '2025-11-15T00:00:00.000Z',
        startTime: '18:00',
        location: 'Local Game Store',
        maxPlayers: 16,
        status: 'OPEN',
        _count: { signups: 5 }
      }
    ];

    apiModule.api.getTournaments.mockResolvedValue(mockTournaments);

    const Calendar = (await import('../Calendar')).default;
    render(<Calendar />);

    await waitFor(() => {
      expect(screen.getByText('Commander Night')).toBeInTheDocument();
    });
  });

  it('should render empty state when no tournaments', async () => {
    apiModule.api.getTournaments.mockResolvedValue([]);

    const Calendar = (await import('../Calendar')).default;
    render(<Calendar />);

    await waitFor(() => {
      expect(screen.getByText(/no tournaments/i)).toBeInTheDocument();
    });
  });

  it('should handle error state', async () => {
    apiModule.api.getTournaments.mockRejectedValue(new Error('Failed to fetch'));

    const Calendar = (await import('../Calendar')).default;
    render(<Calendar />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});

