import { useState, type ChangeEvent, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import './Profileform.css';

interface Experience {
  role: string;
  company: string;
  period: string;
}

export default function ProfileForm() {
  const { username: paramUsername } = useParams();
  const navigate = useNavigate();

  const [username, setUsername] = useState(paramUsername || "");
  const [connections, setConnections] = useState(245);
  const [about, setAbout] = useState(
    "Dedicated to advancing in tech industry through meaningful contributions to innovative projects and forward-thinking teams. Committed to refining technical expertise and eager to learn and embrace new challenges, and consistently delivering high-quality solutions that support organizational growth and technological advancement"
  );

  const [experience, setExperience] = useState<Experience[]>([
    { role: "UX/UI Designer", company: "JyotiTech", period: "2012 – 2014" },
    { role: "SEO Intern", company: "TechHub", period: "2017 - 2019" },
    { role: "Front-End Developer", company: "TechnoLab", period: "2020 – 2023" },
    { role: "Front-End Developer", company: "OfficeTech", period: "2023 – present" },
  ]);

  const [skills, setSkills] = useState([
    "HTML/CSS",
    "Java",
    "React.js",
    "Python",
    "JavaScript",
    "Wireframing",
    "Database Management",
  ]);

  // Handlers for inputs

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleConnectionsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (!isNaN(val)) setConnections(val);
  };

  const handleAboutChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setAbout(e.target.value);
  };

  // Experience handlers

  const handleExperienceChange = (
    index: number,
    field: keyof Experience,
    value: string
  ) => {
    const newExp = [...experience];
    newExp[index] = { ...newExp[index], [field]: value };
    setExperience(newExp);
  };

  const addExperience = () => {
    setExperience([...experience, { role: "", company: "", period: "" }]);
  };

  const removeExperience = (index: number) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  // Skills handlers

  const handleSkillChange = (index: number, value: string) => {
    const newSkills = [...skills];
    newSkills[index] = value;
    setSkills(newSkills);
  };

  const addSkill = () => {
    setSkills([...skills, ""]);
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Here you can handle saving the profile data, e.g. send to backend or update context/state

    alert("Profile updated successfully!");
    // Redirect back to profile view
    navigate(`/profile/${username}`);
  };

  return (
    <div className="profile-form-container">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        {/* Username */}
        <label>
          Username:
          <input type="text" value={username} onChange={handleUsernameChange} />
        </label>

        {/* Connections */}
        <label>
          Connections:
          <input
            type="number"
            value={connections}
            onChange={handleConnectionsChange}
            min={0}
          />
        </label>

        {/* About */}
        <label>
          About:
          <textarea value={about} onChange={handleAboutChange} rows={5} />
        </label>

        {/* Experience */}
        <fieldset>
          <legend>Experience</legend>
          {experience.map((exp, idx) => (
            <div key={idx} className="experience-item">
              <input
                type="text"
                placeholder="Role"
                value={exp.role}
                onChange={(e) => handleExperienceChange(idx, "role", e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Company"
                value={exp.company}
                onChange={(e) => handleExperienceChange(idx, "company", e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Period"
                value={exp.period}
                onChange={(e) => handleExperienceChange(idx, "period", e.target.value)}
                required
              />
              <button type="button" onClick={() => removeExperience(idx)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addExperience}>
            Add Experience
          </button>
        </fieldset>

        {/* Skills */}
        <fieldset>
          <legend>Skills</legend>
          {skills.map((skill, idx) => (
            <div key={idx} className="skill-item">
              <input
                type="text"
                value={skill}
                onChange={(e) => handleSkillChange(idx, e.target.value)}
                required
              />
              <button type="button" onClick={() => removeSkill(idx)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addSkill}>
            Add Skill
          </button>
        </fieldset>

        <button type="submit" className="submit-btn">
          Save Profile
        </button>
      </form>
    </div>
  );
}
