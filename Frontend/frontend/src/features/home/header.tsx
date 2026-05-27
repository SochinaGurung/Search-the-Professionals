import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./header.css";


export default function Header() {
  const currentUserStr = localStorage.getItem("currentUser");
  const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
  const navigate = useNavigate();
  const [gamesOpen, setGamesOpen] = useState(false);
  //const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const goToProfile = () => {
      if (currentUser) {
        navigate(`/profile/${currentUser.id}`); 
      } else {
        alert("User not logged in");
      }
    };


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

  return (
    <header className="app-header">
      <div className="head" onClick={() => navigate("/home")}>
        <span className="logo-icon">✦</span>
        <div className="name">
          <p>FindProfessionals</p>
        </div>
      </div>

      <div className="nav-links">
        <button className="profile-btn" onClick={goToProfile}>
          👤 {currentUser ? currentUser.username : "Profile"}
        </button>

        <div className="games-dropdown">
          <button className="game-icon-btn" onClick={toggleGamesDropdown}>
            🎮
          </button>
          {gamesOpen && (
            <div className="dropdown-menu">
              <p onClick={() => goToGame("tictactoe")}>TicTacToe</p>
              <p onClick={() => goToGame("rockpaperscissor")}>RockPaperScissor</p>
              <p onClick={() => goToGame("diceroll")}>DiceRoll</p>
            </div>
          )}
        </div>

        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
