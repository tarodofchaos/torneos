import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { prisma } from './db/prismaClient.js';
import cors from 'cors';
import pinoHttp from 'pino-http';
import { logger } from './logger.js';
import { tournaments } from './routes/tournaments.js';
import { signups } from './routes/signups.js';

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(pinoHttp({ logger }));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'devsecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Configure Google OAuth only if credentials are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      let user = await prisma.user.findUnique({ where: { email } });
      
      if (!user) {
        const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim());
        user = await prisma.user.create({
          data: {
            email,
            display: profile.displayName,
            isAdmin: adminEmails.includes(email)
          }
        });
      }
      
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));

  app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

  app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/login',
    session: true
  }), (req, res) => {
    res.redirect(process.env.FRONTEND_URL || 'http://localhost:5173/');
  });
}

app.get('/api/me', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ ok: true, user: req.user });
  } else {
    res.status(401).json({ ok: false });
  }
});

app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

app.get('/health', (_req, res) => res.json({ ok: true }));

// API Routes
app.use('/api/tournaments', tournaments);
app.use('/api', signups);

const port = process.env.PORT || 4000;

// Only start server if not in test mode
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => logger.info(`API on http://localhost:${port}`));
}

export { app };

