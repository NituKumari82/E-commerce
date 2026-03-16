import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useProductStore = create((set) => ({
	products: [],
	loading: false,
	error: null,

	setProducts: (products) => set({ products: Array.isArray(products) ? products : [] }),

	createProduct: async (productData) => {
		set({ loading: true });
		try {
			const res = await axios.post("/products", productData);
			set((prevState) => ({
				products: [...prevState.products, res.data],
				loading: false,
			}));
			toast.success("Product created successfully");
		} catch (error) {
			toast.error(error.response?.data?.error || "Failed to create product");
			set({ loading: false });
		}
	},

	fetchAllProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/products");
			// Check if products is nested in .products or is the root array
			const data = response.data.products || response.data || [];
			set({ products: Array.isArray(data) ? data : [], loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false, products: [] });
			toast.error(error.response?.data?.error || "Failed to fetch products");
		}
	},

	fetchProductsByCategory: async (category) => {
		set({ loading: true });
		try {
			const response = await axios.get(`/products/category/${category}`);
			// Handle both { products: [] } and direct array [ ]
			const data = response.data.products || response.data || [];
			set({ products: Array.isArray(data) ? data : [], loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false, products: [] });
			toast.error(error.response?.data?.error || "Failed to fetch products");
		}
	},

	deleteProduct: async (productId) => {
		set({ loading: true });
		try {
			await axios.delete(`/products/${productId}`);
			set((prevState) => ({
				products: prevState.products.filter((product) => product._id !== productId),
				loading: false,
			}));
			toast.success("Product deleted successfully");
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.error || "Failed to delete product");
		}
	},

	toggleFeaturedProduct: async (productId) => {
		set({ loading: true });
		try {
			const response = await axios.patch(`/products/${productId}`);
			set((prevState) => ({
				products: prevState.products.map((product) =>
					product._id === productId ? { ...product, isFeatured: response.data.isFeatured } : product
				),
				loading: false,
			}));
			toast.success("Product updated successfully");
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.error || "Failed to update product");
		}
	},

	fetchFeaturedProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/products/featured");
			const data = response.data.products || response.data || [];
			set({ products: Array.isArray(data) ? data : [], loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false, products: [] });
			console.error("Error fetching featured products:", error);
		}
	},
}));
