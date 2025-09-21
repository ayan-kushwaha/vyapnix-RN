import "react-native-gesture-handler";
import React, { useEffect, useState, useCallback } from 'react';
import { Provider } from 'react-redux';
import { Stack, useRouter, SplashScreen } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator, Platform, StatusBar } from "react-native";
import * as NavigationBar from "expo-navigation-bar";

// Redux Store & Actions
import { store } from '../src/store/store';
import { useAppDispatch, useAppSelector } from '../src/store/hooks';
import { setUserOnLoad, setLoading } from '../src/store/authSlice';

// Context Providers
import ThemeProvider, { useTheme } from '../src/context/ThemeContext'; // ✅ FIX: Corrected import
import { LanguageProvider } from '../src/context/LanguageContext';
import { RoleProvider } from '../src/context/RoleContext';
import { AuthProvider } from "@/src/context/AuthContext";

// Splash screen ko tab tak roke rakhein jab tak app taiyar na ho jaye
SplashScreen.preventAutoHideAsync();

function RootNavigation() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { theme } = useTheme(); // useTheme ko yahan call karein
  const { user, isLoading } = useAppSelector((state) => state.auth);

  // State to check if user has completed the welcome/onboarding screen
  const [hasOnboarded, setHasOnboarded] = useState<boolean | null>(null);
  const [isAppReady, setIsAppReady] = useState(false);
  // Yeh effect app shuru hone par sirf ek baar chalta hai
  useEffect(() => {
    async function prepareApp() {
      try {
        // User data aur onboarding status ko ek saath load karein
        const storedUser = await AsyncStorage.getItem('user');
        const storedOnboardingStatus = await AsyncStorage.getItem('hasOnboarded');

        if (storedUser) {
          dispatch(setUserOnLoad(JSON.parse(storedUser)));
        }

        setHasOnboarded(storedOnboardingStatus === 'true');

      } catch (e) {
        console.warn('Storage se initial app data load karne mein samasya:', e);
      } finally {
        // Redux ko batayein ki initial loading poori ho gayi hai
        // dispatch(setLoading(false));
        setIsAppReady(true);
      }
    }

    prepareApp();
  }, [dispatch]);

  // Yeh effect navigation ko handle karta hai jab bhi state badalti hai
  useEffect(() => {
    // Jab tak loading poori na ho aur onboarding status pata na chale, navigate na karein
    if (isLoading || hasOnboarded === null) {
      return;
    }

    if (!hasOnboarded) {
      // Agar user ne welcome screen nahi dekhi hai, to use wahan bhejein
      router.replace('/(auth)/welcome');
    } else if (user?._id) {
      // Agar user login hai, to use app ke home screen par bhejein
      router.replace('/(tabs)/home');
    } else {
      // Agar user login nahi hai par welcome screen dekh chuka hai, to use login par bhejein
      router.replace('/(auth)/login');
    }

  }, [isLoading, user, hasOnboarded, router]);

  // Yeh function layout taiyar hone par splash screen ko hide karta hai
  const onLayoutRootView = useCallback(async () => {
    if (!isLoading && hasOnboarded !== null) {
      await SplashScreen.hideAsync();
    }
  }, [isLoading, hasOnboarded]);

  // Android ke liye Navigation Bar aur app ke liye Status Bar ka style set karein
  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setBackgroundColorAsync(theme.colors.background);
      NavigationBar.setButtonStyleAsync(theme.mode ? "light" : "dark");
    }
    StatusBar.setBarStyle(theme.mode ? "light-content" : "dark-content");
  }, [theme]);

  // // Jab tak app poori tarah se taiyar na ho, kuch bhi render na karein.
  // // Is dauran native splash screen dikhti rahegi.
  // if (isLoading || hasOnboarded === null) {
  //   // FIX: Blank screen se bachne ke liye ek loading indicator dikhayein.
  //   // Yeh user ko batata hai ki app load ho raha hai.
  //   return (
  //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
  //       <ActivityIndicator size="large" color={theme.colors.primary} />
  //     </View>
  //   );
  // }

  if (!isAppReady) { // ✨ Sirf isAppReady ko check karein
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </View>
  );
}

// Yeh main component hai jo poore app ko sabhi zaroori providers ke saath wrap karta hai
export default function RootLayout() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <LanguageProvider>
          <RoleProvider>
            <AuthProvider>
              <RootNavigation />
            </AuthProvider>
          </RoleProvider>
        </LanguageProvider>
      </ThemeProvider>
    </Provider>
  );
}
