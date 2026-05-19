import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Post } from '@/db/models';
import { db } from '@/db/database';

interface PostsState {
  posts: Post[];
  loading: boolean;
}

const initialState: PostsState = {
  posts: [],
  loading: false
};

// Асинхронные действия
export const fetchAllPosts = createAsyncThunk('posts/fetchAll', async () => {
  return await db.posts.orderBy('createdAt').reverse().toArray();
});

export const createPost = createAsyncThunk(
  'posts/create',
  async (post: Omit<Post, 'id' | 'createdAt' | 'likes' | 'comments'>) => {
    const newPost: Post = {
      ...post,
      id: Date.now().toString(),
      createdAt: Date.now(),
      likes: [],
      comments: []
    };
    await db.posts.add(newPost);
    return newPost;
  }
);

export const deletePost = createAsyncThunk('posts/delete', async (postId: string) => {
  await db.posts.delete(postId);
  return postId;
});

export const likePost = createAsyncThunk(
  'posts/like',
  async ({ postId, userId }: { postId: string; userId: string }) => {
    const post = await db.posts.get(postId);
    if (post) {
      const hasLiked = post.likes.includes(userId);
      const newLikes = hasLiked 
        ? post.likes.filter(id => id !== userId)
        : [...post.likes, userId];
      
      await db.posts.update(postId, { likes: newLikes });
      return { postId, likes: newLikes };
    }
    return { postId, likes: [] };
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(p => p.id !== action.payload);
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const post = state.posts.find(p => p.id === action.payload.postId);
        if (post) {
          post.likes = action.payload.likes;
        }
      });
  }
});

export default postsSlice.reducer;