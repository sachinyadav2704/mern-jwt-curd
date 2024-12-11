const express = require('express');
const router = express.Router();
const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/productController');
const { validateProduct } = require('../validations/productValidation');
const { tokenValidator } = require('../middlewares/tokenVerification');

// Routes with middleware
router.post('/createProduct', tokenValidator, validateProduct, createProduct); // Create Product
router.get('/getAllProducts', tokenValidator, getAllProducts); // Get All Products
router.get('/getProductById/:id', tokenValidator, getProductById); // Get Product By ID
router.put('/updateProduct/:id', tokenValidator, validateProduct, updateProduct); // Update Product
router.delete('/deleteProduct/:id', tokenValidator, deleteProduct); // Delete Product

module.exports = router;
