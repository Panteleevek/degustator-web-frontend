// src/services/api/userApi.ts
import { baseApi } from './baseApi';
import { User, FollowResponse, FollowersResponse, UpdateProfileRequest, } from './types/api.types';

export const userApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Получить профиль пользователя
    getUserProfile: builder.query<User, string>({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'Profile', id }],
    }),
    updateProfile: builder.mutation<any, UpdateProfileRequest>({
      query: (data) => ({
        url: '/users/profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User', 'Profile'],
    }),
    
    // ✅ Обновить аватар
    updateAvatar: builder.mutation<{ success: boolean; message: string; avatar: string }, FormData>({
      query: (formData) => ({
        url: '/users/avatar',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['User', 'Profile'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Обновляем кэш текущего пользователя
          dispatch(
            userApi.util.updateQueryData('getMe', undefined, (draft) => {
              if (draft) draft.avatar = data.avatar;
            })
          );
        } catch (error) {
          console.error('Update avatar error:', error);
        }
      },
    }),
    
    // ✅ Удалить аватар
    deleteAvatar: builder.mutation<{ success: boolean; message: string; avatar: string }, void>({
      query: () => ({
        url: '/users/avatar',
        method: 'DELETE',
      }),
      invalidatesTags: ['User', 'Profile'],
    }),

    // Подписаться на пользователя
    followUser: builder.mutation<FollowResponse, string>({
      query: (id) => ({
        url: `/users/${id}/follow`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Profile', id },
        'User',
      ],
    }),

    // Отписаться от пользователя
    unfollowUser: builder.mutation<FollowResponse, string>({
      query: (id) => ({
        url: `/users/${id}/unfollow`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Profile', id },
        'User',
      ],
    }),

    // Получить подписчиков
    getFollowers: builder.query<FollowersResponse, string>({
      query: (id) => `/users/${id}/followers`,
      providesTags: (result, error, id) => [{ type: 'Profile', id, subType: 'followers' }],
    }),

    // Получить подписки
    getFollowing: builder.query<FollowersResponse, string>({
      query: (id) => `/users/${id}/following`,
      providesTags: (result, error, id) => [{ type: 'Profile', id, subType: 'following' }],
    }),
  }),
});

// Экспорт хуков
export const {
  useGetUserProfileQuery,
  useUpdateProfileMutation,
  useUpdateAvatarMutation,
  useDeleteAvatarMutation,
  useFollowUserMutation,
  useUnfollowUserMutation,
  useGetFollowersQuery,
  useGetFollowingQuery,
} = userApi;