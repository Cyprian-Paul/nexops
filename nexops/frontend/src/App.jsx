import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';

import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import AuthPage from './pages/AuthPage.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import Dashboard from './pages/Dashboard.jsx';
import NewTicket from './pages/NewTicket.jsx';
import TicketDetail from './pages/TicketDetail.jsx';
import Assets from './pages/Assets.jsx';
import NetworkStatus from './pages/NetworkStatus.jsx';
import Reports from './pages/Reports.jsx';
import Settings from './pages/Settings.jsx';

// Any route wrapped in this only renders for a logged in user.
// If not logged in, it sends them back to the login page instead.
function PrivateRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Any route wrapped in this only renders for an admin.
// A logged in regular user gets redirected to their own dashboard instead.
function AdminRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function App() {
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  // On first load, check if the browser already has a valid session,
  // so a logged in user doesn't get bounced back to the login page on refresh.
  useEffect(() => {
    fetch('/backend/api/auth/me.php', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.user) {
          setUser(data.user);
        }
        setCheckingSession(false);
      })
      .catch(() => setCheckingSession(false));
  }, []);

  const handleLogout = async () => {
    await fetch('/backend/api/auth/logout.php', {
      method: 'POST',
      credentials: 'include'
    });
    setUser(null);
  };

  if (checkingSession) {
    return <p>Loading NexOps</p>;
  }

  return (
    <BrowserRouter>
      <nav className="site-nav">
        <Link to="/" className="site-logo">NexOps</Link>
        <div className="site-nav-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          {user ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/settings">Settings</Link>
              <button onClick={handleLogout}>Log Out</button>
            </>
          ) : (
            <Link to="/login">Log In</Link>
          )}
        </div>
      </nav>

      <main className="site-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" replace /> : <AuthPage onLoginSuccess={setUser} />}
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute user={user}>
                <Dashboard user={user} onLogout={handleLogout} />
              </PrivateRoute>
            }
          />

          <Route
            path="/tickets/new"
            element={
              <PrivateRoute user={user}>
                <NewTicket />
              </PrivateRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <PrivateRoute user={user}>
                <Settings />
              </PrivateRoute>
            }
          />

          <Route
            path="/assets"
            element={
              <AdminRoute user={user}>
                <Assets staffList={[]} />
              </AdminRoute>
            }
          />

          <Route
            path="/network"
            element={
              <AdminRoute user={user}>
                <NetworkStatus />
              </AdminRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <AdminRoute user={user}>
                <Reports />
              </AdminRoute>
            }
          />

          <Route
            path="/tickets/:id"
            element={
              <AdminRoute user={user}>
                <TicketDetail ticket={{}} staffList={[]} onUpdated={() => {}} />
              </AdminRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
