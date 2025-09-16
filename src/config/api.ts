// API Configuration for Admin Panel
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api/v1',
  ENDPOINTS: {
    PRODUCTS: '/products',
    ORDERS: '/order',
    AUTH: '/auth',
    ANALYTICS: '/analytics'
  },
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3
};

// Helper function to build full URL
export const buildApiUrl = (endpoint: string) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Environment check
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;

// App configuration
export const APP_CONFIG = {
  NAME: import.meta.env.VITE_APP_NAME || 'Women Street Admin',
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  ENABLE_DEBUG: import.meta.env.VITE_ENABLE_DEBUG === 'true'
};

// Validation
if (!API_CONFIG.BASE_URL) {
  console.error('❌ VITE_API_BASE_URL is not defined in .env file');
}

// Debug logging in development
if (isDevelopment && APP_CONFIG.ENABLE_DEBUG) {
  console.log('🔧 Admin API Configuration:', API_CONFIG);
  console.log('⚙️ Admin App Configuration:', APP_CONFIG);
}
