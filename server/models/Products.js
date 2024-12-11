const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
   {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      category: { type: String, required: true },
      stock: { type: Number, required: true },
   },
   {
      timestamps: true, // Automatically adds createdAt and updatedAt fields
   }
);

module.exports = mongoose.model('Product', productSchema);
