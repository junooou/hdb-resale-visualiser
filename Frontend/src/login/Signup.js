import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // handle signup and input validation
  const handleSignup = async () => {
    if (!username || !email || !password || !confirmPassword) {
      setMessage("Please fill in all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setMessage("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    const apiUrl = "http://127.0.0.1:8000/api/account/signup/";

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
          confirm_password: confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Signed up successfully!");
        setTimeout(() => navigate("/"), 1500);
      } else {
        const errorMessages = Object.values(data).flat().join(", ");
        setMessage(errorMessages || "An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      setMessage("An error occurred while processing your request. Please try again later.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-red-300">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">

        {/* title */}
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>

        {/* feedback message */}
        {message && (
          <div
            className={`mb-4 p-3 rounded ${
              message === "Signed up successfully!" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        {/* form fields */}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded mb-3"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded mb-3"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded mb-3"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded mb-3"
        />

        {/* signup button */}
        <button
          onClick={handleSignup}
          className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700"
        >
          Sign Up
        </button>

        {/* go back link */}
        <p className="mt-3 text-center">
          <button
            onClick={() => navigate("/")}
            className="text-red-600 hover:underline text-sm"
          >
            Go to Homepage
          </button>
        </p>
      </div>
    </div>
  );
}
