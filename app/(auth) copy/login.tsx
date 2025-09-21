// app/(auth)/login.tsx

import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { ArrowLeft, User, KeyRound } from 'lucide-react-native';
import tw from 'twrnc';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image'; // Using expo-image for better GIF support

import { useTheme } from '../../src/context/ThemeContext';
import { useLanguage } from '../../src/context/LanguageContext';
import { authScreenData } from '../../src/data/authScreenData';
import { CustomInput, OtpInput } from '../../src/components/forms/FormUI';
import { useAuth } from '../../src/context/AuthContext';

export default function LoginScreen() {
    const router = useRouter();
    const { theme } = useTheme();
    const { signIn } = useAuth();
    const { locale } = useLanguage();
    
    // Fallback to 'en' to prevent crashes
    const t = (authScreenData[locale as 'en'|'hi'|'en-HI'] || authScreenData.en).login;

    const [step, setStep] = useState('phone');
    const [mobileNumber, setMobileNumber] = useState('');

    const handleSendOtp = () => {
        if (mobileNumber.length >= 10) { // Simple validation
            setStep('otp');
        } else {
            // You can add an alert or a toast message here for invalid number
            console.log("Please enter a valid mobile number.");
        }
    };

    const handleVerifyOtp = () => {
        // In a real app, you would verify the OTP via an API call here.
        const isNewUser = true; // Sample logic
        if (isNewUser) {
            router.push('/register'); // Navigate using the URL path
        } else {
            signIn();
        }
    };
    
    return (
        <SafeAreaView style={[tw`flex-1`, { backgroundColor: theme.colors.background }]}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={tw`flex-1`}
            >
                <ScrollView 
                    contentContainerStyle={tw`flex-grow justify-center p-6 pt-5`} // pt-5 for 20px top padding
                    keyboardShouldPersistTaps="handled"
                >
                    {step === 'otp' && (
                        <TouchableOpacity onPress={() => setStep('phone')} style={tw`absolute top-6 left-6 z-10 p-2`}>
                            <ArrowLeft size={24} color={theme.colors.text} />
                        </TouchableOpacity>
                    )}

                    <View style={tw`items-center`}>
                        <Image
                            source={{ uri: "https://assets-v2.lottiefiles.com/a/2687f5ac-1702-11ef-8647-f31ff7ccd19f/ppoh7rTFRc.gif" }}
                            style={tw`w-64 h-64 mb-8`}
                            contentFit="contain"
                        />
                    </View>

                    {step === 'phone' && (
                        <View>
                            <Text style={[tw`text-3xl font-bold mb-2`, { color: theme.colors.text }]}>{t.title}</Text>
                            <Text style={[tw`text-base mb-8`, { color: theme.colors.textSecondary }]}>{t.subtitle}</Text>
                            <CustomInput 
                                label="Mobile Number" 
                                icon={User} 
                                keyboardType="phone-pad" 
                                value={mobileNumber} 
                                onChangeText={setMobileNumber}
                                maxLength={10}
                            />
                            <TouchableOpacity 
                                onPress={handleSendOtp} 
                                style={[tw`mt-6 h-14 rounded-xl items-center justify-center shadow-md`, { backgroundColor: theme.colors.primary }]}
                            >
                                <Text style={tw`text-white text-lg font-bold`}>{t.button}</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {step === 'otp' && (
                        <View>
                            <Text style={[tw`text-3xl font-bold mb-2`, { color: theme.colors.text }]}>{t.otpTitle}</Text>
                            <Text style={[tw`text-base mb-8`, { color: theme.colors.textSecondary }]}>{t.otpSubtitle} +91 {mobileNumber}</Text>
                            <OtpInput label="Enter OTP" icon={KeyRound} />
                            <TouchableOpacity 
                                onPress={handleVerifyOtp} 
                                style={[tw`mt-6 h-14 rounded-xl items-center justify-center shadow-md`, { backgroundColor: theme.colors.primary }]}
                            >
                                <Text style={tw`text-white text-lg font-bold`}>{t.verifyButton}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Text style={[tw`text-center mt-6`, { color: theme.colors.textSecondary }]}>{t.resend}</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <View style={tw`flex-row justify-center mt-8`}>
                        <Text style={[tw`text-base`, { color: theme.colors.textSecondary }]}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/register')}>
                            <Text style={[tw`text-base font-bold`, { color: theme.colors.primary }]}>Register</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

