import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from '../../config/api';

// Analytics interfaces
export interface DashboardAnalytics {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  revenueChange: number;
  ordersChange: number;
  customersChange: number;
  productsChange: number;
  revenueByStatus: {
    delivered: number;
    pending: number;
    processing: number;
    cancelled: number;
  };
}

export interface RecentSale {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  productId: string;
  name: string;
  sales: number;
  revenue: number;
}

export interface CategoryRevenue {
  category: string;
  revenue: number;
  percentage: number;
}

export interface OrderStatusDistribution {
  status: string;
  count: number;
  percentage: number;
}

// Response interfaces
export interface DashboardAnalyticsResponse {
  message: string;
  status: number;
  data: DashboardAnalytics;
}

export interface RecentSalesResponse {
  message: string;
  status: number;
  data: RecentSale[];
}

export interface TopProductsResponse {
  message: string;
  status: number;
  data: TopProduct[];
}

export interface CategoryRevenueResponse {
  message: string;
  status: number;
  data: CategoryRevenue[];
}

export interface OrderStatusResponse {
  message: string;
  status: number;
  data: OrderStatusDistribution[];
}

export const analyticsApi = createApi({
  reducerPath: 'analyticsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ANALYTICS}`,
    timeout: API_CONFIG.TIMEOUT,
    prepareHeaders: (headers, { getState }) => {
      // Add authentication token
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Analytics'],
  endpoints: (builder) => ({
    // Get dashboard analytics
    getDashboardAnalytics: builder.query<DashboardAnalyticsResponse, void>({
      query: () => '/dashboard',
      providesTags: ['Analytics'],
    }),

    // Get recent sales (last 7 days)
    getRecentSales: builder.query<RecentSalesResponse, void>({
      query: () => '/recent-sales',
      providesTags: ['Analytics'],
    }),

    // Get top performing products
    getTopProducts: builder.query<TopProductsResponse, { limit?: number }>({
      query: ({ limit = 5 } = {}) => ({
        url: '/top-products',
        params: { limit },
      }),
      providesTags: ['Analytics'],
    }),

    // Get revenue by category
    getCategoryRevenue: builder.query<CategoryRevenueResponse, void>({
      query: () => '/revenue-by-category',
      providesTags: ['Analytics'],
    }),

    // Get order status distribution
    getOrderStatusDistribution: builder.query<OrderStatusResponse, void>({
      query: () => '/order-status',
      providesTags: ['Analytics'],
    }),
  }),
});

export const {
  useGetDashboardAnalyticsQuery,
  useGetRecentSalesQuery,
  useGetTopProductsQuery,
  useGetCategoryRevenueQuery,
  useGetOrderStatusDistributionQuery,
} = analyticsApi;
