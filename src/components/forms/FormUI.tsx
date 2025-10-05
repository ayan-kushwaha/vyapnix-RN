//src/componets/FormUi
import React, { FC, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, TextInputProps, Switch, Platform, Modal, Pressable, FlatList } from 'react-native';
import { LucideIcon, Eye, EyeOff, Calendar as CalendarIcon, Clock, Check, CheckSquare } from 'lucide-react-native';
import tw from 'twrnc';
import { useTheme } from '../../context/ThemeContext';
export * from './SearchableDropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
export * from './SearchableDropdown';
export * from '../upload/ImageUploader';

// --- Props ki Typing ---
interface CustomInputProps extends TextInputProps {
    icon: LucideIcon;
    label?: string;
    isPassword?: boolean;
    renderRightIcon?: () => JSX.Element;
}

interface CustomTextAreaProps extends TextInputProps {
    label?: string;
    height?: number;
}

// --- 1. Text, Email, Password ke liye Reusable Input ---
export const CustomInput: FC<CustomInputProps> = ({ icon: Icon, label, multiline, renderRightIcon, isPassword = false, ...props }) => {
    const { theme } = useTheme();
    const [isFocused, setIsFocused] = useState(false);
    const [secureText, setSecureText] = useState(isPassword);

    // ✨ FIX: Border ka color ab 'transparent' hai jab focus nahi hai.
    const borderColor = isFocused ? theme.colors.primary : theme.colors.border;

    return (
        <View style={tw`mb-4`}>
            {label && <Text style={[tw`text-sm font-medium mb-2`, { color: theme.colors.textSecondary }]}>{label}</Text>}
            <View style={[tw`flex-row items-center p-3 rounded-xl border-2`, { backgroundColor: theme.colors.card, borderColor }, multiline ? tw`h-40 items-start` : tw`h-14`]}>
                <Icon color={isFocused ? theme.colors.primary : theme.colors.textSecondary} size={20} />
                <TextInput
                    style={[
                        tw`flex-1 ml-3 text-base h-full min-h-10 ${multiline ? '-mt-3 min-h-40' : ''}`, // Base height for single line
                        { color: theme.colors.text },
                        multiline && { textAlignVertical: 'top' } // This is the key for textarea behavior
                    ]}
                    placeholderTextColor={theme.colors.textSecondary as string}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    secureTextEntry={secureText}
                    multiline={multiline} // Make sure to pass the multiline prop
                    numberOfLines={multiline ? 4 : 1} // Suggests an initial size
                    {...props}
                />
                {isPassword && (
                    <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                        {secureText ? <EyeOff color={theme.colors.textSecondary} size={20} /> : <Eye color={theme.colors.textSecondary} size={20} />}
                    </TouchableOpacity>
                )}
                {renderRightIcon && (
                    <View style={tw`pl-2`}>{renderRightIcon()}</View>
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
                    tw`p-4 rounded-xl border-2 text-base leading-6`, // ✨ FIX: Line height add ki gayi hai behtar readability ke liye.
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



// 2. Switch (On/Off) ke liye
export const SwitchInput = ({ label, value, onValueChange }: { label: string, value: boolean, onValueChange: (val: boolean) => void }) => {
    const { theme } = useTheme();
    return (
        <View style={tw`mb-4`}>
            <Text style={[tw`text-sm font-medium mb-2`, { color: theme.colors.textSecondary }]}>{label}</Text>
            <View style={[tw`flex-row justify-between items-center p-4 rounded-xl h-14`, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, borderWidth: 2 }]}>
                <Text style={{ color: value ? theme.colors.primary as string : theme.colors.text }}>{value ? 'Yes' : 'No'}</Text>
                <Switch value={value} onValueChange={onValueChange} trackColor={{ false: theme.colors.border as string, true: theme.colors.primary as string }} thumbColor={"white"} />
            </View>
        </View>
    );
};

// 3. Date & Time Picker ke liye
export const DateTimeInput = ({ label, value, onValueChange, mode }: { label: string, value: Date, onValueChange: (date: Date) => void, mode: 'date' | 'time' }) => {
    const { theme } = useTheme();
    const [showPicker, setShowPicker] = useState(false);
    const Icon = mode === 'date' ? CalendarIcon : Clock;
    const displayValue = value ? (mode === 'date' ? value.toLocaleDateString() : value.toLocaleTimeString()) : `Select ${mode}`;

    return (
        <View style={tw`mb-4`}>
            <Text style={[tw`text-sm font-medium mb-2`, { color: theme.colors.textSecondary }]}>{label}</Text>
            <TouchableOpacity onPress={() => setShowPicker(true)}>
                <View style={[tw`flex-row items-center p-3 rounded-xl border-2 h-14`, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
                    <Icon color={theme.colors.textSecondary as string} size={20} />
                    <Text style={[tw`flex-1 ml-3 text-base`, { color: theme.colors.text }]}>{displayValue}</Text>
                </View>
            </TouchableOpacity>
            {showPicker && (
                <DateTimePicker
                    value={value || new Date()}
                    mode={mode}
                    display="default"
                    onChange={(_, selectedDate) => {
                        setShowPicker(Platform.OS === 'ios');
                        if (selectedDate) onValueChange(selectedDate);
                    }}
                />
            )}
        </View>
    );
};


// 4. Checkbox
export const CheckboxInput = ({ label, value, onValueChange }: { label: string, value: boolean, onValueChange: (val: boolean) => void }) => {
    const { theme } = useTheme();
    return (
        <TouchableOpacity onPress={() => onValueChange(!value)} style={tw`flex-row items-center mb-4`}>
            <View style={[tw`w-6 h-6 rounded border-2 justify-center items-center`, { borderColor: theme.colors.primary as string, backgroundColor: value ? theme.colors.primary as string : 'transparent' }]}>
                {value && <Check size={16} color="white" />}
            </View>
            <Text style={[tw`ml-3 text-base`, { color: theme.colors.text }]}>{label}</Text>
        </TouchableOpacity>
    );
};

