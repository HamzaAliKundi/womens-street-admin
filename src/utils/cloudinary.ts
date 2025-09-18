// Cloudinary configuration and upload utilities
// Add your Cloudinary credentials to .env file:
// VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
// VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
// VITE_CLOUDINARY_API_KEY=your_api_key (optional, for signed uploads)

export interface UploadResult {
  url: string;
  public_id: string;
  secure_url: string;
}

export const cloudinaryConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY,
};

export const uploadImageToCloudinary = async (file: File): Promise<UploadResult> => {
  try {
    // Get environment variables
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

    // Validate required environment variables
    if (!cloudName) {
      throw new Error('VITE_CLOUDINARY_CLOUD_NAME is not configured. Please check your .env file.');
    }

    console.log('Cloudinary Config:', { cloudName }); // Debug log

    // Use unsigned upload with a default preset
    // This will work if your Cloudinary account allows unsigned uploads
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default'); // Default unsigned preset
    formData.append('folder', 'women-street'); // Optional: organize uploads in a folder
    
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    console.log('Upload URL:', uploadUrl); // Debug log

    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cloudinary API Error:', errorText);
      
      // If ml_default doesn't work, try without any preset
      if (response.status === 400) {
        console.log('Trying upload without preset...');
        const retryFormData = new FormData();
        retryFormData.append('file', file);
        retryFormData.append('folder', 'women-street');
        
        const retryResponse = await fetch(uploadUrl, {
          method: 'POST',
          body: retryFormData,
        });
        
        if (!retryResponse.ok) {
          const retryErrorText = await retryResponse.text();
          console.error('Retry Cloudinary API Error:', retryErrorText);
          throw new Error(`Failed to upload image: ${retryResponse.status} ${retryResponse.statusText}`);
        }
        
        const retryResult = await retryResponse.json();
        console.log('Retry upload successful:', retryResult.secure_url);
        
        return {
          url: retryResult.secure_url,
          public_id: retryResult.public_id,
          secure_url: retryResult.secure_url
        };
      }
      
      throw new Error(`Failed to upload image: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Upload successful:', result.secure_url); // Debug log
    
    return {
      url: result.secure_url,
      public_id: result.public_id,
      secure_url: result.secure_url
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to upload image to Cloudinary');
  }
};

export const uploadMultipleImagesToCloudinary = async (files: File[]): Promise<UploadResult[]> => {
  try {
    const uploadPromises = files.map(file => uploadImageToCloudinary(file));
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Multiple image upload error:', error);
    throw new Error('Failed to upload images to Cloudinary');
  }
};

export const deleteImageFromCloudinary = async (publicId: string): Promise<boolean> => {
  if (!cloudinaryConfig.cloudName || !cloudinaryConfig.apiKey) {
    console.warn('Cannot delete image: API key not configured');
    return false;
  }

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/destroy`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          public_id: publicId,
          api_key: cloudinaryConfig.apiKey,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Delete failed: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return false;
  }
};

export const getOptimizedImageUrl = (originalUrl: string, options: {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
} = {}): string => {
  if (!originalUrl.includes('cloudinary.com')) {
    return originalUrl;
  }

  const { width, height, quality = 'auto', format = 'auto' } = options;
  let url = originalUrl;

  // Add transformation parameters
  const transformations = [];
  
  if (width || height) {
    const size = [];
    if (width) size.push(`w_${width}`);
    if (height) size.push(`h_${height}`);
    if (size.length > 0) {
      size.push('c_fill');
      transformations.push(size.join(','));
    }
  }

  if (quality !== 'auto') {
    transformations.push(`q_${quality}`);
  }

  if (format !== 'auto') {
    transformations.push(`f_${format}`);
  }

  if (transformations.length > 0) {
    // Insert transformations before the filename
    const urlParts = url.split('/upload/');
    if (urlParts.length === 2) {
      url = `${urlParts[0]}/upload/${transformations.join('/')}/${urlParts[1]}`;
    }
  }

  return url;
};

// Helper function to validate file before upload
export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Please select a valid image file (JPEG, PNG, WebP, or GIF)'
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'File size must be less than 10MB'
    };
  }

  return { isValid: true };
};
