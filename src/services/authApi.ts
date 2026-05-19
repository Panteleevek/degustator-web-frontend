// src/services/api/authApi.ts
import { baseApi } from './baseApi';
import {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  User,
  ApiError,
} from './types/api.types';

export const authApi = baseApi.injectEndpoints({
   overrideExisting: true,
  endpoints: (builder) => ({
    // Регистрация
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
      transformResponse: (response: AuthResponse) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response));
        }
        return response;
      },
      invalidatesTags: ['User'],
    }),

    // Логин
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: AuthResponse) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response));
        }
        return response;
      },
      invalidatesTags: ['User'],
    }),

    // Получить текущего пользователя
    getMe: builder.query({
      query: () => '/auth/me',
      // ✅ Настройки для предотвращения лишних запросов
      keepUnusedDataFor: 3600, // Храним данные 1 час
      refetchOnMountOrArgChange: false, // Не перезапрашиваем при монтировании
      refetchOnFocus: false, // Не перезапрашиваем при фокусе
      refetchOnReconnect: false, // Не перезапрашиваем при переподключении
      providesTags: ['User'],
      // ✅ Только если есть токен
    }),

    // Обновить профиль
    updateProfile: builder.mutation<User, FormData>({
      query: (formData) => ({
        url: '/users/profile',
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['User', 'Profile'],
    }),

    // Выход
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Очищаем localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          // Сбрасываем состояние API
          dispatch(baseApi.util.resetApiState());
          // Перенаправляем на страницу входа
          window.location.href = '/auth';
        } catch (error) {
          console.error('Logout error:', error);
        }
      },
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetMeQuery,
  useUpdateProfileMutation,
  useLogoutMutation,
} = authApi;