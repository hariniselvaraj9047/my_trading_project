import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "./Firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignInWithGoogle from "./SignupWithGoogle";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(""); // Clear previous errors

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("User logged in successfully!", { position: "top-center" });
      window.location.href = "/profile"; // Redirect after success
    } catch (error) {
      setLoading(false);
      let message = "";

      // Handling Firebase error codes
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

      setErrorMessage(message); // Show error message on screen
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h3>Login</h3>

        {/* Show error message */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {/* Email Input */}
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

        {/* Password Input */}
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

        {/* Login Button */}
        <div className="d-grid">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>

        {/* Register Link */}
        <p className="forgot-password text-right">
          New user? <a href="/register">Register Here</a>
        </p>

        {/* Google Sign-in Option */}
        <SignInWithGoogle />
      </form>
    </div>
  );
}

export default Login;