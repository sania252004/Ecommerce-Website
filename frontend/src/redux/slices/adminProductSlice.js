import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunks for API calls
export const fetchAdminProducts = createAsyncThunk("adminProduct/fetchAll", async (_, thunkAPI) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/products`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const createProduct = createAsyncThunk("adminProduct/create", async (productData, thunkAPI) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/products`, productData, {
      headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const updateProduct = createAsyncThunk("adminProduct/update", async ({ id, productData }, thunkAPI) => {
  try {
    const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/admin/products/${id}`, productData, {
      headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const deleteAdminProduct = createAsyncThunk("adminProduct/delete", async (id, thunkAPI) => {
  try {
    await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/admin/products/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
    });
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

const adminProductSlice = createSlice({
  name: "adminProduct",
  initialState: { products: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminProducts.fulfilled, (state, action) => { state.products = action.payload; })
      .addCase(createProduct.fulfilled, (state, action) => { state.products.unshift(action.payload); }) // New at top
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) state.products[index] = action.payload;
      })
      .addCase(deleteAdminProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p._id !== action.payload);
      })
      .addMatcher((action) => action.type.endsWith("/pending"), (state) => { state.loading = true; })
      .addMatcher((action) => action.type.endsWith("/fulfilled") || action.type.endsWith("/rejected"), (state, action) => {
        state.loading = false;
        if (action.type.endsWith("/rejected")) state.error = action.payload;
      });
  },
});

export default adminProductSlice.reducer;