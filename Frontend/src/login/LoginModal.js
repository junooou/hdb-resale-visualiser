import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function LoginModal() {
  const navigate = useNavigate();
  const { isLoginOpen, setIsLoginOpen, handleLogin } = useContext(AuthContext);

  const [username, setUsernameInput] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // validate inputs and perform login
  const handleLoginClick = async () => {
    if (!username || !password) {
      setErrorMessage("Please enter both username and password.");
      return;
    }

    try {
      await handleLogin(username, password);
      setErrorMessage("Login successful!");
      setTimeout(() => {
        setIsLoginOpen(false);
        navigate("/");
      }, 1000);
    } catch (err) {
      console.error("Login failed:", err);
      setErrorMessage("Invalid username or password. Please try again.");
    }
  };

  if (!isLoginOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">

        {/* title */}
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        {/* form inputs */}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsernameInput(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded mb-3"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded mb-3"
        />

        {/* feedback */}
        {errorMessage && (
          <p className="text-red-600 text-center mb-3">{errorMessage}</p>
        )}

        {/* login button */}
        <button
          onClick={handleLoginClick}
          className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700"
        >
          Login
        </button>

        {/* bottom actions */}
        <div className="flex justify-between mt-4">
          <button
            className="text-red-600 hover:underline"
            onClick={() => {
              setIsLoginOpen(false);
              navigate("/signup");
            }}
          >
            Sign Up
          </button>
          <button
            onClick={() => setIsLoginOpen(false)}
            className="text-gray-600 hover:underline"
          >
            Continue as Guest
          </button>
        </div>

        <p className="mt-3 text-center">
          <a href="/forgot-password" className="text-red-600 hover:underline">
            Forgot Password?
          </a>
        </p>
      </div>
    </div>
  );
}