import { useState } from "react";
import "./experience.css";

interface ExperienceItem {
  _id?: string;
  company: string;
  position: string;
  duration: string;
}

interface ExperienceProps {
  experiences: ExperienceItem[];
  isCurrentUser: boolean;
  onAdd: (exp: ExperienceItem) => Promise<void>;
  onEdit: (id: string, updated: ExperienceItem) => Promise<void>;
}

export default function Experience({
  experiences,
  isCurrentUser,
  onAdd,
  onEdit,
}: ExperienceProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<ExperienceItem>({
    company: "",
    position: "",
    duration: "",
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company || !formData.position || !formData.duration) {
      setError("All fields are required.");
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      if (editId) {
        await onEdit(editId, formData);
        setSuccess("Experience updated successfully!");
      } else {
        await onAdd(formData);
        setSuccess("Experience added successfully!");
      }
      setFormData({ company: "", position: "", duration: "" });
      setEditId(null);
      setShowForm(false);
    } catch (err) {
      console.error("Failed to save experience", err);
      setError("Something went wrong while saving experience.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditClick = (exp: ExperienceItem) => {
    setFormData({ company: exp.company, position: exp.position, duration: exp.duration });
    setEditId(exp._id || null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setFormData({ company: "", position: "", duration: "" });
    setError(null);
    setSuccess(null);
    setEditId(null);
    setShowForm(false);
  };

  return (
    <div className="experience-tab">
      {/* Header */}
      <div className="experience-header">
        <h3>Work Experience</h3>
        {isCurrentUser && !showForm && (
          <button className="add-experience-btn small-btn" onClick={() => setShowForm(true)}>
            + Add Experience
          </button>
        )}
      </div>

      {/* Feedback */}
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      {/* Form */}
      {showForm && (
        <form className="experience-form small-form" onSubmit={handleSave}>
          <input
            className="small-input"
            id="company"
            name="company"
            type="text"
            value={formData.company}
            onChange={handleChange}
            placeholder="Company"
          />
          <input
            className="small-input"
            id="position"
            name="position"
            type="text"
            value={formData.position}
            onChange={handleChange}
            placeholder="Position"
          />
          <input
            className="small-input"
            id="duration"
            name="duration"
            type="text"
            value={formData.duration}
            onChange={handleChange}
            placeholder="Duration"
          />

          <div className="form-buttons">
            <button type="submit" className="submit-btn small-btn" disabled={isSaving}>
              {editId ? "Update" : "Add"}
            </button>
            <button type="button" className="cancel-btn small-btn" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* List */}
      <div className="experience-list">
        {experiences.map((exp) => (
          <div key={exp._id || exp.company} className="experience-item">
            <p>
              <strong>{exp.company}</strong> - {exp.position} ({exp.duration})
            </p>
            {isCurrentUser && (
              <button className="edit-btn" onClick={() => handleEditClick(exp)}>
                ✏️
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
