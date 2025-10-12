const API_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || 'http://localhost:4000';

export const api = {
  // Tournaments
  async getTournaments() {
    const res = await fetch(`${API_URL}/api/tournaments`);
    if (!res.ok) throw new Error('Failed to fetch tournaments');
    return res.json();
  },

  async getTournament(id) {
    const res = await fetch(`${API_URL}/api/tournaments/${id}`);
    if (!res.ok) throw new Error('Failed to fetch tournament');
    return res.json();
  },

  async createTournament(data) {
    const res = await fetch(`${API_URL}/api/tournaments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create tournament');
    return res.json();
  },

  async updateTournament(id, data) {
    const res = await fetch(`${API_URL}/api/tournaments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update tournament');
    return res.json();
  },

  async deleteTournament(id) {
    const res = await fetch(`${API_URL}/api/tournaments/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to delete tournament');
  },

  // Signups
  async getSignups(tournamentId) {
    const res = await fetch(`${API_URL}/api/tournaments/${tournamentId}/signups`);
    if (!res.ok) throw new Error('Failed to fetch signups');
    return res.json();
  },

  async signup(tournamentId, signupData) {
    const res = await fetch(`${API_URL}/api/tournaments/${tournamentId}/signups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(signupData),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to sign up');
    }
    return res.json();
  },

  async updateSignup(signupId, data) {
    const res = await fetch(`${API_URL}/api/signups/${signupId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update signup');
    return res.json();
  },

  async cancelSignup(signupId) {
    const res = await fetch(`${API_URL}/api/signups/${signupId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to cancel signup');
  },

  // Auth
  async getMe() {
    const res = await fetch(`${API_URL}/api/me`, {
      credentials: 'include',
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.ok ? data.user : null;
  },
};

