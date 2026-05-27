import { useState, useEffect } from 'react';
import './about.css'; 

interface AboutProps {
  aboutText: string | undefined;
  isCurrentUser: boolean;
  onSave: (newAbout: string) => Promise<void>; // async save function
}

export default function About({ aboutText, isCurrentUser, onSave }: AboutProps) {
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
      </div>

      {isCurrentUser ? (
        <>
          <textarea
            value={newAbout}
            onChange={(e) => setNewAbout(e.target.value)}
            rows={5}
            disabled={isSaving}
            placeholder="Tell us about yourself..."
            className="about-textarea"
          />
          <div className="about-actions">
            <button onClick={handleSave} disabled={isSaving} className="save-btn">
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            {error && <p className="error-message">{error}</p>}
          </div>
        </>
      ) : (
        <p>{aboutText || 'No information available'}</p>
      )}
    </div>
  );
}