import "./firstheader.css";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  return (
    <div className="landing-header">
      <div className="landing-head" onClick={() => navigate("/")}>
        <span className="logo-icon">✦</span>
        <span className="brand-name">FindProfessionals</span>
      </div>
      <div className="landing-nav">
        <button className="landing-btn login-btn" onClick={() => navigate("/Login")}>
          Log In
        </button>
        <button className="landing-btn register-btn" onClick={() => navigate("/Register")}>
          Register
        </button>
      </div>
    </div>
  );
}
