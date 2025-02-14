import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "./Firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");  

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("User logged in successfully!", { position: "top-center" });
      window.location.href = "/profile";  
    } catch (error) {
      setLoading(false);
      let message = "";

       
      switch (error.code) {
        case "auth/user-not-found":
          message = "Email is not registered. Please sign up first.";
          break;
        case "auth/wrong-password":
          message = "Incorrect email or password. Please try again.";
          break;
        case "auth/invalid-email":
          message = "Invalid email format. Please enter a valid email.";
          break;
        case "auth/too-many-requests":
          message = "Too many failed attempts! Try again later.";
          break;
        default:
          message = "Login failed. Please check your credentials.";
      }

      setErrorMessage(message);  
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h3>Login</h3>

        
        {errorMessage && <p className="error-message">{errorMessage}</p>}
  
        <div className="mb-3">
          <label>Email Address</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        
        <div className="d-grid">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>

        
        <p className="forgot-password text-right">
          New user? <a href="/register">Register Here</a>
        </p>

       
      </form>
    </div>
  );
}

export default Login;