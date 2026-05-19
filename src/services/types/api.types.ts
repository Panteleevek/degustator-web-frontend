// src/services/types/api.types.ts

// ============ User Types ============
export interface User {
  id?: string;
  username: string;
  email: string;
  password: string;
  fullName: string;
  avatar?: string;
  bio?: string;
  isPrivate?: boolean;
  followersCount?: number;
  followingCount?: number;
  postsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  token: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  bio?: string;
  website?: string;
  avatar?: string;
  email?: string;
  newPassword?: string;
}

// ============ Post Types ============
export interface Post {
  id: string;
  userId: string;
  imageUrl: string;
  title: string;
  rating: number;
  product: string;
  description: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
  isFavorite?: boolean;
  User: {
    id: string;
    username: string;
    fullName: string;
    avatar: string;
  };
}

export interface CreatePostRequest {
  title: string;
  rating: number;
  product: string;
  description: string;
  image: File;
}

export interface UpdatePostRequest {
  title?: string;
  rating?: number;
  product?: string;
  description?: string;
}

export interface FeedResponse {
  posts: Post[];
  total: number;
  page: number;
  pages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

// ============ Comment Types ============
export interface Comment {
  id: string;
  postId: string;
  userId: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  User: {
    id: string;
    username: string;
    fullName: string;
    avatar: string;
  };
}

export interface CreateCommentRequest {
  text: string;
}

export interface UpdateCommentRequest {
  text: string;
}

export interface CommentResponse {
  success: boolean;
  comment: Comment;
}

export interface CommentsResponse {
  success: boolean;
  comments: Comment[];
  total: number;
  page: number;
  pages: number;
  hasMore: boolean;
}

// ============ Follow Types ============
export interface FollowResponse {
  message: string;
}

export interface FollowersResponse {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
}
[];

// ============ API Error Types ============
export interface ApiError {
  message: string;
  error?: string;
  errors?: {
    msg: string;
    param: string;
    location: string;
  }[];
}
