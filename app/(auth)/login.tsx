// app/(auth)/login.tsx

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Phone, KeyRound } from 'lucide-react-native';
import tw from 'twrnc';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';

import { useAppDispatch } from '../../src/store/hooks';
import { loginUser } from '../../src/store/authSlice';
import { useTheme } from '../../src/context/ThemeContext';
import { useRole } from '../../src/context/RoleContext'; // ✅ RoleContext ko import karein
import { CustomInput } from '../../src/components/forms/FormUI';

export default function LoginScreen() {
    const router = useRouter();
    const { theme } = useTheme();
    const dispatch = useAppDispatch();
    const { changeRole } = useRole(); // ✅ RoleContext se changeRole function lein

    const [mobileNumber, setMobileNumber] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Local loading state for the button

    const handleLogin = async () => {
        if (!mobileNumber || !password) {
            Alert.alert('Error', 'Please enter mobile number and password.');
            return;
        }

        setIsLoading(true); // Loader shuru karein

        try {
            const loginData = { mobileNumber, password };
            
            // ✅ loginUser ko sirf ek baar call karein
            const resultAction = await dispatch(loginUser(loginData)).unwrap();

            // ✅ Login safal hone par shuruaati role tay karein
            const availableRoles = resultAction.availableRoles || [];
            
            let initialRole = 'user'; // Default role
            if (availableRoles.includes('business')) {
                initialRole = 'business'; // Priority 1: Business
            } else if (availableRoles.includes('employee')) {
                initialRole = 'employee'; // Priority 2: Employee
            }

            // ✅ RoleContext mein shuruaati role set karein
            changeRole(initialRole);
            
            // Navigation apne aap _layout.tsx se handle ho jayega
            // Yahan `router.replace` ki zaroorat nahi hai agar aapka RootLayout sahi se set hai.

        } catch (error: any) {
            const errorMessage = error.message || 'Invalid credentials';
            Alert.alert('Login Failed', errorMessage);
        } finally {
            setIsLoading(false); // Loader band karein
        }
    };

    return (
        <View style={[tw`flex-1`, { backgroundColor: theme.colors.background }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={tw`flex-1`}
            >
                <ScrollView contentContainerStyle={tw`flex-grow justify-center p-6`} keyboardShouldPersistTaps="handled">
                    <Image
                        source={{ uri: "https://assets-v2.lottiefiles.com/a/2687f5ac-1702-11ef-8647-f31ff7ccd19f/ppoh7rTFRc.gif" }}
                        style={tw`w-64 h-64 mx-auto mb-8`}
                        contentFit="contain"
                    />
                    <Text style={[tw`text-3xl font-bold mb-2`, { color: theme.colors.text }]}>Welcome Back!</Text>
                    <Text style={[tw`text-base mb-8`, { color: theme.colors.textSecondary }]}>Login with your mobile and password.</Text>

                    <CustomInput label="Mobile Number" icon={Phone} keyboardType="phone-pad" value={mobileNumber} onChangeText={setMobileNumber} maxLength={10} />
                    <CustomInput
                        label="Password"
                        icon={KeyRound}
                        value={password}
                        onChangeText={setPassword}
                        isPassword
                    />
                    <TouchableOpacity onPress={handleLogin} disabled={isLoading} style={[tw`mt-6 h-14 rounded-xl items-center justify-center shadow-md`, { backgroundColor: theme.colors.primary, opacity: isLoading ? 0.6 : 1 }]}>
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={tw`text-white text-lg font-bold`}>Login</Text>
                        )}
                    </TouchableOpacity>

                    <View style={tw`flex-row justify-center mt-8`}>
                        <Text style={[tw`text-base`, { color: theme.colors.textSecondary }]}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                            <Text style={[tw`text-base font-bold`, { color: theme.colors.primary }]}>Register</Text>
                        </TouchableOpacity>
                    </View>
                     <View style={tw`flex-row justify-center mt-4`}>
                        <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')}>
                            <Text style={[tw`text-sm`, { color: theme.colors.primary, textAlign: 'right' }]}>
                                Forgot Password?
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}