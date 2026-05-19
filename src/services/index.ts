// src/services/api/index.ts
export { baseApi } from './baseApi';
export { authApi, useRegisterMutation, useLoginMutation, useGetMeQuery, useLogoutMutation } from './authApi';
export { postApi, useGetFeedQuery, useGetUserPostsQuery, useGetPostByIdQuery, useCreatePostMutation, useUpdatePostMutation, useDeletePostMutation, useToggleLikeMutation } from './postApi';
export { userApi, useGetUserProfileQuery, useUpdateProfileMutation, useFollowUserMutation, useUnfollowUserMutation, useGetFollowersQuery, useGetFollowingQuery } from './userApi';
export { commentApi, useGetPostCommentsQuery, useAddCommentMutation, useUpdateCommentMutation, useDeleteCommentMutation, useGetMyCommentsQuery } from './commentApi';

// Экспорт типов
export type * from './types/api.types';