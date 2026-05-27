import { useState, type ChangeEvent, type FormEvent } from "react";
import './register.css';
import { registerApi } from '../../shared/config/api';
import { type AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: ''
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      await registerApi(formData);
      alert('Registration successful! Please log in.');
      navigate('/Login');
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string }>;
      console.error(axiosError);
      if (!axiosError.response) {
        setErrorMessage('Cannot reach the server. Make sure the backend is running on port 3000.');
        return;
      }
      setErrorMessage(
        axiosError.response.data?.message || 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit}>
        <h2 className="RegisterTitle">REGISTER</h2>

        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Enter your name"
          type="text"
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          type="password"
          required
        />
        
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          type="email"
          required
        />

        {errorMessage && <p className="error">{errorMessage}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
}
