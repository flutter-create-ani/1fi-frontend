import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

export const getAllProducts = createAsyncThunk('product/getAllProducts', async (_, { rejectWithValue }) => {
  try {
    const baseUrl = import.meta.env.VITE_API_URL;
    
    if (!baseUrl) {
      throw new Error('API URL is not configured. Please set VITE_API_URL in your .env file');
    }

    // Ensure baseUrl doesn't end with a slash and endpoint doesn't start with one
    const url = `${baseUrl.replace(/\/$/, '')}/products`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    const errorMessage = error.message || 'Failed to fetch products. Please try again later.';
    return rejectWithValue(errorMessage);
  }
})

const productSlice = createSlice({
  name: 'product',
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder.addCase(getAllProducts.pending, (state) => {
      state.loading = true;
      state.error = null; 
    })
    builder.addCase(getAllProducts.fulfilled, (state, action) => {
      state.products = action.payload.data;
      state.loading = false;
      state.error = null;
    })
    builder.addCase(getAllProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || action.error.message || 'An unknown error occurred';
    })
  },
})

export default productSlice.reducer;