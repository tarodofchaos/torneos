const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim());

export function requireAuth(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  next();
}

export function requireAdmin(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  if (!ADMIN_EMAILS.includes(req.user.email)) {
    return res.status(403).json({ error: 'Not authorized - admin access required' });
  }
  next();
}

