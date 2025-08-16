import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const apiUrl = "http://127.0.0.1:8000/api/account/forgot-password/";

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Link sent to your email to reset password.");
        setEmail("");
      } else {
        const errorMessages = Object.values(data).flat().join(", ");
        setMessage(errorMessages || "An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      setMessage("An error occurred while processing your request. Please try again later.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-red-300">
      <div className="bg-white p-8 rounded shadow-md w-96">

        {/* title */}
        <h2 className="text-2xl font-semibold mb-4 text-center">Forgot Your Password?</h2>

        {/* feedback message */}
        {message && (
          <div
            className={`mb-4 p-3 rounded ${
              message.includes("Link sent")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        {/* form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email Address:
            </label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* action buttons */}
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Reset Password
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-red-600 hover:underline text-sm"
            >
              Go to Homepage
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
