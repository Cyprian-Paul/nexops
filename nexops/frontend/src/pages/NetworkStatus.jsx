import { useState, useEffect } from 'react';

// Admin only page. Shows every monitored device and its last known status.
// The Check Now button triggers a live ping check on every device.

function NetworkStatus() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [deviceName, setDeviceName] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [deviceType, setDeviceType] = useState('');
  const [error, setError] = useState('');

  const loadDevices = () => {
    fetch('/backend/api/network/list.php', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        setDevices(data.devices || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadDevices();
  }, []);

  const handleAddDevice = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/backend/api/network/add.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ device_name: deviceName, ip_address: ipAddress, device_type: deviceType })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Could not add device');
        return;
      }

      setDeviceName('');
      setIpAddress('');
      setDeviceType('');
      loadDevices();
    } catch (err) {
      setError('Could not reach the server');
    }
  };

  const handleCheckNow = async () => {
    setChecking(true);
    await fetch('/backend/api/network/check.php', {
      method: 'POST',
      credentials: 'include'
    });
    loadDevices();
    setChecking(false);
  };

  return (
    <div className="network-page">
      <h2>Network Monitoring</h2>

      <button onClick={handleCheckNow} disabled={checking}>
        {checking ? 'Checking' : 'Check Now'}
      </button>

      <form onSubmit={handleAddDevice} className="device-form">
        <input
          type="text"
          placeholder="Device name, for example Office Router"
          value={deviceName}
          onChange={(e) => setDeviceName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="IP address, for example 192.168.1.1"
          value={ipAddress}
          onChange={(e) => setIpAddress(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Device type, for example Router, Switch, Camera"
          value={deviceType}
          onChange={(e) => setDeviceType(e.target.value)}
        />
        <button type="submit">Add Device</button>
      </form>

      {error && <p className="network-error">{error}</p>}

      <table className="network-table">
        <thead>
          <tr>
            <th>Device</th>
            <th>IP Address</th>
            <th>Type</th>
            <th>Status</th>
            <th>Last Checked</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr><td colSpan="5">Loading devices</td></tr>
          )}
          {!loading && devices.length === 0 && (
            <tr><td colSpan="5">No devices added yet</td></tr>
          )}
          {!loading && devices.map((device) => (
            <tr key={device.id}>
              <td>{device.device_name}</td>
              <td>{device.ip_address}</td>
              <td>{device.device_type}</td>
              <td className={`status-${device.last_status}`}>{device.last_status}</td>
              <td>{device.last_checked || 'Never'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default NetworkStatus;
