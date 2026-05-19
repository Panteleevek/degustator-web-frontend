// src/services/api/commentApi.ts
import { baseApi } from './baseApi';
import {
  Comment,
  CreateCommentRequest,
  UpdateCommentRequest,
  CommentResponse,PaginationParams,
  CommentsResponse,
} from './types/api.types';

export const commentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Получить комментарии поста
    getPostComments: builder.query<CommentsResponse, { postId: string; page?: number; limit?: number }>({
      query: ({ postId, page = 1, limit = 20 }) => 
        `/comments/${postId}?page=${page}&limit=${limit}`,
      providesTags: (result, error, { postId }) => [
        { type: 'Comment', id: `POST_${postId}` },
      ],
    }),

    // Добавить комментарий
    addComment: builder.mutation<CommentResponse, { postId: string; data: CreateCommentRequest }>({
      query: ({ postId, data }) => ({
        url: `/comments/${postId}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: 'Comment', id: `POST_${postId}` },
        { type: 'Post', id: postId },
      ],
    }),

    // Обновить комментарий
    updateComment: builder.mutation<CommentResponse, { id: string; data: UpdateCommentRequest }>({
      query: ({ id, data }) => ({
        url: `/comments/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),

    // Удалить комментарий
    deleteComment: builder.mutation<void, { id: string; postId: string }>({
      query: ({ id }) => ({
        url: `/comments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: 'Comment', id: `POST_${postId}` },
        { type: 'Post', id: postId },
      ],
    }),

    // Получить мои комментарии
    getMyComments: builder.query<CommentsResponse, PaginationParams>({
      query: ({ page = 1, limit = 20 }) => `/comments/my/comments?page=${page}&limit=${limit}`,
      providesTags: ['Comment'],
    }),
  }),
});

// Экспорт хуков
export const {
  useGetPostCommentsQuery,
  useAddCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useGetMyCommentsQuery,
} = commentApi;