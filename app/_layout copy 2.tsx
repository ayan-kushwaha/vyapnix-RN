// app/_layout.tsx
import "react-native-gesture-handler";
import "../global.css";

import React, { useEffect, useState, useCallback } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { View, StatusBar, Platform } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import * as SplashScreen from 'expo-splash-screen';

// Redux
import { Provider } from 'react-redux';
import { store } from '../src/store/store';
import { useAppDispatch, useAppSelector } from "../src/store/hooks";
import { setUserOnLoad, setLoading } from "../src/store/authSlice";

// Contexts
import ThemeProvider, { useTheme } from "../src/context/ThemeContext";
import { LanguageProvider } from '../src/context/LanguageContext';
import { RoleProvider } from "../src/context/RoleContext";

// AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- Prevent the splash screen from auto-hiding ---
SplashScreen.preventAutoHideAsync();

// --- Main Navigation & Routing Logic ---
function RootLayoutNav() {
    const { user, isLoading } = useAppSelector((state) => state.auth);
    const [hasOnboarded, setHasOnboarded] = useState(false);
    const [isAppReady, setIsAppReady] = useState(false);

    const segments = useSegments();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { theme } = useTheme();

    // This useEffect handles all initial loading
    useEffect(() => {
        async function prepareApp() {
            try {
                // Check for user token and onboarding status
                const userString = await AsyncStorage.getItem('user');
                const onboarded = await AsyncStorage.getItem('hasOnboarded');

                if (userString) {
                    dispatch(setUserOnLoad(JSON.parse(userString)));
                }
                if (onboarded === 'true') {
                    setHasOnboarded(true);
                }
            } catch (e) {
                console.warn(e);
                dispatch(setLoading(false));
                setIsAppReady(true);
            } finally {
                // Tell the app it's ready to render
                setIsAppReady(true);
                dispatch(setLoading(false));
            }
        }
        prepareApp();
    }, [dispatch]);

    // This useEffect handles navigation AFTER the app is ready
    useEffect(() => {
        if (!isAppReady) return;

        const inAuthGroup = segments[0] === '(auth)';

        if (!hasOnboarded && segments[1] !== 'welcome') {
            router.replace('/(auth)/welcome');
        } else if (hasOnboarded && !user && !inAuthGroup) {
            router.replace('/(auth)/login');
        } else if (hasOnboarded && user && inAuthGroup) {
            router.replace('/(tabs)/home');
        }
    }, [isAppReady, user, hasOnboarded, segments, router]);

    // Hide the splash screen once we're ready
    const onLayoutRootView = useCallback(async () => {
        if (isAppReady) {
            await SplashScreen.hideAsync();
        }
    }, [isAppReady]);

    // Status Bar theming
    useEffect(() => {
        if (Platform.OS === "android") {
            NavigationBar.setButtonStyleAsync(theme.mode ? "light" : "dark");
        }
    }, [theme.mode]);

    if (!isAppReady) {
        return null; // Render nothing while the app is preparing
    }

    return (
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle={theme.mode ? "light-content" : "dark-content"}
            />
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="(auth)" />
            </Stack>
        </View>
    );
}

// --- Final Root Layout with all Providers ---
export default function RootLayout() {
    return (
        <Provider store={store}>
            <ThemeProvider>
                <RoleProvider>
                    <LanguageProvider>
                        <RootLayoutNav />
                    </LanguageProvider>
                </RoleProvider>
            </ThemeProvider>
        </Provider>
    );
}