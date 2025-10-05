import "react-native-gesture-handler";
import React, { useEffect, useCallback } from 'react';
import { Provider } from 'react-redux';
import { Stack, useRouter, useSegments, SplashScreen } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Platform, StatusBar } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
// Redux Store & Actions
import { store } from '../src/store/store';
import { useAppDispatch, useAppSelector } from '../src/store/hooks';
import { setUserOnLoad } from '../src/store/authSlice';

// Context Providers
import ThemeProvider, { useTheme } from '../src/context/ThemeContext';
import { LanguageProvider } from '../src/context/LanguageContext';
import { RoleProvider } from '../src/context/RoleContext';

SplashScreen.preventAutoHideAsync();

function RootNavigationLayout() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const segments = useSegments();
  const { theme } = useTheme();
  const { user, isLoading } = useAppSelector((state) => state.auth);

  // ✨ FIX 1: This useEffect now loads the user session from storage on app start
  useEffect(() => {
    async function loadUserFromStorage() {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          // If a user is found in storage, load them into the Redux state
          dispatch(setUserOnLoad(JSON.parse(storedUser)));
        } else {
          // If no user is found, tell Redux we are done loading
          dispatch(setUserOnLoad(null));
        }
      } catch (e) {
        console.warn('Failed to load user from storage:', e);
        dispatch(setUserOnLoad(null)); // Ensure loading finishes even on error
      }
    }
    loadUserFromStorage();
  }, [dispatch]);

  // ✨ FIX 2: This useEffect now handles navigation correctly
  useEffect(() => {
    // If we are still in the initial loading state, do nothing
    if (isLoading) {
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';

    // If user is logged in and on an auth screen, navigate to home
    if (user?.token && inAuthGroup) {
      router.replace('/(tabs)/home');
    }
    // If user is not logged in and is inside the app, navigate to login
    else if (!user?.token && !inAuthGroup) {
      router.replace('/(auth)/login');
    }
  }, [user, segments, isLoading, router]);

  const onLayoutRootView = useCallback(async () => {
    if (!isLoading) {
      await SplashScreen.hideAsync();
    }
  }, [isLoading]);

  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setBackgroundColorAsync(theme.colors.background);
      NavigationBar.setButtonStyleAsync(theme.mode === 'dark' ? "light" : "dark");
    }
    StatusBar.setBarStyle(theme.mode === 'dark' ? "light-content" : "dark-content");
  }, [theme]);

  // While isLoading is true, the native splash screen will remain visible
  if (isLoading) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="catalog/add-template" options={{ presentation: 'modal' }}        />
        <Stack.Screen name="+not-found" />
      </Stack>
    </View>
  );
}
// The RootLayout with all providers remains the same
export default function RootLayout() {
  return (
    <Provider store={store}>
      <RoleProvider>
        <ThemeProvider>
          <LanguageProvider>
            <RootNavigationLayout />
          </LanguageProvider>
        </ThemeProvider>
      </RoleProvider>
    </Provider>
  );
}
