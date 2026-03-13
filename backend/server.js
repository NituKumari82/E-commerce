 import express from "express";
 import cartRoutes from
 "./routes/cart.route.js"; 
 import couponRoutes from "./routes/coupon.route.js";
  import productRoutes from "./routes/product.route.js";
  import paymentRoutes from "./routes/payment.route.js";
  import analyticsRoutes from "./routes/analytics.route.js";
 import cookieParser from  "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
import dns from "node:dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);
dns.setDefaultResultOrder("ipv4first");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json()); 
app.use(cookieParser());

// Middleware to parse JSON (needed for signup/login)
app.use(express.json()); 

app.use("/api/auth", authRoutes);
app.use("/api/products",productRoutes);
app.use("api/cart",cartRoutes);
app.use("/api/coupons",couponRoutes);
app.use("/api/payment",paymentRoutes);
app.use("/api/analytics",analyticsRoutes);


// Use the PORT variable here so it's dynamic
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB();
});
