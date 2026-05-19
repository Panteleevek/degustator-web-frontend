import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { baseApi } from '@/services/baseApi';
import authReducer from './slices/authSlice';
import postsReducer from './slices/postsSlice';

export const store = configureStore({
  reducer: {
    // ✅ RTK-Query reducer
    [baseApi.reducerPath]: baseApi.reducer,
    
    // Your other reducers
    auth: authReducer,
    posts: postsReducer,
  },
  // ✅ ВАЖНО: добавьте middleware RTK-Query
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

// ✅ Setup listeners для refetchOnFocus/refetchOnReconnect
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;