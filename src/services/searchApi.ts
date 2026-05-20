import { baseApi } from "./baseApi";

export const searchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Глобальный поиск
    globalSearch: builder.query({
      query: ({ q, limit = 20, type }) =>
        `/search?q=${encodeURIComponent(q)}&limit=${limit}${type ? `&type=${type}` : ""}`,
      providesTags: ["Search"],
    }),

    searchFollowing: builder.query({
      query: ({ userId, q }) =>
        `/users/${userId}/following/search?q=${encodeURIComponent(q)}`,
      providesTags: ["Following"],
    }),

    searchFollowers: builder.query({
      query: ({ userId, q }) =>
        `/users/${userId}/followers/search?q=${encodeURIComponent(q)}`,
      providesTags: ["Followers"],
    }),

    searchFavorites: builder.query({
      query: ({ q }) => `/posts/favorites/search?q=${encodeURIComponent(q)}`,
      providesTags: ["Favorites"],
    }),
  }),
});

export const {
  useGlobalSearchQuery,
  useSearchFollowingQuery,
  useSearchFollowersQuery,
  useSearchFavoritesQuery,
  useLazySearchFavoritesQuery,
  useLazySearchFollowingQuery,
  useLazySearchFollowersQuery,
} = searchApi;
