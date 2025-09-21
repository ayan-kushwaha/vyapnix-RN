import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { Mail, KeyRound, Shield } from 'lucide-react-native';
import tw from 'twrnc';
import { CustomInput } from '../../src/components/forms/FormUI';
import { useTheme } from '../../src/context/ThemeContext';
import authService from '../../src/store/authService';
import { useRouter } from 'expo-router';

export default function ForgotPasswordScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  const [step, setStep] = useState(1); // 1 = send OTP, 2 = verify OTP
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 1: Send OTP
  const handleSendOtp = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email.');
      return;
    }
    try {
      setLoading(true);
      const res = await authService.sendOtp(email);
      Alert.alert('OTP Sent', res.message || 'Check your email for OTP.');
      setStep(2); // move to next step
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Reset Password
  const handleResetPassword = async () => {
    if (!otp || !newPassword) {
      Alert.alert('Error', 'Please enter OTP and new password.');
      return;
    }
    try {
      setLoading(true);
      await authService.resetPassword({ email, otp, newPassword });
      Alert.alert('Success', 'Password has been reset. Please login with your new password.');
      router.replace('/(auth)/login'); // navigate back to login
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[tw`flex-1`, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tw`flex-1`}
      >
        <ScrollView contentContainerStyle={tw`flex-grow justify-center p-6`} keyboardShouldPersistTaps="handled">
          <Text style={[tw`text-3xl font-bold mb-4 text-center`, { color: theme.colors.text }]}>
            {step === 1 ? 'Forgot Password' : 'Reset Password'}
          </Text>
          <Text style={[tw`text-base mb-8 text-center`, { color: theme.colors.textSecondary }]}>
            {step === 1
              ? 'Enter your email to receive an OTP.'
              : 'Enter the OTP sent to your email and your new password.'}
          </Text>

          {/* Step 1: Email Input */}
          <CustomInput
            label="Email"
            icon={Mail}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            editable={step === 1} // lock after step 1
          />

          {step === 2 && (
            <>
              <CustomInput
                label="OTP"
                icon={Shield}
                keyboardType="numeric"
                maxLength={6}
                value={otp}
                onChangeText={setOtp}
              />
              <CustomInput
                label="New Password"
                icon={KeyRound}
                isPassword
                value={newPassword}
                onChangeText={setNewPassword}
              />
            </>
          )}

          <TouchableOpacity
            onPress={step === 1 ? handleSendOtp : handleResetPassword}
            disabled={loading}
            style={[
              tw`mt-6 h-14 rounded-xl items-center justify-center shadow-md`,
              { backgroundColor: theme.colors.primary, opacity: loading ? 0.6 : 1 },
            ]}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={tw`text-white text-lg font-bold`}>
                {step === 1 ? 'Send OTP' : 'Reset Password'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Back to Login link */}
          <TouchableOpacity onPress={() => router.replace('/(auth)/login')} style={tw`mt-8`}>
            <Text style={[tw`text-center text-base`, { color: theme.colors.primary }]}>
              Back to Login
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
