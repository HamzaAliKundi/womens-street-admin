import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Order interfaces
export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  nearbyPlace: string;
  city: string;
  postalCode: string;
  notes?: string;
}

export interface Order {
  _id: string;
  guestId: string;
  orderNumber: string;
  items: OrderItem[];
  customerDetails: CustomerDetails;
  totalAmount: number;
  totalItems: number;
  shippingCost: number;
  tax: number;
  finalTotal: number;
  paymentMethod: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface OrdersResponse {
  message: string;
  status: number;
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface SingleOrderResponse {
  message: string;
  status: number;
  order: Order;
}

export interface UpdateOrderStatusRequest {
  status: Order['status'];
}

import { API_CONFIG } from '../../config/api';

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ORDERS}`,
    timeout: API_CONFIG.TIMEOUT,
    prepareHeaders: (headers, { getState }) => {
      // Add authentication token if available
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Order'],
  endpoints: (builder) => ({
    // Get all orders (admin)
    getAllOrders: builder.query<OrdersResponse, {
      page?: number;
      limit?: number;
      status?: string;
      search?: string;
    }>({
      query: (params = {}) => ({
        url: '/admin/all',
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          ...(params.status && params.status !== 'all' && { status: params.status }),
          ...(params.search && { search: params.search }),
        },
      }),
      providesTags: ['Order'],
    }),

    // Get single order by ID
    getOrderById: builder.query<SingleOrderResponse, string>({
      query: (orderId) => `/single/${orderId}`,
      providesTags: (result, error, orderId) => [{ type: 'Order', id: orderId }],
    }),

    // Update order status (admin)
    updateOrderStatus: builder.mutation<SingleOrderResponse, {
      orderId: string;
      status: Order['status'];
    }>({
      query: ({ orderId, status }) => ({
        url: `/admin/${orderId}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['Order'],
    }),

    // Get orders by guest ID (for customer lookup)
    getOrdersByGuest: builder.query<OrdersResponse, {
      guestId: string;
      page?: number;
      limit?: number;
    }>({
      query: ({ guestId, page = 1, limit = 10 }) => ({
        url: `/${guestId}/orders`,
        params: { page, limit },
      }),
      providesTags: ['Order'],
    }),

    // Get order by order number
    getOrderByNumber: builder.query<SingleOrderResponse, string>({
      query: (orderNumber) => `/number/${orderNumber}`,
      providesTags: (result, error, orderNumber) => [{ type: 'Order', id: orderNumber }],
    }),
  }),
});

export const {
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useGetOrdersByGuestQuery,
  useGetOrderByNumberQuery,
} = ordersApi;
