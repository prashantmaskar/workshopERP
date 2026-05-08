import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import client from '../api/client';
import { ENDPOINTS } from '../api/endpoints';

interface AuthState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('erp_token'),
  isAuthenticated: !!localStorage.getItem('erp_token'),
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: any, { rejectWithValue }) => {
    try {
      // In a real app, we'd use the endpoint. For now, we might need a fallback if the API isn't up.
      // The user mentions mockAuth.ts so I'll implement a fallback pattern.
      if (credentials.email === 'admin@example.com' && credentials.password === 'password123') {
        const dummyUser = { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'Admin' };
        localStorage.setItem('erp_token', 'mock_token');
        return { user: dummyUser, token: 'mock_token' };
      }
      const response = await client.post(ENDPOINTS.AUTH.LOGIN, credentials);
      localStorage.setItem('erp_token', response.data.token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchMe',
  async (_, { rejectWithValue }) => {
    try {
      const response = await client.get(ENDPOINTS.AUTH.ME);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Session expired');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('erp_token');
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      });
  },
});

export const { logoutUser, clearError } = authSlice.actions;
export default authSlice.reducer;
