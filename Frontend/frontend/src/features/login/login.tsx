import { useState, type ChangeEvent, type FormEvent } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import type { AxiosResponse, AxiosError } from "axios";
import { loginApi } from "../../shared/config/api";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
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
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
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
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="register-link">
            Don’t have an account?{" "}
            <span onClick={() => navigate("/register")}>Register</span>
          </p>
        </form>
      </div>
    </div>
  );
}
