    //app/(auth)/register.tsx
    import React, { useState, useEffect } from 'react';
    import {
        View,
        Text,
        SafeAreaView,
        TouchableOpacity,
        ScrollView,
        Alert,
        ActivityIndicator,
    } from 'react-native';
    import { ArrowLeft, User, Mail, KeyRound, Phone } from 'lucide-react-native';
    import tw from 'twrnc';
    import { useRouter } from 'expo-router';
    import * as ImagePicker from 'expo-image-picker';

    // Redux
    import { useAppDispatch, useAppSelector } from '../../src/store/hooks';
    import { registerUser, reset } from '../../src/store/authSlice';
    import { RegisterUserData } from '../../src/store/types';

    // Context
    import { useTheme } from '@/src/context/ThemeContext';
    import { useLanguage } from '@/src/context/LanguageContext';

    // Data
    import { authScreenData } from '@/src/data/authScreenData';
    import { businessTypes } from '@/src/data/businessTypesData';

    // UI Components
    import { CustomInput, SearchableDropdown } from '@/src/components/forms/FormUI';
    import { UploadFile } from '@/src/components/upload/uploader';

    // Cloudinary Utils

    export default function RegisterScreen() {
        const router = useRouter();
        const { theme } = useTheme();
        const { locale } = useLanguage();

        const t = (authScreenData[locale as 'en' | 'hi'] || authScreenData.en).register;

        const dispatch = useAppDispatch();
        const { isLoading, isError, isSuccess, message } = useAppSelector((state) => state.auth);

        // ---------------- State ----------------
        const [userType, setUserType] = useState<'user' | 'business'>('user');
    const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

        const [fullName, setFullName] = useState('');
        const [email, setEmail] = useState('');
        const [mobileNumber, setMobileNumber] = useState('');
        const [password, setPassword] = useState('');
        const [confirmPassword, setConfirmPassword] = useState('');
        const [businessType, setBusinessType] = useState('');

        // ---------------- Effects ----------------
        useEffect(() => {
            if (isError && message) {
                Alert.alert('Registration Failed', String(message));
                dispatch(reset());
            }
            if (isSuccess) {
                Alert.alert('Success', 'Account created successfully!');
                dispatch(reset());
                router.replace('/(auth)/login');
            }
        }, [isError, isSuccess, message, dispatch, router]);



        // ---------------- Validation ----------------
        const validateForm = (): boolean => {
            if (!fullName.trim() || !mobileNumber.trim() || !email.trim() || !password.trim()) {
                Alert.alert('Required Fields', 'Please fill all required fields.');
                return false;
            }
            if (password !== confirmPassword) {
                Alert.alert('Password Error', 'Passwords do not match.');
                return false;
            }
            if (userType === 'business' && !businessType) {
                Alert.alert('Required Field', 'Please select a business type.');
                return false;
            }
            return true;
        };

        // ---------------- Submit ----------------
        const handleRegister = () => {
            if (!validateForm()) return;

            const userData: RegisterUserData = {
                fullName,
                mobileNumber,
                email,
                password,
                role: userType,
                businessType: userType === 'business' ? businessType : undefined,
                avatarUrl: avatarUrl,
            };

            dispatch(registerUser(userData));
        };

        // ---------------- UI ----------------
        return (
            <SafeAreaView style={[tw`flex-1 pt-10`, { backgroundColor: theme.colors.background }]}>
                <ScrollView contentContainerStyle={tw`p-6`} keyboardShouldPersistTaps="handled">
                    {/* Back Button */}
                    <TouchableOpacity onPress={() => router.back()} style={tw`mb-6`}>
                        <ArrowLeft size={24} color={theme.colors.text} />
                    </TouchableOpacity>

                    {/* Header */}
                    <Text style={[tw`text-3xl font-bold`, { color: theme.colors.text }]}>{t.title}</Text>
                    <Text
                        style={[
                            tw`text-base mt-2 mb-8`,
                            { color: theme.colors.textSecondary },
                        ]}
                    >
                        {t.subtitle}
                    </Text>

                    {/* Profile Image */}
                    <UploadFile
                        avatarUrl={avatarUrl || undefined}
                        onUploadComplete={({ url }) => setAvatarUrl(url)}
                    />


                    {/* Toggle User Type */}
                    <View
                        style={[
                            tw`flex-row rounded-lg p-1 my-4`,
                            { backgroundColor: theme.colors.card },
                        ]}
                    >
                        <TouchableOpacity
                            onPress={() => setUserType('user')}
                            style={[
                                tw`flex-1 p-3 rounded-lg items-center`,
                                {
                                    backgroundColor:
                                        userType === 'user' ? theme.colors.primary : 'transparent',
                                },
                            ]}
                        >
                            <Text
                                style={{
                                    color: userType === 'user' ? 'white' : theme.colors.text,
                                }}
                            >
                                {t.user}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setUserType('business')}
                            style={[
                                tw`flex-1 p-3 rounded-lg items-center`,
                                {
                                    backgroundColor:
                                        userType === 'business' ? theme.colors.primary : 'transparent',
                                },
                            ]}
                        >
                            <Text
                                style={{
                                    color: userType === 'business' ? 'white' : theme.colors.text,
                                }}
                            >
                                {t.business}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Input Fields */}
                    <CustomInput
                        label="Full Name (Required)"
                        icon={User}
                        value={fullName}
                        onChangeText={setFullName}
                    />
                    <CustomInput
                        label="Mobile Number (Required)"
                        icon={Phone}
                        keyboardType="phone-pad"
                        value={mobileNumber}
                        onChangeText={setMobileNumber}
                        maxLength={10}
                    />
                    <CustomInput
                        label="Email Address (Required)"
                        icon={Mail}
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <CustomInput
                        label="Password (Required)"
                        icon={KeyRound}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                    <CustomInput
                        label="Confirm Password (Required)"
                        icon={KeyRound}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                    />

                    {/* Business Type Dropdown */}
                    {userType === 'business' && (
                        <SearchableDropdown
                            label="Type of Business (Required)"
                            data={businessTypes}
                            onSelect={(item) => setBusinessType(item.value)}
                            selectedValue={businessType}
                        />
                    )}

                    {/* Register Button */}
                    <TouchableOpacity
                        onPress={handleRegister}
                        disabled={isLoading}
                        style={[
                            tw`mt-4 h-14 rounded-xl items-center justify-center`,
                            { backgroundColor: theme.colors.primary },
                        ]}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={tw`text-white text-lg font-bold`}>{t.button}</Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        );
    }
