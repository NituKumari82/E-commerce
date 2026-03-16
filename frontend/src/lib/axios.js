import axios from "axios";

const axiosInstance = axios.create({
	// FIX: Use 'env.MODE' instead of just 'mode'
	baseURL: import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api",
	withCredentials: true, 
});

export default axiosInstance;
