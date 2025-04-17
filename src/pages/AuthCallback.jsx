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
  const { setCurrentUser, clearLoadingStates } = useAuth();

  useEffect(() => {
    let mounted = true;

    const handleAuthCallback = async () => {
      try {
        console.log('AuthCallback component mounted, current URL:', window.location.href);
        
        // Get the hash fragment and convert it to searchParams
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1) // Remove the # character
        );
        
        console.log('Hash params:', Object.fromEntries(hashParams.entries()));
        
        // Check for access_token in hash
        const accessToken = hashParams.get('access_token');
        if (accessToken) {
          console.log('Access token found, setting up session...');
          const { data: { session }, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: hashParams.get('refresh_token')
          });

          if (sessionError) {
            console.error('Session error:', sessionError);
            throw sessionError;
          }

          if (session?.user) {
            console.log('Session established successfully');
            if (mounted) {
              await setCurrentUser(session.user);
              // Clear the hash from the URL
              window.location.hash = '';
              toast.success('Successfully signed in with Google');
              // Clear loading states before navigation
              setLoading(false);
              clearLoadingStates();
              // Navigate to meditation page
              window.location.href = '/meditation';
              return;
            }
          }
        }

        // If no token in hash, check for existing session
        console.log('Checking for existing session...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error('Session check error:', sessionError);
          throw sessionError;
        }

        if (session?.user) {
          console.log('Existing session found');
          if (mounted) {
            await setCurrentUser(session.user);
            setLoading(false);
            clearLoadingStates();
            window.location.href = '/meditation';
            return;
          }
        }

        // If we get here, no valid session was found
        console.log('No valid session found, redirecting to auth');
        if (mounted) {
          setLoading(false);
          clearLoadingStates();
          window.location.href = '/auth';
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        if (mounted) {
          setError(error.message);
          setLoading(false);
          clearLoadingStates();
          toast.error('Authentication failed. Please try again.');
          window.location.href = '/auth';
        }
      }
    };

    // Execute the callback handler
    handleAuthCallback();

    // Cleanup function
    return () => {
      mounted = false;
    };
  }, [navigate, location, setCurrentUser, clearLoadingStates]);

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-dark-300 px-4 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-10 w-[450px] h-[450px] rounded-full bg-gradient-to-br from-primary/20 to-primary/5 blur-3xl animate-float z-0" />
        <div className="absolute bottom-1/4 -right-36 w-[450px] h-[450px] rounded-full bg-gradient-to-tl from-primary/20 to-primary/5 blur-3xl animate-float-reverse z-0" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-primary/15 blur-[100px] animate-float-delay z-0" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-dark-100/50 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-xl border border-primary/10">
          <div className="text-center">
            {loading ? (
              <>
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-white mb-2">Completing Sign In</h2>
                <p className="text-gray-400">Please wait while we verify your credentials...</p>
              </>
            ) : error ? (
              <>
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-red-500 mb-2">Authentication Failed</h2>
                <p className="text-gray-400 mb-4">{error}</p>
                <p className="text-gray-400">Redirecting you back to login...</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-white mb-2">Almost There!</h2>
                <p className="text-gray-400">Setting up your account...</p>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthCallback; 