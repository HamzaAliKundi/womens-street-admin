import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Product interface matching your backend
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: string[];
  colors: string[];
  sizes: string[];
  material: string;
  dimensions: string;
  inStock: boolean;
  stockQuantity: number;
  rating: number;
  reviews: number;
  discount: number;
  createdAt: string;
  updatedAt: string;
}

// Create product request interface
export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: string[];
  colors: string[];
  sizes: string[];
  material: string;
  dimensions: string;
  stockQuantity: number;
  discount: number;
}

// Update product request interface
export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  _id: string;
}

// Products response interface
export interface ProductsResponse {
  message: string;
  status: number;
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Single product response interface
export interface ProductResponse {
  message: string;
  status: number;
  product: Product;
}

import { API_CONFIG } from '../../config/api';

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    prepareHeaders: (headers, { getState }) => {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Product'],
  endpoints: (builder) => ({
    // Get all products with pagination and filters
    getProducts: builder.query<ProductsResponse, {
      page?: number;
      limit?: number;
      category?: string;
      brand?: string;
      minPrice?: number;
      maxPrice?: number;
      search?: string;
      featured?: boolean;
    }>({
      query: (params) => ({
        url: "/products",
        params,
      }),
      providesTags: ['Product'],
    }),

    // Get a single product by ID
    getProduct: builder.query<ProductResponse, string>({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),

    // Create a new product
    createProduct: builder.mutation<ProductResponse, CreateProductRequest>({
      query: (product) => ({
        url: "/products",
        method: "POST",
        body: product,
      }),
      invalidatesTags: ['Product'],
    }),

    // Update a product
    updateProduct: builder.mutation<ProductResponse, UpdateProductRequest>({
      query: ({ _id, ...product }) => ({
        url: `/products/${_id}`,
        method: "PUT",
        body: product,
      }),
      invalidatesTags: (result, error, { _id }) => [
        { type: 'Product', id: _id },
        'Product'
      ],
    }),

    // Delete a product
    deleteProduct: builder.mutation<{ message: string; status: number }, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ['Product'],
    }),



    // Search products
    searchProducts: builder.query<ProductsResponse, {
      q: string;
      page?: number;
      limit?: number;
    }>({
      query: (params) => ({
        url: "/products/search",
        params,
      }),
      providesTags: ['Product'],
    }),

    // Get products by category
    getProductsByCategory: builder.query<ProductsResponse, {
      category: string;
      page?: number;
      limit?: number;
    }>({
      query: ({ category, ...params }) => ({
        url: `/products/category/${category}`,
        params,
      }),
      providesTags: ['Product'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useSearchProductsQuery,
  useGetProductsByCategoryQuery,
} = productsApi;
