# Torneos MTG

A modern tournament management system for Magic: The Gathering tournaments in Huelva. Built with React, Node.js, Express, Prisma, and SQLite.

## Features

- **Public Calendar View**: Browse and sign up for upcoming tournaments
- **Admin Panel**: Manage tournaments (create, edit, delete) - restricted to 4 authorized admins
- **Google OAuth Authentication**: Secure login system
- **Tournament Types**: Support for Commander, 2HG, and other formats
- **Real-time Signup Tracking**: See available spots and current signups
- **Responsive Design**: Modern, sleek UI with MTG-themed styling
- **Internationalization**: Support for English and Spanish

## Tech Stack

### Backend
- **Node.js** with Express
- **Prisma ORM** with SQLite
- **Passport.js** for Google OAuth
- **Vitest** for testing
- **Pino** for logging

### Frontend
- **React** with Vite
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **i18next** for internationalization
- **Vitest** with Testing Library

## Project Structure

```
torneos/
├── server/           # Backend API
│   ├── prisma/      # Database schema and migrations
│   ├── src/
│   │   ├── routes/  # API routes (tournaments, signups)
│   │   ├── middleware/  # Auth middleware
│   │   └── db/      # Database client
│   └── package.json
├── web/             # Frontend application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── lib/         # API client
│   │   └── i18n/        # Translations
│   └── package.json
└── package.json     # Root workspace configuration
```

## Setup

### Prerequisites
- Node.js 18+ (tested with Node 24.9.0)
- npm 9+
- Google OAuth credentials (for authentication)

### Installation

1. **Clone the repository**
   ```bash
   cd C:\Development\mtg\torneos
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create `server/.env` file:
   ```env
   DATABASE_URL="file:./dev.db"
   SESSION_SECRET="your-secret-key-change-in-production"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ADMIN_EMAILS="admin1@example.com,admin2@example.com,admin3@example.com,admin4@example.com"
   PORT=4000
   ```

4. **Set up the database**
   ```bash
   npm run db:generate -w server
   npm run db:push -w server
   ```

## Development

### Run tests (TDD approach)
```bash
# Run all tests
npm test

# Run backend tests only
npm run test:server

# Run frontend tests only
npm run test:web

# Watch mode for development
npm run test:watch -w server
npm run test:watch -w web
```

### Start development servers
```bash
# Start both backend and frontend
npm run dev

# Start backend only
npm run dev:server

# Start frontend only
npm run dev:web
```

- Backend API: http://localhost:4000
- Frontend: http://localhost:5173

## API Endpoints

### Public Endpoints
- `GET /api/tournaments` - List all tournaments
- `GET /api/tournaments/:id` - Get tournament details
- `GET /api/tournaments/:id/signups` - List tournament signups
- `GET /api/me` - Get current user info
- `GET /auth/google` - Initiate Google OAuth login

### Authenticated Endpoints
- `POST /api/tournaments/:id/signups` - Sign up for a tournament
- `DELETE /api/signups/:id` - Cancel your signup

### Admin Only Endpoints
- `POST /api/tournaments` - Create a tournament
- `PUT /api/tournaments/:id` - Update a tournament
- `DELETE /api/tournaments/:id` - Delete a tournament

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:4000/auth/google/callback`
6. Copy Client ID and Client Secret to `.env` file

## Admin Configuration

To grant admin access, add the user's Google email to the `ADMIN_EMAILS` environment variable (comma-separated). Admins can:
- Create new tournaments
- Edit existing tournaments
- Delete tournaments
- View all signups

## Database Schema

### User
- Email, display name, admin status
- OAuth profile information

### Tournament
- Name, type, date, time, location
- Max players, current status
- Description, rules, prizes

### TournamentSignup
- User-tournament relationship
- Player name, notes, signup timestamp
- Unique constraint per user per tournament

## Testing

The project follows Test-Driven Development (TDD):
- **Backend**: 20 tests covering all API routes and authorization
- **Frontend**: 14 tests covering components and pages
- **Total**: 34 tests, all passing ✓

## Deployment

### Build for production
```bash
npm run build
```

### Start production server
```bash
npm start
```

## Contributing

This is a community project for the MTG community in Huelva. The system is designed to be managed by 4 administrators.

## License

MIT

## Acknowledgments

Magic: The Gathering is property of Wizards of the Coast. This project is a community tool and is not affiliated with or endorsed by Wizards of the Coast.

