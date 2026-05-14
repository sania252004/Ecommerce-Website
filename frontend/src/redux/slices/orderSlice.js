import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 1. Export the Thunk so OrderDetails.jsx can find it
export const fetchOrderDetails = createAsyncThunk(
  "orders/fetchOrderDetails",
  async (id, { rejectWithValue }) => {
    try {
      // Adjust this URL to match your backend route
      const response = await axios.get(`/api/orders/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch order");
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    order: null,
    orders: JSON.parse(localStorage.getItem("myOrders")) || [],
    orderDetails: null,
    loading: false,
    error: null,
  },
  reducers: {
    setOrder: (state, action) => {
      state.order = action.payload;
      state.orders.unshift(action.payload);
      localStorage.setItem("myOrders", JSON.stringify(state.orders));
    },
    clearOrder: (state) => {
      state.order = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetails = action.payload;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setOrder, clearOrder } = orderSlice.actions;
export default orderSlice.reducer;