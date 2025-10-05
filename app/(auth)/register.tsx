import React from 'react';
import { useRouter } from 'expo-router';
import ProfileForm from '../../src/components/forms/ProfileForm';
import { Text, TouchableOpacity } from 'react-native';
import tw from "twrnc";
import { useTheme } from '@/src/context/ThemeContext';

export default function RegisterScreen() {
    const router = useRouter();
    const { theme } = useTheme();
    console.log("--- 1. RegisterScreen IS RENDERING ---");

    /**
     * Navigates to the main app screen (tabs) after a successful registration.
     */
    const handleRegistrationSuccess = () => {
        // 'replace' is used so the user can't press the back button
        // to return to the registration screen after creating an account.
        router.replace('/(tabs)/profile');
    };

    return (
        <>
            <ProfileForm
                mode="register"
                onSuccess={handleRegistrationSuccess}
            />
          
        </>
    );
}

