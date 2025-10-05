import React, { useState, useEffect, useContext } from "react";
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import tw from "twrnc";
import { ArrowLeft, User, Mail, Phone, Building, Info, MapPin } from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

// Contexts & Store
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { profileScreenData } from "../../data/profileScreenData";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { updateUser, getMe } from "../../store/authSlice";
import { createBusiness, updateBusiness } from "../../store/businessSlice";
import { UpdateUserData } from "../../store/types";

// Components
import { CustomInput, SearchableDropdown } from "../../components/forms/FormUI";
import { UploadFile } from "../../components/upload/uploader";
import { businessTypesData } from "../../data/businessTypesData";

type Locale = "en" | "hi" | "en-HI";

// Helper functions
const formatTime = (date: Date) => date.toTimeString().slice(0, 5);
const displayTime12hr = (time24: string | null) => {
    if (!time24) return null;
    const [h, m] = time24.split(':');
    return new Date(1970, 0, 1, +h, +m).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
};
const defaultOperatingHours = Array(7).fill(null).map((_, i) => ({
    day: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][i],
    isOpen: true, openTime: "09:00", closeTime: "18:00"
}));

export default function EditProfileForm({ onClose }: { onClose: () => void }) {
    const { theme } = useTheme();
    const { locale } = useLanguage();
    const t = profileScreenData[locale as Locale] || profileScreenData["en"];
    const dispatch = useAppDispatch();

    const { user } = useAppSelector((state) => state.auth);
    const { isLoading: isAuthLoading } = useAppSelector((state) => state.auth);
    const { isLoading: isBusinessLoading } = useAppSelector((state) => state.business);
    const isLoading = isAuthLoading || isBusinessLoading;

    const [showPicker, setShowPicker] = useState<{ index: number; type: 'open' | 'close' } | null>(null);

    // Form ki state, jismein user ka bhara hua data rakha jayega
    const [formData, setFormData] = useState({
        role: "user",
        fullName: "", email: "", mobileNumber: "", bio: "", avatarUrl: "",
        businessProfile: {
            name: "", description: "", category: "", businessModel: "e-commerce", logoUrl: "",
            contact: { phone: "", whatsapp: "", email: "" },
            location: { address: "", city: "", state: "", pincode: "" },
            operatingHours: defaultOperatingHours,
        },
    });

    // ✅ FIX: Yeh effect ab Redux se 'user' ka data badalne par form ko hamesha sahi data se update karega.
    // Jab aap logout karke login karte hain, to naya user object milne par yeh form ko aache se fill kar dega.
    useEffect(() => {
        if (user) {
            setFormData({
                role: user.businessProfile?._id ? 'business' : 'user',
                fullName: user.fullName || '',
                email: user.email || '',
                mobileNumber: user.mobileNumber || '',
                bio: user.bio || '',
                avatarUrl: user.avatarUrl || '',
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
                    // Agar user ke paas operating hours hain to woh use karein, warna default
                    operatingHours: user.businessProfile?.operatingHours?.length ? user.businessProfile.operatingHours : defaultOperatingHours,
                }
            });
        }
    }, [user]);

    // Form ke data ko update karne ke liye ek function
    const handleInputChange = (path: string, value: any) => {
        setFormData(prev => {
            const keys = path.split('.');
            const newState = { ...prev };
            let current: any = newState;
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]] = { ...current[keys[i]] };
            }
            current[keys[keys.length - 1]] = value;
            return newState;
        });
    };

    // Operating hours ko open ya close karne ke liye
    const toggleDayOpen = (dayIndex: number) => {
        const updatedHours = [...formData.businessProfile.operatingHours];
        updatedHours[dayIndex].isOpen = !updatedHours[dayIndex].isOpen;
        handleInputChange("businessProfile.operatingHours", updatedHours);
    };

    // Time picker se time select karne par
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
        if (!formData.fullName.trim() || !formData.email.trim()) {
            return Alert.alert("Validation Error", "Please fill in your full name and email.");
        }

        try {
            // Step 1: Hamesha pehle user ki personal details update karein
            const userPayload: UpdateUserData = {
                fullName: formData.fullName.trim(),
                email: formData.email.trim(),
                bio: formData.bio.trim(),
                avatarUrl: formData.avatarUrl,
            };
            await dispatch(updateUser(userPayload)).unwrap();

            // Step 2: Agar role 'business' chuna gaya hai, to business profile ko handle karein
            if (formData.role === "business") {
                if (!formData.businessProfile.name.trim()) {
                    return Alert.alert("Validation Error", "Business name is required to save a business profile.");
                }
                const businessPayload = {
                    ...formData.businessProfile,
                    operatingHours: formData.businessProfile.operatingHours.map(day => ({
                        ...day,
                        openTime: day.isOpen ? day.openTime : null,
                        closeTime: day.isOpen ? day.closeTime : null,
                    })),
                };

                // Sabse zaroori hissa: Check karein ki profile pehle se hai ya nahi
                if (user?.businessProfile?._id) {
                    // Agar profile hai, to use UPDATE karein
                    await dispatch(updateBusiness(businessPayload)).unwrap();
                } else {
                    // Agar profile nahi hai, to use CREATE karein
                    await dispatch(createBusiness(businessPayload)).unwrap();
                }
            }

            // Step 3: Jab sab kuch safal ho jaye, tabhi success ka message dikhayein
            Alert.alert("Success", 'Profile updated successfully!');
            await dispatch(getMe()); // Server se naya data fetch karein taaki sab kuch sync ho jaye
            onClose(); // Form band karein

        } catch (err: any) {
            console.error("Save failed:", err);
            Alert.alert("Error", err.message || "An unknown error occurred during update.");
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <ScrollView contentContainerStyle={tw`p-6 pb-20`}>
                <TouchableOpacity onPress={onClose} style={tw`mb-4`}>
                    <ArrowLeft size={24} color={theme.colors.text} />
                </TouchableOpacity>

                <View style={[tw`flex-row rounded-lg p-1 my-4`, { backgroundColor: theme.colors.card }]}>
                    {["user", "business"].map((r) => (
                        <TouchableOpacity key={r} onPress={() => handleInputChange('role', r)} style={[tw`flex-1 p-3 rounded-lg items-center`, { backgroundColor: formData.role === r ? theme.colors.primary : "transparent" }]}>
                            <Text style={{ color: formData.role === r ? "white" : theme.colors.text }}>{r === 'user' ? t.common.switchToUser : t.common.switchToBusiness}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {formData.role === 'user' ? (
                    <UploadFile avatarUrl={formData.avatarUrl || undefined} onUploadComplete={({ url }) => handleInputChange('avatarUrl', url)} />
                ) : (
                    <UploadFile avatarUrl={formData.businessProfile.logoUrl || undefined} onUploadComplete={({ url }) => handleInputChange('businessProfile.logoUrl', url)} />
                )}

                <CustomInput label={t.user.details.fullName} icon={User} value={formData.fullName} onChangeText={(v) => handleInputChange("fullName", v)} />
                <CustomInput label={t.user.details.phone} icon={Phone} value={formData.mobileNumber} editable={false} />
                <CustomInput label={t.user.details.email} icon={Mail} value={formData.email} onChangeText={(v) => handleInputChange("email", v)} />

                {formData.role === "user" && (
                    <CustomInput label={t.user.details.bio} icon={Info} value={formData.bio} onChangeText={(v) => handleInputChange("bio", v)} multiline />
                )}

                {formData.role === "business" && (
                    <>
                        <CustomInput label={t.business.details.name} icon={Building} value={formData.businessProfile.name} onChangeText={(v) => handleInputChange("businessProfile.name", v)} />
                        <CustomInput label={t.business.details.description} icon={Info} value={formData.businessProfile.description} onChangeText={(v) => handleInputChange("businessProfile.description", v)} multiline />
                        <SearchableDropdown label={t.business.details.category} data={businessTypes} selectedValue={formData.businessProfile.category} onSelect={(item) => handleInputChange("businessProfile.category", item.value)} />
                        <SearchableDropdown label={t.business.details.businessModel} data={[{ label: "E-commerce", value: "e-commerce" }, { label: "Booking", value: "booking" }]} selectedValue={formData.businessProfile.businessModel} onSelect={(item) => handleInputChange("businessProfile.businessModel", item.value)} />
                        <CustomInput label={t.business.details.phone} icon={Phone} value={formData.businessProfile.contact.phone} onChangeText={(v) => handleInputChange('businessProfile.contact.phone', v)} />
                        <CustomInput label={t.business.details.address} icon={MapPin} value={formData.businessProfile.location.address} onChangeText={(v) => handleInputChange('businessProfile.location.address', v)} />

                        <View style={tw`mt-6`}>
                            <Text style={[tw`text-lg font-bold mb-2`, { color: theme.colors.text }]}>{t.business.operatingHoursTitle}</Text>
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
                    {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={tw`text-white text-lg font-bold`}>{t.common.saveChanges}</Text>}
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

// old