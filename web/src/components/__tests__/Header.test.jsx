import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from '../Header';

// Mock i18n
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key
  })
}));

describe('Header', () => {
  const mockSetView = vi.fn();
  const mockSetUser = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render app title', () => {
    render(<Header view="Calendar" setView={mockSetView} setUser={mockSetUser} />);

    expect(screen.getByText('app.title')).toBeInTheDocument();
  });

  it('should render navigation buttons', () => {
    render(<Header view="Calendar" setView={mockSetView} setUser={mockSetUser} />);

    expect(screen.getAllByText('nav.calendar')).toHaveLength(2); // Desktop and mobile
  });

  it('should highlight active view', () => {
    render(<Header view="Calendar" setView={mockSetView} setUser={mockSetUser} />);

    const buttons = screen.getAllByText('nav.calendar');
    buttons.forEach(button => {
      expect(button).toHaveClass(/from-mtg-blue/);
    });
  });

  it('should call setView when navigation button clicked', async () => {
    const user = userEvent.setup();
    render(<Header view="Calendar" setView={mockSetView} setUser={mockSetUser} />);

    const adminButton = screen.getAllByText('nav.admin')[0];
    await user.click(adminButton);

    expect(mockSetView).toHaveBeenCalledWith('AdminPanel');
  });

  it('should show login button when not authenticated', () => {
    render(<Header view="Calendar" setView={mockSetView} setUser={mockSetUser} user={null} />);

    expect(screen.getByText('auth.login')).toBeInTheDocument();
  });

  it('should show logout button when authenticated', () => {
    const mockUser = { email: 'test@example.com', display: 'Test User' };
    render(<Header view="Calendar" setView={mockSetView} setUser={mockSetUser} user={mockUser} />);

    expect(screen.getByText('auth.logout')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });
});

