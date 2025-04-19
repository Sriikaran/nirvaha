# Nirvaha - Meditation App

A modern meditation application built with React and Vite.

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/Srikarann/nirvaha2.git
cd nirvaha2
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   - Fill in the required values in `.env`:
     - Get Supabase credentials from your Supabase project dashboard
     - Get Google OAuth credentials from Google Cloud Console
     - Get Firebase credentials from Firebase Console (if using Firebase features)

4. Start the development server:
```bash
npm run dev
```

## Required Services

### Supabase
1. Create a Supabase project
2. Get your project URL and anon key from Project Settings > API
3. Add these to your `.env` file

### Google OAuth
1. Create a Google Cloud project
2. Set up OAuth 2.0 credentials
3. Add authorized redirect URIs:
   - `http://localhost:5173/auth/callback` (for development)
   - `https://your-production-domain/auth/callback` (for production)
4. Add the client ID to your `.env` file

### Firebase (Optional)
If using Firebase features:
1. Create a Firebase project
2. Get your Firebase configuration from Project Settings
3. Add the configuration values to your `.env` file

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment

The application is configured for deployment on Netlify. Push to the main branch to trigger automatic deployment.

## License

MIT
