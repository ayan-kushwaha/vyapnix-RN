// src/ store/cont
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'; // Assuming you have a configured axios instance
import { RootState } from './store';
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

// Define the shape of a single contact
export interface Contact {
  _id: string;
  owner: string;
  contactUser: {
    _id: string;
    fullName: string;
    avatarUrl?: string;
    role: 'user' | 'business';
  };
  role: 'client' | 'business' | 'employee' | 'user';
  // ... add other fields like transactions, interactions if needed for the list view
}

interface ContactState {
  contacts: Contact[];
  currentContact: any | null; // For the detail screen
  isLoading: boolean;
  isError: boolean;
  message: string;
}

const initialState: ContactState = {
  contacts: [],
  currentContact: null,
  isLoading: false,
  isError: false,
  message: '',
};
const API_URL = `${API_BASE_URL}/contacts`;

// Async thunk to get all contacts
export const getMyContacts = createAsyncThunk<Contact[], void, { state: RootState; rejectValue: string }>(
    'contacts/getAll',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user?.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.get(API_URL, config);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
);

// Async thunk to get a single contact's details
export const getContactDetails = createAsyncThunk<any, string, { state: RootState; rejectValue: string }>(
    'contacts/getDetails',
    async (contactId, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user?.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.get(`${API_URL}/${contactId}`, config);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
);


const contactSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMyContacts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyContacts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.contacts = action.payload;
      })
      .addCase(getMyContacts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(getContactDetails.pending, (state) => {
        state.isLoading = true;
        state.currentContact = null; // Clear previous contact
      })
      .addCase(getContactDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentContact = action.payload;
      })
      .addCase(getContactDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const { reset } = contactSlice.actions;
export default contactSlice.reducer;