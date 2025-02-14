import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth, db } from "./Firebase";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal"; 
import "./Register.css";

Modal.setAppElement("#root"); 

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success"); 
  const navigate = useNavigate();

  const showModal = (message, type) => {
    setModalMessage(message);
    setModalType(type);
    setModalIsOpen(true);

    if (type === "success") {
      setTimeout(() => {
        setModalIsOpen(false);
        navigate("/login"); 
      }, 2000);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "Users", user.uid), {
        email: user.email,
        firstName: fname,
        lastName: lname,
        photo: "",
      });

      showModal("You have signed up successfully!", "success");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        showModal("This email is already in use. Please login instead.", "error");
      } else if (error.code === "auth/weak-password") {
        showModal("Password should be at least 6 characters long.", "error");
      } else {
        showModal(error.message, "error");
      }
    }
  };

  return (
    <>
      <form onSubmit={handleRegister}>
        <h3>Sign Up</h3>

        <div className="mb-3">
          <label>First Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter first name"
            value={fname}
            onChange={(e) => setFname(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Last Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter last name"
            value={lname}
            onChange={(e) => setLname(e.target.value)}
          />
        </div>

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
          <button type="submit" className="btn btn-primary">
            Sign Up
          </button>
        </div>

        <p className="forgot-password text-right">
          Already registered? <a href="/login">Login</a>
        </p>
      </form>

    
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className={`custom-modal ${modalType}`}
        overlayClassName="custom-overlay"
      >
        <h2>{modalType === "success" ? "🎉 Success" : "⚠ Error"}</h2>
        <p>{modalMessage}</p>
        <button onClick={() => setModalIsOpen(false)}>Close</button>
      </Modal>
    </>
  );
}

export default Register;
