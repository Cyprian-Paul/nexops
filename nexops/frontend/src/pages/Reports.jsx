import { useState, useEffect } from 'react';

// Admin only page. Pulls ticket analytics and shows them as simple summary blocks.
// Kept as plain numbers and lists here, chart rendering can be added on top once styling is set.

function Reports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/backend/api/tickets/reports.php', { credentials: 'include' })
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <p>Loading reports</p>;
  }

  if (!data) {
    return <p>Could not load reports</p>;
  }

  return (
    <div className="reports-page">
      <h2>Reports and Analytics</h2>

      <section className="report-block">
        <h3>Average Resolution Time</h3>
        <p>{data.avg_resolution_hours} hours</p>
      </section>

      <section className="report-block">
        <h3>Tickets by Status</h3>
        <ul>
          {data.by_status.map((row) => (
            <li key={row.status}>{row.status}: {row.total}</li>
          ))}
        </ul>
      </section>

      <section className="report-block">
        <h3>Tickets by Priority</h3>
        <ul>
          {data.by_priority.map((row) => (
            <li key={row.priority}>{row.priority}: {row.total}</li>
          ))}
        </ul>
      </section>

      <section className="report-block">
        <h3>Top Categories</h3>
        <ul>
          {data.by_category.map((row) => (
            <li key={row.category}>{row.category}: {row.total}</li>
          ))}
        </ul>
      </section>

      <section className="report-block">
        <h3>Ticket Volume, Last 7 Days</h3>
        <ul>
          {data.volume_last_7_days.map((row) => (
            <li key={row.day}>{row.day}: {row.total}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default Reports;
