import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const loadCartFromStorage = () => {
  const storedCart = localStorage.getItem("cart");
  return storedCart ? JSON.parse(storedCart) : [];
};

const saveCartToStorage = (cartItems) => {
  try {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  } catch (error) {
    console.error("Could not save cart:", error);
  }
};

export const fetchCart = createAsyncThunk("cart/fetchCart", async ({ userId }, thunkAPI) => {
  try {
    if (userId) {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/cart/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
      });
      return response.data;
    }
    return loadCartFromStorage();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const addToCart = createAsyncThunk("cart/addToCart", async (data, thunkAPI) => {
  try {
    const token = localStorage.getItem("userToken");
    if (token) {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    }
    return data; 
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const updateCartQuantity = createAsyncThunk("cart/updateQuantity", async (data, thunkAPI) => {
  try {
    const token = localStorage.getItem("userToken");
    if (token) {
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/cart/quantity`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    }
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ productId, size, color, userId, guestId }, thunkAPI) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/cart/remove`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
        data: { productId, size, color, userId, guestId }, 
      });
      return response.data; 
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const mergeCart = createAsyncThunk("cart/mergeCart", async ({ guestId, userId }, thunkAPI) => {
  try {
    const token = localStorage.getItem("userToken");
    const guestCartItems = loadCartFromStorage();
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cart/merge`, { guestId, userId, guestCartItems }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    localStorage.removeItem("cart");
    return response.data; 
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: loadCartFromStorage(),
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem("cart");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload.products || action.payload || [];
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload.products || action.payload || [];
        if (!localStorage.getItem("userToken")) saveCartToStorage(state.cartItems);
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload.products || action.payload || [];
        if (!localStorage.getItem("userToken")) saveCartToStorage(state.cartItems);
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload.products || action.payload || [];
        if (!localStorage.getItem("userToken")) saveCartToStorage(state.cartItems);
      })
      .addCase(mergeCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload.products || action.payload || [];
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;