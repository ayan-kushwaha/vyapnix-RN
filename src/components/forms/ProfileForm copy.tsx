import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Alert, ActivityIndicator, TouchableOpacity, SafeAreaView } from "react-native";
import tw from "twrnc";
import { ArrowLeft, User, Mail, Phone, KeyRound, Building, Info, MapPin } from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

// Redux & Context
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { registerUser, updateUser, getMe, reset as resetAuth } from "../../store/authSlice";
import { createBusiness, updateBusiness, reset as resetBusiness } from "../../store/businessSlice";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";

// UI & Data
import { CustomInput, SearchableDropdown } from "./FormUI";
import { UploadFile } from "../upload/uploader";
import { businessTypes } from "../../data/businessTypesData";
import { profileFormData } from "../../data/profileFormData"; // Reusable form translations
import { profileScreenData } from "../../data/profileScreenData"; // For role switcher text

interface ProfileFormProps {
  mode: 'register' | 'edit';
  onSuccess: () => void;
  onClose?: () => void;
}

// Time formatting helpers
const formatTime24hr = (date: Date) => date.toTimeString().slice(0, 5);
const displayTime12hr = (time24: string | null) => {
    if (!time24) return null;
    const [h, m] = time24.split(':');
    return new Date(1970, 0, 1, +h, +m).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
};

export default function ProfileForm({ mode, onSuccess, onClose }: ProfileFormProps) {
  const dispatch = useAppDispatch();
  const { theme } = useTheme();
  const { locale } = useLanguage();
  
  // Use translations from both files
  const t = profileFormData[locale as 'en' | 'hi' | 'en-HI'] || profileFormData.en;
  const tProfile = profileScreenData[locale as 'en' | 'hi' | 'en-HI'] || profileScreenData.en;
  
  const { user } = useAppSelector((state) => state.auth);
  const { isLoading: isAuthLoading, isSuccess: isAuthSuccess, isError: isAuthError, message: authMessage } = useAppSelector((state) => state.auth);
  const { isLoading: isBusinessLoading, isSuccess: isBusinessSuccess, isError: isBusinessError, message: businessMessage } = useAppSelector((state) => state.business);
  const isLoading = isAuthLoading || isBusinessLoading;

  const [formData, setFormData] = useState({
    role: (mode === 'edit' && user?.businessProfile) ? 'business' : 'user',
    fullName: mode === 'edit' ? user?.fullName || '' : '',
    email: mode === 'edit' ? user?.email || '' : '',
    mobileNumber: mode === 'edit' ? user?.mobileNumber || '' : '',
    password: '',
    confirmPassword: '',
    bio: mode === 'edit' ? user?.bio || '' : '',
    avatarUrl: mode === 'edit' ? user?.avatarUrl || '' : '',
    businessProfile: {
      name: mode === 'edit' ? user?.businessProfile?.name || '' : '',
      description: mode === 'edit' ? user?.businessProfile?.description || '' : '',
      category: mode === 'edit' ? user?.businessProfile?.category || '' : '',
      businessModel: mode === 'edit' ? user?.businessProfile?.businessModel || 'e-commerce' : 'e-commerce',
      logoUrl: mode === 'edit' ? user?.businessProfile?.logoUrl || '' : '',
      contact: {
        phone: mode === 'edit' ? user?.businessProfile?.contact?.phone || '' : '',
        whatsapp: mode === 'edit' ? user?.businessProfile?.contact?.whatsapp || '' : '',
        email: mode === 'edit' ? user?.businessProfile?.contact?.email || '' : '',
      },
      location: {
        address: mode === 'edit' ? user?.businessProfile?.location?.address || '' : '',
        city: mode === 'edit' ? user?.businessProfile?.location?.city || '' : '',
        state: mode === 'edit' ? user?.businessProfile?.location?.state || '' : '',
        pincode: mode === 'edit' ? user?.businessProfile?.location?.pincode || '' : '',
      },
      operatingHours: (mode === 'edit' && user?.businessProfile?.operatingHours?.length) ? user.businessProfile.operatingHours : [
        { day: "Monday", isOpen: true, openTime: "09:00", closeTime: "18:00" },
        { day: "Tuesday", isOpen: true, openTime: "09:00", closeTime: "18:00" },
        { day: "Wednesday", isOpen: true, openTime: "09:00", closeTime: "18:00" },
        { day: "Thursday", isOpen: true, openTime: "09:00", closeTime: "18:00" },
        { day: "Friday", isOpen: true, openTime: "09:00", closeTime: "18:00" },
        { day: "Saturday", isOpen: false, openTime: "09:00", closeTime: "18:00" },
        { day: "Sunday", isOpen: false, openTime: "09:00", closeTime: "18:00" },
      ],
    },
  });

  const [showPicker, setShowPicker] = useState<{ index: number; type: 'open' | 'close' } | null>(null);

  useEffect(() => {
    const handleAsyncState = async () => {
      const isSuccess = isAuthSuccess || isBusinessSuccess;
      const isError = isAuthError || isBusinessError;
      const message = authMessage || businessMessage;

      if (isError) Alert.alert("Error", String(message));
      
      if (isSuccess) {
        const successMessage = mode === 'register' ? 'Account created successfully!' : 'Profile updated successfully!';
        Alert.alert("Success", successMessage);
        await dispatch(getMe());
        onSuccess();
      }
      
      if(isError || isSuccess) {
        dispatch(resetAuth());
        dispatch(resetBusiness());
      }
    };
    handleAsyncState();
  }, [isAuthSuccess, isBusinessSuccess, isAuthError, isBusinessError]);

  const handleSave = async () => {
    // --- Registration Logic ---
    if (mode === 'register') {
      if (!formData.fullName || !formData.mobileNumber || !formData.email || !formData.password) {
        return Alert.alert('Validation Error', 'Please fill all required fields.');
      }
      if (formData.password !== formData.confirmPassword) {
        return Alert.alert('Validation Error', 'Passwords do not match.');
      }
      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        mobileNumber: formData.mobileNumber.trim(),
        password: formData.password,
        role: formData.role,
        avatarUrl: formData.avatarUrl,
      };
      dispatch(registerUser(payload));
      return;
    }
    
    // --- Edit Logic ---
    try {
      const userPayload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        bio: formData.bio.trim(),
        avatarUrl: formData.avatarUrl,
      };
      await dispatch(updateUser(userPayload)).unwrap();

      if (formData.role === 'business') {
        const businessPayload = {
            ...formData.businessProfile,
            logoUrl: formData.businessProfile.logoUrl, // Ensure logo is passed
            operatingHours: formData.businessProfile.operatingHours.map(d => ({...d, openTime: d.isOpen ? d.openTime : null, closeTime: d.isOpen ? d.closeTime : null}))
        };

        if (user?.businessProfile?._id) {
          await dispatch(updateBusiness(businessPayload)).unwrap();
        } else {
          await dispatch(createBusiness(businessPayload)).unwrap();
        }
      }
    } catch (error) {
      console.error("Failed to save profile:", error);
    }
  };
  
  // --- Form State Handlers ---
  const handleInputChange = (field: keyof typeof formData, value: string) => setFormData(p => ({ ...p, [field]: value }));
  const handleBusinessInputChange = (field: keyof typeof formData.businessProfile, value: any) => setFormData(p => ({ ...p, businessProfile: { ...p.businessProfile, [field]: value } }));
  const handleNestedBusinessChange = (section: 'contact' | 'location', key: string, value: string) => {
      setFormData(p => ({
          ...p,
          businessProfile: { ...p.businessProfile, [section]: { ...p.businessProfile[section], [key]: value } },
      }));
  };
  const toggleDayOpen = (dayIndex: number) => {
      const updatedHours = [...formData.businessProfile.operatingHours];
      updatedHours[dayIndex].isOpen = !updatedHours[dayIndex].isOpen;
      handleBusinessInputChange("operatingHours", updatedHours);
  };
  const handleTimeChange = (event: any, selectedDate?: Date) => {
      const pickerInfo = showPicker;
      setShowPicker(null);
      if (selectedDate && pickerInfo) {
          const { index, type } = pickerInfo;
          const formattedTime = formatTime24hr(selectedDate);
          const updatedHours = [...formData.businessProfile.operatingHours];
          updatedHours[index][type === 'open' ? 'openTime' : 'closeTime'] = formattedTime;
          handleBusinessInputChange("operatingHours", updatedHours);
      }
  };

  return (
    <SafeAreaView style={[tw`flex-1`, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={tw`p-6 pb-20`} keyboardShouldPersistTaps="handled">
        {onClose && (
          <TouchableOpacity onPress={onClose} style={tw`mb-4 -ml-2 self-start`}>
            <ArrowLeft size={28} color={theme.colors.text} />
          </TouchableOpacity>
        )}
        <Text style={[tw`text-3xl font-bold`, { color: theme.colors.text }]}>{mode === 'register' ? t.register.title : t.edit.title}</Text>
        <Text style={[tw`text-base mt-2 mb-8`, { color: theme.colors.textSecondary }]}>{mode === 'register' ? t.register.subtitle : t.edit.subtitle}</Text>
        
        <View style={[tw`flex-row rounded-lg p-1 my-4`, { backgroundColor: theme.colors.card }]}>
          <TouchableOpacity onPress={() => handleInputChange('role', 'user')} style={[tw`flex-1 p-3 rounded-lg items-center`, { backgroundColor: formData.role === 'user' ? theme.colors.primary : 'transparent' }]}>
            <Text style={{ color: formData.role === 'user' ? 'white' : theme.colors.text }}>{tProfile.common.switchToUser}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleInputChange('role', 'business')} style={[tw`flex-1 p-3 rounded-lg items-center`, { backgroundColor: formData.role === 'business' ? theme.colors.primary : 'transparent' }]}>
            <Text style={{ color: formData.role === 'business' ? 'white' : theme.colors.text }}>{tProfile.common.switchToBusiness}</Text>
          </TouchableOpacity>
        </View>

        <UploadFile
          avatarUrl={formData.role === 'user' ? formData.avatarUrl : formData.businessProfile.logoUrl}
          onUploadComplete={({ url }) => formData.role === 'user' ? handleInputChange('avatarUrl', url) : handleBusinessInputChange('logoUrl', url)}
        />
        
        <CustomInput label={t.labels.fullName} icon={User} value={formData.fullName} onChangeText={(v) => handleInputChange("fullName", v)} />
        <CustomInput label={t.labels.mobileNumber} icon={Phone} value={formData.mobileNumber} editable={mode === 'register'} onChangeText={(v) => handleInputChange("mobileNumber", v)} keyboardType="phone-pad" />
        <CustomInput label={t.labels.email} icon={Mail} value={formData.email} onChangeText={(v) => handleInputChange("email", v)} keyboardType="email-address" autoCapitalize="none" />
        
        {mode === 'register' && (
          <>
            <CustomInput label={t.labels.password} icon={KeyRound} value={formData.password} onChangeText={(v) => handleInputChange("password", v)} secureTextEntry />
            <CustomInput label={t.labels.confirmPassword} icon={KeyRound} value={formData.confirmPassword} onChangeText={(v) => handleInputChange("confirmPassword", v)} secureTextEntry />
          </>
        )}

        {formData.role === 'user' ? (
          <CustomInput label={t.labels.bio} icon={Info} value={formData.bio} onChangeText={(v) => handleInputChange("bio", v)} multiline numberOfLines={4} style={{ height: 100, textAlignVertical: 'top' }} />
        ) : (
          <>
            <CustomInput label={t.labels.businessName} icon={Building} value={formData.businessProfile.name} onChangeText={(v) => handleBusinessInputChange("name", v)} />
            <CustomInput label={t.labels.description} icon={Info} value={formData.businessProfile.description} onChangeText={(v) => handleBusinessInputChange("description", v)} multiline numberOfLines={4} style={{ height: 120, textAlignVertical: 'top' }} />
            <SearchableDropdown label={t.labels.category} data={businessTypes} selectedValue={formData.businessProfile.category} onSelect={(item) => handleBusinessInputChange("category", item.value)} />
            <SearchableDropdown label={t.labels.businessModel} data={[{ label: "E-commerce", value: "e-commerce" }, { label: "Booking", value: "booking" }, { label: "Subscription", value: "subscription" }]} selectedValue={formData.businessProfile.businessModel} onSelect={(item) => handleBusinessInputChange("businessModel", item.value)} />
            <CustomInput label={t.labels.phone} icon={Phone} value={formData.businessProfile.contact.phone} onChangeText={(v) => handleNestedBusinessChange('contact', 'phone', v)} keyboardType="phone-pad" />
            <CustomInput label={t.labels.whatsapp} icon={Phone} value={formData.businessProfile.contact.whatsapp} onChangeText={(v) => handleNestedBusinessChange('contact', 'whatsapp', v)} keyboardType="phone-pad" />
            <CustomInput label={t.labels.emailBusiness} icon={Mail} value={formData.businessProfile.contact.email} onChangeText={(v) => handleNestedBusinessChange('contact', 'email', v)} autoCapitalize="none" />
            <CustomInput label={t.labels.address} icon={MapPin} value={formData.businessProfile.location.address} onChangeText={(v) => handleNestedBusinessChange('location', 'address', v)} />
            <CustomInput label={t.labels.city} icon={MapPin} value={formData.businessProfile.location.city} onChangeText={(v) => handleNestedBusinessChange('location', 'city', v)} />
            <CustomInput label={t.labels.state} icon={MapPin} value={formData.businessProfile.location.state} onChangeText={(v) => handleNestedBusinessChange('location', 'state', v)} />
            <CustomInput label={t.labels.pincode} icon={MapPin} value={formData.businessProfile.location.pincode} onChangeText={(v) => handleNestedBusinessChange('location', 'pincode', v)} keyboardType="number-pad" />
            
            <View style={tw`mt-6`}>
              <Text style={[tw`text-lg font-bold mb-2`, { color: theme.colors.text }]}>{tProfile.business.operatingHoursTitle}</Text>
              {formData.businessProfile.operatingHours.map((day, index) => (
                <View key={day.day} style={[tw`flex-row items-center justify-between mb-3 p-3 rounded-lg`, { backgroundColor: theme.colors.card }]}>
                  <Text style={[tw`w-24 font-semibold`, { color: theme.colors.text }]}>{day.day}</Text>
                  {day.isOpen ? (
                    <View style={tw`flex-1 flex-row items-center justify-end`}>
                      <TouchableOpacity onPress={() => setShowPicker({ index, type: 'open' })} style={[tw`px-3 py-2 rounded-lg mr-2`, { backgroundColor: theme.colors.border }]}>
                        <Text style={{ color: theme.colors.text }}>{displayTime12hr(day.openTime) || tProfile.business.time.open}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setShowPicker({ index, type: 'close' })} style={[tw`px-3 py-2 rounded-lg`, { backgroundColor: theme.colors.border }]}>
                        <Text style={{ color: theme.colors.text }}>{displayTime12hr(day.closeTime) || tProfile.business.time.close}</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity onPress={() => toggleDayOpen(index)} style={[tw`px-3 py-2 rounded-lg`, { backgroundColor: theme.colors.border }]}>
                      <Text style={{ color: theme.colors.text }}>{tProfile.business.time.closed}</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity onPress={() => toggleDayOpen(index)} style={[tw`ml-3 px-2 py-2 rounded-lg`, { backgroundColor: day.isOpen ? theme.colors.destructive : theme.colors.primary }]}>
                     <Text style={{color: 'white'}}>{day.isOpen ? 'Set Closed' : 'Set Open'}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </>
        )}
        
        <TouchableOpacity onPress={handleSave} disabled={isLoading} style={[tw`mt-6 h-14 rounded-xl items-center justify-center`, { backgroundColor: theme.colors.primary }]}>
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={tw`text-white text-lg font-bold`}>{mode === 'register' ? t.register.button : t.edit.button}</Text>}
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            value={new Date(`1970-01-01T${showPicker.type === 'open' ? formData.businessProfile.operatingHours[showPicker.index].openTime : formData.businessProfile.operatingHours[showPicker.index].closeTime || '00:00'}`)}
            mode="time"
            is24Hour={false}
            display="default"
            onChange={handleTimeChange}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ////////////////// /// // // /