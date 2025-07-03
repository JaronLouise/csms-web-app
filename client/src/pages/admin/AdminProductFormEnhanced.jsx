import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, updateProduct, getProductById } from '../../services/adminService';
import { getCategories, createCategory } from '../../services/categoryService';
import uploadService from '../../services/uploadService';

const AdminProductFormEnhanced = () => {
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
  const [activeTab, setActiveTab] = useState('basic');
  
  // New category form state
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [creatingCategory, setCreatingCategory] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setError('Could not load categories.'));

    if (id) {
      setLoading(true);
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
            const techSpecsArray = Array.from(product.technicalSpecs.entries()).map(([key, value]) => ({ key, value }));
            setTechnicalSpecs(techSpecsArray.length > 0 ? techSpecsArray : [{ key: '', value: '' }]);
          }
          
          if (product.images && product.images.length > 0) {
            setImagePreviews(product.images.map(img => img.url));
          }
        })
        .catch((err) => {
          console.error('Error loading product:', err);
          setError('Could not find the product.');
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

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

  const handleImageUpload = async () => {
    if (imageFiles.length === 0) return [];

    setUploadingImages(true);
    try {
      const uploadPromises = imageFiles.map(file => uploadService.uploadImage(file, 'products'));
      const results = await Promise.all(uploadPromises);
      setUploadingImages(false);
      return results.map(result => result.data);
    } catch (error) {
      setUploadingImages(false);
      throw new Error('Failed to upload images: ' + error.message);
    }
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value === 'new') {
      setShowNewCategoryForm(true);
      setCategory('');
    } else {
      setCategory(value);
      setShowNewCategoryForm(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      setError('Category name is required');
      return;
    }

    setCreatingCategory(true);
    setError(null);

    try {
      const newCategory = await createCategory({ name: newCategoryName.trim() });
      setCategories([...categories, newCategory]);
      setCategory(newCategory._id);
      setNewCategoryName('');
      setShowNewCategoryForm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create category');
    } finally {
      setCreatingCategory(false);
    }
  };

  // Feature management
  const addFeature = () => {
    setFeatures([...features, '']);
  };

  const removeFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const updateFeature = (index, value) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  // Technical specs management
  const addTechnicalSpec = () => {
    setTechnicalSpecs([...technicalSpecs, { key: '', value: '' }]);
  };

  const removeTechnicalSpec = (index) => {
    setTechnicalSpecs(technicalSpecs.filter((_, i) => i !== index));
  };

  const updateTechnicalSpec = (index, field, value) => {
    const newSpecs = [...technicalSpecs];
    newSpecs[index][field] = value;
    setTechnicalSpecs(newSpecs);
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

      // Convert technical specs to Map
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
      console.error('Operation failed:', err.message);
      setError(err.message || 'The operation failed. Please check the fields.');
      setLoading(false);
    }
  };
  
  if (loading && id) return <p>Loading product details...</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>{id ? 'Edit Product' : 'Add New Product'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {/* Tab Navigation */}
      <div style={{ marginBottom: '20px', borderBottom: '1px solid #ddd' }}>
        {['basic', 'specifications'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 20px',
              marginRight: '10px',
              border: 'none',
              background: activeTab === tab ? '#28a745' : '#f8f9fa',
              color: activeTab === tab ? 'white' : '#333',
              cursor: 'pointer',
              borderRadius: '5px'
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Basic Information Tab */}
        {activeTab === 'basic' && (
          <div>
            <div style={{ marginBottom: '15px' }}>
              <label>Product Name *:</label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label>Short Description:</label>
              <textarea 
                value={shortDescription} 
                onChange={e => setShortDescription(e.target.value)}
                placeholder="Brief description for product cards"
                style={{ width: '100%', padding: '8px', marginTop: '5px', height: '60px' }}
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label>Detailed Description:</label>
              <textarea 
                value={detailedDescription} 
                onChange={e => setDetailedDescription(e.target.value)}
                placeholder="Comprehensive description for product detail page"
                style={{ width: '100%', padding: '8px', marginTop: '5px', height: '120px' }}
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label>Price *:</label>
                <input 
                  type="number" 
                  value={price} 
                  onChange={e => setPrice(e.target.value)} 
                  required 
                  step="0.01"
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>
              <div>
                <label>Stock:</label>
                <input 
                  type="number" 
                  value={stock} 
                  onChange={e => setStock(e.target.value)} 
                  min="0"
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label>Category *:</label>
              <select value={category} onChange={handleCategoryChange} required style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
                <option value="new">+ Add New Category</option>
              </select>
            </div>
            
            {showNewCategoryForm && (
              <div style={{ marginBottom: '15px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
                <label>New Category Name:</label>
                <input 
                  type="text" 
                  value={newCategoryName} 
                  onChange={e => setNewCategoryName(e.target.value)}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
                <button type="button" onClick={handleCreateCategory} disabled={creatingCategory} style={{ marginTop: '10px', padding: '8px 16px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}>
                  {creatingCategory ? 'Creating...' : 'Create Category'}
                </button>
              </div>
            )}
            
            <div style={{ marginBottom: '15px' }}>
              <label>SKU:</label>
              <input 
                type="text" 
                value={sku} 
                onChange={e => setSku(e.target.value)}
                placeholder="Stock Keeping Unit"
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label>Images:</label>
              <input 
                type="file" 
                multiple 
                accept="image/*"
                onChange={handleImageChange}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
              {imagePreviews.length > 0 && (
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                  {imagePreviews.map((preview, index) => (
                    <img key={index} src={preview} alt={`Preview ${index + 1}`} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px' }} />
                  ))}
                </div>
              )}
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label>
                <input 
                  type="checkbox" 
                  checked={isActive} 
                  onChange={e => setIsActive(e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                Active
              </label>
              <label style={{ marginLeft: '20px' }}>
                <input 
                  type="checkbox" 
                  checked={isFeatured} 
                  onChange={e => setIsFeatured(e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                Featured
              </label>
              <label style={{ marginLeft: '20px' }}>
                <input 
                  type="checkbox" 
                  checked={isNew} 
                  onChange={e => setIsNew(e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                New Product
              </label>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label>
                <input 
                  type="checkbox" 
                  checked={isOnSale} 
                  onChange={e => setIsOnSale(e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                On Sale
              </label>
              {isOnSale && (
                <div style={{ marginTop: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label>Sale Price:</label>
                    <input 
                      type="number" 
                      value={salePrice} 
                      onChange={e => setSalePrice(e.target.value)}
                      step="0.01"
                      style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                  </div>
                  <div>
                    <label>Sale End Date:</label>
                    <input 
                      type="date" 
                      value={saleEndDate} 
                      onChange={e => setSaleEndDate(e.target.value)}
                      style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Specifications Tab */}
        {activeTab === 'specifications' && (
          <div>
            <h3>Product Specifications</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label>Capacity:</label>
                <input 
                  type="text" 
                  value={specifications.capacity} 
                  onChange={e => setSpecifications({...specifications, capacity: e.target.value})}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>
              <div>
                <label>Dimensions:</label>
                <input 
                  type="text" 
                  value={specifications.dimensions} 
                  onChange={e => setSpecifications({...specifications, dimensions: e.target.value})}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label>Warranty:</label>
                <input 
                  type="text" 
                  value={specifications.warranty} 
                  onChange={e => setSpecifications({...specifications, warranty: e.target.value})}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>
              <div>
                <label>Efficiency:</label>
                <input 
                  type="text" 
                  value={specifications.efficiency} 
                  onChange={e => setSpecifications({...specifications, efficiency: e.target.value})}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label>Weight:</label>
                <input 
                  type="text" 
                  value={specifications.weight} 
                  onChange={e => setSpecifications({...specifications, weight: e.target.value})}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>
              <div>
                <label>Material:</label>
                <input 
                  type="text" 
                  value={specifications.material} 
                  onChange={e => setSpecifications({...specifications, material: e.target.value})}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label>Power Output:</label>
                <input 
                  type="text" 
                  value={specifications.powerOutput} 
                  onChange={e => setSpecifications({...specifications, powerOutput: e.target.value})}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>
              <div>
                <label>Voltage:</label>
                <input 
                  type="text" 
                  value={specifications.voltage} 
                  onChange={e => setSpecifications({...specifications, voltage: e.target.value})}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label>Current:</label>
                <input 
                  type="text" 
                  value={specifications.current} 
                  onChange={e => setSpecifications({...specifications, current: e.target.value})}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>
              <div>
                <label>Operating Temperature:</label>
                <input 
                  type="text" 
                  value={specifications.operatingTemperature} 
                  onChange={e => setSpecifications({...specifications, operatingTemperature: e.target.value})}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>
            </div>
            
            <h4>Product Features</h4>
            {features.map((feature, index) => (
              <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <input 
                  type="text" 
                  value={feature} 
                  onChange={e => updateFeature(index, e.target.value)}
                  placeholder="Enter feature"
                  style={{ flex: 1, padding: '8px' }}
                />
                <button type="button" onClick={() => removeFeature(index)} style={{ padding: '8px 16px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px' }}>
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={addFeature} style={{ padding: '8px 16px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}>
              Add Feature
            </button>
            
            <h4>Technical Specifications</h4>
            {technicalSpecs.map((spec, index) => (
              <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '10px', marginBottom: '10px' }}>
                <input 
                  type="text" 
                  value={spec.key} 
                  onChange={e => updateTechnicalSpec(index, 'key', e.target.value)}
                  placeholder="Specification name"
                  style={{ padding: '8px' }}
                />
                <input 
                  type="text" 
                  value={spec.value} 
                  onChange={e => updateTechnicalSpec(index, 'value', e.target.value)}
                  placeholder="Specification value"
                  style={{ padding: '8px' }}
                />
                <button type="button" onClick={() => removeTechnicalSpec(index)} style={{ padding: '8px 16px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px' }}>
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={addTechnicalSpec} style={{ padding: '8px 16px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}>
              Add Technical Spec
            </button>
          </div>
        )}

        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <button 
            type="submit" 
            disabled={loading || uploadingImages}
            style={{ 
              padding: '12px 30px', 
              background: '#28a745', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px',
              fontSize: '16px',
              cursor: loading || uploadingImages ? 'not-allowed' : 'pointer',
              opacity: loading || uploadingImages ? 0.6 : 1
            }}
          >
            {loading ? 'Saving...' : uploadingImages ? 'Uploading Images...' : (id ? 'Update Product' : 'Create Product')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductFormEnhanced; 