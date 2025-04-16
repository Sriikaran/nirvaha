import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { GOOGLE_AUTH_CONFIG } from '../config/googleAuth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Clear error state
  const clearError = () => setError(null);

  // Fetch user profile data
  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        setError('Failed to fetch user profile. Please try again later.');
        console.error('Error fetching profile:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      setError('An unexpected error occurred while fetching your profile.');
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };
  
  // Create or update profile in database
  const upsertProfile = async (user) => {
    if (!user) {
      setError('No user data provided for profile creation.');
      return null;
    }
    
    try {
      // Check if we already have a profile
      let profile = await fetchUserProfile(user.id);
      
      if (!profile) {
        // Extract data from user object
        const { id, email } = user;
        const name = user.user_metadata?.name || user.user_metadata?.full_name || '';
        const avatarUrl = user.user_metadata?.avatar_url || '';
        const provider = user.app_metadata?.provider || 'email';
        let username = user.user_metadata?.username || '';
        
        // For OAuth users, create a username from email if not already set
        if (!username && provider !== 'email') {
          username = email.split('@')[0];
        }
        
        // Insert new profile
        const { data, error } = await supabase
          .from('profiles')
          .upsert({
            id,
            email,
            username,
            name,
            avatar_url: avatarUrl,
            provider,
            updated_at: new Date()
          }, { onConflict: 'id' });
          
        if (error) {
          setError('Failed to create user profile. Please try again.');
          console.error('Error creating profile:', error);
        } else {
          profile = await fetchUserProfile(id);
        }
      }
      
      setUserProfile(profile);
      return profile;
    } catch (error) {
      setError('An unexpected error occurred while creating your profile.');
      console.error('Error in upsertProfile:', error);
      return null;
    }
  };

  const signup = async ({ email, password, options }) => {
    try {
      setLoading(true);
      setError(null);
      
      // First, check if the username already exists
      const username = options?.data?.username;
      if (username) {
        const { data: existingUser, error: usernameCheckError } = await supabase
          .from('profiles')
          .select('id')
          .eq('username', username)
          .single();
        
        if (existingUser) {
          throw new Error('Email already used or username already taken.');
        }
      }
      
      // Then attempt to sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          ...options,
          emailRedirectTo: window.location.origin + '/auth'
        }
      });
      
      if (error) {
        // Handle specific error cases
        if (error.message.includes('already registered')) {
          throw new Error('Email already used or username already taken.');
        }
        throw error;
      }
      
      // Create a profile for the new user
      if (data?.user) {
        await upsertProfile(data.user);
      }
      
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async ({ email, username, password }) => {
    try {
      setLoading(true);
      setError(null);

      if (email) {
        // Login with email
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) {
          setError(error.message);
          throw error;
        }
        
        if (data?.user) {
          const profile = await upsertProfile(data.user);
          if (!profile) {
            setError('Failed to load user profile');
            throw new Error('Failed to load user profile');
          }
        }
        
        return data;
      } else if (username) {
        // First, find the user's email by username
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('email')
          .eq('username', username)
          .single();

        if (profileError) {
          setError('Username not found');
          throw new Error('Username not found');
        }

        // Then login with the found email
        const { data, error } = await supabase.auth.signInWithPassword({
          email: profiles.email,
          password
        });
        if (error) {
          setError(error.message);
          throw error;
        }
        
        if (data?.user) {
          const profile = await upsertProfile(data.user);
          if (!profile) {
            setError('Failed to load user profile');
            throw new Error('Failed to load user profile');
          }
        }
        
        return data;
      }
      setError('Either email or username is required');
      throw new Error('Either email or username is required');
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: GOOGLE_AUTH_CONFIG.redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
      
      // If we have a URL, redirect to it
      if (data?.url) {
        window.location.href = data.url;
      }
      
      return data;
    } catch (error) {
      console.error('Google sign-in error:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) throw error;
      
      // Clear local user data
      setCurrentUser(null);
      setUserProfile(null);
      
      // Clear local storage items that might contain auth data
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('supabase.auth.expires_at');
      
      // Clear any auth-related cookies
      document.cookie.split(';').forEach(cookie => {
        const [name] = cookie.trim().split('=');
        if (name.includes('auth') || name.includes('session')) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }
      });
      
    } catch (error) {
      console.error('Logout error:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Add resetPassword function
  const resetPassword = async (email) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      
      if (error) {
        setError(error.message);
        throw error;
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Add updatePassword function
  const updatePassword = async (newPassword) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        setError(error.message);
        throw error;
      }
    } catch (error) {
      console.error('Update password error:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update user profile function
  const updateProfile = async (profileData) => {
    try {
      if (!currentUser) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...profileData,
          updated_at: new Date()
        })
        .eq('id', currentUser.id);
        
      if (error) throw error;
      
      // Refresh profile data
      const updatedProfile = await fetchUserProfile(currentUser.id);
      setUserProfile(updatedProfile);
      
      return updatedProfile;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  useEffect(() => {
    let mounted = true;
    
    // Get initial session
    const initAuth = async () => {
      try {
        if (!mounted) return;
        setLoading(true);
        
        // Get session data
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        // If we have a session, set the current user
        if (session?.user) {
          if (!mounted) return;
          setCurrentUser(session.user);
          
          // Fetch user profile
          const profile = await fetchUserProfile(session.user.id);
          
          // If no profile exists yet (e.g., first OAuth login), create one
          if (!profile) {
            await upsertProfile(session.user);
          } else {
            if (!mounted) return;
            setUserProfile(profile);
          }
        } else {
          if (!mounted) return;
          setCurrentUser(null);
          setUserProfile(null);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        if (!mounted) return;
        setCurrentUser(null);
        setUserProfile(null);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    
    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      // Set currentUser based on session
      setCurrentUser(session?.user ?? null);
      
      if (session?.user) {
        // Update profile if auth state changed
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
          const profile = await fetchUserProfile(session.user.id);
          
          // If no profile exists yet (e.g., first OAuth login), create one
          if (!profile || event === 'SIGNED_IN') {
            await upsertProfile(session.user);
          } else {
            if (!mounted) return;
            setUserProfile(profile);
          }
        }
      } else {
        // Clear profile when signed out
        if (!mounted) return;
        setUserProfile(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    error,
    clearError,
    signup,
    login,
    logout,
    signInWithGoogle,
    resetPassword,
    updatePassword,
    updateProfile,
    setLoading // Export setLoading to allow manual control when needed
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 