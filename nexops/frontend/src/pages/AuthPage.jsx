import { useState } from 'react';

// This component handles both login and register.
// The toggleMode function switches which form is visible.
// Styling is left plain here since you will apply your own design.

function AuthPage({ onLoginSuccess }) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [department, setDepartment] = useState('');
  const [rank, setRank] = useState('junior');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_BASE = '/backend/api/auth';

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLoginMode ? `${API_BASE}/login.php` : `${API_BASE}/register.php`;
    const payload = isLoginMode
      ? { email, password }
      : { name, email, password, role, department, rank };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Something went wrong');
        setLoading(false);
        return;
      }

      if (isLoginMode) {
        onLoginSuccess(data.user);
      } else {
        setIsLoginMode(true);
        setError('Account created. You can log in now.');
      }
    } catch (err) {
      setError('Could not reach the server');
    }

    setLoading(false);
  };

  return (
    <div className="auth-page">
      <h2>{isLoginMode ? 'Log In' : 'Create Account'}</h2>

      <form onSubmit={handleSubmit}>
        {!isLoginMode && (
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {!isLoginMode && (
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        )}

        {!isLoginMode && (
          <input
            type="text"
            placeholder="Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
        )}

        {!isLoginMode && (
          <select value={rank} onChange={(e) => setRank(e.target.value)}>
            <option value="junior">Junior</option>
            <option value="senior">Senior</option>
            <option value="lead">Lead</option>
            <option value="manager">Manager</option>
          </select>
        )}

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Please wait' : isLoginMode ? 'Log In' : 'Register'}
        </button>
      </form>

      <p onClick={toggleMode} className="auth-toggle">
        {isLoginMode ? 'Need an account? Register' : 'Already have an account? Log in'}
      </p>
    </div>
  );
}

export default AuthPage;
