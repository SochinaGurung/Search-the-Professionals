import { useState, useEffect } from 'react';
import './about.css'; 

interface AboutProps {
  aboutText: string | undefined;
  isCurrentUser: boolean;
  onSave: (newAbout: string) => Promise<void>; // async save function
}

export default function About({ aboutText, isCurrentUser, onSave }: AboutProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newAbout, setNewAbout] = useState(aboutText || '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setNewAbout(aboutText || '');
  }, [aboutText]);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      await onSave(newAbout);
      setIsEditing(false);
    } catch (e) {
      setError('Failed to save changes.');
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="profile-section">
      <div className="about-header">
        <h3>About</h3>
        {isCurrentUser && (
          <button className="edit-btn" onClick={() => setIsEditing(true)}>✏️</button>
        )}
      </div>


      {isEditing ? (
        <>
          <textarea
            value={newAbout}
            onChange={(e) => setNewAbout(e.target.value)}
            rows={5}
            disabled={isSaving}
          />
          <button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button onClick={() => setIsEditing(false)} disabled={isSaving}>
            Cancel
          </button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </>
      ) : (
        <p>{aboutText || 'No information available'}</p>
      )}
    </div>
  );
}