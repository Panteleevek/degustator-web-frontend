// src/services/api/postApi.ts
import { baseApi } from "./baseApi";
import {
  Post,
  CreatePostRequest,
  UpdatePostRequest,
  FeedResponse,
  PaginationParams,
  ApiError,
} from "./types/api.types";

export const postApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
toggleFavorite: builder.mutation<{ success: boolean; message: string; isFavorite: boolean }, string>({
      query: (postId) => ({
        url: `/posts/${postId}/favorite`,
        method: 'POST',
      }),
      invalidatesTags: ['Favorites'],
      async onQueryStarted(postId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          
          // Обновляем isFavorite в getFeed
          dispatch(
            postApi.util.updateQueryData('getFeed', { page: 1, limit: 10 }, (draft) => {
              const post = draft.posts?.find(p => p.id === postId);
              if (post) {
                post.isFavorite = data.isFavorite;
              }
            })
          );
          
          // Обновляем isFavorite в getAllPosts
          dispatch(
            postApi.util.updateQueryData('getAllPosts', { page: 1, limit: 20 }, (draft) => {
              const post = draft.posts?.find(p => p.id === postId);
              if (post) {
                post.isFavorite = data.isFavorite;
              }
            })
          );
        } catch (error) {
          console.error('Toggle favorite error:', error);
        }
      },
    }),
    
    getFavorites: builder.query({
      query: ({ page = 1, limit = 20 }) => `/posts/favorites?page=${page}&limit=${limit}`,
      providesTags: ['Favorites'],
    }),
    // Получить ленту постов
    getFeed: builder.query<FeedResponse, PaginationParams>({
      query: ({ page = 1, limit = 10 }) =>
        `/posts/feed?page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              ...result.posts.map(({ id }) => ({ type: "Post" as const, id })),
              { type: "Post", id: "LIST" },
            ]
          : [{ type: "Post", id: "LIST" }],
    }),

    // Получить посты пользователя
    getUserPosts: builder.query<
      FeedResponse,
      { userId: string; page?: number; limit?: number }
    >({
      query: ({ userId, page = 1, limit = 20 }) =>
        `/posts/user/${userId}?page=${page}&limit=${limit}`,
      providesTags: (result, error, { userId }) => [
        { type: "Post", id: `USER_${userId}` },
      ],
    }),

    // Получить один пост
    getPostById: builder.query<Post, string>({
      query: (id) => `/posts/${id}`,
      providesTags: (result, error, id) => [{ type: "Post", id }],
    }),

    // Создать пост
    createPost: builder.mutation<Post, CreatePostRequest>({
      query: (formData) => ({
        url: "/posts",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Post", "Feed", "Profile"],
    }),

    // Обновить пост
    updatePost: builder.mutation<Post, { id: string; data: UpdatePostRequest }>(
      {
        query: ({ id, data }) => ({
          url: `/posts/${id}`,
          method: "PUT",
          body: data,
        }),
        invalidatesTags: (result, error, { id }) => [{ type: "Post", id }],
      },
    ),

    // Удалить пост
    deletePost: builder.mutation<void, string>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Post", id },
        { type: "Post", id: "LIST" },
        "Profile",
      ],
    }),

    // Лайкнуть/убрать лайк
    toggleLike: builder.mutation<{ isLiked: boolean; message: string }, string>(
      {
        query: (id) => ({
          url: `/posts/${id}/like`,
          method: "POST",
        }),
        async onQueryStarted(id, { dispatch, queryFulfilled }) {
          const patchResult = dispatch(
            postApi.util.updateQueryData(
              "getFeed",
              { page: 1, limit: 10 },
              (draft) => {
                const post = draft.posts.find((p) => p.id === id);
                if (post) {
                  post.isLiked = !post.isLiked;
                  post.likesCount += post.isLiked ? 1 : -1;
                }
              },
            ),
          );
          try {
            await queryFulfilled;
          } catch {
            patchResult.undo();
          }
        },
      },
    ),
    getAllPosts: builder.query({
      query: ({
        page = 1,
        limit = 20,
        search = "",
        product = "",
        minRating = 1,
        sortBy = "latest",
      }) =>
        `/posts/all?page=${page}&limit=${limit}&search=${search}&product=${product}&minRating=${minRating}&sortBy=${sortBy}`,
      serializeQueryArgs: ({ endpointName }) => endpointName,
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page === 1) {
          return newItems;
        }
        return {
          ...newItems,
          posts: [...(currentCache?.posts || []), ...newItems.posts],
        };
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.posts.map(({ id }: any) => ({ type: "Post", id })),
              { type: "Post", id: "ALL" },
            ]
          : [{ type: "Post", id: "ALL" }],
    }),
   
  }),
});

// Экспорт хуков
export const {
  useGetFeedQuery,
  useGetUserPostsQuery,
  useGetPostByIdQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useToggleLikeMutation,
  useGetAllPostsQuery,
  useToggleFavoriteMutation,
  useGetFavoritesQuery,
} = postApi;
