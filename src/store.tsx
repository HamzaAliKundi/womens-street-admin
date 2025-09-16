import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './apis/auth';
import { productsApi } from './apis/products';
import { ordersApi } from './apis/orders';
import { analyticsApi } from './apis/analytics';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [analyticsApi.reducerPath]: analyticsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(productsApi.middleware)
      .concat(ordersApi.middleware)
      .concat(analyticsApi.middleware)
});