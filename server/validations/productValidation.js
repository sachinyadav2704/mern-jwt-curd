// validators/productValidator.js
const Joi = require('joi');

// Function to validate product data
const validateProduct = data => {
   const schema = Joi.object({
      name: Joi.string().min(3).max(255).required().messages({
         'string.base': 'Product name must be a string.',
         'string.min': 'Product name must be at least 3 characters long.',
         'string.max': 'Product name cannot exceed 255 characters.',
         'any.required': 'Product name is required.',
      }),
      price: Joi.number().min(0).required().messages({
         'number.base': 'Price must be a valid number.',
         'number.min': 'Price must be 0 or greater.',
         'any.required': 'Price is required.',
      }),
      category: Joi.string().min(3).max(255).required().messages({
         'string.base': 'Category must be a string.',
         'string.min': 'Category must be at least 3 characters long.',
         'string.max': 'Category cannot exceed 255 characters.',
         'any.required': 'Category is required.',
      }),
      stock: Joi.number().integer().min(0).required().messages({
         'number.base': 'Stock must be a valid number.',
         'number.integer': 'Stock must be an integer.',
         'number.min': 'Stock must be 0 or greater.',
         'any.required': 'Stock is required.',
      }),
   });

   const { error } = schema.validate(req.body);
   if (error) {
      return res.status(400).json({ message: 'Bad request', error });
   }
   next();
};

module.exports = { validateProduct };
