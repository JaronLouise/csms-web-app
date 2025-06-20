const Product = require('../models/Product');

// @desc Get all products (with optional filters)
exports.getAllProducts = async (req, res) => {
  try {
    console.log('=== FETCHING ALL PRODUCTS ===');
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

    console.log('Filters applied:', filters);

    const products = await Product.find(filters).populate('category');
    
    console.log('=== PRODUCTS FETCHED FROM DATABASE ===');
    console.log('Number of products found:', products.length);
    products.forEach((product, index) => {
      console.log(`Product ${index + 1}:`, {
        id: product._id,
        name: product.name,
        price: product.price,
        stock: product.stock,
        category: product.category?.name
      });
    });
    
    res.json(products);
  } catch (err) {
    console.error('ERROR FETCHING PRODUCTS:', err);
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
    console.log('=== CREATE PRODUCT REQUEST ===');
    console.log('Request body:', req.body);
    console.log('File uploaded:', req.file);

    const { name, description, price, category, stock } = req.body;

    // Basic validation
    if (!name || !price || !category || !stock) {
      console.log('VALIDATION FAILED - Missing required fields');
      return res.status(400).json({ message: 'Name, price, category, and stock are required.' });
    }

    const newProduct = {
      name,
      description,
      price: Number(price), // Explicit casting
      category,
      stock: Number(stock), // Explicit casting
      images: []
    };

    if (req.file) {
      newProduct.images.push(req.file.path);
    }

    console.log('Product data to save:', newProduct);

    const product = new Product(newProduct);
    const saved = await product.save();
    
    console.log('=== PRODUCT SAVED TO DATABASE ===');
    console.log('Saved product:', saved);
    console.log('Product ID:', saved._id);
    
    res.status(201).json(saved);
  } catch (err) {
    console.error('ERROR CREATING PRODUCT:', err); // Detailed server-side logging
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join('. ') });
    }
    // Generic fallback for other errors
    res.status(400).json({ message: 'An unexpected error occurred.', error: err.message });
  }
};

// @desc Update product (admin only)
exports.updateProduct = async (req, res) => {
  try {
    console.log('=== UPDATE PRODUCT REQUEST ===');
    console.log('Product ID:', req.params.id);
    console.log('Request body:', req.body);
    console.log('File uploaded:', req.file);

    const { name, description, price, category, stock } = req.body;
    
    // Add validation for update
    if (!name || !price || !category || !stock) {
      console.log('VALIDATION FAILED - Missing required fields');
      return res.status(400).json({ message: 'Name, price, category, and stock are required fields.' });
    }

    const updateData = { 
      name, 
      description, 
      price: Number(price), // Explicit casting
      category, 
      stock: Number(stock)  // Explicit casting
    };
    
    if (req.file) {
      updateData.images = [req.file.path];
    }

    console.log('Update data:', updateData);

    // First, let's check if the product exists
    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) {
      console.log('PRODUCT NOT FOUND IN DATABASE');
      return res.status(404).json({ message: 'Product not found' });
    }
    
    console.log('Existing product found:', existingProduct);

    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true // Ensure model validations are run on update
    });

    console.log('=== PRODUCT UPDATED IN DATABASE ===');
    console.log('Updated product:', updated);
    console.log('Updated product ID:', updated._id);

    res.json(updated);
  } catch (err) {
    console.error('ERROR UPDATING PRODUCT:', err); // Detailed server-side logging
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join('. ') });
    }
    // Generic fallback for other errors
    res.status(400).json({ message: 'An unexpected error occurred during update.', error: err.message });
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
