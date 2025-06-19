const Product = require('../models/Product');

// @desc Get all products (with optional filters)
exports.getAllProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, isCustomizable, search } = req.query;

    let filters = {};

    if (category) {
      filters.category = category;
    }

    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = Number(minPrice);
      if (maxPrice) filters.price.$lte = Number(maxPrice);
    }

    if (isCustomizable === 'true' || isCustomizable === 'false') {
      filters.isCustomizable = isCustomizable === 'true';
    }

    if (search) {
      filters.name = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(filters).populate('category');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// @desc Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc Create new product (admin only)
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      specifications,
      stock,
      isCustomizable,
      customizationOptions,
      images // This should be an array of URLs from image upload
    } = req.body;

    const product = new Product({
      name,
      description,
      price,
      category,
      specifications,
      stock,
      isCustomizable,
      customizationOptions,
      images // store image URLs here
    });

    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create product', error: err });
  }
};

// @desc Update product (admin only)
exports.updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err });
  }
};

// @desc Delete product (admin only)
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err });
  }
};
