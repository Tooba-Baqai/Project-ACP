import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading, currentUser } = useAuth();

  useEffect(() => {
    console.log('AdminRoute component mounted');
    console.log('Auth state in AdminRoute:', { 
      isAuthenticated, 
      isAdmin, 
      loading,
      userRole: currentUser?.role,
      currentUser: currentUser ? {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role
      } : null
    });
  }, [isAuthenticated, isAdmin, loading, currentUser]);

  if (loading) {
    console.log('AdminRoute: Still loading...');
    return <div className="loading-spinner">Loading...</div>;
  }

  if (!isAuthenticated) {
    console.log('AdminRoute: Not authenticated, redirecting to login');
    return <Navigate to="/login" />;
  }

  // Check for admin role using direct role check from user object
  // This is more reliable than using the isAdmin state which might be out of sync
  const userIsAdmin = currentUser?.role === 'admin';
  
  console.log('AdminRoute direct role check:', {
    isAdminFromContext: isAdmin,
    userRoleDirectCheck: currentUser?.role,
    userIsAdmin
  });

  // If direct role check shows user is not admin, redirect
  if (!userIsAdmin) {
    console.log('AdminRoute: Not admin by role check, redirecting to home page');
    return <Navigate to="/" />;
  }

  console.log('AdminRoute: Admin access granted');
  return children;
};

export default AdminRoute; 