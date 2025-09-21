// app/(auth)/register.tsx

import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { ArrowLeft, User, Mail, Store, KeyRound, Phone } from 'lucide-react-native';
import tw from 'twrnc';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

import { useTheme } from '../../src/context/ThemeContext';
import { useLanguage } from '../../src/context/LanguageContext';
import { authScreenData } from '../../src/data/authScreenData';
import { CustomInput, OtpInput, SearchableDropdown } from '../../src/components/forms/FormUI';
import { UploadFile } from '../../src/components/upload/uploader';
import { useAuth } from '../../src/context/AuthContext';
import { businessTypes } from '../../src/data/businessTypesData';

export default function RegisterScreen() {
    const router = useRouter();
    const { theme } = useTheme();
    const { signIn } = useAuth();
    const { locale } = useLanguage();
    const t = (authScreenData[locale as 'en'|'hi'|'en-HI'] || authScreenData.en).register;

    // State for the form
    const [step, setStep] = useState('details'); // 'details' or 'otp'
    const [userType, setUserType] = useState<'user' | 'business'>('user');
    const [avatar, setAvatar]  = useState<string | null>(null);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [mobileNumber, setMobileNumber] = useState(''); // <-- State for Mobile Number
    const [businessType, setBusinessType] = useState('');
    
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setAvatar(result.assets[0].uri);
        }
    };

    const handleNextStep = () => {
        // --- Validation ---
        if (!fullName.trim()) {
            Alert.alert('Required Field', 'Please enter your full name.');
            return;
        }
        if (!mobileNumber.trim() || mobileNumber.length !== 10) {
            Alert.alert('Required Field', 'Please enter a valid 10-digit mobile number.');
            return;
        }
        if (userType === 'business' && !businessType) {
            Alert.alert('Required Field', 'Please select a business type.');
            return;
        }

        console.log('Details are valid. Proceeding to OTP verification...');
        // In a real app, you would send an OTP to the `mobileNumber` here.
        setStep('otp');
    };

    const handleCreateAccount = () => {
        // In a real app, you would verify the OTP and then save user details.
        console.log("Creating account with details:", {
            avatar,
            fullName,
            email,
            mobileNumber,
            userType,
            businessType: userType === 'business' ? businessType : null,
        });
        
        Alert.alert('Success!', 'Your account has been created successfully.');
        signIn(); // Log the user in and navigate to the home screen
    };

    return (
        <SafeAreaView style={[tw`flex-1 pt-10`, { backgroundColor: theme.colors.background }]}>
            <ScrollView contentContainerStyle={tw`p-6`} keyboardShouldPersistTaps="handled">
                <TouchableOpacity onPress={() => step === 'otp' ? setStep('details') : router.back()} style={tw`mb-6`}>
                    <ArrowLeft size={24} color={theme.colors.text} />
                </TouchableOpacity>

                {step === 'details' && (
                    <>
                        <Text style={[tw`text-3xl font-bold`, { color: theme.colors.text }]}>{t.title}</Text>
                        <Text style={[tw`text-base mt-2 mb-8`, { color: theme.colors.textSecondary }]}>{t.subtitle}</Text>

                        <UploadFile 
                            avatarUrl={avatar || 'https://i.pravatar.cc/300'} 
                            onPress={pickImage} 
                            label="Upload Profile Photo (Optional)" 
                        />

                        <View style={[tw`flex-row rounded-lg p-1 my-4`, { backgroundColor: theme.colors.card }]}>
                            <TouchableOpacity onPress={() => setUserType('user')} style={[tw`flex-1 p-3 rounded-lg items-center`, { backgroundColor: userType === 'user' ? theme.colors.primary : 'transparent' }]}>
                                <Text style={{ color: userType === 'user' ? 'white' : theme.colors.text }}>{t.user}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setUserType('business')} style={[tw`flex-1 p-3 rounded-lg items-center`, { backgroundColor: userType === 'business' ? theme.colors.primary : 'transparent' }]}>
                                <Text style={{ color: userType === 'business' ? 'white' : theme.colors.text }}>{t.business}</Text>
                            </TouchableOpacity>
                        </View>
                        
                        {/* --- Input Fields --- */}
                        <CustomInput label="Full Name (Required)" icon={User} value={fullName} onChangeText={setFullName} />
                        <CustomInput 
                            label="Mobile Number (Required)" 
                            icon={Phone} 
                            keyboardType="phone-pad" 
                            value={mobileNumber} 
                            onChangeText={setMobileNumber}
                            maxLength={10}
                        />
                        <CustomInput label="Email Address (Optional)" icon={Mail} keyboardType="email-address" value={email} onChangeText={setEmail} />

                        {userType === 'business' && (
                            <SearchableDropdown
                                label="Type of Business (Required)"
                                data={businessTypes}
                                onSelect={(item) => setBusinessType(item.value)}
                                selectedValue={businessType}
                            />
                        )}

                        <TouchableOpacity onPress={handleNextStep} style={[tw`mt-4 h-14 rounded-xl items-center justify-center`, { backgroundColor: theme.colors.primary }]}>
                            <Text style={tw`text-white text-lg font-bold`}>Next</Text>
                        </TouchableOpacity>
                    </>
                )}
                
                {step === 'otp' && (
                     <View>
                        <Text style={[tw`text-3xl font-bold mb-2`, { color: theme.colors.text }]}>Verify Your Mobile</Text>
                        {/* --- Displays the number user entered --- */}
                        <Text style={[tw`text-base mb-8`, { color: theme.colors.textSecondary }]}>Enter the OTP sent to +91 {mobileNumber}</Text>
                        
                        <OtpInput label="Enter OTP" icon={KeyRound} />
                        
                        <TouchableOpacity 
                            onPress={handleCreateAccount} 
                            style={[tw`mt-6 h-14 rounded-xl items-center justify-center`, { backgroundColor: theme.colors.primary }]}
                        >
                            <Text style={tw`text-white text-lg font-bold`}>{t.button}</Text>
                        </TouchableOpacity>
                         <TouchableOpacity>
                            <Text style={[tw`text-center mt-6`, { color: theme.colors.textSecondary }]}>Resend Code</Text>
                        </TouchableOpacity>
                    </View>
                )}

            </ScrollView>
        </SafeAreaView>
    );
}