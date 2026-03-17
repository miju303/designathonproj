import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/api';

// Create the context
const UserContext = createContext(null);

/**
 * UserProvider wraps the app and provides the logged-in user state
 * to all child components via useUser() hook.
 *
 * On mount it calls /api/user/me to restore session on page refresh.
 * After login, call refreshUser() to update the context from the Login component.
 */
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Fetch current user from the backend session.
   * Called on app load and after login.
   */
  const refreshUser = useCallback(async () => {
    try {
      const response = await authApi.me();
      if (response.data && response.data.success !== false) {
        const userData = response.data;
        setUser(userData);
        // Keep localStorage in sync for ProtectedRoute
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('userId', userData.id);
        localStorage.setItem('userName', userData.name);
        localStorage.setItem('userRole', userData.role);
        localStorage.setItem('userDept', userData.department || '');
      } else {
        clearUser();
      }
    } catch (err) {
      // 401 means not authenticated — clear state
      clearUser();
    } finally {
      setLoading(false);
    }
  }, []);

  const clearUser = () => {
    setUser(null);
    localStorage.clear();
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      // ignore logout errors
    }
    clearUser();
  };

  // On initial mount, try to restore session
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  return (
    <UserContext.Provider value={{ user, setUser, loading, refreshUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

/**
 * Hook to consume user context anywhere in the app.
 * Usage: const { user, loading, refreshUser, logout } = useUser();
 */
export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within a UserProvider');
  return ctx;
};

export default UserContext;
