import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/";

// Function to get a new access token using refresh token
const getAccessToken = async () => {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) return null;

  try {
    const response = await axios.post(`${API_URL}account/refresh/`, { refresh: refreshToken }); // Updated URL
    const newAccessToken = response.data.access;
    localStorage.setItem("access_token", newAccessToken);
    return newAccessToken;
  } catch (err) {
    console.error("Token refresh failed:", err);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    return null;
  }
};

// Axios instance for API calls with base URL
const axiosInstance = axios.create({ baseURL: API_URL });

// Request: Attach access token in headers
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response: Refresh token if status is 401
axiosInstance.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      const newToken = await getAccessToken();
      if (newToken) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        return axiosInstance(original);
      }
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;
