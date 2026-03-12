import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String, // Capital 'S'
    required: true,
  },
  description: {
    type: String, // Capital 'S'
    required: true
  },
  price: {
    type: Number,
    min: 0,
    required: true,
  },
  image: {
    type: String, // Capital 'S'
    required: [true, 'image is required']
  },
  category: {
    type: String, // Capital 'S'
    required: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true // Note: Should be 'timestamps' (plural) to work correctly
});

const Product = mongoose.model("product", productSchema);
export default Product;
