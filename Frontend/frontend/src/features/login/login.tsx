import { useState, type ChangeEvent, type FormEvent } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import type { AxiosResponse, AxiosError } from "axios";
import { loginApi } from "../../shared/config/api";
import professionalImg from "../../assets/professional.png";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    loginApi(formData)
      .then((res: AxiosResponse) => {
        console.log("Login response:", res.data);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("currentUser", JSON.stringify(res.data.user));

        if (res.data.user.profileCompleted) {
          navigate("/home");
        } else {
          navigate("/profileForm");
        }
      })
      .catch((error: AxiosError) => {
        const message =
          (error.response?.data as { message?: string })?.message ||
          "Server Error";
        alert(message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="login-page">
      <div className="login-box">
        {/* Left Side - Form */}
        <div className="login-form-section">
          <h2>Welcome back 👋</h2>
          <p className="subtitle">Login to continue to FindProfessionals</p>

          <form onSubmit={handleSubmit} className="login-form">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
            />

            <label htmlFor="password">Password</label>
            <div className="password-field">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"} 
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "Hide Password" : "Show Password"} 
              </button>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="divider">
              <span>or continue with</span>
            </div>

            <div className="social-login">
              <button type="button" className="social-btn google">
                🌐 Sign in with Google
              </button>
            </div>

            <p className="register-link">
              Don’t have an account?{" "}
              <span onClick={() => navigate("/Register")}>Register</span>
            </p>
          </form>
        </div>

        <div className="login-image-section">
          <img
            src={professionalImg}
            alt="Professional"
            className="login-image"
          />
          <div className="overlay">
            <div className="task-card">
              <h4>Daily Meeting</h4>
              <p>12:00pm - 01:00pm</p>
            </div>
            <div className="task-card">
              <h4>Team Sync</h4>
              <p>03:00pm - 03:30pm</p>
            </div>
          </div>
          <p className="image-text">
            Log in to connect with skilled professionals and grow your network.
          </p>
        </div>
      </div>
    </div>
  );
}
