import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddItem.css";

import { register } from "./services/authService";

function AddItem() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [title, setTitle] = useState("");
  //const [studentID, setStudentID] = useState("");

  const handleCanclClick = () => {
    navigate("/dashboard");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
    }

    try {
      await register(firstName, lastName, title, email, password, role);
      alert("Registration successful");
      setFirstName("");
      setLastName("");
      setTitle("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setRole("");
    } catch (error) {
      alert("Registration failed");
      console.log(error.message);
    }
  };

  return (
    <div className="loginPage">
      <div className="fullBox">
        <div className="overlay"></div>
        <div className="loginBox" id="addUserBox">
          <h2 className="loginTitle">Add user</h2>
          <form onSubmit={handleSubmit}>
            <div className="typeBox">
              <input
                type="text"
                placeholder=" First Name"
                autoComplete="off"
                name="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="typeBoxControl"
              />
            </div>
            <div className="typeBox">
              <input
                type="text"
                placeholder=" Last Name"
                autoComplete="off"
                name="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="typeBoxControl"
              />
            </div>
            <div className="typeBox">
              <input
                type="text"
                placeholder=" Mr/Mrs/Dr"
                autoComplete="off"
                name="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="typeBoxControl"
              />
            </div>
            <div className="typeBox">
              <input
                type="text"
                placeholder=" email"
                autoComplete="off"
                name="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="typeBoxControl"
              />
            </div>
            <div className="typeBox">
              <input
                type="password"
                placeholder=" New password"
                autoComplete="off"
                name="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="typeBoxControl"
              />
            </div>

            <div className="typeBox">
              <input
                type="password"
                placeholder=" Confirm password"
                autoComplete="off"
                name="text"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="typeBoxControl"
              />
            </div>
            <div className="typeBox">
              <input
                type="text"
                placeholder=" role"
                autoComplete="off"
                name="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="typeBoxControl"
              />
            </div>
            {/* <div className="typeBox">
              <input
                type="text"
                placeholder=" student ID"
                autoComplete="off"
                name="text"
                value={studentID}
                onChange={(e) => setStudentID(e.target.value)}
                className="typeBoxControl"
              />
            </div> */}

            <button type="submit" className="loginBtn" id="saveUserBtn">
              <b>SAVE</b>
            </button>
          </form>

          <button type="submit" className="loginBtn" onClick={handleCanclClick}>
            <b>Cancel</b>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddItem;
