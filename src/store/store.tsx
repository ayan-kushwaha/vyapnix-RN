// src/store/store.tsx
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import businessReducer from "./businessSlice";
import contactReducer from './contactSlice';
import catalogReducer from './catalogSlice';
import taxReducer from './taxSlice';
export const store = configureStore({
    reducer: {
        auth: authReducer,
        business: businessReducer,
        contacts: contactReducer,
        catalog: catalogReducer,
        tax: taxReducer,

    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

// ✅ Yeh types poore app ke liye important hain
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;