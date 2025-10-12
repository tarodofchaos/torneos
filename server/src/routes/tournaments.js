import express from 'express';
import { prisma } from '../db/prismaClient.js';
import { requireAdmin } from '../middleware/auth.js';

export const tournaments = express.Router();

// GET /api/tournaments - List all tournaments (public)
tournaments.get('/', async (req, res) => {
  try {
    const tournaments = await prisma.tournament.findMany({
      orderBy: { date: 'asc' },
      include: {
        _count: {
          select: { signups: true }
        }
      }
    });
    res.json(tournaments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tournaments' });
  }
});

// GET /api/tournaments/:id - Get tournament details (public)
tournaments.get('/:id', async (req, res) => {
  try {
    const tournament = await prisma.tournament.findUnique({
      where: { id: req.params.id },
      include: {
        _count: {
          select: { signups: true }
        }
      }
    });

    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    res.json(tournament);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tournament' });
  }
});

// POST /api/tournaments - Create tournament (admin only)
tournaments.post('/', requireAdmin, async (req, res) => {
  try {
    const { name, type, date, startTime, location, maxPlayers, description, rules, prizes } = req.body;

    const tournament = await prisma.tournament.create({
      data: {
        name,
        type,
        date: new Date(date),
        startTime,
        location,
        maxPlayers: parseInt(maxPlayers),
        description,
        rules,
        prizes
      }
    });

    res.status(201).json(tournament);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create tournament' });
  }
});

// PUT /api/tournaments/:id - Update tournament (admin only)
tournaments.put('/:id', requireAdmin, async (req, res) => {
  try {
    const updates = { ...req.body };
    
    // Convert date if provided
    if (updates.date) {
      updates.date = new Date(updates.date);
    }
    
    // Convert maxPlayers if provided
    if (updates.maxPlayers) {
      updates.maxPlayers = parseInt(updates.maxPlayers);
    }

    const tournament = await prisma.tournament.update({
      where: { id: req.params.id },
      data: updates
    });

    res.json(tournament);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Tournament not found' });
    }
    res.status(500).json({ error: 'Failed to update tournament' });
  }
});

// DELETE /api/tournaments/:id - Delete tournament (admin only)
tournaments.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await prisma.tournament.delete({
      where: { id: req.params.id }
    });

    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Tournament not found' });
    }
    res.status(500).json({ error: 'Failed to delete tournament' });
  }
});

