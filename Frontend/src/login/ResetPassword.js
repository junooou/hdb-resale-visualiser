import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  // handle password reset
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    const apiUrl = "http://127.0.0.1:8000/api/account/reset-password/";

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          new_password: password,
          confirm_new_password: confirmPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Password reset successfully. You can now log in.");
        navigate("/");
      } else {
        const error = Object.values(data).flat().join(", ");
        setMessage(error || "An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred while processing your request.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-red-300">
      <div className="bg-white p-8 rounded shadow-md w-96">

        {/* title */}
        <h2 className="text-2xl font-semibold mb-4 text-center">Reset Your Password</h2>

        {/* message */}
        {message && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-700">{message}</div>
        )}

        {/* form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              New Password:
            </label>
            <input
              type="password"
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Confirm Password:
            </label>
            <input
              type="password"
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* submit button */}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
