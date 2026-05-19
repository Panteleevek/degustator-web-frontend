import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../db/models';

interface AuthState {
  currentUser: User | null;
  users: User[];
}

const initialState: AuthState = {
  currentUser: null,
  users: []
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
    },
    loadUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    }
  }
});

export const { setCurrentUser, addUser, loadUsers } = authSlice.actions;
export default authSlice.reducer;