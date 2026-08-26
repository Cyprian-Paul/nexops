import { useState } from 'react';

// Any logged in user can submit a ticket here.
// Before final submit, the description is sent to the AI assistant for a category and priority suggestion.
// The user can accept the suggestion or change it before confirming.

function NewTicket({ onTicketCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('');
  const [suggesting, setSuggesting] = useState(false);
  const [suggested, setSuggested] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGetSuggestion = async () => {
    if (!title || !description) {
      setError('Add a title and description first');
      return;
    }

    setSuggesting(true);
    setError('');

    try {
      const response = await fetch('/backend/api/ai/suggest.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title, description })
      });

      const data = await response.json();

      if (response.ok) {
        setCategory(data.category);
        setPriority(data.priority);
        setSuggested(true);
      }
    } catch (err) {
      // Silently ignore, the user can still set category and priority manually
    }

    setSuggesting(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('/backend/api/tickets/create.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title, description, priority, category })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Something went wrong');
        setLoading(false);
        return;
      }

      setSuccess('Ticket submitted');
      setTitle('');
      setDescription('');
      setPriority('medium');
      setCategory('');
      setSuggested(false);

      if (onTicketCreated) {
        onTicketCreated(data.ticket);
      }
    } catch (err) {
      setError('Could not reach the server');
    }

    setLoading(false);
  };

  return (
    <div className="new-ticket">
      <h2>Submit a Ticket</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Short title, for example Cannot connect to VPN"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Describe the issue in detail"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          required
        />

        <button type="button" onClick={handleGetSuggestion} disabled={suggesting}>
          {suggesting ? 'Checking with AI' : 'Get AI Suggestion'}
        </button>

        {suggested && (
          <p className="ai-suggestion-note">
            AI suggested category and priority below. Change them if needed.
          </p>
        )}

        <input
          type="text"
          placeholder="Category, for example Network, Hardware, Access"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>

        {error && <p className="ticket-error">{error}</p>}
        {success && <p className="ticket-success">{success}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting' : 'Submit Ticket'}
        </button>
      </form>
    </div>
  );
}

export default NewTicket;
