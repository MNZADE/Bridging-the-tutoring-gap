import axios from "axios";

// Use your Render backend URL
const API_URL = "https://bridging-the-tutoring-gap.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
