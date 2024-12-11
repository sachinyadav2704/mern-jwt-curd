const Product = require('../models/Products');

// Create a product
const createProduct = async (req, res) => {
   console.log('Create Product ====> ', req.body);
   try {
      const { name, price, category, stock } = req.body;
      const newProduct = new Product({ name, price, category, stock });
      const savedProduct = await newProduct.save();

      res.status(200).json({ success: true, message: 'Product created successfully', data: savedProduct });
   } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Internal server error' });
   }
};

// Get all products
const getAllProducts = async (req, res) => {
   console.log('Get All Products ====> ', req.body);
   try {
      const products = await Product.find();
      res.status(200).json({ success: true, data: products });
   } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Internal server error' });
   }
};

// Get a single product by ID
const getProductById = async (req, res) => {
   console.log('Get Product By ID ====> ', req.body);
   try {
      const { id } = req.params;
      const product = await Product.findById(id);
      if (!product) {
         return res.status(404).json({ success: false, message: 'Product not found' });
      }
      res.status(200).json({ success: true, data: product });
   } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Internal server error' });
   }
};

// Update a product by ID
const updateProduct = async (req, res) => {
   try {
      const { id } = req.params;

      // Validate the input
      const { error } = validateProduct(req.body);
      if (error) {
         return res.status(400).json({ success: false, message: error.details[0].message });
      }

      const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedProduct) {
         return res.status(404).json({ success: false, message: 'Product not found' });
      }

      res.status(200).json({ success: true, message: 'Product updated successfully', data: updatedProduct });
   } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Internal server error' });
   }
};

// Delete a product by ID
const deleteProduct = async (req, res) => {
   try {
      const { id } = req.params;
      const deletedProduct = await Product.findByIdAndDelete(id);
      if (!deletedProduct) {
         return res.status(404).json({ success: false, message: 'Product not found' });
      }
      res.status(200).json({ success: true, message: 'Product deleted successfully', data: deletedProduct });
   } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Internal server error' });
   }
};

module.exports = {
   createProduct,
   getAllProducts,
   getProductById,
   updateProduct,
   deleteProduct,
};
