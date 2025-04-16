import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../config/supabase';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const AuthCallback = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { setCurrentUser, setLoading: setAuthLoading } = useAuth();

  useEffect(() => {
    let mounted = true;

    const handleAuthCallback = async () => {
      try {
        console.log('AuthCallback component mounted');
        
        // Get the hash fragment and convert it to searchParams
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1) // Remove the # character
        );
        
        console.log('Hash params:', Object.fromEntries(hashParams.entries()));
        
        // Check for access_token in hash
        const accessToken = hashParams.get('access_token');
        if (accessToken) {
          console.log('Access token found in hash');
          const { data: { session }, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: hashParams.get('refresh_token')
          });

          if (sessionError) {
            console.error('Session error:', sessionError);
            throw sessionError;
          }

          if (session) {
            console.log('Session established');
            if (mounted) {
              setCurrentUser(session.user);
              toast.success('Successfully signed in with Google');
              setLoading(false);
              setAuthLoading(false);
              // Clear the hash from the URL
              window.location.hash = '';
              navigate('/meditation', { replace: true });
            }
            return;
          }
        }

        // Handle query parameters for errors
        const params = new URLSearchParams(location.search);
        if (params.get('error')) {
          const errorMsg = `Authentication error: ${params.get('error_description') || params.get('error')}`;
          console.error('Auth error from params:', errorMsg);
          if (mounted) {
            setError(errorMsg);
            setLoading(false);
            setAuthLoading(false);
            toast.error(errorMsg);
            setTimeout(() => mounted && navigate('/auth', { replace: true }), 2000);
          }
          return;
        }

        // If no token and no error, check for existing session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error('Session check error:', sessionError);
          throw sessionError;
        }

        if (session) {
          console.log('Existing session found');
          if (mounted) {
            setCurrentUser(session.user);
            setLoading(false);
            setAuthLoading(false);
            navigate('/meditation', { replace: true });
          }
          return;
        }

        // If we get here, redirect to auth
        console.log('No session or token found, redirecting to auth');
        if (mounted) {
          setLoading(false);
          setAuthLoading(false);
          navigate('/auth', { replace: true });
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        if (mounted) {
          setError(error.message);
          setLoading(false);
          setAuthLoading(false);
          toast.error(error.message);
          setTimeout(() => mounted && navigate('/auth', { replace: true }), 2000);
        }
      }
    };

    handleAuthCallback();

    // Cleanup function
    return () => {
      mounted = false;
    };
  }, [navigate, location, setCurrentUser, setAuthLoading]);

  // If we're not loading and don't have an error, redirect immediately
  useEffect(() => {
    if (!loading && !error) {
      navigate('/meditation', { replace: true });
    }
  }, [loading, error, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-300">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-8"
      >
        <div className="bg-dark-100/50 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-primary/10">
          {loading ? (
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white">Completing authentication...</h2>
              <p className="text-gray-400 mt-2">Please wait while we verify your credentials</p>
            </div>
          ) : error ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-red-500">Authentication Failed</h2>
              <p className="text-gray-400 mt-2">{error}</p>
              <p className="text-gray-400 mt-4">Redirecting to login page...</p>
            </div>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthCallback; 