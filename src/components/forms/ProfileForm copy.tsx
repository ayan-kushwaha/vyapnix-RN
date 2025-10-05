import React, { useContext, useEffect, useState, useMemo } from "react";
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Platform } from "react-native";
import tw from "twrnc";
import { ArrowLeft, User, Mail, Phone, Building, Info, MapPin, KeyRound } from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

// Contexts & Store
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { registerUser, updateUser, getMe } from "../../store/authSlice";
import { createBusiness, updateBusiness, fetchMyBusiness } from "../../store/businessSlice";
import { RoleContext } from "../../context/RoleContext";

// Types
import { BusinessProfile, RegisterUserData, UpdateUserData } from "../../store/types";

// Components & Data
import { profileFormData } from "../../data/profileFormData";
import { profileScreenData } from "../../data/profileScreenData";
import { CustomInput, SearchableDropdown } from "./FormUI";
import { UploadFile } from "../upload/uploader";
import { businessTypesData } from "../../data/businessTypesData";
import LocationPickerModal from './LocationPickerModal';
import { useTabBar } from "@/src/context/TabBarContext";

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
const defaultLocation = { address: "", city: "", state: "", pincode: "", landmark: "", latitude: null, longitude: null };

interface ProfileFormProps {
  mode: "edit" | "register";
  onSuccess: () => void;
  onClose?: () => void;
}

export default function ProfileForm({ onClose, onSuccess, mode }: ProfileFormProps) {
  const { theme } = useTheme();
  const { locale } = useLanguage();
  const t = profileFormData[locale as Locale] || profileFormData.en;
  const tCommon = profileScreenData[locale as Locale] || profileScreenData.en;
  const tBT = businessTypesData[locale as Locale] || businessTypesData.en;
  const { setTabBarVisible } = useTabBar();

  const dispatch = useAppDispatch();
  const { changeRole } = useContext(RoleContext);
  const { user } = useAppSelector((s) => s.auth);
  const { business } = useAppSelector((s) => s.business);
  useEffect(() => {
    setTabBarVisible(false); // page open → hide tab
    return () => setTabBarVisible(true); // page exit → show tab again
  }, []);
  const [showPicker, setShowPicker] = useState<{ index: number; type: "open" | "close" } | null>(null);
  const [isMapModalVisible, setMapModalVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
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

  useEffect(() => {
    const initialUser = user;
    if (initialUser) {
      const businessDataToLoad = business || initialUser.businessProfile;
      setFormData({
        role: businessDataToLoad?._id ? 'business' : 'user',
        fullName: initialUser.fullName || '',
        email: initialUser.email || '',
        mobileNumber: initialUser.mobileNumber || '',
        bio: initialUser.bio || '',
        avatarUrl: initialUser.avatarUrl || '',
        password: '',
        confirmPassword: '',
        address: initialUser.address || defaultLocation,
        businessProfile: {
          ...(businessDataToLoad || {} as BusinessProfile),
          name: businessDataToLoad?.name || '',
          description: businessDataToLoad?.description || '',
          category: businessDataToLoad?.category || '',
          businessModel: businessDataToLoad?.businessModel || 'e-commerce',
          logoUrl: businessDataToLoad?.logoUrl || '',
          contact: businessDataToLoad?.contact || { phone: "", whatsapp: "", email: "" },
          location: businessDataToLoad?.location || defaultLocation,
          operatingHours: businessDataToLoad?.operatingHours?.length ? businessDataToLoad.operatingHours : defaultOperatingHours,
        }
      });
    }

    if (mode === 'edit' && initialUser && !initialUser.businessProfile && !business) {
      dispatch(fetchMyBusiness());
    }
  }, []);

  const handleInputChange = (path: string, value: any) => {
    setFormData(prev => {
      const keys = path.split('.');
      const newState = { ...prev };
      let current: any = newState;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]] = { ...(current[keys[i]] || {}) };
      }
      current[keys[keys.length - 1]] = value;
      return newState;
    });
  };

  const dataForSections = useMemo(() => [
    { title: "🛒 Retail & eCommerce", data: tBT.eCommerce },
    { title: "📅 Booking Based Services", data: tBT.booking },
    { title: "🔄 Subscription Based", data: tBT.subscription },
    { title: "📦 Wholesale", data: tBT.wholesale },
    { title: "🏭 Manufacturing", data: tBT.manufacturing },
    { title: "💼 Services", data: tBT.services },
    { title: "🌐 Online", data: tBT.online },
    { title: "🚜 Agriculture & Farming", data: tBT.agriculture },
  ], [tBT]);

  const categoryToModelMap = useMemo(() => {
    const map: { [key: string]: string } = {};
    Object.values(tBT).forEach((categoryArray: any) => {
      if (Array.isArray(categoryArray)) {
        categoryArray.forEach(item => { if (item.value && item.modelType) { map[item.value] = item.modelType; } });
      }
    });
    return map;
  }, [tBT]);

  const handleCategoryChange = (selection: { value: string; modelType?: string }) => {
    const categoryValue = selection.value;
    const modelType = categoryToModelMap[categoryValue];
    setFormData(prev => ({
      ...prev,
      businessProfile: { ...prev.businessProfile, category: categoryValue, businessModel: modelType || prev.businessProfile.businessModel }
    }));
  };

  const handleRoleChange = (newRole: 'user' | 'business') => {
    handleInputChange("role", newRole);
    changeRole(newRole);
  };

  const toggleDayOpen = (dayIndex: number) => {
    const updatedHours = (formData.businessProfile.operatingHours || []).map((day, index) => {
      if (index === dayIndex) {
        const newIsOpen = !day.isOpen;
        return { ...day, isOpen: newIsOpen, openTime: newIsOpen ? day.openTime || "09:00" : null, closeTime: newIsOpen ? day.closeTime || "18:00" : null };
      }
      return day;
    });
    handleInputChange("businessProfile.operatingHours", updatedHours);
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    const pickerInfo = showPicker;
    setShowPicker(null);
    if (event.type === 'set' && selectedDate && pickerInfo) {
      const { index, type } = pickerInfo;
      const updatedHours = (formData.businessProfile.operatingHours || []).map((day, i) => {
        if (i === index) { return { ...day, [type === 'open' ? 'openTime' : 'closeTime']: formatTime(selectedDate) }; }
        return day;
      });
      handleInputChange("businessProfile.operatingHours", updatedHours);
    }
  };

  // ✅ FIX: handleSave function ko poora theek kar diya gaya hai
  const handleSave = async () => {
    // Step 1: Basic validation
    if (!formData.fullName.trim() || !formData.email.trim()) {
      return Alert.alert(t.validation.title, "Full name and email are required.");
    }

    // ✅ Step 2: Loader ko hamesha function ke shuru mein ON karein
    setIsSaving(true);
    let wasSuccessful = false;

    try {
      // Step 3: Saara main logic 'try' block ke andar
      if (mode === "register") {
        if (!formData.password) throw new Error(t.validation.passwordRequired);
        if (formData.password !== formData.confirmPassword) throw new Error(t.validation.passwordMismatch);

        const payload: RegisterUserData = {
          fullName: formData.fullName.trim(),
          mobileNumber: formData.mobileNumber.trim(),
          email: formData.email.trim(),
          password: formData.password,
          role: formData.role as "user" | "business",
          avatarUrl: formData.avatarUrl,
          address: formData.role === 'user' ? formData.address : undefined,
        };
        await dispatch(registerUser(payload)).unwrap();

        if (formData.role === 'business') {
          await dispatch(createBusiness(formData.businessProfile)).unwrap();
        }

        Alert.alert(t.validation.success, t.register.successMessage);

      } else { // EDIT MODE
        const userPayload: UpdateUserData = {
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          bio: formData.bio?.trim() || "",
          avatarUrl: formData.avatarUrl || "",
          role: formData.role as "user" | "business",
          address: formData.role === 'user' ? formData.address : undefined,
        };
        await dispatch(updateUser(userPayload)).unwrap();

        if (formData.role === "business") {
          if (!formData.businessProfile.name?.trim()) throw new Error("Business name is required");
          await dispatch(updateBusiness(formData.businessProfile)).unwrap();
        }

        Alert.alert(t.validation.success, t.edit.successMessage);
      }

      // ✅ Step 4: Jab sab kuchh safal ho jaaye, tab naya data fetch karein
      await dispatch(getMe());
      wasSuccessful = true;

      // ✅ Step 5: Sabse aakhir mein (success hone par) form band karein

    } catch (err: any) {
      // ✅ Step 6: Koi bhi error aane par use handle karein
      const msg = err?.message || "An unknown error occurred.";
      Alert.alert("Error", msg);
    } finally {
      // ✅ Step 7 (Sabse Zaroori): Loader ko hamesha OFF karein, chahe success ho ya error
      setIsSaving(false);
      if (wasSuccessful) {
        onSuccess();
      }
    }
  };

  const handleLocationConfirm = (locationDetails: any) => {
    const path = formData.role === 'business' ? 'businessProfile.location' : 'address';
    handleInputChange(path, locationDetails);
    setMapModalVisible(false);
  };

  const locationData = (formData.role === 'business' ? formData.businessProfile.location : formData.address) || defaultLocation;
  const locationPath = formData.role === 'business' ? 'businessProfile.location' : 'address';
  const formContent = mode === "register" ? t.register : t.edit;

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={tw`p-4 pb-20`} keyboardShouldPersistTaps="handled">
        <LocationPickerModal visible={isMapModalVisible} onClose={() => setMapModalVisible(false)} onLocationSelect={handleLocationConfirm} />
        {/* {onClose && <TouchableOpacity onPress={onClose} style={tw`mb-4`}><ArrowLeft size={24} color={theme.colors.text as string} /></TouchableOpacity>} */}
        {/* <Text style={[tw`text-3xl font-bold mt-2`, { color: theme.colors.text }]}>{formContent.title}</Text>
        <Text style={[tw`text-base mt-2 mb-6`, { color: theme.colors.textSecondary }]}>{formContent.subtitle}</Text> */}

        <View style={tw`mb-6`}>
          <Text style={[tw`text-lg font-bold mb-2`, { color: theme.colors.text }]}>Profile Type</Text>
          <View style={[tw`flex-row rounded-xl p-1`, { backgroundColor: theme.colors.card }]}>
            {["user", "business"].map((r) => (
              <TouchableOpacity key={r} onPress={() => handleRoleChange(r as 'user' | 'business')} style={[tw`flex-1 py-2.5 rounded-lg items-center`, formData.role === r && [tw`shadow-md`, { backgroundColor: theme.colors.background }]]}>
                <Text style={[tw`font-semibold capitalize`, { color: formData.role === r ? theme.colors.primary : theme.colors.textSecondary }]}>{r}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <UploadFile
          avatarUrl={formData.role === 'user' ? formData.avatarUrl : formData.businessProfile.logoUrl}
          onUploadComplete={({ url }) => handleInputChange(formData.role === 'user' ? 'avatarUrl' : 'businessProfile.logoUrl', url)}
        />
        {formData.role === "user" && (
          <>
            <CustomInput label={t.fields.fullName} icon={User} value={formData.fullName} onChangeText={(v) => handleInputChange("fullName", v)} />
            <CustomInput label={t.fields.mobileNumber} icon={Phone} value={formData.mobileNumber} editable={false} />
            <CustomInput label={t.fields.email} icon={Mail} value={formData.email} onChangeText={(v) => handleInputChange("email", v)} />
          </>
        )}
        {mode === "register" && (
          <>
            <CustomInput label={t.fields.password} icon={KeyRound} value={formData.password} onChangeText={(v) => handleInputChange("password", v)} isPassword />
            <CustomInput label={t.fields.confirmPassword} icon={KeyRound} value={formData.confirmPassword} onChangeText={(v) => handleInputChange("confirmPassword", v)} isPassword />
          </>
        )}

        {formData.role === "user" && <CustomInput label={t.fields.bio} icon={Info} value={formData.bio} onChangeText={(v) => handleInputChange("bio", v)} multiline />}

        {/* ✅ FIX: Saare Business Fields yahan sahi se hain */}
        {formData.role === "business" && (
          <>
            <CustomInput label={t.fields.businessName} icon={Building} value={formData.businessProfile.name} onChangeText={(v) => handleInputChange("businessProfile.name", v)} />
            <CustomInput label={t.fields.description} icon={Info} value={formData.businessProfile.description} onChangeText={(v) => handleInputChange("businessProfile.description", v)} multiline />
            <SearchableDropdown
              label={t.fields.category}
              subType={true}
              data={dataForSections}
              selectedValue={formData.businessProfile.category}
              onSelect={(selection) => { if (!Array.isArray(selection)) { handleCategoryChange(selection); } }}
            />
            <CustomInput label={t.fields.phone} icon={Phone} value={formData.businessProfile.contact?.phone || ''} onChangeText={(v) => handleInputChange("businessProfile.contact.phone", v)} keyboardType="phone-pad" />
            <CustomInput label={t.fields.whatsapp} icon={Phone} value={formData.businessProfile.contact?.whatsapp || ''} onChangeText={(v) => handleInputChange("businessProfile.contact.whatsapp", v)} keyboardType="phone-pad" />
            <CustomInput label={t.fields.email} icon={Mail} value={formData.businessProfile.contact?.email || ''} onChangeText={(v) => handleInputChange("businessProfile.contact.email", v)} keyboardType="email-address" />
          </>
        )}

        {/* ✅ FIX: Poora Location Section yahan sahi se hai */}
        <View>
          <TouchableOpacity onPress={() => setMapModalVisible(true)} style={[tw`flex-row items-center justify-center p-4 rounded-xl my-4`, { backgroundColor: theme.colors.primary }]}>
            <MapPin color="white" size={20} style={tw`mr-2`} />
            <Text style={tw`text-white font-bold text-base`}>Select Location on Map</Text>
          </TouchableOpacity>
          <CustomInput label={t.fields.address} icon={MapPin} value={locationData.address} onChangeText={(v) => handleInputChange(`${locationPath}.address`, v)} />
          <CustomInput label={t.fields.landmark} icon={MapPin} value={locationData.landmark} onChangeText={(v) => handleInputChange(`${locationPath}.landmark`, v)} />
          <CustomInput label={t.fields.city} icon={MapPin} value={locationData.city} onChangeText={(v) => handleInputChange(`${locationPath}.city`, v)} />
          <CustomInput label={t.fields.state} icon={MapPin} value={locationData.state} onChangeText={(v) => handleInputChange(`${locationPath}.state`, v)} />
          <CustomInput label={t.fields.pincode} icon={MapPin} value={locationData.pincode} onChangeText={(v) => handleInputChange(`${locationPath}.pincode`, v)} keyboardType="number-pad" />
        </View>

        {formData.role === "business" && (
          <View style={tw`mt-6`}>
            <Text style={[tw`text-lg font-bold mb-2`, { color: theme.colors.text as string }]}>{tCommon.business.operatingHoursTitle}</Text>
            {(formData.businessProfile.operatingHours || []).map((day, index) => (
              <View key={index} style={[tw`flex-row items-center justify-between mb-3 p-3 rounded-lg`, { backgroundColor: theme.colors.card as string }]}>
                <Text style={[tw`w-24 font-semibold`, { color: theme.colors.text as string }]}>{day.day}</Text>
                {day.isOpen ? (
                  <View style={tw`flex-row items-center`}>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => setShowPicker({ index, type: "open" })} style={[tw`px-3 py-2 rounded-lg mr-2`, { backgroundColor: theme.colors.border as string }]}>
                      <Text style={{ color: theme.colors.text as string }}>{displayTime12hr(day.openTime) || "Set Time"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => setShowPicker({ index, type: "close" })} style={[tw`px-3 py-2 rounded-lg`, { backgroundColor: theme.colors.border as string }]}>
                      <Text style={{ color: theme.colors.text as string }}>{displayTime12hr(day.closeTime) || "Set Time"}</Text>
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

        {showPicker && Platform.OS !== "web" && (() => {
          const timeString = showPicker.type === 'open'
            ? formData.businessProfile.operatingHours?.[showPicker.index]?.openTime
            : formData.businessProfile.operatingHours?.[showPicker.index]?.closeTime;
          const initialDate = new Date(`1970-01-01T${timeString || '09:00'}`);
          return (<DateTimePicker value={initialDate} mode="time" is24Hour={false} display="default" onChange={handleTimeChange} />);
        })()}
      </ScrollView>
    </View>
  );
}