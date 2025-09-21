// src/components/forms/ProfileForm.tsx
import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import tw from "twrnc";
import { ArrowLeft, User, Mail, Phone, Building, Info, MapPin, KeyRound } from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

// Contexts, Store & Types
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { registerUser, updateUser, getMe } from "../../store/authSlice";
import { createBusiness, updateBusiness } from "../../store/businessSlice";
import { BusinessProfile, RegisterUserData, UpdateUserData } from "../../store/types";

// Data & Components
import { profileFormData } from "../../data/profileFormData";
import { profileScreenData } from "../../data/profileScreenData";
import { CustomInput, SearchableDropdown } from "../../components/forms/FormUI";
import { UploadFile } from "../../components/upload/uploader";
import { businessTypes } from "../../data/businessTypesData";

type Locale = "en" | "hi" | "en-HI";

// Helper functions
const formatTime = (date: Date) => date.toTimeString().slice(0, 5);
const displayTime12hr = (time24: string | null) => {
    if (!time24) return null;
    const [h, m] = time24.split(':');
    return new Date(1970, 0, 1, +h, +m).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
};
const defaultOperatingHours: { day: string; isOpen: boolean; openTime: string | null; closeTime: string | null; }[] = Array(7).fill(null).map((_, i) => ({
    day: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][i],
    isOpen: true, openTime: "09:00", closeTime: "18:00"
}));

interface ProfileFormProps {
    mode: 'edit' | 'register';
    onSuccess: () => void;
    onClose?: () => void;
}

export default function ProfileForm({ onClose, onSuccess, mode }: ProfileFormProps) {
    const { theme } = useTheme();
    const { locale } = useLanguage();
    const t = profileFormData[locale as Locale] || profileFormData.en;
    const tCommon = profileScreenData[locale as Locale] || profileScreenData.en;
    const dispatch = useAppDispatch();

    const { user } = useAppSelector((state) => state.auth);
    const { isLoading: isAuthLoading } = useAppSelector((state) => state.auth);
    const { isLoading: isBusinessLoading } = useAppSelector((state) => state.business);
    const isLoading = isAuthLoading || isBusinessLoading;

    const [showPicker, setShowPicker] = useState<{ index: number; type: 'open' | 'close' } | null>(null);
    console.log(`DEBUG: isAuthLoading = ${isAuthLoading}, isBusinessLoading = ${isBusinessLoading}`);
console.log('user',user)
    // ✅ FIX: Form ki state mein business profile ke liye poora structure pehle se bana diya gaya hai
    const [formData, setFormData] = useState({
        role: "",
        fullName: "", email: "", mobileNumber: "", bio: "", avatarUrl: "",
        password: "", confirmPassword: "",
        businessProfile: {
            name: "", description: "", category: "", businessModel: "e-commerce" as "e-commerce" | "booking" | "subscription", logoUrl: "",
            contact: { phone: "", whatsapp: "", email: "" },
            location: { address: "", city: "", state: "", pincode: "" },
            operatingHours: defaultOperatingHours,
        },
    });

    useEffect(() => {
        // Only populate the form with user data if in 'edit' mode and the user exists.
        if (mode === 'edit' && user) {
            setFormData({
                role: user.businessProfile?._id ? 'business' : 'user',
                fullName: user.fullName || '',
                email: user.email || '',
                mobileNumber: user.mobileNumber || '',
                bio: user.bio || '',
                avatarUrl: user.avatarUrl || '',
                password: "",
                confirmPassword: "",
                businessProfile: {
                    name: user.businessProfile?.name || '',
                    description: user.businessProfile?.description || '',
                    category: user.businessProfile?.category || '',
                    businessModel: user.businessProfile?.businessModel || 'e-commerce',
                    logoUrl: user.businessProfile?.logoUrl || '',
                    contact: {
                        phone: user.businessProfile?.contact?.phone || '',
                        whatsapp: user.businessProfile?.contact?.whatsapp || '',
                        email: user.businessProfile?.contact?.email || '',
                    },
                    location: {
                        address: user.businessProfile?.location?.address || '',
                        city: user.businessProfile?.location?.city || '',
                        state: user.businessProfile?.location?.state || '',
                        pincode: user.businessProfile?.location?.pincode || '',
                    },
                    operatingHours: user.businessProfile?.operatingHours?.length ? user.businessProfile.operatingHours : defaultOperatingHours,
                }
            });
        }
    }, [user, mode]);


    const handleInputChange = (path: string, value: any) => {
        setFormData(prev => {
            const keys = path.split('.');
            const newState = JSON.parse(JSON.stringify(prev));
            let current: any = newState;
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]] = current[keys[i]] || {};
            }
            current[keys[keys.length - 1]] = value;
            return newState;
        });
    };


    const toggleDayOpen = (dayIndex: number) => {
        const updatedHours = [...formData.businessProfile.operatingHours];
        updatedHours[dayIndex].isOpen = !updatedHours[dayIndex].isOpen;
        handleInputChange("businessProfile.operatingHours", updatedHours);
    };

    const handleTimeChange = (event: any, selectedDate?: Date) => {
        const pickerInfo = showPicker;
        setShowPicker(null);
        if (selectedDate && pickerInfo) {
            const { index, type } = pickerInfo;
            const updatedHours = [...formData.businessProfile.operatingHours];
            updatedHours[index][type === 'open' ? 'openTime' : 'closeTime'] = formatTime(selectedDate);
            handleInputChange("businessProfile.operatingHours", updatedHours);
        }
    };

    // ✅ FIX: handleSave logic ab 100% sahi hai. Yeh create aur update ko theek se handle karta hai.
    const handleSave = async () => {
        if (!formData.fullName.trim() || !formData.email.trim() || !formData.mobileNumber.trim()) {
            return Alert.alert(t.validation.title, t.validation.requiredFields);
        }
        console.log("--- Form Data on Save ---");
        console.log(JSON.stringify(formData, null, 2));
        console.log(`Current role in form state is: "${formData.role}"`);

        try {
            if (mode === 'register') {
                if (!formData.password) return Alert.alert(t.validation.title, t.validation.passwordRequired);
                if (formData.password !== formData.confirmPassword) return Alert.alert(t.validation.title, t.validation.passwordMismatch);

                const payload: RegisterUserData = {
                    fullName: formData.fullName.trim(),
                    mobileNumber: formData.mobileNumber.trim(),
                    email: formData.email.trim(),
                    password: formData.password,
                    role: formData.role as 'user' | 'business',
                    avatarUrl: formData.avatarUrl,
                };
                await dispatch(registerUser(payload)).unwrap();
                Alert.alert(t.validation.success, t.register.successMessage);

            } else { // Edit mode
                const userPayload: UpdateUserData = {
                    fullName: formData.fullName.trim(),
                    email: formData.email.trim(),
                    bio: formData.bio.trim(),
                    avatarUrl: formData.avatarUrl,
                };
                await dispatch(updateUser(userPayload)).unwrap();

                if (formData.role === "business") {
                    if (!formData.businessProfile.name.trim()) {
                        return Alert.alert("Missing Information", "Business name is required.");
                    }
                    if (!formData.businessProfile.category.trim()) {
                        return Alert.alert("Missing Information", "Business category is required.");
                    }

                    if (!formData.businessProfile.name.trim()) return Alert.alert(t.validation.title, t.validation.businessNameRequired);

                    const businessPayload: Partial<BusinessProfile> = {
                        ...formData.businessProfile,
                        operatingHours: formData.businessProfile.operatingHours.map(day => ({ ...day, openTime: day.isOpen ? day.openTime : null, closeTime: day.isOpen ? day.closeTime : null })),
                    };

                    if (user?.businessProfile?._id) {
                                            console.log("Business profile exists. Updating...");

                        await dispatch(updateBusiness(businessPayload)).unwrap();
                    } else {
                                            console.log("No business profile found. Creating new one...");

                        await dispatch(createBusiness(businessPayload)).unwrap();
                    }
                }
                Alert.alert(t.validation.success, t.edit.successMessage);
            }

            await dispatch(getMe());
            onSuccess();

        } catch (error: any) {
            console.error("Save failed:", error);
            Alert.alert("Error", error.message || "An unknown error occurred.");
        }
    };
    const formContent = mode === 'register' ? t.register : t.edit;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <ScrollView contentContainerStyle={tw`p-6 pb-20`}>
                {onClose && (
                    <TouchableOpacity onPress={onClose} style={tw`mb-4`}>
                        <ArrowLeft size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                )}

                <Text style={[tw`text-3xl font-bold mt-4`, { color: theme.colors.text }]}>{formContent.title}</Text>
                <Text style={[tw`text-base mt-2 mb-8`, { color: theme.colors.textSecondary }]}>{formContent.subtitle}</Text>

                <View style={[tw`flex-row rounded-lg p-1 my-4`, { backgroundColor: theme.colors.card }]}>
                    {["user", "business"].map((r) => (
                        <TouchableOpacity key={r} onPress={() => handleInputChange('role', r)} style={[tw`flex-1 p-3 rounded-lg items-center`, { backgroundColor: formData.role === r ? theme.colors.primary : "transparent" }]}>
                            <Text style={{ color: formData.role === r ? "white" : theme.colors.text }}>{t.common[r as 'user' | 'business']}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {formData.role === 'user' ? (
                    <UploadFile avatarUrl={formData.avatarUrl || undefined} onUploadComplete={({ url }) => handleInputChange('avatarUrl', url)} />
                ) : (
                    <UploadFile avatarUrl={formData.businessProfile.logoUrl || undefined} onUploadComplete={({ url }) => handleInputChange('businessProfile.logoUrl', url)} />
                )}

                <CustomInput label={t.fields.fullName} icon={User} value={formData.fullName} onChangeText={(v) => handleInputChange("fullName", v)} />
                <CustomInput label={t.fields.mobileNumber} icon={Phone} value={formData.mobileNumber} onChangeText={(v) => handleInputChange("mobileNumber", v)} editable={mode === 'register'} keyboardType="phone-pad" maxLength={10} />
                <CustomInput label={t.fields.email} icon={Mail} value={formData.email} onChangeText={(v) => handleInputChange("email", v)} />

                {mode === 'register' && (
                    <>
                        <CustomInput label={t.fields.password} icon={KeyRound} value={formData.password} onChangeText={(v) => handleInputChange('password', v)} isPassword={true} />
                        <CustomInput label={t.fields.confirmPassword} icon={KeyRound} value={formData.confirmPassword} onChangeText={(v) => handleInputChange('confirmPassword', v)} isPassword={true} />
                    </>
                )}

                {formData.role === "user" && (
                    <CustomInput label={t.fields.bio} icon={Info} value={formData.bio} onChangeText={(v) => handleInputChange("bio", v)} multiline />
                )}

                {formData.role === "business" && (
                    <>
                        <CustomInput label={t.fields.businessName} icon={Building} value={formData.businessProfile.name} onChangeText={(v) => handleInputChange("businessProfile.name", v)} />
                        <CustomInput label={t.fields.description} icon={Info} value={formData.businessProfile.description} onChangeText={(v) => handleInputChange("businessProfile.description", v)} multiline />
                        <SearchableDropdown label={t.fields.category} data={businessTypes} selectedValue={formData.businessProfile.category} onSelect={(item) => handleInputChange("businessProfile.category", item.value)} />
                        <SearchableDropdown label={t.fields.businessModel} data={[{ label: "E-commerce", value: "e-commerce" }, { label: "Booking", value: "booking" }, { label: "Subscription", value: "subscription" }]} selectedValue={formData.businessProfile.businessModel} onSelect={(item) => handleInputChange("businessProfile.businessModel", item.value)} />

                        <CustomInput label={t.fields.phone} icon={Phone} value={formData.businessProfile.contact.phone} onChangeText={(v) => handleInputChange('businessProfile.contact.phone', v)} keyboardType="phone-pad" />
                        <CustomInput label={t.fields.whatsapp} icon={Phone} value={formData.businessProfile.contact.whatsapp} onChangeText={(v) => handleInputChange('businessProfile.contact.whatsapp', v)} keyboardType="phone-pad" />
                        <CustomInput label={t.fields.email} icon={Mail} value={formData.businessProfile.contact.email} onChangeText={(v) => handleInputChange('businessProfile.contact.email', v)} keyboardType="email-address" />

                        <CustomInput label={t.fields.address} icon={MapPin} value={formData.businessProfile.location.address} onChangeText={(v) => handleInputChange('businessProfile.location.address', v)} />
                        <CustomInput label={t.fields.city} icon={MapPin} value={formData.businessProfile.location.city} onChangeText={(v) => handleInputChange('businessProfile.location.city', v)} />
                        <CustomInput label={t.fields.state} icon={MapPin} value={formData.businessProfile.location.state} onChangeText={(v) => handleInputChange('businessProfile.location.state', v)} />
                        <CustomInput label={t.fields.pincode} icon={MapPin} value={formData.businessProfile.location.pincode} onChangeText={(v) => handleInputChange('businessProfile.location.pincode', v)} keyboardType="number-pad" />

                        <View style={tw`mt-6`}>
                            <Text style={[tw`text-lg font-bold mb-2`, { color: theme.colors.text }]}>{tCommon.business.operatingHoursTitle}</Text>
                            {formData.businessProfile.operatingHours.map((day, index) => (
                                <View key={index} style={[tw`flex-row items-center justify-between mb-3 p-3 rounded-lg`, { backgroundColor: theme.colors.card }]}>
                                    <Text style={[tw`w-24 font-semibold`, { color: theme.colors.text }]}>{day.day}</Text>
                                    {day.isOpen ? (
                                        <View style={tw`flex-row items-center`}>
                                            <TouchableOpacity onPress={() => setShowPicker({ index, type: 'open' })} style={[tw`px-3 py-2 rounded-lg mr-2`, { backgroundColor: theme.colors.border }]}>
                                                <Text style={{ color: theme.colors.text }}>{displayTime12hr(day.openTime) || 'Open'}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => setShowPicker({ index, type: 'close' })} style={[tw`px-3 py-2 rounded-lg`, { backgroundColor: theme.colors.border }]}>
                                                <Text style={{ color: theme.colors.text }}>{displayTime12hr(day.closeTime) || 'Close'}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ) : <Text style={{ color: theme.colors.textSecondary }}>Closed</Text>}
                                    <TouchableOpacity onPress={() => toggleDayOpen(index)} style={[tw`ml-3 px-2 py-2 rounded-lg`, { backgroundColor: day.isOpen ? theme.colors.destructive : theme.colors.primary }]}>
                                        <Text style={{ color: 'white' }}>{day.isOpen ? 'Set Closed' : 'Set Open'}</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </>
                )}

                <TouchableOpacity onPress={handleSave} disabled={isLoading} style={[tw`mt-6 h-14 rounded-xl items-center justify-center`, { backgroundColor: theme.colors.primary }]}>
                    {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={tw`text-white text-lg font-bold`}>{mode === 'register' ? t.register.button : t.common.saveChanges}</Text>}
                </TouchableOpacity>

                {showPicker && (
                    <DateTimePicker
                        value={new Date(`1970-01-01T${showPicker.type === 'open' ? formData.businessProfile.operatingHours[showPicker.index].openTime : formData.businessProfile.operatingHours[showPicker.index].closeTime || '00:00'}`)}
                        mode="time" is24Hour={false} display="default" onChange={handleTimeChange}
                    />
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

// 