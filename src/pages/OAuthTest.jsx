import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import { GOOGLE_AUTH_CONFIG } from '../config/googleAuth';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const OAuthTest = () => {
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { currentUser, signInWithGoogle } = useAuth();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        setSession(data.session);
      } catch (error) {
        console.error('Session check error:', error);
        setError(error.message);
      }
    };
    checkSession();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Starting Google sign-in...');
      const response = await signInWithGoogle();
      console.log('Google sign-in response:', response);
      
      if (response?.url) {
        console.log('Redirecting to:', response.url);
        window.location.href = response.url;
      } else {
        toast.error('No redirect URL received from Google sign-in');
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setSession(null);
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center bg-dark-300 px-4">
      <div className="w-full max-w-md bg-dark-100/50 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-primary/10">
        <h1 className="text-3xl font-bold text-primary mb-6 text-center">OAuth Test Page</h1>
        
        <div className="space-y-4">
          <div className="bg-dark-200 p-4 rounded-xl">
            <h2 className="text-xl font-semibold text-white mb-2">Current Session</h2>
            <pre className="text-sm text-gray-400 overflow-x-auto">
              {JSON.stringify(session || 'No active session', null, 2)}
            </pre>
          </div>

          <div className="bg-dark-200 p-4 rounded-xl">
            <h2 className="text-xl font-semibold text-white mb-2">Current User</h2>
            <pre className="text-sm text-gray-400 overflow-x-auto">
              {JSON.stringify(currentUser || 'No current user', null, 2)}
            </pre>
          </div>

          {error && (
            <div className="bg-red-500/10 p-4 rounded-xl">
              <h2 className="text-xl font-semibold text-red-500 mb-2">Error</h2>
              <pre className="text-sm text-red-400 overflow-x-auto">
                {error}
              </pre>
            </div>
          )}

          <div className="flex flex-col space-y-4">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-primary to-primary/80 text-dark-300 rounded-full font-medium
                       hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Sign in with Google'}
            </button>

            {session && (
              <button
                onClick={handleSignOut}
                disabled={loading}
                className="w-full px-6 py-3 bg-red-500/10 text-red-500 rounded-full font-medium
                         hover:bg-red-500/20 transition-all duration-300 disabled:opacity-50"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OAuthTest; 