import React, { useState, useEffect, useMemo } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { 
  useGetProductsQuery, 
  useCreateProductMutation, 
  useUpdateProductMutation, 
  useDeleteProductMutation,
  type Product,
  type CreateProductRequest
} from '../../apis/products';
import { uploadMultipleImagesToCloudinary } from '../../utils/cloudinary';

// Categories for the fashion store
const categories = [
  'Dresses', 'Tops', 'Bottoms', 'Outerwear', 'Shoes', 'Accessories', 'Bags', 'Jewelry'
];



// Predefined colors
const colors = [
  'Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple', 'Orange', 'Brown',
  'Gray', 'Navy', 'Beige', 'Cream', 'Gold', 'Silver', 'Rose Gold', 'White Gold', 'Yellow Gold',
  'Maroon', 'Teal', 'Coral', 'Lavender', 'Mint', 'Peach', 'Turquoise', 'Indigo', 'Violet'
];

// Predefined sizes
const sizes = [
  'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL',
  '28', '30', '32', '34', '36', '38', '40', '42', '44', '46', '48',
  '6', '7', '8', '9', '10', '11', '12', '13', '14', '15',
  'One Size', 'Free Size'
];

const Products = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce search term to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // API hooks
  const { data: productsData, isLoading, error } = useGetProductsQuery({
    page: currentPage,
    limit: 10,
    category: selectedCategory === 'all' ? undefined : selectedCategory,
    search: debouncedSearchTerm || undefined,
  }, {
    // Refetch when search term changes
    refetchOnMountOrArgChange: true,
  });

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  // Form state variables
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    originalPrice: '',
    stockQuantity: '',
    description: '',
    discount: '',
    colors: [] as string[],
    sizes: [] as string[],
    rating: 0,
    reviews: 0
  });

  // Custom input states
  const [customColor, setCustomColor] = useState('');
  const [customSize, setCustomSize] = useState('');
  
  // Image states
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  const products = productsData?.products || [];
  const totalPages = productsData?.pagination?.pages || 1;

  // Calculate final price based on form inputs
  const calculateFinalPrice = () => {
    const originalPrice = parseFloat(formData.originalPrice) || 0;
    const discount = parseFloat(formData.discount) || 0;

    if (discount === 0) {
      return originalPrice;
    }

    // Assuming discount is percentage
    return Math.max(0, originalPrice - (originalPrice * discount / 100));
  };

  const finalPrice = calculateFinalPrice();

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Image handling functions
  const handleImageSelect = (files: FileList) => {
    const newFiles = Array.from(files);
    const totalImages = selectedImages.length + newFiles.length;
    
    if (totalImages > 8) {
      toast.error('Maximum 8 images allowed per product');
      return;
    }

    // Validate all files
    for (const file of newFiles) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select only image files');
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('Image size should be less than 10MB');
        return;
      }
    }

    setSelectedImages(prev => [...prev, ...newFiles]);
    
    // Create previews for new images
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    // Remove from both selected images and previews
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    // Remove only from existing images (for editing)
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const setMainImage = (index: number) => {
    if (index === 0) return; // Already main image
    
    // Create new arrays for both images and previews
    const newPreviews = [...imagePreviews];
    
    // Move selected preview to first position
    const [selectedPreview] = newPreviews.splice(index, 1);
    newPreviews.unshift(selectedPreview);
    
    // Update only the previews since we're just reordering
    setImagePreviews(newPreviews);
    
    toast.success('Main image updated!');
  };

  // Color management
  const addColor = (color: string) => {
    if (color && !formData.colors.includes(color)) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, color]
      }));
    }
  };

  const removeColor = (colorToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter(color => color !== colorToRemove)
    }));
  };

  // Size management
  const addSize = (size: string) => {
    if (size && !formData.sizes.includes(size)) {
      setFormData(prev => ({
        ...prev,
        sizes: [...prev.sizes, size]
      }));
    }
  };

  const removeSize = (sizeToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter(size => size !== sizeToRemove)
    }));
  };





  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId).unwrap();
        toast.success('Product deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const getStatusColor = (product: Product) => {
    const isOutOfStock = !product.inStock || product.stockQuantity <= 0;
    return isOutOfStock ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';
  };

  const getStatusText = (product: Product) => {
    const isOutOfStock = !product.inStock || product.stockQuantity <= 0;
    return isOutOfStock ? 'Out of Stock' : 'In Stock';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR'
    }).format(price);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let imageUrls: string[] = [];
      
      if (editingProduct) {
        // For editing: filter out base64 data and use only Cloudinary URLs
        imageUrls = imagePreviews.filter(img => img.startsWith('http'));
        
        // Upload new images if any
        if (selectedImages.length > 0) {
          setUploadingImages(true);
          try {
            const uploadResults = await uploadMultipleImagesToCloudinary(selectedImages);
            const newImageUrls = uploadResults.map(result => result.secure_url);
            imageUrls = [...imageUrls, ...newImageUrls];
          } catch (uploadError) {
            toast.error('Failed to upload new images. Please try again.');
            setUploadingImages(false);
            return;
          }
          setUploadingImages(false);
        }
      } else {
        // For creating: upload selected images
        if (selectedImages.length > 0) {
          setUploadingImages(true);
          try {
            const uploadResults = await uploadMultipleImagesToCloudinary(selectedImages);
            imageUrls = uploadResults.map(result => result.secure_url);
          } catch (uploadError) {
            toast.error('Failed to upload images. Please try again.');
            setUploadingImages(false);
            return;
          }
          setUploadingImages(false);  
        }
      }
      
      const productData: CreateProductRequest = {
        name: formData.name,
        description: formData.description,
        price: finalPrice,
        originalPrice: parseFloat(formData.originalPrice) || finalPrice,
        category: formData.category,
        images: imageUrls,
        colors: formData.colors,
        sizes: formData.sizes,
        stockQuantity: parseInt(formData.stockQuantity),
        discount: parseFloat(formData.discount) || 0,
      };

      if (editingProduct) {
        await updateProduct({ _id: editingProduct._id, ...productData }).unwrap();
        toast.success('Product updated successfully!');
      } else {
        await createProduct(productData).unwrap();
        toast.success('Product created successfully!');
      }

      setShowAddModal(false);
      setEditingProduct(null);
      resetModal();
    } catch (error) {
      console.error('Failed to save product:', error);
      toast.error('Failed to save product. Please try again.');
    }
  };

  const resetModal = () => {
    setShowAddModal(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      category: '',
      originalPrice: '',
      stockQuantity: '',
      description: '',
      discount: '',
      colors: [],
      sizes: [],
      rating: 0,
      reviews: 0
    });
    setCustomColor('');
    setCustomSize('');
    setSelectedImages([]);
    setImagePreviews([]);
  };

  const handleEditProduct = async (product: Product) => {
    try {
      // Use the existing product data instead of fetching again
      // This avoids the "entity too large" error
      setEditingProduct(product);
      setFormData({
        name: product.name,
        category: product.category,
        originalPrice: product.originalPrice?.toString() || '',
        stockQuantity: product.stockQuantity.toString(),
        description: product.description,
        discount: product.discount.toString(),
        colors: product.colors,
        sizes: product.sizes || [],
        rating: product.rating,
        reviews: product.reviews
      });
      
      // Load existing images for editing
      if (product.images && product.images.length > 0) {
        setImagePreviews(product.images);
        setSelectedImages([]); // No new images selected initially
      } else {
        setImagePreviews([]);
        setSelectedImages([]);
      }
      
      setShowAddModal(true);
    } catch (error) {
      console.error('Failed to load product details:', error);
      toast.error('Failed to load product details. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          Error loading products. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Products Management</h1>
          <p className="text-slate-600">Manage your fashion products, inventory, and pricing</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 sm:mt-0 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
                     <div className="flex-1 relative">
             <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
             <input
               type="text"
               placeholder="Search products by name, description, or category..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-10 pr-10 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
             />
             {searchTerm && (
               <button
                 onClick={() => setSearchTerm('')}
                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
               >
                 <FiX className="w-4 h-4" />
               </button>
             )}
           </div>
          <div className="sm:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

             {/* Search Results Info */}
       {(searchTerm || selectedCategory !== 'all') && (
         <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
           <div className="flex items-center justify-between">
             <div className="flex items-center gap-2">
               <FiSearch className="text-blue-600" />
               <span className="text-blue-800 font-medium">
                 {searchTerm && `Search: "${searchTerm}"`}
                 {searchTerm && selectedCategory !== 'all' && ' • '}
                 {selectedCategory !== 'all' && `Category: ${selectedCategory}`}
               </span>
             </div>
             <div className="text-blue-600 text-sm">
               {products.length} product{products.length !== 1 ? 's' : ''} found
             </div>
           </div>
         </div>
       )}

       {/* Products Table */}
       <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
         <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-12 w-12 flex-shrink-0">
                        <img
                          className="h-12 w-12 rounded-lg object-cover"
                          src={product.images[0] || ''}
                          alt={product.name}
                        />
                      </div>
                                             <div className="ml-4">
                         <div className="text-sm font-medium text-slate-900">{product.name}</div>
                         <div className="text-xs text-slate-400">{product.images.length} image(s)</div>
                       </div>
                    </div>
                  </td>
                                     <td className="px-6 py-4 whitespace-nowrap">
                     <div className="text-sm text-slate-900">{product.category}</div>
                   </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      {product.originalPrice && product.originalPrice > product.price ? (
                        <>
                          <div className="text-sm font-semibold text-slate-900">{formatPrice(product.price)}</div>
                          <div className="text-xs text-slate-500 line-through">{formatPrice(product.originalPrice)}</div>
                        </>
                      ) : (
                        <div className="text-sm font-semibold text-slate-900">{formatPrice(product.price)}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-slate-900">{product.stockQuantity}</span>
                      {product.stockQuantity <= 5 && product.stockQuantity > 0 && (
                        <span className="text-xs text-amber-600 font-medium">Low Stock</span>
                      )}
                      {product.stockQuantity === 0 && (
                        <span className="text-xs text-red-600 font-medium">No Stock</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product)}`}>
                      {getStatusText(product)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                      >
                        <FiEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                        disabled={isDeleting}
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

                 {/* Empty State */}
         {products.length === 0 && (
           <div className="text-center py-12">
             <div className="text-6xl mb-4">
               {searchTerm || selectedCategory !== 'all' ? '🔍' : '🛍️'}
             </div>
             <h3 className="text-xl font-semibold text-slate-900 mb-2">
               {searchTerm || selectedCategory !== 'all' ? 'No products found' : 'No products yet'}
             </h3>
             <p className="text-slate-600 mb-4">
               {searchTerm || selectedCategory !== 'all' 
                 ? `No products match "${searchTerm || selectedCategory}". Try adjusting your search or category filter.`
                 : 'Get started by adding your first product to the store.'
               }
             </p>
             <button
               onClick={() => setShowAddModal(true)}
               className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
             >
               {searchTerm || selectedCategory !== 'all' ? 'Clear Filters' : 'Add Your First Product'}
             </button>
             {(searchTerm || selectedCategory !== 'all') && (
               <button
                 onClick={() => {
                   setSearchTerm('');
                   setSelectedCategory('all');
                 }}
                 className="ml-3 bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-2 rounded-lg font-medium transition-colors"
               >
                 Clear All
               </button>
             )}
           </div>
         )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-700">
                Showing page <span className="font-medium">{currentPage}</span> of{' '}
                <span className="font-medium">{totalPages}</span>
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-slate-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  onClick={resetModal}
                  className="text-slate-500 hover:text-slate-700 text-2xl"
                >
                  <FiX />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information Section */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-slate-900 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Product Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter product name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
                      <select 
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        required
                      >
                        <option value="">Select category</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter product description"
                      required
                    />
                  </div>
                </div>

                {/* Pricing Section */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-slate-900 mb-4">Pricing & Inventory</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Original Price (PKR) *</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.originalPrice}
                        onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Discount (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.discount}
                        onChange={(e) => handleInputChange('discount', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Stock Quantity *</label>
                      <input
                        type="number"
                        value={formData.stockQuantity}
                        onChange={(e) => handleInputChange('stockQuantity', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                        required
                      />
                    </div>
                  </div>

                  {/* Final Price Display */}
                  <div className="mt-4 bg-white rounded-lg p-4 border border-slate-200">
                    <h4 className="text-sm font-medium text-slate-700 mb-3">Price Summary</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Original Price</label>
                        <div className="text-lg font-semibold text-slate-900">
                          {formData.originalPrice ? `PKR ${formData.originalPrice}` : 'PKR 0'}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Discount</label>
                        <div className="text-lg font-semibold text-slate-900">
                          {formData.discount ? `${formData.discount}%` : '0%'}
                        </div>
                      </div>
                      <div className="flex items-end">
                        <div className="w-full bg-slate-50 rounded-lg p-3 border border-slate-200">
                          <div className="text-xs text-slate-500 mb-1">Final Price</div>
                          <div className="text-lg font-semibold text-slate-900">
                            {finalPrice > 0 ? `PKR ${finalPrice.toFixed(2)}` : 'PKR 0'}
                          </div>
                          {formData.discount && finalPrice > 0 && (
                            <div className="text-xs text-green-600 mt-1">
                              {formData.discount}% OFF
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Colors Section */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-slate-900 mb-4">Available Colors</h3>
                  
                  {/* Selected Colors */}
                  {formData.colors.length > 0 && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Selected Colors:</label>
                      <div className="flex flex-wrap gap-2">
                        {formData.colors.map((color, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                          >
                            {color}
                            <button
                              type="button"
                              onClick={() => removeColor(color)}
                              className="text-blue-500 hover:text-blue-700 text-lg leading-none"
                            >
                              <FiX className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Color Selection */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 mb-4">
                    {colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => addColor(color)}
                        disabled={formData.colors.includes(color)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                          formData.colors.includes(color)
                            ? 'bg-slate-200 text-slate-500 border-slate-300 cursor-not-allowed'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-slate-400'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>

                  {/* Custom Color Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      placeholder="Add custom color..."
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addColor(customColor);
                          setCustomColor('');
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        addColor(customColor);
                        setCustomColor('');
                      }}
                      disabled={!customColor.trim()}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-lg font-medium transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Sizes Section */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-slate-900 mb-4">Available Sizes</h3>
                  
                  {/* Selected Sizes */}
                  {formData.sizes.length > 0 && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Selected Sizes:</label>
                      <div className="flex flex-wrap gap-2">
                        {formData.sizes.map((size, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                          >
                            {size}
                            <button
                              type="button"
                              onClick={() => removeSize(size)}
                              className="text-green-500 hover:text-green-700 text-lg leading-none"
                            >
                              <FiX className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Size Selection */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 mb-4">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => addSize(size)}
                        disabled={formData.sizes.includes(size)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                          formData.sizes.includes(size)
                            ? 'bg-slate-200 text-slate-500 border-slate-300 cursor-not-allowed'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-slate-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>

                  {/* Custom Size Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customSize}
                      onChange={(e) => setCustomSize(e.target.value)}
                      placeholder="Add custom size..."
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSize(customSize);
                          setCustomSize('');
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        addSize(customSize);
                        setCustomSize('');
                      }}
                      disabled={!customSize.trim()}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-300 text-white rounded-lg font-medium transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>





                {/* Images Section */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-slate-900 mb-4">Product Images</h3>
                  
                  {/* Image Previews */}
                  {imagePreviews.length > 0 && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        {editingProduct ? 'Product Images:' : 'Selected Images:'}
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className={`w-full h-24 object-cover rounded-lg border-2 transition-all ${
                                index === 0 
                                  ? 'border-blue-500 ring-2 ring-blue-200' 
                                  : 'border-slate-300 hover:border-slate-400'
                              }`}
                            />
                            
                            {/* Main Image Badge */}
                            {index === 0 && (
                              <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                                Main
                              </div>
                            )}
                            
                            {/* Image Number */}
                            <div className={`absolute bottom-1 left-1 text-xs px-2 py-1 rounded ${
                              index === 0 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-black bg-opacity-50 text-white'
                            }`}>
                              {index + 1}
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {/* Set as Main Button */}
                              {index !== 0 && (
                                <button
                                  type="button"
                                  onClick={() => setMainImage(index)}
                                  className="bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600 transition-colors"
                                  title="Set as main image"
                                >
                                  <FiEdit className="w-3 h-3" />
                                </button>
                              )}
                              
                                                             {/* Remove Button */}
                               <button
                                 type="button"
                                 onClick={() => editingProduct ? removeExistingImage(index) : removeImage(index)}
                                 className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                 title="Remove image"
                               >
                                 <FiX className="w-3 h-3" />
                               </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                          <span>Main image (first image)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-slate-300 rounded-full"></div>
                          <span>Additional images</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">
                        {editingProduct 
                          ? 'Click the edit icon to set an image as main. First image will be the product thumbnail.'
                          : 'Click the edit icon to set an image as main. First image will be the product thumbnail.'
                        }
                      </p>
                    </div>
                  )}

                  {/* Upload Area */}
                  {imagePreviews.length < 8 && (
                    <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg hover:border-slate-400 transition-colors">
                      <div className="space-y-1 text-center">
                        <div className="text-6xl mb-4">📷</div>
                        <div className="flex text-sm text-slate-600">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                            <span>Upload images</span>
                            <input
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              multiple
                              onChange={(e) => {
                                const files = e.target.files;
                                if (files) {
                                  handleImageSelect(files);
                                }
                              }}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-slate-500">
                          PNG, JPG, GIF up to 10MB each. {imagePreviews.length}/8 images
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Additional Settings */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-slate-900 mb-4">Additional Settings</h3>
                  
                                     <div className="space-y-4">

                    {/* Rating and Reviews (for editing) */}
                    {editingProduct && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Rating</label>
                          <input
                            type="number"
                            min="0"
                            max="5"
                            step="0.1"
                            value={formData.rating}
                            onChange={(e) => handleInputChange('rating', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0.0"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Number of Reviews</label>
                          <input
                            type="number"
                            min="0"
                            value={formData.reviews}
                            onChange={(e) => handleInputChange('reviews', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 pt-4">
                                     <button
                     type="submit"
                     className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
                     disabled={isCreating || isUpdating || uploadingImages}
                   >
                     {uploadingImages ? 'Uploading Images...' :
                      isCreating ? 'Creating Product...' : 
                      isUpdating ? 'Updating Product...' : 
                      editingProduct ? 'Update Product' : 'Add Product'}
                   </button>
                  <button
                    type="button"
                    onClick={resetModal}
                    className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
