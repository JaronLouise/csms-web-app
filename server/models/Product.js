const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    shortDescription: String, // For product cards
    detailedDescription: String, // For detailed view
    price: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    
    // Enhanced specifications
    specifications: {
      capacity: String,
      dimensions: String,
      warranty: String,
      efficiency: String,
      weight: String,
      material: String,
      powerOutput: String,
      voltage: String,
      current: String,
      operatingTemperature: String,
      certifications: [String],
      compatibility: [String]
    },
    
    // Product features
    features: [String],
    
    // Technical specifications
    technicalSpecs: {
      type: Map,
      of: String
    },
    
    // Product variants/options
    variants: [
      {
        name: String,
        price: Number,
        stock: Number,
        specifications: {
          type: Map,
          of: String
        }
      }
    ],
    
    // Related products
    relatedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    
    // SEO and metadata
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
    
    // Product status and visibility
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isNew: { type: Boolean, default: false },
    isOnSale: { type: Boolean, default: false },
    salePrice: Number,
    saleEndDate: Date,
    
    // Inventory and shipping
    stock: { type: Number, default: 0 },
    sku: String,
    weight: Number, // in kg
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    
    // Images with enhanced structure
    images: [
      {
        public_id: { type: String, required: true },
        url: { type: String, required: true },
        width: Number,
        height: Number,
        format: String,
        size: Number,
        alt: String,
        isPrimary: { type: Boolean, default: false }
      }
    ],
    
    // Customization options
    isCustomizable: { type: Boolean, default: false },
    customizationOptions: [
      {
        name: String,
        type: String, // 'color', 'size', 'material', 'text', etc.
        options: [String],
        required: Boolean,
        price: Number
      }
    ],
    
    // Reviews and ratings (for future implementation)
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    
    // Additional information
    manufacturer: String,
    modelNumber: String,
    countryOfOrigin: String,
    installationInstructions: String,
    maintenanceGuide: String,
    safetyInformation: String
  },
  { timestamps: true }
);

// Index for better search performance
productSchema.index({ name: 'text', description: 'text', detailedDescription: 'text' });

module.exports = mongoose.model('Product', productSchema);
