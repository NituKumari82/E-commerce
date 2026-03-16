import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useProductStore } from "../stores/useProductStore";
import ProductCard from "../components/ProductCard";

const CategoryPage = () => {
	const { category } = useParams();
	const { fetchProductsByCategory, products, loading, error } = useProductStore();

	useEffect(() => {
		if (category) {
			fetchProductsByCategory(category);
		}
	}, [fetchProductsByCategory, category]);

	// Format title: "home-decor" -> "Home Decor"
	const displayTitle = category
		? category.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
		: "Products";

	return (
		<div className='min-h-screen bg-gray-900'>
			<div className='relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				<motion.h1
					className='text-center text-4xl sm:text-5xl font-bold text-emerald-400 mb-8'
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					{displayTitle}
				</motion.h1>

				{/* Loading State */}
				{loading && (
					<div className="flex justify-center items-center h-64">
						<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
					</div>
				)}

				{/* Error State */}
				{!loading && error && (
					<p className="text-red-400 text-center text-xl mt-4">{error}</p>
				)}

				{/* Products Grid */}
				{!loading && !error && (
					<motion.div
						className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center'
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
					>
						{/* Use Array.isArray check to be 100% safe from .map errors */}
						{!Array.isArray(products) || products.length === 0 ? (
							<h2 className='text-3xl font-semibold text-gray-300 text-center col-span-full'>
								No products found in this category.
							</h2>
						) : (
							products.map((product) => (
								<ProductCard key={product._id} product={product} />
							))
						)}
					</motion.div>
				)}
			</div>
		</div>
	);
};

export default CategoryPage;


