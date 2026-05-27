import { useState } from "react";
import './skills.css';

interface SkillsProps {
  skills?: string[];
  isCurrentUser: boolean;
  onAddSkill: (skill: string) => Promise<void>;
  onDeleteSkill: (skill: string) => Promise<void>;
}

export default function Skills({ skills = [], isCurrentUser, onAddSkill, onDeleteSkill }: SkillsProps) {
  const [newSkill, setNewSkill] = useState("");
  const [editingSkill, setEditingSkill] = useState<string | null>(null);
  const [confirmDeleteSkill, setConfirmDeleteSkill] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAddSkill = async () => {
    if (!newSkill.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await onAddSkill(newSkill.trim());
      setNewSkill("");
    } catch (e) {
      setError("Failed to add skill");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSkill = async (skill: string) => {
    setLoading(true);
    setError(null);
    try {
      await onDeleteSkill(skill);
      setConfirmDeleteSkill(null);
      if (editingSkill === skill) setEditingSkill(null);
    } catch (e) {
      setError("Failed to delete skill");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-section">
      <div className="skills-header">
        <h3>Skills</h3>
      </div>

      {isCurrentUser && (
        <div className="add-skill-form">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Add a skill..."
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddSkill();
              }
            }}
          />
          <button onClick={handleAddSkill} disabled={loading || !newSkill.trim()}>
            Add
          </button>
          {error && <p className="error">{error}</p>}
        </div>
      )}

      {skills.length > 0 ? (
        <ul className="skills-list">
          {skills.map((skill) => (
            <li key={skill} className="skill-item">
              <span>{skill}</span>
              {isCurrentUser && (
                <button 
                  className="delete-skill-btn"
                  onClick={() => setConfirmDeleteSkill(skill)}
                  title="Delete skill"
                >
                  ×
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        isCurrentUser && <p className="no-skills">Add your skills above</p>
      )}

      {/* Confirmation popup */}
      {confirmDeleteSkill && (
        <div className="popup-overlay" onClick={() => setConfirmDeleteSkill(null)}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <p>Delete skill "{confirmDeleteSkill}"?</p>
            <div className="popup-buttons">
              <button onClick={() => setConfirmDeleteSkill(null)}>Cancel</button>
              <button onClick={() => handleDeleteSkill(confirmDeleteSkill)} className="delete-btn">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}