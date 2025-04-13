import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import { GOOGLE_AUTH_CONFIG } from '../config/googleAuth';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const AuthCallback = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    // Function to handle the OAuth callback
    const handleAuthCallback = async () => {
      try {
        console.log('AuthCallback component mounted');
        // Extract hash fragment or query parameters from URL
        const hash = window.location.hash;
        const params = new URLSearchParams(window.location.search);
        const url = window.location.href;
        
        console.log('Current URL:', url);
        console.log('Hash fragment:', hash);
        console.log('URL parameters:', Object.fromEntries(params.entries()));
        console.log('Current user:', currentUser);
        
        // If user is already logged in, or we have auth data in the URL
        if (currentUser || hash || params.get('code')) {
          console.log('Verifying session...');
          // Verify the session
          const { data, error } = await supabase.auth.getSession();
          
          console.log('Session data:', data);
          
          if (error) {
            console.error('Session error:', error);
            throw error;
          }
          
          if (data?.session) {
            console.log('Valid session found, redirecting to:', GOOGLE_AUTH_CONFIG.defaultRedirectPath);
            toast.success('Successfully signed in with Google');
            // Navigate to the default redirect path
            setTimeout(() => {
              navigate(GOOGLE_AUTH_CONFIG.defaultRedirectPath, { replace: true });
            }, 500);
          } else {
            // Handle potential errors in URL parameters
            if (params.get('error')) {
              const errorMsg = `Authentication error: ${params.get('error_description') || params.get('error')}`;
              console.error(errorMsg);
              setError(errorMsg);
              toast.error(errorMsg);
              setTimeout(() => {
                navigate('/auth', { replace: true });
              }, 2000);
            } else {
              console.log('No session found, redirecting to auth page');
              navigate('/auth', { replace: true });
            }
          }
        } else {
          console.log('No auth data found, redirecting to auth page');
          navigate('/auth', { replace: true });
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        setError(error.message);
        toast.error(error.message);
        setTimeout(() => {
          navigate('/auth', { replace: true });
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [navigate, currentUser]);

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