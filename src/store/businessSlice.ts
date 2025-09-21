// src/store/businessSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import businessService from "./businessService";
import { BusinessProfile } from "./types";
import { RootState } from "./store";

interface BusinessState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
  business: BusinessProfile | null;
}

const initialState: BusinessState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
  business: null,
};

// Fetch current user's business
export const fetchMyBusiness = createAsyncThunk<
  BusinessProfile,
  void,
  { state: RootState; rejectValue: string }
>("business/fetchMyBusiness", async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user?.token;
    if (!token) return thunkAPI.rejectWithValue("Authentication token not found!");
    return await businessService.getMyBusiness(token);
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || "Failed to fetch business profile.";
    return thunkAPI.rejectWithValue(message);
  }
});

// Create business
export const createBusiness = createAsyncThunk<
  BusinessProfile,
  Partial<BusinessProfile>,
  { state: RootState; rejectValue: string }
>("business/create", async (businessData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user?.token;
    if (!token) return thunkAPI.rejectWithValue("Authentication token not found!");
    return await businessService.create(businessData, token);
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || "Failed to create business profile.";
    return thunkAPI.rejectWithValue(message);
  }
});

// Update business
export const updateBusiness = createAsyncThunk<
  BusinessProfile,
  Partial<BusinessProfile>,
  { state: RootState; rejectValue: string }
>("business/update", async (businessData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user?.token;
    if (!token) return thunkAPI.rejectWithValue("Authentication token not found!");
    return await businessService.update(businessData, token);
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || "Failed to update business profile.";
    return thunkAPI.rejectWithValue(message);
  }
});

const businessSlice = createSlice({
  name: "business",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyBusiness.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMyBusiness.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.business = action.payload;
      })
      .addCase(fetchMyBusiness.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(createBusiness.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.business = action.payload;
      })
      .addCase(updateBusiness.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.business = action.payload;
      });
  },
});

export const { reset } = businessSlice.actions;
export default businessSlice.reducer;
