import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  error: null,
  currentPage: 1,
  pageSize: 10,
  total: 0,
};

const purchaseOrderSlice = createSlice({
  name: 'purchaseOrder',
  initialState,
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload;
      state.total = action.payload.length;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  }
});

export const { setItems, setLoading, setError } = purchaseOrderSlice.actions;
export default purchaseOrderSlice.reducer;
