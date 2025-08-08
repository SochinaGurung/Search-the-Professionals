import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./homepage.css";
import type { AxiosResponse } from 'axios';
import { getUserSearchApi } from '../../shared/config/api';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

interface User {
  _id: string;
  username: string;
  email: string;
}

interface UserListResponse {
  users: User[];
}

export default function Home() {
  const navigate = useNavigate();
  const userData = localStorage.getItem("currentUser");
  const username = userData ? JSON.parse(userData).username : "User";

  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [userList, setUserList] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search.trim() !== "") {
        setLoading(true);
        getUserSearchApi(search)
          .then((res: AxiosResponse<UserListResponse>) => {
            setUserList(res.data.users);
            setError(null);
          })
          .catch((err) => {
            setError("Failed to fetch users.");
            console.error(err);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setUserList([]); // Clear list when search is empty
      }
    }, 500); // debounce delay

    return () => clearTimeout(delayDebounce);
  }, [search]);

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearch(search);
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  const goToProfile = (username: string) => {
    navigate(`/profile/${username}`);
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Welcome, {username}</h1>
        <p>You have successfully logged in.</p>

        <form className="search-bar-wrapper" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search"
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

        {loading ? (
          <p>Loading users...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <div className="profiles-grid">
            {userList.length > 0 ? (
              userList.map((user: User) => (
                <div key={user._id} className="profile-card">
                  <p>
                    <strong>Username:</strong>{' '}
                    <span
                      className="clickable-username"
                      onClick={() => goToProfile(user.username)}
                    >
                      {user.username}
                    </span>
                  </p>
                  <p><strong>Email:</strong> {user.email}</p>
                </div>
              ))
            ) : (
              <p>No users found.</p>
            )}
          </div>
        )}

        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
