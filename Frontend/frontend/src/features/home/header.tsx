import { useNavigate } from "react-router-dom";
import "./header.css";

interface HeaderProps {
  onLogout: () => void;
}

export default function Header({ onLogout }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="app-header">
      <div className="logo" onClick={() => navigate("/")}>
        <h1>ProFinder</h1>
      </div>

      <nav className="nav-links">
        <button className="nav-btn" onClick={() => navigate("/about")}>
          About
        </button>
        <button className="nav-btn" onClick={() => navigate("/contact")}>
          Contact
        </button>
        <button className="nav-btn logout" onClick={onLogout}>
          Logout
        </button>
      </nav>
    </header>
  );
}
