import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiClient } from "@/lib/api";
import { CartState, CartItem, ApiResponse } from "@/types";

const initialState: CartState = {
  items: [],
  itemCount: 0,
  subtotal: 0,
  loading: false,
};

// Async thunks
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<
        ApiResponse<{
          items: CartItem[];
          itemCount: number;
          subtotal: number;
        }>
      >("/cart");
      return response.data.data!;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch cart"
      );
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (
    {
      productId,
      quantity = 1,
      color,
      size,
      note,
    }: {
      productId: string;
      quantity?: number;
      color?: string;
      size?: string;
      note?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.post<ApiResponse<CartItem>>("/cart", {
        productId,
        quantity,
        color,
        size,
        note,
      });
      return response.data.data!;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add to cart"
      );
    }
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async (
    { itemId, quantity }: { itemId: string; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.put<ApiResponse<CartItem>>(
        `/cart/${itemId}`,
        {
          quantity,
        }
      );
      return response.data.data!;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update cart"
      );
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (itemId: string, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/cart/${itemId}`);
      return itemId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove item"
      );
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      await apiClient.delete("/cart");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to clear cart"
      );
    }
  }
);

// Slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetCart: (state) => {
      state.items = [];
      state.itemCount = 0;
      state.subtotal = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.itemCount = action.payload.itemCount;
        state.subtotal = action.payload.subtotal;
      })
      .addCase(fetchCart.rejected, (state) => {
        state.loading = false;
      })
      // Add to cart
      .addCase(addToCart.fulfilled, (state, action) => {
        const existingItem = state.items.find(
          (item) => item.id === action.payload.id
        );
        if (existingItem) {
          existingItem.quantity = action.payload.quantity;
        } else {
          state.items.push(action.payload);
        }
        state.itemCount = state.items.length;
        state.subtotal = state.items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );
      })
      // Update cart item
      .addCase(updateCartItem.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.subtotal = state.items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );
      })
      // Remove from cart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.itemCount = state.items.length;
        state.subtotal = state.items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );
      })
      // Clear cart
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.itemCount = 0;
        state.subtotal = 0;
      });
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
