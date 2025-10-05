// authSlice.tsx
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import authService from './authService';
import { User, RegisterUserData, LoginUserData, UpdateUserData } from './types';
import { RootState } from './store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ROLE_KEY } from '../context/RoleContext';

// -------------------- State Types --------------------
interface AuthState {
    user: User | null;
    isError: boolean;
    isSuccess: boolean;
    isLoading: boolean;
    message: string | unknown;
    availableRoles: string[],
}

const initialState: AuthState = {
    user: null,
    isError: false,
    isSuccess: false,
    isLoading: false, // Start as true to handle app loading state
    message: '',
    availableRoles: ['user'],
};

// -------------------- Async Thunks --------------------

export const registerUser = createAsyncThunk<User, RegisterUserData, { rejectValue: string }>(
    'auth/register',
    async (user, thunkAPI) => {
        try {
            return await authService.register(user);
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const loginUser = createAsyncThunk<User, LoginUserData, { rejectValue: string }>(
    'auth/login',
    async (user, thunkAPI) => {
        try {
            return await authService.login(user);
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getMe = createAsyncThunk<User, void, { state: RootState, rejectValue: string }>(
    'auth/getMe',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user?.token;
            if (!token) return thunkAPI.rejectWithValue('No token found!');
            return await authService.getMe(token);
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || "Failed to fetch user data";
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const updateUser = createAsyncThunk<User, UpdateUserData, { state: RootState, rejectValue: string }>(
    'auth/updateUser',
    async (userData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user?.token;
            if (!token) return thunkAPI.rejectWithValue('No token found!');
            return await authService.updateProfile(userData, token);
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
    await authService.logout();
    // try {
    //     // 1. Backend से लॉगआउट करें (अगर कोई API कॉल है)
    //     await authService.logout();

    //     // 2. AsyncStorage से सारा जरूरी डेटा हटाएं
    //     // ✅ यूजर टोकन हटाएं (मान लेते हैं कि आपने इसे 'userToken' की से सेव किया है)
    //     await AsyncStorage.removeItem('userToken');

    //     // ✅ RoleContext द्वारा सेव किया गया रोल हटाएं
    //     await AsyncStorage.removeItem(ROLE_KEY);

    //     // ✅ redux-persist द्वारा बनाए गए डेटा को हटाने के लिए यह लाइन भी जोड़ सकते हैं
    //     // यह Redux में सेव सारे slices (auth, business, etc.) का persisted data हटा देगा।
    //     await AsyncStorage.removeItem('persist:root');

    //     // आप चाहें तो पूरी AsyncStorage भी क्लियर कर सकते हैं, लेकिन यह थीम जैसी सेटिंग्स भी हटा देगा
    //     // await AsyncStorage.clear();

    // } catch (error) {
    //     return alert('Logout failed');
    // }
});

// -------------------- Slice --------------------
export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
        setUserOnLoad: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
            state.isLoading = false;
        },
        // ✅ FIX: setLoading reducer ko wapas add kar diya gaya hai
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Register
            .addCase(registerUser.pending, (state) => { state.isLoading = true; })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
                state.availableRoles = ['user'];
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })
            // Login
            .addCase(loginUser.pending, (state) => { state.isLoading = true; })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
                state.availableRoles = action.payload.availableRoles || ['user'];

            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
                state.availableRoles = [];
            })
            // Get Me (Fresh Data)
            .addCase(getMe.fulfilled, (state, action) => {
                const token = state.user?.token;
                state.user = { ...action.payload, token: token || '' };
                state.availableRoles = action.payload.availableRoles || ['user'];

            })
            // Update User
            .addCase(updateUser.pending, (state) => { state.isLoading = true; })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                if (state.user) {
                    state.user = { ...state.user, ...action.payload };
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Logout
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.availableRoles = [];
            });

    },
});

// ✅ FIX: setLoading action ko export kar diya gaya hai
export const { reset, setUserOnLoad, setLoading } = authSlice.actions;
export default authSlice.reducer;
// old is goals