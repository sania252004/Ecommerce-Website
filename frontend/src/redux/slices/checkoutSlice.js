import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async Thunk to create a final order
export const createOrder = createAsyncThunk(
  "checkout/createOrder",
  async (orderData, thunkAPI) => {
    try {
      const token = localStorage.getItem("userToken");
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders`,
        orderData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const checkoutSlice = createSlice({
  name: "checkout",
  initialState: {
    shippingAddress: {
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      postalCode: "",
      country: "",
    },
    paymentMethod: "Credit Card", // Default value
    loading: false,
    error: null,
    order: null, // Stores the response from a successful purchase
  },
  reducers: {
    // Update shipping info as user types in the form
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
    },
    // Set payment type (e.g., Stripe, PayPal, COD)
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },
    // Reset checkout state after a successful purchase
    resetCheckout: (state) => {
      state.order = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload; // Order success details
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Order placement failed";
      });
  },
});

export const { saveShippingAddress, savePaymentMethod, resetCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer;