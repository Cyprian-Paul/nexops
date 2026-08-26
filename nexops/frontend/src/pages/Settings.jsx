import { useState, useEffect } from 'react';

// Lets any logged in user update their own name, email, department, and profile picture,
// and change their password with a show or hide toggle.

function Settings() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [profilePreview, setProfilePreview] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [profileMessage, setProfileMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [uploadingPicture, setUploadingPicture] = useState(false);

  // Replace these two with your actual Cloudinary cloud name and unsigned upload preset,
  // both found in your Cloudinary dashboard after you create a free account.
  const CLOUDINARY_CLOUD_NAME = 'your_cloud_name';
  const CLOUDINARY_UPLOAD_PRESET = 'your_upload_preset';

  useEffect(() => {
    fetch('/backend/api/auth/me.php', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          setName(data.user.name);
          setEmail(data.user.email);
          setDepartment(data.user.department || '');
          setProfilePreview(data.user.profile_picture || '');
        }
      });
  }, []);

  const handlePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfilePreview(URL.createObjectURL(file));
    setUploadingPicture(true);
    setProfileMessage('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );

      const uploadData = await uploadResponse.json();

      if (!uploadData.secure_url) {
        setProfileMessage('Could not upload picture');
        setUploadingPicture(false);
        return;
      }

      // Save the returned Cloudinary URL to the user's profile right away,
      // so a new picture sticks even if the rest of the form isn't saved yet.
      await fetch('/backend/api/auth/update_profile.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ profile_picture: uploadData.secure_url })
      });

      setProfilePreview(uploadData.secure_url);
      setProfileMessage('Profile picture updated');
    } catch (err) {
      setProfileMessage('Could not reach the server');
    }

    setUploadingPicture(false);
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMessage('');

    // Picture upload to storage is a separate small endpoint to add later.
    // For now, only name, email, and department save through this call.
    try {
      const response = await fetch('/backend/api/auth/update_profile.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, department })
      });

      const data = await response.json();

      if (!response.ok) {
        setProfileMessage(data.error || 'Could not update profile');
        setSavingProfile(false);
        return;
      }

      setProfileMessage('Profile updated');
    } catch (err) {
      setProfileMessage('Could not reach the server');
    }

    setSavingProfile(false);
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    setSavingPassword(true);
    setPasswordMessage('');

    try {
      const response = await fetch('/backend/api/auth/change_password.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword })
      });

      const data = await response.json();

      if (!response.ok) {
        setPasswordMessage(data.error || 'Could not update password');
        setSavingPassword(false);
        return;
      }

      setPasswordMessage('Password updated');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setPasswordMessage('Could not reach the server');
    }

    setSavingPassword(false);
  };

  if (!user) {
    return <p>Loading settings</p>;
  }

  return (
    <div className="settings-page">
      <h2>Settings</h2>

      <form onSubmit={handleProfileSave} className="settings-profile">
        <h3>Profile</h3>

        <div className="profile-picture-row">
          {profilePreview ? (
            <img src={profilePreview} alt="Profile" className="profile-picture-preview" />
          ) : (
            <div className="profile-picture-placeholder">{user.name.charAt(0)}</div>
          )}
          <input type="file" accept="image/*" onChange={handlePictureChange} />
          {uploadingPicture && <span className="upload-status">Uploading</span>}
        </div>

        <label>Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Department</label>
        <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} />

        <p className="settings-static">Rank: {user.rank}</p>
        <p className="settings-static">Role: {user.role}</p>

        {profileMessage && <p className="settings-message">{profileMessage}</p>}

        <button type="submit" disabled={savingProfile}>
          {savingProfile ? 'Saving' : 'Save Profile'}
        </button>
      </form>

      <form onSubmit={handlePasswordSave} className="settings-password">
        <h3>Change Password</h3>

        <label>Current Password</label>
        <div className="password-field">
          <input
            type={showCurrentPassword ? 'text' : 'password'}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
          >
            {showCurrentPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        <label>New Password</label>
        <div className="password-field">
          <input
            type={showNewPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        {passwordMessage && <p className="settings-message">{passwordMessage}</p>}

        <button type="submit" disabled={savingPassword}>
          {savingPassword ? 'Saving' : 'Change Password'}
        </button>
      </form>
    </div>
  );
}

export default Settings;
