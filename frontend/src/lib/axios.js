import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:5002/api" : "https://chatapp-production-64fb.up.railway.app/api",
  withCredentials: true,
});