import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Phone, KeyRound } from 'lucide-react-native';
import tw from 'twrnc';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';

// ✅ FIX 1: Apne custom typed hooks ko import karein
import { useAppDispatch, useAppSelector } from '../../src/store/hooks';
import { loginUser, reset } from '../../src/store/authSlice';
import { useTheme } from '../../src/context/ThemeContext';
import { CustomInput } from '../../src/components/forms/FormUI';
import { RootState } from '../../src/store/store'; // RootState ko import karein (good practice)

export default function LoginScreen() {
    const router = useRouter();
    const { theme } = useTheme();

    // ✅ FIX 2: useDispatch ki jagah useAppDispatch ka istemal karein
    const dispatch = useAppDispatch();

    const [mobileNumber, setMobileNumber] = useState('');
    const [password, setPassword] = useState('');

    // ✅ FIX 3: useSelector ki jagah useAppSelector ka istemal karein
    // Ab 'state' ka type 'RootState' hai, 'unknown' nahi.
    const { user, isLoading, isError, isSuccess, message } = useAppSelector(
        (state: RootState) => state.auth
    );

    useEffect(() => {
        // Agar API se error aaye, toh alert dikhayein aur state reset karein
        if (isError && message) {
            // Message string hai ya nahi, yeh check karein
            const errorMessage = typeof message === 'string' ? message : 'An unknown error occurred';
            Alert.alert('Login Failed', errorMessage);
            dispatch(reset()); // Reset karna zaroori hai taaki error baar baar na dikhe
        }

        // Agar success ho jaaye, toh bhi state ko reset karein
        // Navigation ka kaam RootLayoutNav component dekh lega
        if (isSuccess || user) {
            dispatch(reset());
        }
    }, [isError, isSuccess, user, message, dispatch]);

    const handleLogin = () => {
        if (!mobileNumber || !password) {
            Alert.alert('Error', 'Please enter mobile number and password.');
            return;
        }
        // Login action ko dispatch karein
        dispatch(loginUser({ mobileNumber, password }));
    };
    LoginScreen.tsx

    // ...
    // const handleLogin = async () => { // ✨ Ise async banayein
    //     if (!mobileNumber || !password) {
    //         Alert.alert('Error', 'Please enter mobile number and password.');
    //         return;
    //     }

    //     try {
    //         // Login action ko dispatch karein aur result ka intezar karein
    //         await dispatch(loginUser({ mobileNumber, password })).unwrap();

    //         // Agar login safal hota hai, to navigation apne aap _layout.tsx se ho jayega.
    //         // Yahan kuch karne ki zaroorat nahi hai.
    //         // dispatch(reset()) yahan call karne ki zaroorat nahi kyunki hum navigate kar rahe hain.

    //     } catch (error: any) {
    //         // Agar login fail hota hai, to error ko yahan pakdein
    //         const errorMessage = typeof error.message === 'string' ? error.message : 'Invalid credentials';
    //         Alert.alert('Login Failed', errorMessage);
    //         // Fail hone par state ko reset karein
    //         //   dispatch(reset());
    //     }
    // };
    // ...

    return (
        <SafeAreaView style={[tw`flex-1`, { backgroundColor: theme.colors.background }]}>
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
                    <View style={tw`flex-row justify-center mt-8`}>
                        <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')}>
                            <Text style={[tw`text-sm mb-4`, { color: theme.colors.primary, textAlign: 'right' }]}>
                                Forgot Password?
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
// old is