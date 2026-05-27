import { useState, useEffect, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { profileForm, getProfileById } from "../../shared/config/api";
import "./Profileform.css";

export default function ProfileForm() {
  const [fullName, setfullName] = useState("");
  const [address, setAddress] = useState("");
  const [profession, setProfession] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [contact, setContact] = useState("");
  const [linkedIn, setLinkedIn] = useState("");
  const [instagram, setInstagram] = useState("");
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();

  // Pre-fill form when user has an existing profile (e.g. from Edit Profile)
  useEffect(() => {
    const loadExistingProfile = async () => {
      const currentUserStr = localStorage.getItem("currentUser");
      if (!currentUserStr) {
        setLoading(false);
        return;
      }
      try {
        const currentUser = JSON.parse(currentUserStr);
        const userId = currentUser?.id || currentUser?._id;
        if (!userId) {
          setLoading(false);
          return;
        }
        const res = await getProfileById(userId);
        const user = res.data?.user;
        if (user) {
          setfullName(user.fullName || "");
          setAddress(user.address || "");
          setProfession(user.profession || "");
          setSpecialization(user.specialization || "");
          setSkills(Array.isArray(user.skills) ? user.skills : []);
          setContact(user.contact || "");
          setLinkedIn(user.linkedIn || "");
          setInstagram(user.instagram || "");
          setIsEditMode(true);
        }
      } catch {
        // No existing profile or fetch failed
      } finally {
        setLoading(false);
      }
    };
    loadExistingProfile();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();

  if (!fullName || !profession || !contact || !specialization || skills.length === 0) {
    alert("Please complete all fields before submitting.");
    return;
  }

  try {
    const res = await profileForm({ fullName, address, profession, specialization, skills, contact, linkedIn, instagram });

    if (res.data.user.profileCompleted) {
      localStorage.setItem("currentUser", JSON.stringify(res.data.user));
      alert("Profile saved successfully!");
      const user = res.data.user;
      const userId = user?._id || user?.id;
      navigate(userId ? `/profile/${userId}` : "/home");
    } else {
      alert("Please complete all fields.");
    }
  } catch (error) {
    console.error(error);
    alert("Error saving your profile");
  }
};


  if (loading) {
    return (
      <div className="form-container">
        <div className="form-box" style={{ textAlign: "center", padding: "3rem" }}>
          Loading your profile...
        </div>
      </div>
    );
  }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form-box">
        <h1 className="form-title">{isEditMode ? "Edit Your Profile" : "Set Up Your Profile"}</h1>
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
          placeholder="Contact"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
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
          value={Array.isArray(skills) ? skills.join(", ") : ""}
          onChange={(e) =>
            setSkills(e.target.value.split(",").map((s) => s.trim()).filter(Boolean))
          }
        />
        
        <input
          className="form-input"
          placeholder="LinkedIn URL (optional)"
          value={linkedIn}
          onChange={(e) => setLinkedIn(e.target.value)}
        />
        
        <input
          className="form-input"
          placeholder="Instagram URL (optional)"
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
        />
         
        <button type="submit" className="form-button">
          Save Details
        </button>
      </form>
    </div>
  );
}
