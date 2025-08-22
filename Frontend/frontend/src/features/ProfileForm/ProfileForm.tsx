import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { profileForm } from "../../shared/config/api";
import "./Profileform.css";

export default function ProfileForm() {
  const [fullName, setfullName] = useState("");
  const [address, setAddress] = useState("");
  const [profession, setProfession] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [skills, setSkills] = useState<string[]>([]);

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();

  if (!fullName || !profession || !specialization || skills.length === 0) {
    alert("Please complete all fields before submitting.");
    return;
  }

  try {
    const res = await profileForm({ fullName, address, profession, specialization, skills });

    if (res.data.user.profileCompleted) {
      localStorage.setItem("currentUser", JSON.stringify(res.data.user));
      alert("Profile saved successfully!");
      navigate("/home");
    } else {
      alert("Please complete all fields.");
    }
  } catch (error) {
    console.error(error);
    alert("Error saving your profile");
  }
};


  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form-box">
        <h1 className="form-title">Set Up Your Profile</h1>
        <input
          className="form-input"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setfullName(e.target.value)}
        />
         <input
          className="form-input"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        
        <input
          className="form-input"
          placeholder="Profession"
          value={profession}
          onChange={(e) => setProfession(e.target.value)}
        />

        <input
          className="form-input"
          placeholder="Specialization"
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
        />

        <input
          className="form-input"
          placeholder="Skills (comma separated)"
          onChange={(e) =>
            setSkills(e.target.value.split(",").map((s) => s.trim()))
          }
        />
         
        <button type="submit" className="form-button">
          Save Details
        </button>
      </form>
    </div>
  );
}
