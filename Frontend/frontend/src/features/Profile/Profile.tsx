import "./Profile.css";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Experience from "../experience/experience";
import Skills from "../skills/skills";
import About from "../about/about";
import { getProfileById, updateProfile } from '../../shared/config/api';
import type { User } from '../../shared/Interface/User';
import type { AxiosResponse } from 'axios';
import defaultUser from '../../assets/user.png'; // default profile image

interface ApiResponse {
  user: User;
}

export default function Profile() {
  const { id: profileUserId } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<User | null>(null);
  const [isCurrentUser, setIsCurrentUser] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<string>("Overview");

  const navigate = useNavigate();

  // Fetch profile user
  useEffect(() => {
    if (!profileUserId) return;
    setLoading(true);

    getProfileById(profileUserId)
      .then((res: AxiosResponse<ApiResponse>) => {
        setUserData(res.data.user);
      })
      .catch((error) => console.error('Failed to fetch profile:', error))
      .finally(() => setLoading(false));
  }, [profileUserId]);

  useEffect(() => {
    const currentUserStr = localStorage.getItem('currentUser');
    if (!currentUserStr || !profileUserId) return;
    const currentUser = JSON.parse(currentUserStr);
    setIsCurrentUser(currentUser.id === profileUserId);
  }, [profileUserId]);

  if (loading) return <p className="loading">Loading profile...</p>;
  if (!userData) return <p className="error">Profile not found.</p>;

  // Helper function to update profile field in DB + UI
  const handleUpdateProfile = async (field: keyof User, value: any) => {
  if (!profileUserId || !isCurrentUser) return; // prevent editing if not owner
  try {
    await updateProfile(profileUserId, { [field]: value });
    setUserData(prev => prev ? { ...prev, [field]: value } : null);
  } catch (err) {
    console.error(`Failed to update ${field}:`, err);
  }
};

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-card">
        <div className="cover-photo">
          <img
            src={defaultUser}
            width="150px"
            alt="Profile"
            className="profile-img"
          />
          <div className="user-info">
            <h2>{userData.fullName || "No Name"}</h2>
            <p>{userData.profession || "No Profession"}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="tab-bar">
          {["Overview", "Experience", "Skills", "Contact"].map(tab => (
            <button
              key={tab}
              className={`tab ${selectedTab === tab ? "active" : ""}`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="profile-section">
        {/* Overview / About */}
        {selectedTab === "Overview" && (
          <About
            aboutText={userData.about}
            isCurrentUser={isCurrentUser}
            onSave={async (newAbout) => {
              await handleUpdateProfile("about", newAbout);
            }}
          />
        )}

       {/* Experience */}
      {selectedTab === "Experience" && (
        <div className="experience-tab">
          <Experience
            experiences={userData.experience || []}
            isCurrentUser={isCurrentUser}
            onAdd={async (newExp) => {
              // Add new experience to the list
              const updatedList = [...(userData.experience || []), newExp];
              await handleUpdateProfile("experience", updatedList);
            }}
            onEdit={async (id, updatedExp) => {
              // Edit an existing experience
              const updatedList = (userData.experience || []).map((exp) =>
                exp._id === id ? { ...exp, ...updatedExp } : exp
              );
              await handleUpdateProfile("experience", updatedList);
            }}
          />
        </div>
      )}


        {/* Skills */}
        {selectedTab === "Skills" && (
          <Skills
            skills={userData.skills || []}
            isCurrentUser={isCurrentUser}
            onAddSkill={async (skill) => {
              const updatedSkills = [...(userData.skills || []), skill];
              await handleUpdateProfile("skills", updatedSkills);
            }}
            onDeleteSkill={async (skill) => {
              const updatedSkills = (userData.skills || []).filter(s => s !== skill);
              await handleUpdateProfile("skills", updatedSkills);
            }}
          />
        )}

        {/* Contact */}
        {selectedTab === "Contact" && (
          <div>
            <h3>Contact</h3>
            <p>📧 {userData.email || "example@email.com"}</p>
            <p>📞 +977-9800000000</p>
          </div>
        )}
      </div>
    </div>
  );
}
