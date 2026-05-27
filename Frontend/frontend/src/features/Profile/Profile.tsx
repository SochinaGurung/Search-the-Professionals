import "./Profile.css";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Experience from "../experience/experience";
import Skills from "../skills/skills";
import About from "../about/about";
import Contact from "../contact/contact";
import { getProfileById, updateProfile, getMessagesByUsers } from '../../shared/config/api';
import type { User } from '../../shared/Interface/User';
import type { AxiosResponse } from 'axios';
import defaultUser from '../../assets/user.png'; 
import Header from "../home/header";
import Footer from "../footer/footer";
import { io } from "socket.io-client";
import { Socket } from "socket.io-client";
import { BACKEND_URL } from '../../shared/config/backend';
import MessagesInbox from './MessagesInbox';


interface ApiResponse {
  user: User;
}

interface ChatMessage {
  from: string;
  text: string;
  createdAt?: string;
}

export default function Profile() {
  const { id: profileUserId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<User | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string>(defaultUser);
  const [isCurrentUser, setIsCurrentUser] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<string>("Overview");
  const [showMessageBox, setShowMessageBox] = useState<boolean>(false);
  const [messageText, setMessageText] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [showMessagesInbox, setShowMessagesInbox] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);

const socket = useRef<Socket | null>(null);


  // Load conversation history and setup socket
  useEffect(() => {
    const currentUserStr = localStorage.getItem('currentUser');
    if (!currentUserStr || !profileUserId) return;
    const currentUser = JSON.parse(currentUserStr);

    // Load existing messages from database (only when viewing someone else's profile)
    if (currentUser.id !== profileUserId) {
      const loadMessages = async () => {
        try {
          const response = await getMessagesByUsers(currentUser.id, profileUserId!);
          const loadedMessages = response.data.map((msg: any) => ({
            from: msg.from,
            text: msg.text,
            createdAt: msg.createdAt
          }));
          setMessages(loadedMessages);
        } catch (error) {
          console.error('Failed to load messages:', error);
        }
      };
      loadMessages();
    }

    // Setup socket connection
    socket.current = io(BACKEND_URL);
    socket.current.emit("join", currentUser.id);

    socket.current.on("getMessage", (data: ChatMessage) => {
      // If message is from someone else (not the current user), increment unread count
      if (data.from !== currentUser.id && !showMessagesInbox) {
        setUnreadCount(prev => prev + 1);
      }
      
      // Show all messages in this conversation (from either the profile user or current user)
      // This ensures both sent and received messages are displayed
      if (data.from === profileUserId || data.from === currentUser.id) {
        setMessages(prev => {
          // Avoid duplicates - check if message already exists
          const exists = prev.some(msg => 
            msg.text === data.text && 
            msg.from === data.from &&
            Math.abs(new Date(msg.createdAt || '').getTime() - new Date(data.createdAt || '').getTime()) < 1000
          );
          if (exists) return prev;
          return [...prev, data];
        });
      }
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [profileUserId]);

  // Fetch profile data
  useEffect(() => {
    if (!profileUserId) return;

    setLoading(true);
    getProfileById(profileUserId)
      .then((res: AxiosResponse<ApiResponse>) => {
        const user = res.data.user;
        setUserData(user);
        setProfileImageUrl(user.profilePicture?.url ?? defaultUser);
      })
      .catch((error) => console.error('Failed to fetch profile:', error))
      .finally(() => setLoading(false));
  }, [profileUserId]);

  // Determine if current user is viewing their own profile
  useEffect(() => {
    const currentUserStr = localStorage.getItem('currentUser');
    if (!currentUserStr || !profileUserId) return;
    const currentUser = JSON.parse(currentUserStr);
    setIsCurrentUser(currentUser.id === profileUserId);
  }, [profileUserId]);

  // --- Chat: Send message ---
  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    const currentUserStr = localStorage.getItem('currentUser');
    if (!currentUserStr) return;
    const currentUser = JSON.parse(currentUserStr);

    // Send via socket.io
    if (!socket.current) return;
    socket.current.emit("sendMessage", {
      senderId: currentUser.id,
      receiverId: profileUserId,
      text: messageText,
    });

    
    setMessages(prev => [...prev, { from: currentUser.id, text: messageText, createdAt: new Date().toISOString() }]);
    setMessageText("");
  };

  if (loading) return <p className="loading">Loading profile...</p>;
  if (!userData) return <p className="error">Profile not found.</p>;

  // Get current user ID for messages inbox
  const currentUserStr = localStorage.getItem('currentUser');
  const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;

  return (
    <>
      <Header />
      {showMessagesInbox && currentUser && (
        <MessagesInbox 
          onClose={() => {
            setShowMessagesInbox(false);
            setUnreadCount(0);
          }} 
          currentUserId={currentUser.id}
        />
      )}
      <div className="profile-page">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="cover-photo-section">
            {isCurrentUser && (
              <button className="change-cover-btn">
                📷 Change Cover
              </button>
            )}
          </div>
          
          <div className="profile-header-content">
            <div className="profile-picture-section">
              <div className="profile-picture-wrapper">
                <img
                  src={profileImageUrl || defaultUser}
                  alt="Profile"
                  className="profile-picture-large"
                  onError={(e) => (e.currentTarget.src = defaultUser)}
                />
                {isCurrentUser && (
                  <div className="profile-picture-edit">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setSelectedFile(e.target.files[0]);
                          setProfileImageUrl(URL.createObjectURL(e.target.files[0]));
                        }
                      }}
                      style={{ display: "none" }}
                      id="profile-upload"
                    />
                    <label htmlFor="profile-upload" className="edit-icon">+</label>
                    {selectedFile && (
                      <button
                        className="upload-confirm-btn"
                        onClick={async () => {
                          if (!selectedFile) return alert("Select a file first!");
                          setUploading(true);
                          const token = localStorage.getItem("token");
                          const formData = new FormData();
                          formData.append("profilePicture", selectedFile);

                          try {
                            const res = await fetch(`${BACKEND_URL}/api/user/uploadProfilePic`, {
                              method: "PATCH",
                              headers: { Authorization: `Bearer ${token}` },
                              body: formData,
                            });
                            const data = await res.json();
                            if (data.success) {
                              alert("Profile picture updated!");
                              setProfileImageUrl(data.profilePicture.url);
                              setUserData(prev => prev ? { ...prev, profilePicture: data.profilePicture } : null);
                              setSelectedFile(null);
                            } else {
                              alert("Upload failed: " + data.message);
                            }
                          } catch (err) { console.error(err); }
                          finally { setUploading(false); }
                        }}
                        disabled={uploading}
                      >
                        {uploading ? "Uploading..." : "Upload"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="profile-info-section">
              <h1 className="profile-name">{userData.fullName || "No Name"}</h1>
              <p className="profile-roles">
                {userData.profession || "No Profession"} {userData.specialization && `• ${userData.specialization}`}
              </p>
              <p className="profile-location">
                📍 {userData.address || "Unknown Location"}
              </p>
            </div>

            <div className="profile-actions">
              {!isCurrentUser ? (
                <button className="action-btn connect-btn">Connect</button>
              ) : (
                <button className="action-btn edit-profile-btn" onClick={() => navigate('/profileForm')}>Edit Profile</button>
              )}
              {!isCurrentUser ? (
                <button 
                  className="action-btn message-btn"
                  onClick={() => setShowMessageBox(prev => !prev)}
                >
                  Message
                </button>
              ) : (
                <button 
                  className="action-btn message-btn"
                  onClick={() => {
                    setUnreadCount(0);
                    setShowMessagesInbox(true);
                  }}
                >
                  Messages
                  {unreadCount > 0 && <span className="action-btn-badge">{unreadCount}</span>}
                </button>
              )}
            </div>
          </div>

          {/* Profile Tabs */}
          <div className="profile-tabs">
            {["Overview", "Experience", "Skills", "Contact"].map(tab => (
              <button
                key={tab}
                className={`profile-tab ${selectedTab === tab ? "active" : ""}`}
                onClick={() => setSelectedTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="profile-content">
          <div className="profile-left-column">
            {selectedTab === "Overview" && (
              <div className="content-card">
                <About
                  aboutText={userData.about}
                  isCurrentUser={isCurrentUser}
                  onSave={async (newAbout) => {
                    await updateProfile(profileUserId!, { about: newAbout });
                    setUserData(prev => prev ? { ...prev, about: newAbout } : null);
                  }}
                />
              </div>
            )}

            {selectedTab === "Experience" && (
              <div className="content-card">
                <Experience
                  experiences={userData.experience || []}
                  isCurrentUser={isCurrentUser}
                  onAdd={async (newExp) => {
                    const updatedList = [...(userData.experience || []), newExp];
                    await updateProfile(profileUserId!, { experience: updatedList });
                    setUserData(prev => prev ? { ...prev, experience: updatedList } : null);
                  }}
                  onEdit={async (id, updatedExp) => {
                    const updatedList = (userData.experience || []).map((exp) =>
                      exp._id === id ? { ...exp, ...updatedExp } : exp
                    );
                    await updateProfile(profileUserId!, { experience: updatedList });
                    setUserData(prev => prev ? { ...prev, experience: updatedList } : null);
                  }}
                />
              </div>
            )}

            {selectedTab === "Skills" && (
              <div className="content-card">
                <Skills
                  skills={userData.skills || []}
                  isCurrentUser={isCurrentUser}
                  onAddSkill={async (skill) => {
                    const updatedSkills = [...(userData.skills || []), skill];
                    await updateProfile(profileUserId!, { skills: updatedSkills });
                    setUserData(prev => prev ? { ...prev, skills: updatedSkills } : null);
                  }}
                  onDeleteSkill={async (skill) => {
                    const updatedSkills = (userData.skills || []).filter(s => s !== skill);
                    await updateProfile(profileUserId!, { skills: updatedSkills });
                    setUserData(prev => prev ? { ...prev, skills: updatedSkills } : null);
                  }}
                />
              </div>
            )}

            {selectedTab === "Contact" && (
              <div className="content-card">
                <Contact
                  email={userData.email}
                  contact={userData.contact}
                  linkedIn={userData.linkedIn}
                  instagram={userData.instagram}
                  isCurrentUser={isCurrentUser}
                  onSave={async (data) => {
                    await updateProfile(profileUserId!, data);
                    setUserData(prev => prev ? { ...prev, ...data } : null);
                  }}
                />
              </div>
            )}
          </div>

          <div className="profile-right-column">
            {selectedTab === "Overview" && (
              <>
                <div className="content-card">
                  <Skills
                    skills={userData.skills || []}
                    isCurrentUser={isCurrentUser}
                    onAddSkill={async (skill) => {
                      const updatedSkills = [...(userData.skills || []), skill];
                      await updateProfile(profileUserId!, { skills: updatedSkills });
                      setUserData(prev => prev ? { ...prev, skills: updatedSkills } : null);
                    }}
                    onDeleteSkill={async (skill) => {
                      const updatedSkills = (userData.skills || []).filter(s => s !== skill);
                      await updateProfile(profileUserId!, { skills: updatedSkills });
                      setUserData(prev => prev ? { ...prev, skills: updatedSkills } : null);
                    }}
                  />
                </div>
                <div className="content-card">
                  <Contact
                    email={userData.email}
                    contact={userData.contact}
                    linkedIn={userData.linkedIn}
                    instagram={userData.instagram}
                    isCurrentUser={isCurrentUser}
                    onSave={async (data) => {
                      await updateProfile(profileUserId!, data);
                      setUserData(prev => prev ? { ...prev, ...data } : null);
                    }}
                  />
                </div>
              </>
            )}

            {selectedTab === "Experience" && (
              <div className="content-card">
                <Skills
                  skills={userData.skills || []}
                  isCurrentUser={isCurrentUser}
                  onAddSkill={async (skill) => {
                    const updatedSkills = [...(userData.skills || []), skill];
                    await updateProfile(profileUserId!, { skills: updatedSkills });
                    setUserData(prev => prev ? { ...prev, skills: updatedSkills } : null);
                  }}
                  onDeleteSkill={async (skill) => {
                    const updatedSkills = (userData.skills || []).filter(s => s !== skill);
                    await updateProfile(profileUserId!, { skills: updatedSkills });
                    setUserData(prev => prev ? { ...prev, skills: updatedSkills } : null);
                  }}
                />
              </div>
            )}

            {selectedTab === "Skills" && (
              <div className="content-card">
                <Contact
                  email={userData.email}
                  contact={userData.contact}
                  linkedIn={userData.linkedIn}
                  instagram={userData.instagram}
                  isCurrentUser={isCurrentUser}
                  onSave={async (data) => {
                    await updateProfile(profileUserId!, data);
                    setUserData(prev => prev ? { ...prev, ...data } : null);
                  }}
                />
              </div>
            )}

            {selectedTab === "Contact" && (
              <div className="content-card">
                <Skills
                  skills={userData.skills || []}
                  isCurrentUser={isCurrentUser}
                  onAddSkill={async (skill) => {
                    const updatedSkills = [...(userData.skills || []), skill];
                    await updateProfile(profileUserId!, { skills: updatedSkills });
                    setUserData(prev => prev ? { ...prev, skills: updatedSkills } : null);
                  }}
                  onDeleteSkill={async (skill) => {
                    const updatedSkills = (userData.skills || []).filter(s => s !== skill);
                    await updateProfile(profileUserId!, { skills: updatedSkills });
                    setUserData(prev => prev ? { ...prev, skills: updatedSkills } : null);
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Floating Message Box */}
        {showMessageBox && !isCurrentUser && (
          <div className="floating-message-box">
            <div className="message-box-header">
              <span>Messaging</span>
              <button onClick={() => setShowMessageBox(false)}>×</button>
            </div>
            <div className="message-box-content">
              {messages.map((msg, i) => (
                <div key={i} className={`message-item ${msg.from === currentUser?.id ? 'sent' : 'received'}`}>
                  <div className="message-avatar">
                    {msg.from === currentUser?.id ? (currentUser?.username?.charAt(0).toUpperCase() || 'U') : (userData.username?.charAt(0).toUpperCase() || 'U')}
                  </div>
                  <div className="message-text-wrapper">
                    <div className="message-text">{msg.text}</div>
                    <div className="message-time">{new Date(msg.createdAt || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="message-box-input">
              <input
                type="text"
                placeholder="Type a message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
              />
              <button onClick={handleSendMessage}>→</button>
            </div>
          </div>
        )}

      </div>
      <Footer />
    </>
  );
}
