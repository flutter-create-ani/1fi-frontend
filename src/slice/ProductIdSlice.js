import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

export const getProductById = createAsyncThunk('productId/getProductById', async (id, { rejectWithValue }) => {
  try {
    if (!id) {
      throw new Error('Product ID is required');
    }

    const response = await fetch(`/api/product/${id}`, {
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
    const errorMessage = error.message || 'Failed to fetch product. Please try again later.';
    return rejectWithValue(errorMessage);
  }
})

const productIdSlice = createSlice({
  name: 'productId',
  initialState: {
    productId: null,
    loading: false,
    error: null,
    product: null,
  },
  reducers: {
    setProductId: (state, action) => {
      state.productId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getProductById.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    builder.addCase(getProductById.fulfilled, (state, action) => {
      state.product = action.payload;
      state.loading = false;
      state.error = null;
    })
    builder.addCase(getProductById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || action.error.message || 'An unknown error occurred';
    })
  },
})  

export const { setProductId } = productIdSlice.actions;
export default productIdSlice.reducer;