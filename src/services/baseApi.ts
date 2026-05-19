// src/services/api/baseApi.ts
import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { ApiError } from './types/api.types';

// Базовый URL API
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:5000/api',
  credentials: 'include', // ✅ ДОЛЖНО БЫТЬ
  prepareHeaders: (headers) => {
    // ❌ НЕ ДОБАВЛЯЙТЕ Authorization header вручную
    return headers;
  },
});
// Создание базового API
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQuery,
  tagTypes: ['User', 'Post', 'Comment', 'Profile', 'Feed', 'Favorites'],
  endpoints: () => ({}),
});