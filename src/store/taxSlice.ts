// src/store/taxSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import taxService from './taxService';
import { RootState } from './store';
import { TaxRate } from './types';

interface TaxState {
  taxes: TaxRate[];
  isLoading: boolean;
  isError: boolean;
  message: string;
}

const initialState: TaxState = {
  taxes: [],
  isLoading: false,
  isError: false,
  message: '',
};

// --- Thunks ---
export const getTaxes = createAsyncThunk('tax/getTaxes', async (_, thunkAPI) => {
  const token = (thunkAPI.getState() as RootState).auth.user!.token;
  return await taxService.getTaxes(token);
});

export const createTax = createAsyncThunk('tax/createTax', async (taxData: Partial<TaxRate>, thunkAPI) => {
  const token = (thunkAPI.getState() as RootState).auth.user!.token;
  return await taxService.createTax(taxData, token);
});

export const updateTax = createAsyncThunk('tax/updateTax', async ({ taxId, taxData }: { taxId: string; taxData: Partial<TaxRate> }, thunkAPI) => {
  const token = (thunkAPI.getState() as RootState).auth.user!.token;
  return await taxService.updateTax(taxId, taxData, token);
});

export const deleteTax = createAsyncThunk('tax/deleteTax', async (taxId: string, thunkAPI) => {
  const token = (thunkAPI.getState() as RootState).auth.user!.token;
  await taxService.deleteTax(taxId, token);
  return taxId;
});

// --- Slice ---
const taxSlice = createSlice({
  name: 'tax',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTaxes.pending, (state) => { state.isLoading = true; })
      .addCase(getTaxes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.taxes = action.payload;
      })
      .addCase(getTaxes.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.error.message || 'Failed to fetch taxes';
      })
      .addCase(createTax.fulfilled, (state, action) => {
        state.taxes.push(action.payload);
      })
      .addCase(updateTax.fulfilled, (state, action) => {
        const index = state.taxes.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) state.taxes[index] = action.payload;
      })
      .addCase(deleteTax.fulfilled, (state, action) => {
        state.taxes = state.taxes.filter((t) => t._id !== action.payload);
      });
  },
});

export const { reset } = taxSlice.actions;
export default taxSlice.reducer;
