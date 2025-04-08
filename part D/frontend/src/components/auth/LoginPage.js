import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/AuthForm.css";

export default function LoginPage() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Function to validate the phone number
  const isPhoneValid = (phone) => {
    const phoneRegex = /^[0-9]{10}$/; // Regex for exactly 10 digits
    return phoneRegex.test(phone);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const phone = e.target.phone.value;
    const password = e.target.password.value;

    // Validate phone number
    if (!isPhoneValid(phone)) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }

    const person = {
      phone,
      password,
    };

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(person),
      });

      const dataUser = await response.json();
      if (!dataUser.success) throw "Invalid login";

      window.localStorage.setItem("currentUser", JSON.stringify(dataUser.user));

      if (dataUser.user.role === "owner") {
        navigate("/owner/dashboard");
      } else {
        navigate("/supplier/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login");
    }
  };

  const getToSign = () => navigate("/register");

  return (
    <div className="form-box">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="user-box">
          <input name="phone" type="text" required />
          <label>Phone Number</label>
        </div>
        <div className="user-box">
          <input name="password" type="password" required />
          <label>Password</label>
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="btn">Login</button>
        <button type="button" className="btn btn-secondary" onClick={getToSign}>
          Register
        </button>
      </form>
    </div>
  );
}

