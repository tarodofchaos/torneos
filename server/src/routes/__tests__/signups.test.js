import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import { signups } from '../signups.js';

// Mock prisma
vi.mock('../../db/prismaClient.js', () => ({
  prisma: {
    tournament: {
      findUnique: vi.fn(),
    },
    tournamentSignup: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    }
  }
}));

// Mock auth middleware
vi.mock('../../middleware/auth.js', () => ({
  requireAuth: (req, res, next) => {
    if (!req.headers.authorization) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    req.user = { id: 'user1', email: 'user@example.com', display: 'Test User' };
    next();
  },
  requireAdmin: (req, res, next) => {
    if (!req.headers.authorization) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    if (req.headers.authorization !== 'admin') {
      return res.status(403).json({ error: 'Not authorized - admin access required' });
    }
    req.user = { id: 'admin1', email: 'admin1@example.com' };
    next();
  }
}));

describe('Signups API', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api', signups);
    vi.clearAllMocks();
  });

  describe('GET /api/tournaments/:id/signups', () => {
    it('should return all signups for a tournament', async () => {
      const mockSignups = [
        {
          id: '1',
          tournamentId: 'tournament1',
          userId: 'user1',
          playerName: 'Player 1',
          notes: 'Looking forward to it',
          signedUpAt: new Date(),
          user: { email: 'player1@example.com', display: 'Player 1' }
        }
      ];

      const { prisma } = await import('../../db/prismaClient.js');
      prisma.tournamentSignup.findMany.mockResolvedValue(mockSignups);

      const response = await request(app).get('/api/tournaments/tournament1/signups');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].playerName).toBe('Player 1');
      expect(response.body[0].user.email).toBe('player1@example.com');
      expect(prisma.tournamentSignup.findMany).toHaveBeenCalledWith({
        where: { tournamentId: 'tournament1' },
        include: { user: { select: { email: true, display: true } } },
        orderBy: { signedUpAt: 'asc' }
      });
    });
  });

  describe('POST /api/tournaments/:id/signups', () => {
    it('should create a signup when authenticated and spots available', async () => {
      const mockTournament = {
        id: 'tournament1',
        maxPlayers: 16,
        status: 'OPEN'
      };

      const newSignup = {
        id: 'signup1',
        tournamentId: 'tournament1',
        userId: 'user1',
        playerName: 'Test User',
        notes: 'Excited to play',
        signedUpAt: new Date()
      };

      const { prisma } = await import('../../db/prismaClient.js');
      prisma.tournament.findUnique.mockResolvedValue(mockTournament);
      prisma.tournamentSignup.findFirst.mockResolvedValue(null);
      prisma.tournamentSignup.count.mockResolvedValue(10);
      prisma.tournamentSignup.create.mockResolvedValue(newSignup);

      const response = await request(app)
        .post('/api/tournaments/tournament1/signups')
        .set('Authorization', 'user')
        .send({ notes: 'Excited to play' });

      expect(response.status).toBe(201);
      expect(response.body.id).toBe('signup1');
      expect(response.body.playerName).toBe('Test User');
      expect(response.body.notes).toBe('Excited to play');
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .post('/api/tournaments/tournament1/signups')
        .send({ notes: 'Test' });

      expect(response.status).toBe(401);
    });

    it('should return 404 when tournament not found', async () => {
      const { prisma } = await import('../../db/prismaClient.js');
      prisma.tournament.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/tournaments/tournament1/signups')
        .set('Authorization', 'user')
        .send({ notes: 'Test' });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Tournament not found' });
    });

    it('should return 400 when tournament is full', async () => {
      const mockTournament = {
        id: 'tournament1',
        maxPlayers: 16,
        status: 'OPEN'
      };

      const { prisma } = await import('../../db/prismaClient.js');
      prisma.tournament.findUnique.mockResolvedValue(mockTournament);
      prisma.tournamentSignup.findFirst.mockResolvedValue(null);
      prisma.tournamentSignup.count.mockResolvedValue(16);

      const response = await request(app)
        .post('/api/tournaments/tournament1/signups')
        .set('Authorization', 'user')
        .send({ notes: 'Test' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Tournament is full' });
    });

    it('should return 400 when already signed up', async () => {
      const mockTournament = {
        id: 'tournament1',
        maxPlayers: 16,
        status: 'OPEN'
      };

      const existingSignup = {
        id: 'signup1',
        tournamentId: 'tournament1',
        userId: 'user1'
      };

      const { prisma } = await import('../../db/prismaClient.js');
      prisma.tournament.findUnique.mockResolvedValue(mockTournament);
      prisma.tournamentSignup.findFirst.mockResolvedValue(existingSignup);

      const response = await request(app)
        .post('/api/tournaments/tournament1/signups')
        .set('Authorization', 'user')
        .send({ notes: 'Test' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Already signed up for this tournament' });
    });
  });

  describe('DELETE /api/signups/:id', () => {
    it('should delete own signup when authenticated', async () => {
      const mockSignup = {
        id: 'signup1',
        userId: 'user1',
        tournamentId: 'tournament1'
      };

      const { prisma } = await import('../../db/prismaClient.js');
      prisma.tournamentSignup.findFirst.mockResolvedValue(mockSignup);
      prisma.tournamentSignup.delete.mockResolvedValue(mockSignup);

      const response = await request(app)
        .delete('/api/signups/signup1')
        .set('Authorization', 'user');

      expect(response.status).toBe(204);
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app).delete('/api/signups/signup1');

      expect(response.status).toBe(401);
    });

    it('should return 404 when signup not found', async () => {
      const { prisma } = await import('../../db/prismaClient.js');
      prisma.tournamentSignup.findFirst.mockResolvedValue(null);

      const response = await request(app)
        .delete('/api/signups/signup1')
        .set('Authorization', 'user');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Signup not found' });
    });

    it('should return 403 when trying to delete another user signup', async () => {
      const mockSignup = {
        id: 'signup1',
        userId: 'otheruser',
        tournamentId: 'tournament1'
      };

      const { prisma } = await import('../../db/prismaClient.js');
      prisma.tournamentSignup.findFirst.mockResolvedValue(mockSignup);

      const response = await request(app)
        .delete('/api/signups/signup1')
        .set('Authorization', 'user');

      expect(response.status).toBe(403);
      expect(response.body).toEqual({ error: 'Not authorized to delete this signup' });
    });
  });
});

