import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./homepage.css";
import type { AxiosResponse } from "axios";
import { getUserSearchApi, getUserListApi } from "../../shared/config/api";

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
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [userList, setUserList] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetches 4 users on the page
  useEffect(() => {
    setLoading(true);
    getUserListApi()
      .then((res: AxiosResponse<UserListResponse>) => {
        setUserList(res.data.users.slice(0, 4));
        setError(null);
      })
      .catch((err) => {
        setError("Failed to fetch users.");
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  // Search with debounce
  useEffect(() => {
    if (search.trim() === "") return;

    const delayDebounce = setTimeout(() => {
      setLoading(true);
      getUserSearchApi(search)
        .then((res: AxiosResponse<UserListResponse>) => {
          if (res.data.users.length === 0) {
            setError("User does not exist.");
            setUserList([]);
          } else {
            setUserList(res.data.users);
            setError(null);
          }
        })
        .catch((err) => {
          setError("Failed to fetch users.");
          console.error(err);
        })
        .finally(() => setLoading(false));
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!search.trim()) return;

    setLoading(true);
    getUserSearchApi(search)
      .then((res: AxiosResponse<UserListResponse>) => {
        if (res.data.users.length === 0) {
          setError("User does not exist.");
          setUserList([]);
        } else {
          setUserList(res.data.users);
          setError(null);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Search the Professionals</h1>
        <p>You have successfully logged in.</p>

        {/* Search Form */}
        <form className="search-bar-wrapper" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="🔍 Search professionals..."
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

        {/* Error Message */}
        {error && <p className="error-message">{error}</p>}

        {/* Users Grid */}
        {!error && (
          <>
            <h2>Registered Professionals</h2>
            <div className="profiles-grid">
              {userList.map((user: User) => (
                <div
                  key={user._id}
                  className="profile-card"
                  onClick={() => navigate(`/profile/${user._id}`)}
                >
                  <p>
                    <strong>Username:</strong> {user.username}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
