import { useState, useEffect } from 'react';
import './contact.css';
import linkedinIcon from '../../assets/linkedin-icon.png';

interface ContactProps {
  email: string | undefined;
  contact: string | undefined;
  linkedIn: string | undefined;
  instagram: string | undefined;
  isCurrentUser: boolean;
  onSave: (data: { linkedIn: string; instagram: string }) => Promise<void>;
}

export default function Contact({ email, contact, linkedIn, instagram, isCurrentUser, onSave }: ContactProps) {
  const [newLinkedIn, setNewLinkedIn] = useState(linkedIn || '');
  const [newInstagram, setNewInstagram] = useState(instagram || '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setNewLinkedIn(linkedIn || '');
    setNewInstagram(instagram || '');
  }, [linkedIn, instagram]);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      await onSave({ linkedIn: newLinkedIn, instagram: newInstagram });
    } catch (e) {
      setError('Failed to save changes.');
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  // Helper function to format URLs
  const formatUrl = (url: string) => {
    if (!url) return '';
    // If it doesn't start with http:// or https://, add https://
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  };

  return (
    <div className="contact-section">
      <div className="contact-header">
        <h3>Contact Info</h3>
      </div>

      <div className="contact-info">
        <p>📧 {email || "example@email.com"}</p>
        <p>📞 {contact || "+977-9800000000"}</p>
      </div>

      {isCurrentUser ? (
        <div className="contact-edit-form">
          <div className="form-group">
            <label htmlFor="linkedin">LinkedIn URL:</label>
            <input
              id="linkedin"
              type="text"
              value={newLinkedIn}
              onChange={(e) => setNewLinkedIn(e.target.value)}
              placeholder="linkedin.com/in/yourprofile"
              disabled={isSaving}
              className="contact-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="instagram">Instagram URL:</label>
            <input
              id="instagram"
              type="text"
              value={newInstagram}
              onChange={(e) => setNewInstagram(e.target.value)}
              placeholder="instagram.com/yourprofile"
              disabled={isSaving}
              className="contact-input"
            />
          </div>
          <div className="form-actions">
            <button onClick={handleSave} disabled={isSaving} className="save-btn">
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
          {error && <p className="error-message">{error}</p>}
        </div>
      ) : (
        <div className="icon">
          {linkedIn && (
            <a href={formatUrl(linkedIn)} className="social-icon" target="_blank" rel="noopener noreferrer">
              <img src={linkedinIcon} alt="LinkedIn" onError={(e) => {
                e.currentTarget.style.display = 'none';
              }} />
            </a>
          )}
          {instagram && (
            <a href={formatUrl(instagram)} className="social-icon social-link-text" target="_blank" rel="noopener noreferrer">
              <span className="instagram-text">📷 Instagram</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
}
