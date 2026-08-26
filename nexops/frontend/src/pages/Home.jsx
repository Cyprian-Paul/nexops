import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-page">
      <section className="hero">
        <h1>NexOps</h1>
        <p>One dashboard for tickets, assets, network health, and support operations.</p>
        <Link to="/login" className="cta-button">Log In</Link>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>Ticket Management</h3>
          <p>Submit, track, and resolve support tickets with AI assisted categorization.</p>
        </div>
        <div className="feature-card">
          <h3>Asset Tracking</h3>
          <p>Know exactly which device belongs to which person, at all times.</p>
        </div>
        <div className="feature-card">
          <h3>Network Monitoring</h3>
          <p>Check the live status of routers, switches, and other network devices.</p>
        </div>
        <div className="feature-card">
          <h3>Reports and Analytics</h3>
          <p>See ticket trends, resolution times, and common issue categories at a glance.</p>
        </div>
      </section>
    </div>
  );
}

export default Home;
