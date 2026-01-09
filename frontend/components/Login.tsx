// components/Login.tsx
import React, { useState } from "react";
//import apiService from '../utils/api';
interface LoginFormData {
  saIdNumber: string;
  password: string;
}

interface LoginProps {
  onAuth: (type: "login", formData: LoginFormData) => Promise<{
    success: boolean;
    message?: string;
  }>;
  isLoading?: boolean;
}

const Login: React.FC<LoginProps> = ({ onAuth, isLoading = false }) => {
  const [formData, setFormData] = useState<LoginFormData>({
    saIdNumber: "",
    password: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.saIdNumber.trim() || !formData.password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    const result = await onAuth("login", formData);

    if (!result.success) {
      setError(result.message || "Login failed");
    }
  };

  return (
    <div className="login-form">
      <h2>Welcome Back</h2>
      <p style={{ color: "var(--color-text-secondary)", marginBottom: "2rem" }}>
        Please enter your credentials to access your account
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="saIdNumber">SA ID Number</label>
          <input
            type="text"
            id="saIdNumber"
            name="saIdNumber"
            value={formData.saIdNumber}
            onChange={handleChange}
            placeholder="Enter your SA ID number"
            disabled={isLoading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            disabled={isLoading}
            required
          />
        </div>

        {error && (
          <div className="error-message" style={{ color: "red", marginBottom: "1rem" }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="submit-button"
        >
          {isLoading ? "Logging in..." : "Log in"}
        </button>
      </form>
    </div>
  );
};

export default Login;
