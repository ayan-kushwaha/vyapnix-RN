import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {
    signIn: () => void;
    signOut: () => void;
    user: any;
    isLoading: boolean;
    completeOnboarding: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ✨ FIX: Yeh hook ab aklmand hai aur infinite loop nahi banayega
function useProtectedRoute(user: any, hasOnboarded: boolean) {
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        const inAuthGroup = segments[0] === '(auth)';

        // Agar segments load nahi hue hain, to kuch na karein
        if (segments.length === 0) return;

        if (!hasOnboarded) {
            // 1. Agar Welcome screen nahi dekhi hai, to wahan bhejo
            // Lekin tabhi bhejo jab pehle se wahan na ho
            if (segments[1] !== 'welcome') {
                router.replace('/(auth)/welcome');
            }
        } else if (!user && !inAuthGroup) {
            // 2. Agar Welcome dekh li hai, par login nahi hai, to login par bhejo
            router.replace('/(auth)/login');
        } else if (user && inAuthGroup) {
            // 3. Agar login hai, to app ke andar (home) bhejo
            router.replace('/(tabs)/home');
        }
    }, [user, segments, hasOnboarded, router]);
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const [hasOnboarded, setHasOnboarded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuthState = async () => {
            try {
                const userToken = await AsyncStorage.getItem('userToken');
                const onboarded = await AsyncStorage.getItem('hasOnboarded');
                
                if (userToken) setUser({ token: userToken });
                if (onboarded === 'true') setHasOnboarded(true);

            } catch (e) {
                console.error("Failed to load auth state.", e);
            } finally {
                setIsLoading(false);
            }
        };
        checkAuthState();
    }, []);

    useProtectedRoute(user, hasOnboarded);

    const signIn = async () => {
        await AsyncStorage.setItem('userToken', 'dummy-token');
        setUser({ token: 'dummy-token' });
    };
    
    const signOut = async () => {
        await AsyncStorage.removeItem('userToken');
        // Onboarding ko reset nahi karna hai
        // await AsyncStorage.removeItem('hasOnboarded');
        setUser(null);
    };

    const completeOnboarding = async () => {
        await AsyncStorage.setItem('hasOnboarded', 'true');
        setHasOnboarded(true);
    };

    return (
        <AuthContext.Provider value={{ signIn, signOut, user, isLoading, completeOnboarding }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

