import { create } from "zustand";
// IMPORTANT: Ensure this path points to YOUR custom axios instance in lib/axios.js
import axios from "../lib/axios"; 
import { toast } from "react-hot-toast";

export const useUserStore = create((set) => ({
	user: null,
	loading: false,
	checkingAuth: true,

	signup: async (payload) => {
		const { name, email, password, confirmPassword } = payload;
		set({ loading: true });

		if (!name || !email || !password || !confirmPassword) {
			set({ loading: false });
			toast.error("All fields are required");
			return false;
		}

		if (password !== confirmPassword) {
			set({ loading: false });
			toast.error("Passwords do not match");
			return false;
		}

		try {
			const res = await axios.post("/auth/signup", { name, email, password });
			set({ user: res.data, loading: false });
			toast.success("Signup successful!");
			return true;
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.message || "An error occurred during signup");
			return false;
		}
	},

	login: async (email, password) => {
		set({ loading: true });
		if (!email.trim() || !password) {
			set({ loading: false });
			toast.error("Email and password are required");
			return false;
		}

		try {
			const res = await axios.post("/auth/login", { email, password });
			set({ user: res.data, loading: false });
			toast.success("Login successful!");
			return true;
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.message || "Invalid credentials or server error");
			return false;
		}
	},

	logout: async () => {
		try {
			await axios.post("/auth/logout");
			set({ user: null });
		} catch (error) {
			toast.error(error.response?.data?.message || "An error occurred during logout");
		}
	},

	checkAuth: async () => {
  set({ checkingAuth: true });
  try {
    const response = await axios.get("/auth/profile");
    set({ user: response.data, checkingAuth: false });
  } catch {
    set({ checkingAuth: false, user: null });
  }
},

	refreshToken: async () => {
  const response = await axios.post("/auth/refresh-token");
  return response.data;
},
}));

// Axios interceptor for token refresh
let refreshPromise = null;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const url = originalRequest?.url || "";

    const skipRefresh =
      url.includes("/auth/login") ||
      url.includes("/auth/signup") ||
      url.includes("/auth/logout") ||
      url.includes("/auth/refresh-token");

    if (error.response?.status === 401 && !originalRequest._retry && !skipRefresh) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = useUserStore.getState().refreshToken();
        }

        await refreshPromise;
        refreshPromise = null;

        return axios(originalRequest);
      } catch (e) {
        refreshPromise = null;
        useUserStore.setState({ user: null });
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);