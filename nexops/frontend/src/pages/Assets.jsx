import { useState, useEffect } from 'react';

// Admin only page. Lists all assets and lets an admin add new ones or reassign existing ones.

function Assets({ staffList }) {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assetName, setAssetName] = useState('');
  const [assetType, setAssetType] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [error, setError] = useState('');

  const loadAssets = () => {
    fetch('/backend/api/assets/list.php', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        setAssets(data.assets || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/backend/api/assets/create.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          asset_name: assetName,
          asset_type: assetType,
          assigned_to: assignedTo || null
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Could not add asset');
        return;
      }

      setAssetName('');
      setAssetType('');
      setAssignedTo('');
      loadAssets();
    } catch (err) {
      setError('Could not reach the server');
    }
  };

  const handleReassign = async (assetId, newUserId) => {
    await fetch('/backend/api/assets/update.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ id: assetId, assigned_to: newUserId || null })
    });
    loadAssets();
  };

  return (
    <div className="assets-page">
      <h2>Assets</h2>

      <form onSubmit={handleAdd} className="asset-form">
        <input
          type="text"
          placeholder="Asset name, for example Dell Latitude 5420"
          value={assetName}
          onChange={(e) => setAssetName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Asset type, for example Laptop, Router, Monitor"
          value={assetType}
          onChange={(e) => setAssetType(e.target.value)}
        />
        <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
          <option value="">Unassigned</option>
          {staffList.map((staff) => (
            <option key={staff.id} value={staff.id}>{staff.name}</option>
          ))}
        </select>
        <button type="submit">Add Asset</button>
      </form>

      {error && <p className="asset-error">{error}</p>}

      <table className="asset-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Status</th>
            <th>Assigned To</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr><td colSpan="4">Loading assets</td></tr>
          )}
          {!loading && assets.length === 0 && (
            <tr><td colSpan="4">No assets yet</td></tr>
          )}
          {!loading && assets.map((asset) => (
            <tr key={asset.id}>
              <td>{asset.asset_name}</td>
              <td>{asset.asset_type}</td>
              <td>{asset.status}</td>
              <td>
                <select
                  value={asset.assigned_to_id || ''}
                  onChange={(e) => handleReassign(asset.id, e.target.value)}
                >
                  <option value="">Unassigned</option>
                  {staffList.map((staff) => (
                    <option key={staff.id} value={staff.id}>{staff.name}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Assets;
