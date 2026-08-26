import { useState, useEffect } from 'react';

// Dashboard renders different sections depending on the logged in user's role.
// Admins see the full operations view. Regular users only see their own tickets.

function Dashboard({ user, onLogout }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = user.role === 'admin';

  useEffect(() => {
    const endpoint = isAdmin ? '/backend/api/tickets/all.php' : '/backend/api/tickets/mine.php';

    fetch(endpoint, { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        setTickets(data.tickets || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [isAdmin]);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h2>Welcome, {user.name}</h2>
          <p>{user.department} · {user.user_rank} · {user.role}</p>
        </div>
        <button onClick={onLogout}>Log Out</button>
      </header>

      <nav className="dashboard-nav">
        <a href="/tickets">Tickets</a>
        {isAdmin && <a href="/assets">Assets</a>}
        {isAdmin && <a href="/network">Network</a>}
        {isAdmin && <a href="/reports">Reports</a>}
        {isAdmin && <a href="/users">Users</a>}
      </nav>

      <section className="dashboard-summary">
        <div className="summary-card">
          <h3>{isAdmin ? 'All Open Tickets' : 'My Tickets'}</h3>
          <p>{loading ? 'Loading' : tickets.length}</p>
        </div>

        {isAdmin && (
          <>
            <div className="summary-card">
              <h3>Assets Tracked</h3>
              <p>Coming from api/assets</p>
            </div>
            <div className="summary-card">
              <h3>Network Status</h3>
              <p>Coming from api/network</p>
            </div>
          </>
        )}
      </section>

      <section className="ticket-list">
        <h3>{isAdmin ? 'Recent Tickets' : 'Your Recent Tickets'}</h3>
        {loading && <p>Loading tickets</p>}
        {!loading && tickets.length === 0 && <p>No tickets yet</p>}
        {!loading &&
          tickets.map((ticket) => (
            <div className="ticket-row" key={ticket.id}>
              <span>{ticket.title}</span>
              <span>{ticket.priority}</span>
              <span>{ticket.status}</span>
            </div>
          ))}
      </section>
    </div>
  );
}

export default Dashboard;
