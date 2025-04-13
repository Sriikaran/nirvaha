// Google OAuth 2.0 configuration
// Replace these with your actual Google Cloud OAuth credentials
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = import.meta.env.VITE_GOOGLE_CLIENT_SECRET;

// Auth configuration
export const GOOGLE_AUTH_CONFIG = {
  // Scopes determine what information about the user you have access to
  scopes: [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
  ],
  
  // These URLs are used by Supabase to handle the authentication flow
  redirectTo: window.location.origin + '/auth/callback',
  
  // After authentication, the user will be redirected to the meditation page
  defaultRedirectPath: '/meditation',
  
  // Enable for debugging OAuth flow
  debug: false
}; 