import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import { tournaments } from '../tournaments.js';

// Mock prisma
vi.mock('../../db/prismaClient.js', () => ({
  prisma: {
    tournament: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    tournamentSignup: {
      findMany: vi.fn(),
    }
  }
}));

// Mock auth middleware
vi.mock('../../middleware/auth.js', () => ({
  requireAuth: (req, res, next) => {
    if (!req.headers.authorization) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    req.user = { id: 'user1', email: 'user@example.com' };
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

describe('Tournaments API', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/tournaments', tournaments);
    vi.clearAllMocks();
  });

  describe('GET /api/tournaments', () => {
    it('should return all tournaments', async () => {
      const mockTournaments = [
        {
          id: '1',
          name: 'Commander Night',
          type: 'Commander',
          date: new Date('2025-11-01'),
          startTime: '18:00',
          location: 'Local Game Store',
          maxPlayers: 16,
          status: 'OPEN',
          description: 'Weekly Commander tournament',
          rules: 'Standard Commander rules',
          prizes: '1st: Booster Box',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      const { prisma } = await import('../../db/prismaClient.js');
      prisma.tournament.findMany.mockResolvedValue(mockTournaments);

      const response = await request(app).get('/api/tournaments');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe('Commander Night');
      expect(response.body[0].type).toBe('Commander');
      expect(prisma.tournament.findMany).toHaveBeenCalledWith({
        orderBy: { date: 'asc' },
        include: {
          _count: {
            select: { signups: true }
          }
        }
      });
    });
  });

  describe('GET /api/tournaments/:id', () => {
    it('should return a specific tournament', async () => {
      const mockTournament = {
        id: '1',
        name: 'Commander Night',
        type: 'Commander',
        date: new Date('2025-11-01'),
        startTime: '18:00',
        location: 'Local Game Store',
        maxPlayers: 16,
        status: 'OPEN',
        _count: { signups: 5 }
      };

      const { prisma } = await import('../../db/prismaClient.js');
      prisma.tournament.findUnique.mockResolvedValue(mockTournament);

      const response = await request(app).get('/api/tournaments/1');

      expect(response.status).toBe(200);
      expect(response.body.id).toBe('1');
      expect(response.body.name).toBe('Commander Night');
      expect(response.body._count.signups).toBe(5);
    });

    it('should return 404 if tournament not found', async () => {
      const { prisma } = await import('../../db/prismaClient.js');
      prisma.tournament.findUnique.mockResolvedValue(null);

      const response = await request(app).get('/api/tournaments/999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Tournament not found' });
    });
  });

  describe('POST /api/tournaments', () => {
    it('should create a tournament when authenticated as admin', async () => {
      const newTournament = {
        name: 'Two-Headed Giant',
        type: '2HG',
        date: '2025-11-15T00:00:00.000Z',
        startTime: '19:00',
        location: 'Game Store',
        maxPlayers: 20,
        description: '2HG Tournament',
        rules: 'Standard 2HG rules',
        prizes: '1st: $100'
      };

      const createdTournament = {
        id: '2',
        ...newTournament,
        date: new Date(newTournament.date),
        status: 'OPEN',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const { prisma } = await import('../../db/prismaClient.js');
      prisma.tournament.create.mockResolvedValue(createdTournament);

      const response = await request(app)
        .post('/api/tournaments')
        .set('Authorization', 'admin')
        .send(newTournament);

      expect(response.status).toBe(201);
      expect(response.body.id).toBe('2');
      expect(response.body.name).toBe('Two-Headed Giant');
      expect(response.body.type).toBe('2HG');
      expect(response.body.status).toBe('OPEN');
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .post('/api/tournaments')
        .send({ name: 'Test' });

      expect(response.status).toBe(401);
    });

    it('should return 403 when authenticated but not admin', async () => {
      const response = await request(app)
        .post('/api/tournaments')
        .set('Authorization', 'user')
        .send({ name: 'Test' });

      expect(response.status).toBe(403);
    });
  });

  describe('PUT /api/tournaments/:id', () => {
    it('should update a tournament when authenticated as admin', async () => {
      const updates = {
        name: 'Updated Commander Night',
        maxPlayers: 20
      };

      const updatedTournament = {
        id: '1',
        name: 'Updated Commander Night',
        type: 'Commander',
        date: new Date('2025-11-01'),
        startTime: '18:00',
        location: 'Local Game Store',
        maxPlayers: 20,
        status: 'OPEN',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const { prisma } = await import('../../db/prismaClient.js');
      prisma.tournament.update.mockResolvedValue(updatedTournament);

      const response = await request(app)
        .put('/api/tournaments/1')
        .set('Authorization', 'admin')
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Commander Night');
      expect(response.body.maxPlayers).toBe(20);
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .put('/api/tournaments/1')
        .send({ name: 'Updated' });

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/tournaments/:id', () => {
    it('should delete a tournament when authenticated as admin', async () => {
      const { prisma } = await import('../../db/prismaClient.js');
      prisma.tournament.delete.mockResolvedValue({ id: '1' });

      const response = await request(app)
        .delete('/api/tournaments/1')
        .set('Authorization', 'admin');

      expect(response.status).toBe(204);
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app).delete('/api/tournaments/1');

      expect(response.status).toBe(401);
    });
  });
});

