import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

// Profile Page
export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState({ username: false, email: false });
  const [newValues, setNewValues] = useState({ username: "", email: "", password: "" });
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [resetMessage, setResetMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.get("account/user-profile/");
        setUserData(response.data);
        setNewValues({ username: response.data.username, email: response.data.email, password: "" });
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("You must be logged in to view this page.");
        setTimeout(() => navigate("/login"), 2000);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  // Request Password Reset Link
  const handleResetPassword = async () => {
    if (!userData?.email) {
      setResetMessage("No email found. Please update your profile.");
      return;
    }

    setIsResettingPassword(true);

    try {
      await axiosInstance.post("account/forgot-password/", { email: userData.email });
      setResetMessage("Password reset instructions sent to your email.");
    } catch (error) {
      console.error("Error requesting password reset:", error);
      setResetMessage("Failed to send reset email. Please try again.");
    } finally {
      setIsResettingPassword(false);
    }
  };

  // Handle Input Changes for Form Fields
  const handleChange = (field, value) => {
    setNewValues((prev) => ({ ...prev, [field]: value }));
  };

  // Save Updated Profile Info
  const handleSave = async () => {
    if (!newValues.password) {
      alert("Please enter your password to confirm changes.");
      return;
    }

    try {
      const response = await axiosInstance.put("account/update-profile/", {
        username: newValues.username,
        email: newValues.email,
        password: newValues.password,
      });

      setUserData(response.data);
      setIsEditing({ username: false, email: false });
      setNewValues((prev) => ({ ...prev, password: "" }));
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(error.response?.data?.password || "Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-red-300">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96 text-left">
        <h2 className="text-2xl font-bold mb-6">User Profile</h2>

        {error ? (
          <p className="text-red-600">{error}</p>
        ) : userData ? (
          <>
            {/* Username Field */}
            <div className="mb-4">
              <p className="text-lg"><strong>Username:</strong> {userData.username}</p>
              {isEditing.username && (
                <input
                  type="text"
                  value={newValues.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                  className="border px-2 py-1 rounded w-full mt-2"
                />
              )}
              <button
                className="text-blue-600 hover:underline text-sm mt-1"
                onClick={() => setIsEditing((prev) => ({ ...prev, username: !prev.username }))}
              >
                {isEditing.username ? "Cancel" : "Edit Username"}
              </button>
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <p className="text-lg"><strong>Email:</strong> {userData.email || "Not Available"}</p>
              {isEditing.email && (
                <input
                  type="email"
                  value={newValues.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="border px-2 py-1 rounded w-full mt-2"
                />
              )}
              <button
                className="text-blue-600 hover:underline text-sm mt-1"
                onClick={() => setIsEditing((prev) => ({ ...prev, email: !prev.email }))}
              >
                {isEditing.email ? "Cancel" : "Edit Email"}
              </button>
            </div>

            {/* Password Confirmation Field */}
            {(isEditing.username || isEditing.email) && (
              <div className="mb-4">
                <p className="text-lg"><strong>Enter Password to Confirm:</strong></p>
                <input
                  type="password"
                  value={newValues.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className="border px-2 py-1 rounded w-full mt-2"
                  placeholder="Enter your password"
                />
              </div>
            )}

            {/* Save Button */}
            {(isEditing.username || isEditing.email) && (
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full mt-3"
              >
                Save Changes
              </button>
            )}

            {/* Reset Password */}
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={handleResetPassword}
                disabled={isResettingPassword}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
              >
                {isResettingPassword ? (
                  <>
                    <svg className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" viewBox="0 0 24 24"></svg>
                    Sending...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>

              <button
                onClick={() => navigate("/")}
                className="text-red-600 hover:underline text-sm"
              >
                Go to Homepage
              </button>
            </div>

            {resetMessage && (
              <p className="text-center text-green-600 mt-3 animate-fadeIn">{resetMessage}</p>
            )}
          </>
        ) : (
          <p>Loading profile...</p>
        )}
      </div>
    </div>
  );
}
