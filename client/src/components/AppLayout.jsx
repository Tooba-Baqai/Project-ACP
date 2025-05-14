import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from './Header';
import AdminHeader from './AdminHeader';
import Footer from './Footer';

const AppLayout = ({ children }) => {
  const { currentUser, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isAdminPath = location.pathname.startsWith('/admin');
 
  const userIsAdmin = isAdmin && currentUser?.role === 'admin';

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  useEffect(() => {
    if (isAuthPage) {
      console.log('On auth page, skipping redirect checks');
      return;
    }
    
    if (currentUser) {
      if (isAdminPath && !userIsAdmin) {
        console.log('Non-admin user trying to access admin area, redirecting...');
        navigate('/');
      }

      if (userIsAdmin && !isAdminPath && location.pathname !== '/') {
        if (['/dashboard', '/orders'].includes(location.pathname)) {
          console.log('Admin trying to access user-only area, redirecting to admin dashboard...');
          navigate('/admin');
        }
      }
    }
  }, [isAdminPath, userIsAdmin, navigate, location.pathname, currentUser, isAuthPage]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      {userIsAdmin && isAdminPath ? (
        <AdminHeader />
      ) : (
        <Header />
      )}

      <main className="main-content">
        {children}
      </main>
      
      <Footer />
    </>
  );
};

export default AppLayout; 