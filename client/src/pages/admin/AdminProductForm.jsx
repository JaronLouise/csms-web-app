import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, updateProduct, getProductById } from '../../services/adminService';
import { getCategories, createCategory } from '../../services/categoryService';
import uploadService from '../../services/uploadService';

const AdminProductForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState(0);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // New category form state
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [creatingCategory, setCreatingCategory] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams(); // For editing existing product

  useEffect(() => {
    // Fetch categories for the dropdown
    getCategories()
      .then(setCategories)
      .catch(() => setError('Could not load categories.'));

    // If there's an ID, we are in "edit" mode
    if (id) {
      console.log('Loading product for editing, ID:', id);
      setLoading(true);
      getProductById(id)
        .then(product => {
          console.log('Product loaded successfully:', product.name);
          setName(product.name);
          setDescription(product.description);
          setPrice(product.price);
          setCategory(product.category._id);
          setStock(product.stock);
          
          // Set image preview if product has images
          if (product.images && product.images.length > 0) {
            setImagePreview(product.images[0].url);
          }
        })
        .catch((err) => {
          console.error('Error loading product:', err);
          setError('Could not find the product.');
        })
        .finally(() => setLoading(false));
    } else {
      console.log('Creating new product');
    }
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return null;

    setUploadingImage(true);
    try {
      const result = await uploadService.uploadImage(imageFile, 'products');
      setUploadingImage(false);
      return result.data;
    } catch (error) {
      setUploadingImage(false);
      throw new Error('Failed to upload image: ' + error.message);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Frontend validation
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
    if (stock < 0) {
      setError('Stock cannot be negative');
      setLoading(false);
      return;
    }

    try {
      let imageData = null;
      
      // Upload image if a new one is selected
      if (imageFile) {
        imageData = await handleImageUpload();
      }

      const productData = {
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        category: category,
        stock: Number(stock)
      };

      // Add image data if uploaded
      if (imageData) {
        productData.imageData = JSON.stringify(imageData);
      }

      if (id) {
        console.log('Updating product:', id);
        await updateProduct(id, productData);
        console.log('Product updated successfully');
        navigate('/admin/products');
      } else {
        console.log('Creating new product');
        await createProduct(productData);
        console.log('Product created successfully');
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
    <div>
      <h3>{id ? 'Edit Product' : 'Add New Product'}</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} required />
        
        <label>Description:</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} required />

        <label>Price:</label>
        <input type="number" value={price} onChange={e => setPrice(e.target.value)} required />

        <label>Stock:</label>
        <input type="number" value={stock} onChange={e => setStock(e.target.value)} required />
        
        <label>Category:</label>
        <select value={category} onChange={handleCategoryChange} required>
          <option value="">Select a category</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
          <option value="new">+ Create New Category</option>
        </select>

        {showNewCategoryForm && (
          <div style={{ marginTop: '10px', padding: '10px', border: '1px solid #ccc' }}>
            <label>New Category Name:</label>
            <input 
              type="text" 
              value={newCategoryName} 
              onChange={e => setNewCategoryName(e.target.value)}
              placeholder="Enter category name"
            />
            <button 
              type="button" 
              onClick={handleCreateCategory}
              disabled={creatingCategory}
            >
              {creatingCategory ? 'Creating...' : 'Create Category'}
            </button>
            <button 
              type="button" 
              onClick={() => {
                setShowNewCategoryForm(false);
                setNewCategoryName('');
                setCategory('');
              }}
            >
              Cancel
            </button>
          </div>
        )}

        <label>Image:</label>
        <input 
          type="file" 
          accept="image/*"
          onChange={handleImageChange}
          disabled={uploadingImage}
        />
        
        {imagePreview && (
          <div style={{ marginTop: '10px' }}>
            <img 
              src={imagePreview} 
              alt="Preview" 
              style={{ 
                maxWidth: '200px', 
                maxHeight: '200px', 
                border: '1px solid #ccc',
                borderRadius: '4px'
              }} 
            />
          </div>
        )}
        
        <button type="submit" disabled={loading || uploadingImage}>
          {loading ? 'Saving...' : uploadingImage ? 'Uploading Image...' : (id ? 'Update Product' : 'Create Product')}
        </button>
      </form>
    </div>
  );
};

export default AdminProductForm; 