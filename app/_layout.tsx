import "react-native-gesture-handler";
import React, { useEffect, useCallback } from 'react';
import { Provider } from 'react-redux';
import { Stack, useRouter, useSegments, SplashScreen } from 'expo-router';
import { View, Platform, StatusBar } from "react-native";
import * as NavigationBar from "expo-navigation-bar";

// Redux Store & Actions
import { store } from '../src/store/store';
import { useAppSelector } from '../src/store/hooks';

// Context Providers (AuthProvider is now removed)
import ThemeProvider, { useTheme } from '../src/context/ThemeContext';
import { LanguageProvider } from '../src/context/LanguageContext';
import { RoleProvider } from '../src/context/RoleContext';

// Keep the splash screen visible while the app is loading
SplashScreen.preventAutoHideAsync();

function RootNavigationLayout() {
  // Data ab sirf Redux se aa raha hai
  const { user, isLoading } = useAppSelector((state) => state.auth);
  const segments = useSegments();
  const router = useRouter();
  const { theme } = useTheme();

  // Yeh hook navigation ko control karta hai
  useEffect(() => {
    // Agar Redux initial user data load kar raha hai, to kuch na karein
    if (isLoading) {
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';

    // 1. Agar user login hai aur woh abhi bhi login/register screen par hai
    if (user?.token && inAuthGroup) {
      router.replace('/(tabs)/home');
    } 
    // 2. Agar user login nahi hai aur woh app ke andar ki screen par hai
    else if (!user?.token && !inAuthGroup) {
      router.replace('/(auth)/login');
    }
  }, [user, segments, isLoading, router]);

  // Jab layout taiyar ho jaye to splash screen ko hide karein
  const onLayoutRootView = useCallback(async () => {
    if (!isLoading) {
      await SplashScreen.hideAsync();
    }
  }, [isLoading]);

  // Android aur iOS ke liye bar styling
  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setBackgroundColorAsync(theme.colors.background);
      NavigationBar.setButtonStyleAsync(theme.mode === 'dark' ? "light" : "dark");
    }
    StatusBar.setBarStyle(theme.mode === 'dark' ? "light-content" : "dark-content");
  }, [theme]);

  // Jab tak Redux pehli baar user ki sthiti jaanch raha hai, kuch bhi na dikhayein.
  // Is dauran native splash screen dikhti rahegi.
  if (isLoading) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </View>
  );
}

// Yeh main component hai jo poore app ko sahi providers ke saath wrap karta hai
export default function RootLayout() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <LanguageProvider>
          <RoleProvider>
            {/* ✨ AuthProvider yahan se hata diya gaya hai */}
            <RootNavigationLayout />
          </RoleProvider>
        </LanguageProvider>
      </ThemeProvider>
    </Provider>
  );
}