// app/_layout.tsx
import "react-native-gesture-handler";
import "../global.css";

import React, { useEffect, useState, useCallback } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { View, StatusBar, Platform, ActivityIndicator } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import * as SplashScreen from "expo-splash-screen";

// Redux
import { Provider } from "react-redux";
import { store } from "../src/store/store";
import { useAppDispatch, useAppSelector } from "../src/store/hooks";
import { setUserOnLoad, setLoading } from "../src/store/authSlice";

// Contexts
import ThemeProvider, { useTheme } from "../src/context/ThemeContext";
import { LanguageProvider } from "../src/context/LanguageContext";
import { RoleProvider } from "../src/context/RoleContext";

// AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";

// Prevent the splash screen from auto-hiding until we are ready
SplashScreen.preventAutoHideAsync();

// -------------------- Main Navigation Logic --------------------
function RootLayoutNav() {
    const { user, isLoading } = useAppSelector((state) => state.auth);
    const [hasOnboarded, setHasOnboarded] = useState(false);
    const [isAppReady, setIsAppReady] = useState(false);

    const segments = useSegments();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { theme } = useTheme();

    // Load initial user and onboarding data
    useEffect(() => {
        const prepareApp = async () => {
            try {
                const userString = await AsyncStorage.getItem("user");
                const onboarded = await AsyncStorage.getItem("hasOnboarded");

                if (userString) {
                    dispatch(setUserOnLoad(JSON.parse(userString)));
                }

                if (onboarded === "true") {
                    setHasOnboarded(true);
                }
            } catch (e) {
                console.warn("Error loading app data:", e);
            } finally {
                dispatch(setLoading(false));
                setIsAppReady(true);
            }
        };

        prepareApp();
    }, [dispatch]);

    // Navigation based on state
    useEffect(() => {
        if (!isAppReady) return;

        const inAuthGroup = segments[0] === "(auth)";

        if (!hasOnboarded && segments[1] !== "welcome") {
            router.replace("/(auth)/welcome");
        } else if (hasOnboarded && !user && !inAuthGroup) {
            router.replace("/(auth)/login");
        } else if (hasOnboarded && user && inAuthGroup) {
            router.replace("/(tabs)/home");
        }
    }, [isAppReady, user, hasOnboarded, segments]);

    // Hide splash screen when app is ready
    const onLayoutRootView = useCallback(async () => {
        if (isAppReady) {
            await SplashScreen.hideAsync();
        }
    }, [isAppReady]);

    // Set NavigationBar buttons color for Android
    useEffect(() => {
        if (Platform.OS === "android") {
            NavigationBar.setButtonStyleAsync(theme.mode ? "light" : "dark");
        }
    }, [theme.mode]);

    // While the app is still preparing, show a loader
    if (!isAppReady) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
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

// -------------------- Final RootLayout --------------------
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
