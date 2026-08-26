import { useState } from 'react';

// This view lets an admin change a single ticket's status, priority, or assignment.
// It expects the full ticket object and a list of users to assign to, passed in as props.

function TicketDetail({ ticket, staffList, onUpdated }) {
  const [status, setStatus] = useState(ticket.status);
  const [priority, setPriority] = useState(ticket.priority);
  const [assignedTo, setAssignedTo] = useState(ticket.assigned_to || '');
  const [category, setCategory] = useState(ticket.category || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setSaving(true);
    setError('');

    try {
      const response = await fetch('/backend/api/tickets/update.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id: ticket.id,
          status,
          priority,
          assigned_to: assignedTo || null,
          category
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Could not update ticket');
        setSaving(false);
        return;
      }

      if (onUpdated) {
        onUpdated({ ...ticket, status, priority, assigned_to: assignedTo, category });
      }
    } catch (err) {
      setError('Could not reach the server');
    }

    setSaving(false);
  };

  return (
    <div className="ticket-detail">
      <h3>{ticket.title}</h3>
      <p>{ticket.description}</p>

      <label>Status</label>
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="open">Open</option>
        <option value="in_progress">In Progress</option>
        <option value="resolved">Resolved</option>
        <option value="closed">Closed</option>
      </select>

      <label>Priority</label>
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="urgent">Urgent</option>
      </select>

      <label>Assigned To</label>
      <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
        <option value="">Unassigned</option>
        {staffList.map((staff) => (
          <option key={staff.id} value={staff.id}>{staff.name}</option>
        ))}
      </select>

      <label>Category</label>
      <input
        type="text"
        placeholder="For example Network, Hardware, Access"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      {error && <p className="ticket-error">{error}</p>}

      <button onClick={handleSave} disabled={saving}>
        {saving ? 'Saving' : 'Save Changes'}
      </button>
    </div>
  );
}

export default TicketDetail;
