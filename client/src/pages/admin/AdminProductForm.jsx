import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, updateProduct, getProductById } from '../../services/adminService';
import { getCategories, createCategory } from '../../services/categoryService';
import uploadService from '../../services/uploadService';

const AdminProductForm = () => {
  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [skippedSteps, setSkippedSteps] = useState(new Set());
  
  // Basic product information
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [detailedDescription, setDetailedDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState(0);
  const [sku, setSku] = useState('');
  
  // Product status
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [isOnSale, setIsOnSale] = useState(false);
  const [salePrice, setSalePrice] = useState('');
  const [saleEndDate, setSaleEndDate] = useState('');
  
  // Specifications
  const [specifications, setSpecifications] = useState({
    capacity: '',
    dimensions: '',
    warranty: '',
    efficiency: '',
    weight: '',
    material: '',
    powerOutput: '',
    voltage: '',
    current: '',
    operatingTemperature: '',
    certifications: [],
    compatibility: []
  });
  
  // Features
  const [features, setFeatures] = useState(['']);
  
  // Technical specifications
  const [technicalSpecs, setTechnicalSpecs] = useState([{ key: '', value: '' }]);
  
  // Images
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  
  // Form state
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // New category form state
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [creatingCategory, setCreatingCategory] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  
  // Touch gesture support
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Step definitions
  const steps = [
    {
      id: 1,
      title: 'Basic Information',
      description: 'Product name, category, and pricing',
      required: true
    },
    {
      id: 2,
      title: 'Description',
      description: 'Product descriptions and details',
      required: false
    },
    {
      id: 3,
      title: 'Specifications',
      description: 'Technical specs and features',
      required: false
    },
    {
      id: 4,
      title: 'Images',
      description: 'Product photos and media',
      required: false
    },
    {
      id: 5,
      title: 'Status & Pricing',
      description: 'Product status and sale settings',
      required: false
    }
  ];

  useEffect(() => {
    console.log('=== ADMIN PRODUCT FORM: LOADING ===');
    console.log('Product ID from params:', id);
    
    getCategories()
      .then(setCategories)
      .catch(() => setError('Could not load categories.'));

    if (id) {
      setLoading(true);
      
      // Validate product ID format
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        setError('Invalid product ID format.');
        setLoading(false);
        return;
      }
      
      getProductById(id)
        .then(product => {
          setName(product.name);
          setDescription(product.description || '');
          setShortDescription(product.shortDescription || '');
          setDetailedDescription(product.detailedDescription || '');
          setPrice(product.price);
          setCategory(product.category._id);
          setStock(product.stock);
          setSku(product.sku || '');
          setIsActive(product.isActive);
          setIsFeatured(product.isFeatured);
          setIsNew(product.isNew);
          setIsOnSale(product.isOnSale);
          setSalePrice(product.salePrice || '');
          setSaleEndDate(product.saleEndDate ? new Date(product.saleEndDate).toISOString().split('T')[0] : '');
          
          if (product.specifications) {
            setSpecifications({
              capacity: product.specifications.capacity || '',
              dimensions: product.specifications.dimensions || '',
              warranty: product.specifications.warranty || '',
              efficiency: product.specifications.efficiency || '',
              weight: product.specifications.weight || '',
              material: product.specifications.material || '',
              powerOutput: product.specifications.powerOutput || '',
              voltage: product.specifications.voltage || '',
              current: product.specifications.current || '',
              operatingTemperature: product.specifications.operatingTemperature || '',
              certifications: product.specifications.certifications || [],
              compatibility: product.specifications.compatibility || []
            });
          }
          
          setFeatures(product.features && product.features.length > 0 ? product.features : ['']);
          
          if (product.technicalSpecs) {
            console.log('=== TECHNICAL SPECS DEBUG ===');
            console.log('Type:', typeof product.technicalSpecs);
            console.log('Is Map:', product.technicalSpecs instanceof Map);
            console.log('Is Array:', Array.isArray(product.technicalSpecs));
            console.log('Value:', product.technicalSpecs);
            
            let techSpecsArray = [];
            
            // Handle different types of technicalSpecs
            if (product.technicalSpecs instanceof Map) {
              // If it's a Map object
              techSpecsArray = Array.from(product.technicalSpecs.entries()).map(([key, value]) => ({ key, value }));
            } else if (Array.isArray(product.technicalSpecs)) {
              // If it's an array
              techSpecsArray = product.technicalSpecs.map(spec => ({
                key: spec.key || '',
                value: spec.value || ''
              }));
            } else if (typeof product.technicalSpecs === 'object' && product.technicalSpecs !== null) {
              // If it's a plain object
              techSpecsArray = Object.entries(product.technicalSpecs).map(([key, value]) => ({ key, value }));
            }
            
            console.log('Processed tech specs:', techSpecsArray);
            setTechnicalSpecs(techSpecsArray.length > 0 ? techSpecsArray : [{ key: '', value: '' }]);
          }
          
          setCompletedSteps(new Set([1, 2, 3, 4, 5]));
          setLoading(false);
        })
        .catch(err => {
          console.error('Error loading product details:', err);
          console.error('Error response:', err.response);
          console.error('Error message:', err.message);
          
          if (err.response?.status === 404) {
            setError('Product not found. It may have been deleted.');
          } else if (err.response?.status === 401) {
            setError('Authentication required. Please log in again.');
          } else if (err.response?.status === 403) {
            setError('Access denied. Admin privileges required.');
          } else if (err.response?.status === 429) {
            setError('Too many requests. Please wait a moment and try again.');
          } else {
            setError(`Failed to load product details: ${err.message}`);
          }
          setLoading(false);
        });
    }
  }, [id]);

  // Touch gesture handlers
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentStep < steps.length) {
      handleNext();
    } else if (isRightSwipe && currentStep > 1) {
      handlePrevious();
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(prev => [...prev, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleImageUpload = async () => {
    if (imageFiles.length === 0) return [];
    
    setUploadingImages(true);
    const uploadPromises = imageFiles.map(file => uploadService.uploadImage(file));
    
    try {
      const results = await Promise.all(uploadPromises);
      setUploadingImages(false);
      return results;
    } catch (error) {
      setUploadingImages(false);
      throw new Error('Failed to upload images');
    }
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value === 'new') {
      setShowNewCategoryForm(true);
    } else {
      setCategory(value);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    
    setCreatingCategory(true);
    try {
      const newCategory = await createCategory({ name: newCategoryName.trim() });
      setCategories(prev => [...prev, newCategory]);
      setCategory(newCategory._id);
      setShowNewCategoryForm(false);
      setNewCategoryName('');
    } catch (err) {
      setError('Failed to create category');
    } finally {
      setCreatingCategory(false);
    }
  };

  const addFeature = () => {
    setFeatures(prev => [...prev, '']);
  };

  const removeFeature = (index) => {
    setFeatures(prev => prev.filter((_, i) => i !== index));
  };

  const updateFeature = (index, value) => {
    setFeatures(prev => prev.map((f, i) => i === index ? value : f));
  };

  const addTechnicalSpec = () => {
    setTechnicalSpecs(prev => [...prev, { key: '', value: '' }]);
  };

  const removeTechnicalSpec = (index) => {
    setTechnicalSpecs(prev => prev.filter((_, i) => i !== index));
  };

  const updateTechnicalSpec = (index, field, value) => {
    setTechnicalSpecs(prev => prev.map((spec, i) => i === index ? { ...spec, [field]: value } : spec));
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return name.trim() && price > 0 && category;
      case 2:
        return true; // Optional step
      case 3:
        return true; // Optional step
      case 4:
        return true; // Optional step
      case 5:
        return true; // Optional step
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
        // Auto-scroll to show the next step
        setTimeout(() => {
          const progressSteps = document.querySelector('.progress-steps');
          if (progressSteps) {
            const stepWidth = 220; // Approximate width of each step
            const scrollAmount = stepWidth * (currentStep - 1);
            progressSteps.scrollTo({
              left: scrollAmount,
              behavior: 'smooth'
            });
          }
        }, 100);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    setSkippedSteps(prev => new Set([...prev, currentStep]));
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      // Auto-scroll to show the next step
      setTimeout(() => {
        const progressSteps = document.querySelector('.progress-steps');
        if (progressSteps) {
          const stepWidth = 220; // Approximate width of each step
          const scrollAmount = stepWidth * (currentStep - 1);
          progressSteps.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!name.trim()) {
      setError('Product name is required');
      setLoading(false);
      return;
    }
    if (!price || price <= 0) {
      setError('Valid price is required');
      setLoading(false);
      return;
    }
    if (!category) {
      setError('Please select a category');
      setLoading(false);
      return;
    }

    try {
      let imageData = [];
      
      if (imageFiles.length > 0) {
        imageData = await handleImageUpload();
      }

      const techSpecsMap = new Map();
      technicalSpecs.forEach(spec => {
        if (spec.key && spec.value) {
          techSpecsMap.set(spec.key, spec.value);
        }
      });

      const productData = {
        name: name.trim(),
        description: description.trim(),
        shortDescription: shortDescription.trim(),
        detailedDescription: detailedDescription.trim(),
        price: Number(price),
        category: category,
        stock: Number(stock),
        sku: sku.trim(),
        isActive,
        isFeatured,
        isNew,
        isOnSale,
        salePrice: salePrice ? Number(salePrice) : null,
        saleEndDate: saleEndDate || null,
        specifications,
        features: features.filter(f => f.trim() !== ''),
        technicalSpecs: techSpecsMap
      };

      if (imageData.length > 0) {
        productData.imageData = JSON.stringify(imageData);
      }

      if (id) {
        await updateProduct(id, productData);
        navigate('/admin/products');
      } else {
        await createProduct(productData);
        navigate('/admin/products');
      }
    } catch (err) {
      setError(err.message || 'The operation failed. Please check the fields.');
      setLoading(false);
    }
  };

  if (loading && id) return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '50vh',
      fontSize: '1.2rem',
      color: '#666'
    }}>
      Loading product details...
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <h3>Basic Product Information</h3>
            <p className="step-description">Let's start with the essential details about your product.</p>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter product name"
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Category *</label>
                <select value={category} onChange={handleCategoryChange} className="form-input">
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                  <option value="new">+ Add New Category</option>
                </select>
                
                {showNewCategoryForm && (
                  <div className="new-category-form">
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Enter category name"
                      className="form-input"
                    />
                    <button
                      type="button"
                      onClick={handleCreateCategory}
                      disabled={creatingCategory}
                      className="btn-secondary"
                    >
                      {creatingCategory ? 'Creating...' : 'Create Category'}
                    </button>
                  </div>
                )}
              </div>
              
              <div className="form-group">
                <label>Price *</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Stock Quantity</label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="0"
                  min="0"
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>SKU (Stock Keeping Unit)</label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="Enter SKU"
                  className="form-input"
                />
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="step-content">
            <h3>Product Descriptions</h3>
            <p className="step-description">Help customers understand your product with clear descriptions.</p>
            
            <div className="form-group">
              <label>Short Description</label>
              <textarea
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Brief description for product listings"
                rows="3"
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label>Full Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed product description"
                rows="4"
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label>Detailed Description</label>
              <textarea
                value={detailedDescription}
                onChange={(e) => setDetailedDescription(e.target.value)}
                placeholder="Comprehensive product information"
                rows="6"
                className="form-input"
              />
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="step-content">
            <h3>Product Specifications</h3>
            <p className="step-description">Add technical specifications and features to help customers make informed decisions.</p>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Capacity</label>
                <input
                  type="text"
                  value={specifications.capacity}
                  onChange={(e) => setSpecifications(s => ({...s, capacity: e.target.value}))}
                  placeholder="e.g., 1000W"
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Dimensions</label>
                <input
                  type="text"
                  value={specifications.dimensions}
                  onChange={(e) => setSpecifications(s => ({...s, dimensions: e.target.value}))}
                  placeholder="e.g., 50cm x 30cm x 20cm"
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Weight</label>
                <input
                  type="text"
                  value={specifications.weight}
                  onChange={(e) => setSpecifications(s => ({...s, weight: e.target.value}))}
                  placeholder="e.g., 5kg"
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Material</label>
                <input
                  type="text"
                  value={specifications.material}
                  onChange={(e) => setSpecifications(s => ({...s, material: e.target.value}))}
                  placeholder="e.g., Stainless Steel"
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Warranty</label>
                <input
                  type="text"
                  value={specifications.warranty}
                  onChange={(e) => setSpecifications(s => ({...s, warranty: e.target.value}))}
                  placeholder="e.g., 2 years"
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Efficiency</label>
                <input
                  type="text"
                  value={specifications.efficiency}
                  onChange={(e) => setSpecifications(s => ({...s, efficiency: e.target.value}))}
                  placeholder="e.g., 95%"
                  className="form-input"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Product Features</label>
              {features.map((feature, idx) => (
                <div key={idx} className="feature-item">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => updateFeature(idx, e.target.value)}
                    placeholder="Enter a feature"
                    className="form-input"
                  />
                  <button
                    type="button"
                    onClick={() => removeFeature(idx)}
                    className="btn-remove"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button type="button" onClick={addFeature} className="btn-add">
                + Add Feature
              </button>
            </div>
            
            <div className="form-group">
              <label>Technical Specifications</label>
              {technicalSpecs.map((spec, idx) => (
                <div key={idx} className="tech-spec-item">
                  <input
                    type="text"
                    placeholder="Specification name"
                    value={spec.key}
                    onChange={(e) => updateTechnicalSpec(idx, 'key', e.target.value)}
                    className="form-input"
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={spec.value}
                    onChange={(e) => updateTechnicalSpec(idx, 'value', e.target.value)}
                    className="form-input"
                  />
                  <button
                    type="button"
                    onClick={() => removeTechnicalSpec(idx)}
                    className="btn-remove"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button type="button" onClick={addTechnicalSpec} className="btn-add">
                + Add Technical Spec
              </button>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="step-content">
            <h3>Product Images</h3>
            <p className="step-description">Upload high-quality images to showcase your product.</p>
            
            <div className="image-upload-area">
              <div className="upload-zone">
                <span className="upload-icon">📷</span>
                <p>Drag & drop images here or click to browse</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input"
                />
              </div>
            </div>
            
            {imagePreviews.length > 0 && (
              <div className="image-previews">
                <h4>Uploaded Images</h4>
                <div className="preview-grid">
                  {imagePreviews.map((src, i) => (
                    <div key={i} className="image-preview">
                      <img src={src} alt="" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="remove-image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
        
      case 5:
        return (
          <div className="step-content">
            <h3>Product Status & Pricing</h3>
            <p className="step-description">Configure product visibility and pricing options.</p>
            
            <div className="form-grid">
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                  />
                  Active Product
                </label>
              </div>
              
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                  />
                  Featured Product
                </label>
              </div>
              
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={isNew}
                    onChange={(e) => setIsNew(e.target.checked)}
                  />
                  New Product
                </label>
              </div>
              
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={isOnSale}
                    onChange={(e) => setIsOnSale(e.target.checked)}
                  />
                  On Sale
                </label>
              </div>
            </div>
            
            {isOnSale && (
              <div className="sale-settings">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Sale Price</label>
                    <input
                      type="number"
                      value={salePrice}
                      onChange={(e) => setSalePrice(e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Sale End Date</label>
                    <input
                      type="date"
                      value={saleEndDate}
                      onChange={(e) => setSaleEndDate(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="product-form-container">
      <div className="form-header">
        <h2>{id ? 'Edit Product' : 'Add New Product'}</h2>
        {error && <div className="error-message">{error}</div>}
      </div>
      
      {/* Progress Steps */}
      <div className="progress-steps">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`step ${currentStep === step.id ? 'active' : ''} ${
              completedSteps.has(step.id) ? 'completed' : ''
            } ${skippedSteps.has(step.id) ? 'skipped' : ''}`}
          >
            <div className="step-number">
              {completedSteps.has(step.id) ? '✓' : step.id}
            </div>
            <div className="step-info">
              <div className="step-title">{step.title}</div>
              <div className="step-description">{step.description}</div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Step Content */}
      <div 
        className="step-content-wrapper"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {renderStepContent()}
      </div>
      
      {/* Navigation */}
      <div className="step-navigation">
        <div className="nav-left">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="btn-cancel"
          >
            Cancel
          </button>
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handlePrevious}
              className="btn-secondary"
            >
              ← Previous
            </button>
          )}
        </div>
        
        <div className="nav-right">
          {currentStep < steps.length && (
            <>
              {!steps[currentStep - 1].required && (
                <button
                  type="button"
                  onClick={handleSkip}
                  className="btn-skip"
                >
                  Skip
                </button>
              )}
              <button
                type="button"
                onClick={handleNext}
                disabled={!validateCurrentStep()}
                className="btn-primary"
              >
                Next →
              </button>
            </>
          )}
          
          {currentStep === steps.length && (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || uploadingImages}
              className="btn-submit"
            >
              {loading ? 'Saving...' : uploadingImages ? 'Uploading...' : (id ? 'Update Product' : 'Create Product')}
            </button>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .product-form-container {
          max-width: 1000px;
          margin: 40px auto;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
          padding: 2.5rem;
          font-family: 'Poppins', sans-serif;
        }
        
        .form-header {
          margin-bottom: 2rem;
        }
        
        .form-header h2 {
          font-weight: 700;
          font-size: 2rem;
          margin-bottom: 1rem;
          color: #1a1a1a;
        }
        
        .error-message {
          color: #dc3545;
          background: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 1rem;
        }
        
        .progress-steps {
          display: flex;
          margin-bottom: 3rem;
          overflow: hidden;
          padding-bottom: 1rem;
          position: relative;
          width: 100%;
        }
        
        .step {
          display: flex;
          align-items: center;
          margin-right: 2rem;
          min-width: 200px;
          opacity: 0.6;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }
        
        .step.active {
          opacity: 1;
        }
        
        .step.completed {
          opacity: 1;
        }
        
        .step-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #e9ecef;
          color: #6c757d;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          margin-right: 12px;
          transition: all 0.3s ease;
        }
        
        .step.active .step-number {
          background: #007bff;
          color: white;
        }
        
        .step.completed .step-number {
          background: #28a745;
          color: white;
        }
        
        .step.skipped .step-number {
          background: #ffc107;
          color: #212529;
        }
        
        .step-info {
          flex: 1;
        }
        
        .step-title {
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 4px;
        }
        
        .step-description {
          font-size: 0.875rem;
          color: #495057;
        }
        
        .step-content-wrapper {
          margin-bottom: 3rem;
          touch-action: pan-y;
          user-select: none;
        }
        
        .step-content h3 {
          font-weight: 600;
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          color: #1a1a1a;
        }
        
        .step-content h3::after {
          content: ' ← Swipe to navigate →';
          font-size: 0.8rem;
          color: #6c757d;
          font-weight: 400;
          display: none;
        }
        
        @media (max-width: 768px) {
          .step-content h3::after {
            display: inline;
          }
        }
        
        .step-content .step-description {
          color: #6c757d;
          margin-bottom: 2rem;
          font-size: 1rem;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-group label {
          display: block;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }
        
        .form-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          font-size: 1rem;
          background: #f8f9fa;
          color: #1a1a1a;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #007bff;
          background: white;
          color: #1a1a1a;
          box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
        }
        
        .form-input::placeholder {
          color: #6c757d;
        }
        
        .checkbox-label {
          display: flex !important;
          align-items: center;
          cursor: pointer;
          font-weight: 500;
        }
        
        .checkbox-label input[type="checkbox"] {
          margin-right: 8px;
          width: 18px;
          height: 18px;
        }
        
        textarea.form-input,
        select.form-input {
          color: #1a1a1a;
          background: #f8f9fa;
        }
        
        textarea.form-input:focus,
        select.form-input:focus {
          background: white;
          color: #1a1a1a;
        }
        
        .new-category-form {
          margin-top: 1rem;
          display: flex;
          gap: 1rem;
        }
        
        .feature-item,
        .tech-spec-item {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          align-items: center;
        }
        
        .btn-add {
          background: #28a745;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 8px 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        
        .btn-add:hover {
          background: #218838;
        }
        
        .btn-remove {
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 18px;
          transition: background 0.2s ease;
        }
        
        .btn-remove:hover {
          background: #c82333;
        }
        
        .image-upload-area {
          margin-bottom: 2rem;
        }
        
        .upload-zone {
          border: 2px dashed #e9ecef;
          border-radius: 12px;
          padding: 3rem;
          text-align: center;
          background: #f8f9fa;
          position: relative;
          transition: all 0.2s ease;
        }
        
        .upload-zone:hover {
          border-color: #007bff;
          background: #f0f8ff;
        }
        
        .upload-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          display: block;
        }
        
        .file-input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }
        
        .image-previews {
          margin-top: 2rem;
        }
        
        .preview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }
        
        .image-preview {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          aspect-ratio: 1;
        }
        
        .image-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .remove-image {
          position: absolute;
          top: 4px;
          right: 4px;
          background: rgba(0,0,0,0.6);
          color: white;
          border: none;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 14px;
        }
        
        .sale-settings {
          margin-top: 2rem;
          padding: 1.5rem;
          background: #f8f9fa;
          border-radius: 8px;
        }
        
        .step-navigation {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 2rem;
          border-top: 1px solid #e9ecef;
        }
        
        .nav-left,
        .nav-right {
          display: flex;
          gap: 1rem;
        }
        
        .btn-primary,
        .btn-secondary,
        .btn-skip,
        .btn-submit {
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }
        
        .btn-primary {
          background: #007bff;
          color: white;
        }
        
        .btn-primary:hover:not(:disabled) {
          background: #0056b3;
        }
        
        .btn-primary:disabled {
          background: #6c757d;
          cursor: not-allowed;
        }
        
        .btn-secondary {
          background: #6c757d;
          color: white;
        }
        
        .btn-secondary:hover {
          background: #545b62;
        }
        
        .btn-skip {
          background: transparent;
          color: #6c757d;
          border: 1px solid #6c757d;
        }
        
        .btn-skip:hover {
          background: #6c757d;
          color: white;
        }
        
        .btn-submit {
          background: #28a745;
          color: white;
        }
        
        .btn-submit:hover:not(:disabled) {
          background: #218838;
        }
        
        .btn-submit:disabled {
          background: #6c757d;
          cursor: not-allowed;
        }
        
        .btn-cancel {
          background: #dc3545;
          color: white;
        }
        
        .btn-cancel:hover {
          background: #c82333;
        }
        
        @media (max-width: 768px) {
          .product-form-container {
            margin: 20px;
            padding: 1.5rem;
          }
          
          .form-grid {
            grid-template-columns: 1fr;
          }
          
          .progress-steps {
            flex-direction: column;
            gap: 1rem;
          }
          
          .step {
            margin-right: 0;
          }
          
          .step-navigation {
            flex-direction: column;
            gap: 1rem;
          }
          
          .nav-left,
          .nav-right {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminProductForm; 