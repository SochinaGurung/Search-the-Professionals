import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./homepage.css";
import Footer from "../footer/footer";
import type { AxiosResponse } from "axios";
import { getUserSearchApi, getUserListApi } from "../../shared/config/api";

interface User {
  _id: string;
  username: string;
  email: string;
  profession?: string;
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
  const [gamesOpen, setGamesOpen] = useState(false);
  
  const currentUserStr = localStorage.getItem("currentUser");
  const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;

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

  // Search user with debounce
  useEffect(() => {
    if (search.trim() === "") {
      // Reset to initial 4 users when search is cleared
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
      return;
    }

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

  const toggleGamesDropdown = () => {
    setGamesOpen(!gamesOpen);
  };

  const goToGame = (game: string) => {
    navigate(`/games/${game}`);
    setGamesOpen(false);
  };

  const goToProfile = () => {
    if (currentUser) {
      navigate(`/profile/${currentUser.id}`);
    } else {
      alert("User not logged in");
    }
  };

  return (
    <>
      {/* TOP NAV */}
      <header className="top-nav">
        <div className="logo" onClick={() => navigate("/home")}>
          <span className="logo-icon">✦</span>
          <span>FindProfessionals</span>
        </div>

        <div className="nav-actions">
          <button className="nav-btn profile-btn" onClick={goToProfile}>
            👤 My Profile
          </button>
          <div className="games-dropdown-wrapper">
            <button className="nav-btn game-btn" onClick={toggleGamesDropdown}>
              🎮 Play Game
            </button>
            {gamesOpen && (
              <div className="dropdown-menu">
                <p onClick={() => goToGame("tictactoe")}>TicTacToe</p>
                <p onClick={() => goToGame("rockpaperscissor")}>RockPaperScissor</p>
                <p onClick={() => goToGame("diceroll")}>DiceRoll</p>
              </div>
            )}
          </div>
          <button className="nav-btn logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="hero-section">
        <h1>Connect with Top Professionals</h1>
        <p>
          Discover and collaborate with specialized talent from across the
          globe.
        </p>

        <form className="search-bar-wrapper" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="🔍 Search professionals..."
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

      </section>

      {/* MAIN CONTENT */}
      <main className="home-content">
        <h2>Registered Professionals</h2>

        {loading && <p className="loading">Loading professionals...</p>}
        {error && <p className="error">{error}</p>}

        {!error && (
          <div className="profiles-grid">
            {userList.map((user: User) => (
              <div
                key={user._id}
                className="profile-card"
                onClick={() => navigate(`/profile/${user._id}`)}
              >
                <div className="avatar">
                  {user.username.charAt(0).toUpperCase()}
                </div>

                <h3>@{user.username}</h3>
                <p className="profession">{user.profession || "Not specified"}</p>
                <p className="email">{user.email}</p>

                <span className="view-profile">View Profile ↗</span>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
