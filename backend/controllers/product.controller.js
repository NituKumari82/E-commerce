import Product from "../models/product.model.js";
import cloudinary from "../lib/cloudinary.js";
import {redis} from "../lib/redis.js"; // Ensure this matches your redis export name

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ products });
  } catch (error) {
    console.log("Error in getAllProducts", error.message);
    res.status(500).json({ message: "server error", error: error.message });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    let featureProducts = await Product.find({ isFeatured: true }).lean();
    if (!featureProducts) {
      return res.status(404).json({ message: "No featured Products found" });
    }
    // Corrected to lowercase 'redis' to match standard imports
    await redis.set("featured_products", JSON.stringify(featureProducts));
    res.json(featureProducts);
  } catch (error) {
    console.log("Error in getFeaturedProducts", error.message);
    res.status(500).json({ message: "server error", error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;
    let cloudinaryResponse = null;
    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" });
    }
    const product = await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
      category,
    });
    res.status(201).json(product);
  } catch (error) {
    console.log("error in createProduct controller", error.message);
    res.status(500).json({ message: "server error", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }
    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
        console.log("deleted image from cloudinary");
      } catch (error) {
        console.log("error deleting image from cloudinary", error);
      }
    }
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "product deleted successfully" });
  } catch (error) {
    console.log("Error in deleteproduct controller", error.message);
    res.status(500).json({ message: "server error", error: error.message });
  }
};

export const getRecommendedProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      { $sample: { size: 3 } },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          image: 1,
          price: 1,
        },
      },
    ]);
    res.json(products);
  } catch (error) {
    console.log("Error in getRecommendedProducts controller", error.message);
    res.status(500).json({ message: "server error", error: error.message });
  }
};

export const getProductByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const products = await Product.find({ category });
    res.json(products);
  } catch (error) {
    console.log("Error in getProductByCategory controller", error.message);
    res.status(500).json({ message: "server error", error: error.message });
  }
};

export const toggleFeatureProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.isFeatured = !product.isFeatured;
      // Fixed: changed Product.save() to product.save()
      const updatedProduct = await product.save();
      await updateFeaturedProductsCache();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "product not found" });
    }
  } catch (error) {
    console.log("Error in toggle featuredProduct controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

async function updateFeaturedProductsCache() {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    // Added: Actually updating the redis cache
    await redis.set("featured_products", JSON.stringify(featuredProducts));
  } catch (error) {
    console.log("error in update cache function", error.message);
  }
}
