import React, { useEffect, useState } from 'react';
import { useSegments, useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUserOnLoad, setLoading } from '../../store/authSlice';
import { View, ActivityIndicator } from 'react-native'; // Import for loader

export default function ProtectedRoute({ children }) {
    const segments = useSegments();
    const router = useRouter();
    const dispatch = useDispatch();
    const { user, isLoading } = useSelector((state) => state.auth);
    const [hasOnboarded, setHasOnboarded] = useState(false);
    const [isCheckingStorage, setIsCheckingStorage] = useState(true);

    useEffect(() => {
        const checkAuthState = async () => {
            try {
                const userString = await AsyncStorage.getItem('user');
                const onboarded = await AsyncStorage.getItem('hasOnboarded');
                
                if (userString) {
                    dispatch(setUserOnLoad(JSON.parse(userString)));
                }
                if (onboarded === 'true') {
                    setHasOnboarded(true);
                }
            } catch (e) {
                console.error("Failed to load auth state.", e);
            } finally {
                // Use a local state to ensure this part finishes before navigation logic runs
                setIsCheckingStorage(false);
                dispatch(setLoading(false));
            }
        };
        checkAuthState();
    }, [dispatch]);

    useEffect(() => {
        // Wait until storage check is complete and segments are available
        if (isCheckingStorage || segments.length === 0) {
            return;
        }

        const inAuthGroup = segments[0] === '(auth)';
        
        // 1. Onboarding has the highest priority
        if (!hasOnboarded) {
            // If not already on the welcome screen, navigate there
            if (segments[1] !== 'welcome') {
                router.replace('/(auth)/welcome');
            }
            return; // Stop further checks
        }

        // 2. User is not signed in and is trying to access a protected screen
        if (!user && !inAuthGroup) {
            router.replace('/(auth)/login');
        }

        // 3. User is signed in but is still on a screen in the (auth) group
        if (user && inAuthGroup) {
            router.replace('/(tabs)/home');
        }

    }, [user, segments, hasOnboarded, isCheckingStorage, router]);
    
    // While checking initial state, you might want to show a loading screen
    if (isCheckingStorage || isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return <>{children}</>;
}