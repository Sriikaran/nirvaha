import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import { supabase } from '../config/supabase';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: '',
    confirmPassword: '',
    name: '',
    email: '',
    resetEmail: ''
  });
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    email: ''
  });
  const [validating, setValidating] = useState({
    name: false,
    email: false
  });

  const navigate = useNavigate();
  const { signup, login, resetPassword, signInWithGoogle } = useAuth();

  // Function to check username availability with debounce
  const checkUsernameAvailability = async (username) => {
    if (!username || username.length < 3) return;
    
    setValidating(prev => ({ ...prev, name: true }));
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .single();
      
      if (data) {
        setValidationErrors(prev => ({ 
          ...prev, 
          name: 'Username already taken' 
        }));
      } else {
        setValidationErrors(prev => ({ ...prev, name: '' }));
      }
    } catch (error) {
      // No user found, which is good
      setValidationErrors(prev => ({ ...prev, name: '' }));
    } finally {
      setValidating(prev => ({ ...prev, name: false }));
    }
  };

  // Function to check email availability with debounce
  const checkEmailAvailability = async (email) => {
    if (!email || !email.includes('@')) return;
    
    setValidating(prev => ({ ...prev, email: true }));
    
    try {
      // This is an approximation as we can't directly query auth.users
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();
      
      if (data) {
        setValidationErrors(prev => ({ 
          ...prev, 
          email: 'Email already used' 
        }));
      } else {
        setValidationErrors(prev => ({ ...prev, email: '' }));
      }
    } catch (error) {
      // No user found, which is good
      setValidationErrors(prev => ({ ...prev, email: '' }));
    } finally {
      setValidating(prev => ({ ...prev, email: false }));
    }
  };

  // Debounce validation checks
  useEffect(() => {
    if (!isLogin && formData.name) {
      const timer = setTimeout(() => {
        checkUsernameAvailability(formData.name);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [formData.name, isLogin]);

  useEffect(() => {
    if (!isLogin && formData.email) {
      const timer = setTimeout(() => {
        checkEmailAvailability(formData.email);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [formData.email, isLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check for validation errors before proceeding
    if (!isLogin && (validationErrors.name || validationErrors.email)) {
      toast.error('Please fix the validation errors before continuing');
      return;
    }
    
    setLoading(true);

    try {
      if (isForgotPassword) {
        await resetPassword(formData.resetEmail);
        toast.success('Password reset link sent to your email');
        setIsForgotPassword(false);
        setIsLogin(true);
        setFormData({
          ...formData,
          resetEmail: ''
        });
        return;
      }
      
      if (isLogin) {
        const isEmail = formData.emailOrUsername.includes('@');
        const loginData = {
          email: isEmail ? formData.emailOrUsername : undefined,
          username: !isEmail ? formData.emailOrUsername : undefined,
          password: formData.password
        };

        console.log('Attempting login with:', { ...loginData, password: '[REDACTED]' });
        const result = await login(loginData);
        console.log('Login successful:', result);
        
        toast.success('Welcome back!');
        navigate('/meditation');
      } else {
        // Check if passwords match
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match');
          return;
        }
        
        // Validate password strength
        if (formData.password.length < 6) {
          toast.error('Password must be at least 6 characters');
          return;
        }
        
        try {
          await signup({
            email: formData.email,
            password: formData.password,
            options: {
              data: {
                username: formData.name
              }
            }
          });
          toast.success('Account created! Please check your email for confirmation link.');
          setIsLogin(true);
          setFormData({
            emailOrUsername: formData.email,
            password: '',
            confirmPassword: '',
            name: '',
            email: ''
          });
        } catch (error) {
          if (error.message.includes('already')) {
            toast.error('Email already used or username already taken.');
          } else {
            throw error;
          }
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      if (error.message.includes('Email not confirmed')) {
        toast.error('Please confirm your email address. Check your inbox for the confirmation link.');
      } else if (error.message.includes('Invalid login credentials')) {
        toast.error('Invalid email/username or password');
      } else {
        toast.error(error.message || 'An error occurred during authentication');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      setGoogleLoading(true);
      await signInWithGoogle();
      // Note: No need to navigate here as the OAuth callback will handle it
    } catch (error) {
      console.error('Google sign-in error:', error);
      toast.error('Failed to sign in with Google. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  // Reset form and validation states
  const reset = () => {
    setFormData({
      emailOrUsername: '',
      password: '',
      confirmPassword: '',
      name: '',
      email: '',
      resetEmail: ''
    });
    setValidationErrors({
      name: '',
      email: ''
    });
    setValidating({
      name: false,
      email: false
    });
    setLoading(false);
    setGoogleLoading(false);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-300">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-8"
      >
        <div className="bg-dark-100/50 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-primary/10">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            {isForgotPassword ? 'Reset Password' : isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {isForgotPassword ? (
              <div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={formData.resetEmail}
                  onChange={(e) => setFormData({ ...formData, resetEmail: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-dark-200 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            ) : (
              <>
                {!isLogin && (
                  <div>
                    <input
                      type="text"
                      placeholder="Username"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl bg-dark-200 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary ${
                        validationErrors.name ? 'border-red-500' : ''
                      }`}
                      required
                    />
                    {validationErrors.name && (
                      <p className="mt-1 text-sm text-red-500">{validationErrors.name}</p>
                    )}
                    {validating.name && (
                      <p className="mt-1 text-sm text-primary">Checking username availability...</p>
                    )}
                  </div>
                )}
                
                {!isLogin && (
                  <div>
                    <input
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl bg-dark-200 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary ${
                        validationErrors.email ? 'border-red-500' : ''
                      }`}
                      required
                    />
                    {validationErrors.email && (
                      <p className="mt-1 text-sm text-red-500">{validationErrors.email}</p>
                    )}
                    {validating.email && (
                      <p className="mt-1 text-sm text-primary">Checking email availability...</p>
                    )}
                  </div>
                )}
                
                {isLogin && (
                  <input
                    type="text"
                    placeholder="Email or Username"
                    value={formData.emailOrUsername}
                    onChange={(e) => setFormData({ ...formData, emailOrUsername: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-dark-200 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                )}
                
                <input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-dark-200 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                
                {!isLogin && (
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-dark-200 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                )}
              </>
            )}
            
            <button
              type="submit"
              className="w-full py-3 px-4 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || validating.name || validating.email}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {isForgotPassword ? 'Sending Reset Link...' : isLogin ? 'Signing In...' : 'Creating Account...'}
                </div>
              ) : (
                isForgotPassword ? 'Send Reset Link' : isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <div className="text-gray-400">or</div>
            
            <button
              onClick={handleGoogleSignIn}
              className="mt-4 w-full flex items-center justify-center py-3 px-4 bg-dark-200 text-white rounded-xl font-medium hover:bg-dark-200/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={googleLoading}
            >
              {googleLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Connecting to Google...
                </div>
              ) : (
                <>
                  <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 mr-2" />
                  Sign in with Google
                </>
              )}
            </button>
            
            {!isForgotPassword && (
              <div className="mt-6">
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    reset();
                  }}
                  className="text-primary hover:underline"
                >
                  {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
                </button>
              </div>
            )}
            
            {isLogin && !isForgotPassword && (
              <div className="mt-4">
                <button
                  onClick={() => {
                    setIsForgotPassword(true);
                    reset();
                  }}
                  className="text-primary hover:underline"
                >
                  Forgot your password?
                </button>
              </div>
            )}
            
            {isForgotPassword && (
              <div className="mt-4">
                <button
                  onClick={() => {
                    setIsForgotPassword(false);
                    reset();
                  }}
                  className="text-primary hover:underline"
                >
                  Back to Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
      <Toaster position="top-center" />
    </div>
  );
};

export default Auth; 