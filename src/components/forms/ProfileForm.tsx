import React, { useEffect, useState, useMemo } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Platform, Modal, Pressable } from "react-native";
import tw from "twrnc";
import { User, Mail, Phone, Building, Info, MapPin, KeyRound, Pencil } from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";

// Contexts & Store
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { registerUser, updateUser, getMe } from "../../store/authSlice";
import { createBusiness, updateBusiness, fetchMyBusiness } from "../../store/businessSlice";
import { useRole } from "../../context/RoleContext";

// Types
import { BusinessProfile, UpdateUserData, RegisterUserData } from "../../store/types";

// Components & Data
import { profileFormData } from "../../data/profileFormData";
import { profileScreenData } from "../../data/profileScreenData";
import { CustomInput, SearchableDropdown } from "./FormUI";
import { UploadFile } from "../upload/uploader";
import { businessTypesData } from "../../data/businessTypesData";
import LocationPickerModal from './LocationPickerModal';
import { useTabBar } from "@/src/context/TabBarContext";

type Locale = "en" | "hi" | "en-HI";

// Helper Functions
const formatTime = (date: Date) => date.toTimeString().slice(0, 5);
const displayTime12hr = (time24: string | null) => {
  if (!time24) return "Set Time";
  const [h, m] = time24.split(':');
  return new Date(1970, 0, 1, +h, +m).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
};
const defaultOperatingHours = Array(7).fill(null).map((_, i) => ({
  day: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][i] as string,
  isOpen: true, openTime: "09:00", closeTime: "18:00"
}));
const defaultLocation = { address: "", city: "", state: "", pincode: "", landmark: "", latitude: null, longitude: null };

interface ProfileFormProps {
  mode: "edit" | "register";
  onSuccess: () => void;
  onClose?: () => void;
}

type FormDataType = {
  role: 'user' | 'business';
  fullName: string;
  email: string;
  mobileNumber: string;
  bio: string;
  avatarUrl: string;
  password?: string;
  confirmPassword?: string;
  address: typeof defaultLocation;
  businessProfile: BusinessProfile;
};

export default function ProfileForm({ onClose, onSuccess, mode }: ProfileFormProps) {
  const { theme } = useTheme();
  const { locale } = useLanguage();
  const router = useRouter();
  const t = profileFormData[locale as Locale] || profileFormData.en;
  const tCommon = profileScreenData[locale as Locale] || profileScreenData.en;
  const tBT = businessTypesData[locale as Locale] || businessTypesData.en;

  let setTabBarVisible = (_visible: boolean) => { };
  try {
    const tabBarContext = useTabBar();
    setTabBarVisible = tabBarContext.setTabBarVisible;
  } catch (e) {
    // TabBarProvider is not available in register screen
  }

  const dispatch = useAppDispatch();
  const { role, changeRole } = useRole();
  const { user, business } = useAppSelector(s => ({ user: s.auth.user, business: s.business.business }));

  // States
  const [formData, setFormData] = useState<FormDataType>({
    role: "user",
    fullName: "", email: "", mobileNumber: "", bio: "", avatarUrl: "", password: "", confirmPassword: "",
    address: defaultLocation,
    businessProfile: {
      name: "", description: "", category: "", businessModel: "e-commerce", logoUrl: "",
      contact: { phone: "", whatsapp: "", email: "" },
      location: defaultLocation,
      operatingHours: defaultOperatingHours,
    } as BusinessProfile,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isMapModalVisible, setMapModalVisible] = useState(false);
  const [showPicker, setShowPicker] = useState<{ index: number; type: "open" | "close" } | null>(null);
  const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);
  const [fieldToUpdate, setFieldToUpdate] = useState<'email' | 'mobile' | null>(null);
  const [newValue, setNewValue] = useState('');
  const [confirmNewValue, setConfirmNewValue] = useState('');

  // Effects
  useEffect(() => {
    if (mode === 'edit') {
      setTabBarVisible(false);
      return () => setTabBarVisible(true);
    }
  }, [mode, setTabBarVisible]);

  useEffect(() => {
    if (mode === 'edit' && user) {
      const initialUser = user;
      const businessDataToLoad = business || initialUser?.businessProfile;
      setFormData(prev => ({
        ...prev, role: role as 'user' | 'business', fullName: initialUser?.fullName || '', email: initialUser?.email || '', mobileNumber: initialUser?.mobileNumber || '', bio: initialUser?.bio || '', avatarUrl: initialUser?.avatarUrl || '', address: initialUser?.address || defaultLocation,
        businessProfile: {
          ...(businessDataToLoad || {} as BusinessProfile),
          name: businessDataToLoad?.name || '', description: businessDataToLoad?.description || '', category: businessDataToLoad?.category || '', businessModel: businessDataToLoad?.businessModel || 'e-commerce', logoUrl: businessDataToLoad?.logoUrl || '', contact: businessDataToLoad?.contact || { phone: '', whatsapp: '', email: '' }, location: businessDataToLoad?.location || defaultLocation,
          operatingHours: businessDataToLoad?.operatingHours && businessDataToLoad.operatingHours.length > 0 ? businessDataToLoad.operatingHours : defaultOperatingHours,
        }
      }));
    }
  }, [user, business, role, mode]);

  // Handlers
  const handleInputChange = (path: string, value: any) => {
    setFormData(prev => {
      const keys = path.split('.');
      const newState = JSON.parse(JSON.stringify(prev)); let current: any = newState;
      for (let i = 0; i < keys.length - 1; i++) { current = current[keys[i]] = current[keys[i]] || {}; }
      current[keys[keys.length - 1]] = value; return newState;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    if (mode === 'register') {
      try {
        if (!formData.fullName || !formData.email || !formData.password) { throw new Error("Full Name, Email, and Password are required."); }
        if (formData.password !== formData.confirmPassword) { throw new Error("Passwords do not match."); }
        const registrationData: RegisterUserData = { fullName: formData.fullName, email: formData.email, mobileNumber: formData.mobileNumber, password: formData.password, role: 'user' };
        await dispatch(registerUser(registrationData)).unwrap();
        Alert.alert('Success', 'Registration successful!'); onSuccess();
      } catch (err: any) {
        const errorMessage = err.message || 'Something went wrong during registration.'; Alert.alert('Registration Error', errorMessage);
      } finally { setIsSaving(false); }
      return;
    }
    if (mode === 'edit') {
      try {
        if (formData.role === 'business') {
          if (!formData.businessProfile.name || !formData.businessProfile.category) { throw new Error('Business name and category are required.'); }
          if (formData.businessProfile?._id) { await dispatch(updateBusiness(formData.businessProfile)).unwrap(); } else { await dispatch(createBusiness(formData.businessProfile)).unwrap(); }
        }
        const userDataToUpdate: UpdateUserData = { fullName: formData.fullName, email: formData.email, bio: formData.bio, address: formData.address, avatarUrl: formData.avatarUrl, role: formData.role };
        await dispatch(updateUser(userDataToUpdate)).unwrap();
        await dispatch(getMe());
        if (formData.role === 'business') { await dispatch(fetchMyBusiness()); }
        Alert.alert('Success', 'Profile saved successfully!'); onSuccess();
      } catch (err: any) {
        const errorMessage = err.message || 'Something went wrong while saving.'; Alert.alert('Error', errorMessage);
      } finally { setIsSaving(false); }
    }
  };

  const handleEditField = (field: 'email' | 'mobile') => {
    setFieldToUpdate(field); setNewValue(''); setConfirmNewValue(''); setUpdateModalVisible(true);
  };

  const handleConfirmUpdate = () => {
    if (!newValue || !confirmNewValue) { Alert.alert("Error", "Please fill both fields."); return; }
    if (newValue !== confirmNewValue) { Alert.alert("Error", "The values do not match. Please try again."); return; }
    if (fieldToUpdate === 'email') { handleInputChange('email', newValue); } else if (fieldToUpdate === 'mobile') { handleInputChange('mobileNumber', newValue); }
    setUpdateModalVisible(false); setFieldToUpdate(null);
  };

  const handleRoleChange = (newRole: 'user' | 'business') => { handleInputChange('role', newRole); changeRole(newRole); };
  const handleLocationConfirm = (locationDetails: any) => { const path = formData.role === 'business' ? 'businessProfile.location' : 'address'; handleInputChange(path, locationDetails); setMapModalVisible(false); };
  const toggleDayOpen = (dayIndex: number) => { const updatedHours = (formData.businessProfile.operatingHours || []).map((day, index) => { if (index === dayIndex) { const newIsOpen = !day.isOpen; return { ...day, isOpen: newIsOpen, openTime: newIsOpen ? day.openTime || "09:00" : null, closeTime: newIsOpen ? day.closeTime || "18:00" : null }; } return day; }); handleInputChange("businessProfile.operatingHours", updatedHours); };
  const handleTimeChange = (event: any, selectedDate?: Date) => { const pickerInfo = showPicker; setShowPicker(null); if (event.type === 'set' && selectedDate && pickerInfo) { const { index, type } = pickerInfo; const updatedHours = (formData.businessProfile.operatingHours || []).map((day, i) => { if (i === index) { return { ...day, [type === 'open' ? 'openTime' : 'closeTime']: formatTime(selectedDate) }; } return day; }); handleInputChange("businessProfile.operatingHours", updatedHours); } };
  const handleCategoryChange = (selection: { value: string; modelType?: string }) => { const categoryValue = selection.value; const modelType = categoryToModelMap[categoryValue]; setFormData(prev => ({ ...prev, businessProfile: { ...prev.businessProfile, category: categoryValue, businessModel: modelType || prev.businessProfile.businessModel } })); };

  const dataForSections = useMemo(() => [{ title: "🛒 Retail & eCommerce", data: tBT.eCommerce }, { title: "📅 Booking Based Services", data: tBT.booking }, { title: "🔄 Subscription Based", data: tBT.subscription }, { title: "📦 Wholesale", data: tBT.wholesale }, { title: "🏭 Manufacturing", data: tBT.manufacturing }, { title: "💼 Services", data: tBT.services }, { title: "🌐 Online", data: tBT.online }, { title: "🚜 Agriculture & Farming", data: tBT.agriculture },], [tBT]);
  const categoryToModelMap = useMemo(() => { const map: { [key: string]: string } = {}; Object.values(tBT).forEach((categoryArray: any) => { if (Array.isArray(categoryArray)) { categoryArray.forEach(item => { if (item.value && item.modelType) { map[item.value] = item.modelType; } }); } }); return map; }, [tBT]);
  const locationData = (formData.role === 'business' ? formData.businessProfile.location : formData.address) || defaultLocation;
  const locationPath = formData.role === 'business' ? 'businessProfile.location' : 'address';

  // JSX Return
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={tw`p-4 pb-20`} keyboardShouldPersistTaps="handled">
        <LocationPickerModal visible={isMapModalVisible} onClose={() => setMapModalVisible(false)} onLocationSelect={handleLocationConfirm} />

        {mode === "edit" && (
          <View style={tw`mb-6`}>
            <Text style={[tw`text-lg font-bold mb-2`, { color: theme.colors.text }]}>Profile Type</Text>
            <View style={[tw`flex-row rounded-xl p-1`, { backgroundColor: theme.colors.card }]}>
              {(['user', 'business'] as const).map((r) => (
                <TouchableOpacity key={r} onPress={() => handleRoleChange(r)} style={[tw`flex-1 py-2.5 rounded-lg items-center`, formData.role === r && [tw`shadow-md`, { backgroundColor: theme.colors.background }]]}>
                  <Text style={[tw`font-semibold capitalize`, { color: formData.role === r ? theme.colors.primary : theme.colors.textSecondary }]}>{r}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <UploadFile
          avatarUrl={formData.role === 'user' ? formData.avatarUrl : formData.businessProfile.logoUrl}
          onUploadComplete={({ url }) => handleInputChange(formData.role === 'user' ? 'avatarUrl' : 'businessProfile.logoUrl', url)}
        />

        {formData.role === "user" && (
          <>
            <CustomInput label={t.fields.fullName} icon={User} value={formData.fullName} onChangeText={(v) => handleInputChange("fullName", v)} />

            {/* ✅ यहाँ मोबाइल नंबर और ईमेल का लॉजिक ठीक किया गया है */}
            <CustomInput
              label={t.fields.mobileNumber}
              icon={Phone}
              value={formData.mobileNumber}
              // रजिस्ट्रेशन में एडिटेबल, एडिट मोड में डिसेबल
              editable={mode === 'register'}
              onChangeText={(v) => handleInputChange("mobileNumber", v)}
              renderRightIcon={mode === 'edit' ? () => (
                <TouchableOpacity onPress={() => handleEditField('mobile')}>
                  <Pencil size={20} color={theme.colors.primary} />
                </TouchableOpacity>
              ) : undefined}
            />
            <CustomInput
              label={t.fields.email}
              icon={Mail}
              value={formData.email}
              // रजिस्ट्रेशन में एडिटेबल, एडिट मोड में डिसेबल
              editable={mode === 'register'}
              onChangeText={(v) => handleInputChange("email", v)}
              renderRightIcon={mode === 'edit' ? () => (
                <TouchableOpacity onPress={() => handleEditField('email')}>
                  <Pencil size={20} color={theme.colors.primary} />
                </TouchableOpacity>
              ) : undefined}
            />
          </>
        )}

        {mode === "register" && (
          <>
            <CustomInput label={t.fields.password} icon={KeyRound} value={formData.password || ''} onChangeText={(v) => handleInputChange("password", v)} isPassword />
            <CustomInput label={t.fields.confirmPassword} icon={KeyRound} value={formData.confirmPassword || ''} onChangeText={(v) => handleInputChange("confirmPassword", v)} isPassword />
          </>
        )}

        {formData.role === "user" && <CustomInput label={t.fields.bio} icon={Info} value={formData.bio} onChangeText={(v) => handleInputChange("bio", v)} multiline />}

        {/* --- Business Fields (Completed) --- */}
        {formData.role === "business" && (
          <>
            <CustomInput label={t.fields.businessName} icon={Building} value={formData.businessProfile.name} onChangeText={(v) => handleInputChange("businessProfile.name", v)} />
            <CustomInput label={t.fields.description} icon={Info} value={formData.businessProfile.description} onChangeText={(v) => handleInputChange("businessProfile.description", v)} multiline />
            <SearchableDropdown label={t.fields.category} subType={true} data={dataForSections} selectedValue={formData.businessProfile.category} onSelect={(selection) => { if (!Array.isArray(selection)) { handleCategoryChange(selection); } }} />
            <CustomInput label={t.fields.phone} icon={Phone} value={formData.businessProfile.contact?.phone || ''} onChangeText={(v) => handleInputChange("businessProfile.contact.phone", v)} keyboardType="phone-pad" />
            <CustomInput label={t.fields.whatsapp} icon={Phone} value={formData.businessProfile.contact?.whatsapp || ''} onChangeText={(v) => handleInputChange("businessProfile.contact.whatsapp", v)} keyboardType="phone-pad" />
            <CustomInput label={t.fields.email} icon={Mail} value={formData.businessProfile.contact?.email || ''} onChangeText={(v) => handleInputChange("businessProfile.contact.email", v)} keyboardType="email-address" />
          </>
        )}

        {/* --- Location Fields (Completed) --- */}
        <View>
          <TouchableOpacity onPress={() => setMapModalVisible(true)} style={[tw`flex-row items-center justify-center p-4 rounded-xl my-4`, { backgroundColor: theme.colors.primary as string }]}>
            <MapPin color="white" size={20} style={tw`mr-2`} />
            <Text style={tw`text-white font-bold text-base`}>Select Location on Map</Text>
          </TouchableOpacity>
          <CustomInput label={t.fields.address} icon={MapPin} value={locationData.address} onChangeText={(v) => handleInputChange(`${locationPath}.address`, v)} />
          <CustomInput label={t.fields.landmark} icon={MapPin} value={locationData.landmark} onChangeText={(v) => handleInputChange(`${locationPath}.landmark`, v)} />
          <CustomInput label={t.fields.city} icon={MapPin} value={locationData.city} onChangeText={(v) => handleInputChange(`${locationPath}.city`, v)} />
          <CustomInput label={t.fields.state} icon={MapPin} value={locationData.state} onChangeText={(v) => handleInputChange(`${locationPath}.state`, v)} />
          <CustomInput label={t.fields.pincode} icon={MapPin} value={locationData.pincode} onChangeText={(v) => handleInputChange(`${locationPath}.pincode`, v)} keyboardType="number-pad" />
        </View>

        {/* --- Operating Hours Fields (Completed) --- */}
        {formData.role === "business" && (
          <View style={tw`mt-6`}>
            <Text style={[tw`text-lg font-bold mb-2`, { color: theme.colors.text as string }]}>{tCommon.business.operatingHoursTitle}</Text>
            {(formData.businessProfile.operatingHours || []).map((day, index) => (
              <View key={index} style={[tw`flex-row items-center justify-between mb-3 p-3 rounded-lg`, { backgroundColor: theme.colors.card as string }]}>
                <Text style={[tw`w-24 font-semibold`, { color: theme.colors.text as string }]}>{day.day}</Text>
                {day.isOpen ? (
                  <View style={tw`flex-row items-center`}>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => setShowPicker({ index, type: "open" })} style={[tw`px-3 py-2 rounded-lg mr-2`, { backgroundColor: theme.colors.border as string }]}>
                      <Text style={{ color: theme.colors.text as string }}>{displayTime12hr(day.openTime)}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => setShowPicker({ index, type: "close" })} style={[tw`px-3 py-2 rounded-lg`, { backgroundColor: theme.colors.border as string }]}>
                      <Text style={{ color: theme.colors.text as string }}>{displayTime12hr(day.closeTime)}</Text>
                    </TouchableOpacity>
                  </View>
                ) : <Text style={{ color: theme.colors.textSecondary as string }}>Closed</Text>}
                <TouchableOpacity activeOpacity={0.8} onPress={() => toggleDayOpen(index)} style={[tw`ml-3 px-2 py-2 rounded-lg`, { backgroundColor: day.isOpen ? theme.colors.destructive as string : theme.colors.primary as string }]}>
                  <Text style={{ color: "white" }}>{day.isOpen ? "Set Closed" : "Set Open"}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity onPress={handleSave} disabled={isSaving} style={[tw`mt-6 h-14 rounded-xl items-center justify-center`, { backgroundColor: theme.colors.primary as string, opacity: isSaving ? 0.7 : 1.0 }]}>
          {isSaving ? <ActivityIndicator color="#fff" /> : <Text style={tw`text-white text-md font-bold`}>{mode === "register" ? t.register.button : t.common.saveChanges}</Text>}
        </TouchableOpacity>

        {mode === "register" &&
          <TouchableOpacity onPress={() => router.replace('/(auth)/login')} style={tw`mt-10 w-full flex-row items-center justify-center`}>
            <Text style={[tw`text-base font-bold`, { color: theme.colors.primary }]}>Already have an account? Log In</Text>
          </TouchableOpacity>
        }

        {showPicker && Platform.OS !== "web" && (() => { const timeString = showPicker.type === 'open' ? formData.businessProfile.operatingHours?.[showPicker.index]?.openTime : formData.businessProfile.operatingHours?.[showPicker.index]?.closeTime; const initialDate = new Date(`1970-01-01T${timeString || '09:00'}`); return (<DateTimePicker value={initialDate} mode="time" is24Hour={false} display="default" onChange={handleTimeChange} />); })()}
      </ScrollView>

      <Modal transparent={true} visible={isUpdateModalVisible} animationType="fade" onRequestClose={() => setUpdateModalVisible(false)}>
        <Pressable style={tw`flex-1 justify-center items-center bg-black bg-opacity-60`} onPress={() => setUpdateModalVisible(false)}>
          <Pressable style={[tw`w-11/12 p-6 rounded-2xl`, { backgroundColor: theme.colors.card }]} onPress={() => { }}>
            <Text style={[tw`text-xl font-bold mb-4`, { color: theme.colors.text }]}>Update {fieldToUpdate === 'email' ? 'Email' : 'Mobile Number'}</Text>
            <CustomInput label={`New ${fieldToUpdate === 'email' ? 'Email' : 'Mobile Number'}`} icon={fieldToUpdate === 'email' ? Mail : Phone} value={newValue} onChangeText={setNewValue} keyboardType={fieldToUpdate === 'email' ? 'email-address' : 'phone-pad'} />
            <CustomInput label={`Confirm New ${fieldToUpdate === 'email' ? 'Email' : 'Mobile Number'}`} icon={fieldToUpdate === 'email' ? Mail : Phone} value={confirmNewValue} onChangeText={setConfirmNewValue} keyboardType={fieldToUpdate === 'email' ? 'email-address' : 'phone-pad'} />
            <TouchableOpacity onPress={handleConfirmUpdate} style={[tw`mt-4 h-12 rounded-xl items-center justify-center`, { backgroundColor: theme.colors.primary }]}>
              <Text style={tw`text-white text-base font-bold`}>Confirm Change</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}