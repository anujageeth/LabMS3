import React from 'react'
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import "../Login.css";

function LoginModal({ setUser, showLoginModal, setShowLoginModal }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!email || typeof email != "string") {
        throw new Error("Invalid email");
      }

      const normalizedEmail = email.trim().toLowerCase();
      const data = await login(normalizedEmail, password);
      console.log(data);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error.message);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div>
      {showLoginModal && (
        <div>
          <div className="overlay"></div>
          <div className="loginBox" id="loginPageBox">
            <h2 className="loginTitle"><b>Welcome!</b></h2>
            <form onSubmit={handleSubmit}>
              <div className="typeBox">
                <input
                  type="email"
                  placeholder="Email"
                  autoComplete="on"
                  name="email"
                  className="typeBoxControl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="typeBox">
                <input
                  type="password"
                  placeholder="Password"
                  autoComplete="on"
                  name="password"
                  className="typeBoxControl"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="loginBtn" id="userLoginBtn">
                <b>Login</b>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginModal;