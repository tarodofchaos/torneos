import express from 'express';
import { prisma } from '../db/prismaClient.js';
import { requireAuth } from '../middleware/auth.js';

export const signups = express.Router();

// GET /api/tournaments/:id/signups - List signups for tournament (public)
signups.get('/tournaments/:id/signups', async (req, res) => {
  try {
    const signups = await prisma.tournamentSignup.findMany({
      where: { tournamentId: req.params.id },
      include: {
        user: {
          select: { email: true, display: true }
        }
      },
      orderBy: { signedUpAt: 'asc' }
    });

    res.json(signups);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch signups' });
  }
});

// POST /api/tournaments/:id/signups - Sign up for tournament (public)
signups.post('/tournaments/:id/signups', async (req, res) => {
  try {
    const tournamentId = req.params.id;
    const { playerName, email, phone, notes } = req.body;

    // Validate required fields
    if (!playerName || playerName.trim().length === 0) {
      return res.status(400).json({ error: 'Player name is required' });
    }

    // Check if tournament exists
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId }
    });

    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    // Check if tournament is open
    if (tournament.status !== 'OPEN') {
      return res.status(400).json({ error: 'Tournament is not open for signups' });
    }

    // Check if player name already signed up for this tournament
    const existingSignup = await prisma.tournamentSignup.findFirst({
      where: {
        tournamentId,
        playerName: playerName.trim()
      }
    });

    if (existingSignup) {
      return res.status(400).json({ error: 'This player name is already signed up for this tournament' });
    }

    // Check if tournament is full
    const signupCount = await prisma.tournamentSignup.count({
      where: { tournamentId }
    });

    if (signupCount >= tournament.maxPlayers) {
      return res.status(400).json({ error: 'Tournament is full' });
    }

    // Create signup (with optional user ID if authenticated)
    const signup = await prisma.tournamentSignup.create({
      data: {
        tournamentId,
        userId: req.isAuthenticated() ? req.user.id : null,
        playerName: playerName.trim(),
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        notes: notes?.trim() || null
      }
    });

    res.status(201).json(signup);
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to create signup' });
  }
});

// PATCH /api/signups/:id - Update signup (admin only)
signups.patch('/signups/:id', requireAuth, async (req, res) => {
  try {
    const signupId = req.params.id;
    const { paid } = req.body;

    // Check if user is admin
    const isAdmin = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()).includes(req.user.email);
    if (!isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // Update signup
    const signup = await prisma.tournamentSignup.update({
      where: { id: signupId },
      data: { paid: paid === true }
    });

    res.json(signup);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Signup not found' });
    }
    res.status(500).json({ error: 'Failed to update signup' });
  }
});

// DELETE /api/signups/:id - Cancel signup (admin only for public signups, users can cancel their own)
signups.delete('/signups/:id', async (req, res) => {
  try {
    const signupId = req.params.id;

    // Find the signup
    const signup = await prisma.tournamentSignup.findFirst({
      where: { id: signupId }
    });

    if (!signup) {
      return res.status(404).json({ error: 'Signup not found' });
    }

    // Check authorization
    if (req.isAuthenticated()) {
      const isAdmin = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()).includes(req.user.email);
      const isOwner = signup.userId === req.user.id;
      
      if (!isOwner && !isAdmin) {
        return res.status(403).json({ error: 'Not authorized to delete this signup' });
      }
    } else {
      // For non-authenticated users, require admin (only admins can delete public signups)
      return res.status(401).json({ error: 'Authentication required to cancel signups' });
    }

    // Delete signup
    await prisma.tournamentSignup.delete({
      where: { id: signupId }
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete signup' });
  }
});

