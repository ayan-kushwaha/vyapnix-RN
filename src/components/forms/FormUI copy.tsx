import React, { FC, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, TextInputProps } from 'react-native';
import { LucideIcon, Eye, EyeOff } from 'lucide-react-native';
import tw from 'twrnc';
import { useTheme } from '../../context/ThemeContext';

// --- Props ki Typing ---
interface CustomInputProps extends TextInputProps {
    icon: LucideIcon;
    label: string;
    isPassword?: boolean;
}

interface CustomTextAreaProps extends TextInputProps {
    label: string;
    height?: number;
}

// --- 1. Text, Email, Password ke liye Reusable Input ---
export const CustomInput: FC<CustomInputProps> = ({ icon: Icon, label, isPassword = false, ...props }) => {
    const { theme } = useTheme();
    const [isFocused, setIsFocused] = useState(false);
    const [secureText, setSecureText] = useState(isPassword);

    // ✨ FIX: Border ka color ab 'transparent' hai jab focus nahi hai.
    const borderColor = isFocused ? theme.colors.primary : 'transparent';

    return (
        <View style={tw`mb-4`}>
            <Text style={[tw`text-sm font-medium mb-2`, { color: theme.colors.textSecondary }]}>{label}</Text>
            {/* ✨ FIX: Border hamesha 2px ka rahega, bas color badlega. Isse layout shift nahi hoga. */}
            <View style={[tw`flex-row items-center h-14 p-3 rounded-xl border-2`, { backgroundColor: theme.colors.card, borderColor }]}>
                <Icon color={isFocused ? theme.colors.primary : theme.colors.textSecondary} size={20} />
                <TextInput
                    style={[tw`flex-1 ml-3 text-base border-none h-full`, { color: theme.colors.text }]}
                    placeholderTextColor={theme.colors.textSecondary}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    
                    secureTextEntry={secureText}
                    {...props}
                />
                {isPassword && (
                    <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                        {secureText ? <EyeOff color={theme.colors.textSecondary} size={20} /> : <Eye color={theme.colors.textSecondary} size={20} />}
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

// --- 2. Bio jaise bade text ke liye Text Area ---
export const CustomTextArea: FC<CustomTextAreaProps> = ({ label, height = 120, ...props }) => {
    const { theme } = useTheme();
    const [isFocused, setIsFocused] = useState(false);

    // ✨ FIX: Border ka color yahan bhi 'transparent' hai jab focus nahi hai.
    const borderColor = isFocused ? theme.colors.primary : 'transparent';

    return (
        <View style={tw`mb-4`}>
            <Text style={[tw`text-sm font-medium mb-2`, { color: theme.colors.textSecondary }]}>{label}</Text>
            <TextInput
                style={[
                    tw`p-4 rounded-xl border-2 text-base leading-6 border-none`, // ✨ FIX: Line height add ki gayi hai behtar readability ke liye.
                    { 
                        backgroundColor: theme.colors.card, 
                        borderColor, 
                        height, 
                        textAlignVertical: 'top', // Text hamesha upar se shuru hoga
                        color: theme.colors.text, // Text ka color theme se aayega
                    }
                ]}
                placeholderTextColor={theme.colors.textSecondary}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                multiline
                {...props}
            />
        </View>
    );
};

// --- 3. OTP Input (Ismein koi badlav nahi) ---
export const OtpInput: FC<{ label: string }> = ({ label }) => {
    const { theme } = useTheme();
    return (
        <View style={tw`mb-4 items-center`}>
            <Text style={[tw`text-sm font-medium mb-3`, { color: theme.colors.textSecondary }]}>{label}</Text>
            <View style={tw`flex-row justify-between w-full`}>
                {[...Array(6)].map((_, index) => (
                    <TextInput
                        key={index}
                        style={[
                            tw`h-14 w-12 rounded-xl border-2 text-center text-xl font-bold`,
                            { backgroundColor: theme.colors.card, borderColor: theme.colors.border, color: theme.colors.text }
                        ]}
                        keyboardType="number-pad"
                        maxLength={1}
                    />
                ))}
            </View>
        </View>
    );
};

