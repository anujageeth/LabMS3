import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { login } from "./services/authService";

function Login({ setUser }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!email || typeof email != "string") {
        throw new Error("Invalid email");
        // console.log(email);
      }

      const normalizedEmail = email.trim().toLowerCase(); // Normalize email

      const data = await login(normalizedEmail, password); // Keep email lowercase
      setUser(data);
      console.log(data);

      //alert("Login successful");
      navigate("/dashboard"); // Redirect after successful login
    } catch (error) {
      console.error("Login error:", error.message);
      alert("Login failed. Please check your credentials.");
    }
  };

  const handleCancel = () => {
    setEmail("");
    setPassword("");
    navigate("/"); // Navigate to homepage or other page
  };

  return (
    <div className="loginPage">
      <div className="fullBox">
        <div className="overlay"></div>
        <div className="loginBox" id="loginPageBox">
          <h2 className="loginTitle">Welcome!</h2>
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

          <button onClick={handleCancel} className="loginBtn">
            <b>Cancel</b>
          </button>
          <br />
          <Link to="/register" className="forgetPw">
            Forget password?
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
