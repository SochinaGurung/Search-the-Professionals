import React, { useState } from "react";
import './skills.css';

interface SkillsProps {
  skills?: string[];
  isCurrentUser: boolean;
  onAddSkill: (skill: string) => Promise<void>;
  onDeleteSkill: (skill: string) => Promise<void>;
}

export default function Skills({ skills = [], isCurrentUser, onAddSkill, onDeleteSkill }: SkillsProps) {
  const [adding, setAdding] = useState(false);
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
      setAdding(false);
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
        {isCurrentUser && !adding && !editingSkill && (
          <button className="add-skill-btn" onClick={() => setAdding(true)}>+</button>
        )}
      </div>

      {adding && (
        <div className="add-skill-form">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Enter skill"
            disabled={loading}
          />
          <button onClick={handleAddSkill} disabled={loading}>Save</button>
          <button onClick={() => setAdding(false)} disabled={loading}>Cancel</button>
          {error && <p className="error">{error}</p>}
        </div>
      )}

      {skills.length > 0 && (
        <ul className="skills-list">
          {skills.map((skill) => (
            <li key={skill}>
              {skill}
              {isCurrentUser && (
                <>
                  {!editingSkill && <button onClick={() => setEditingSkill(skill)}>✏️</button>}
                  {editingSkill === skill && (
                    <>
                      <button onClick={() => setConfirmDeleteSkill(skill)}>Delete</button>
                      <button onClick={() => setEditingSkill(null)}>Cancel</button>
                    </>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Confirmation popup */}
      {confirmDeleteSkill && (
        <div className="popup">
          <p>Do you want to delete skill "{confirmDeleteSkill}"?</p>
          <button onClick={() => setConfirmDeleteSkill(null)}>Not now</button>
          <button onClick={() => handleDeleteSkill(confirmDeleteSkill)}>Delete</button>
        </div>
      )}
    </div>
  );
}