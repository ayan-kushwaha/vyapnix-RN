// src/components/forms/ProfileForm.tsx
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
  TextInput,
} from "react-native";
import tw from "twrnc";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Building,
  Info,
  MapPin,
  KeyRound,
} from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
// Contexts & Store
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { registerUser, updateUser, getMe } from "../../store/authSlice";
import { createBusiness, updateBusiness, fetchMyBusiness } from "../../store/businessSlice";
import { RoleContext } from "../../context/RoleContext"; // ✨ यह लाइन जोड़ें

// Types
import {
  BusinessProfile,
  RegisterUserData,
  UpdateUserData,
} from "../../store/types";

// Components & Data
import { profileFormData } from "../../data/profileFormData";
import { profileScreenData } from "../../data/profileScreenData";
import { CustomInput, SearchableDropdown } from "./FormUI";
import { UploadFile } from "../upload/uploader";
import { businessTypes } from "../../data/businessTypesData";
import LocationPickerModal from './LocationPickerModal';

type Locale = "en" | "hi" | "en-HI";

/** ---------- Helpers ---------- */
const formatTime = (date: Date) => date.toTimeString().slice(0, 5);

const displayTime12hr = (time24: string | null) => {
  if (!time24) return null;
  const [h, m] = time24.split(":");
  return new Date(1970, 0, 1, +h, +m).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const defaultOperatingHours = Array(7)
  .fill(null)
  .map((_, i) => ({
    day: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][i],
    isOpen: true,
    openTime: "09:00",
    closeTime: "18:00",
  }));

// ✨ FIX 1: Create a default location object that matches your types
const defaultLocation = {
  address: "",
  city: "",
  state: "",
  pincode: "",
  landmark: "",
  latitude: null,
  longitude: null,
};

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

  const dispatch = useAppDispatch();
  const { role, changeRole } = useContext(RoleContext);
  const { user } = useAppSelector((s) => s.auth);
  const { business, isLoading: isBusinessLoading } = useAppSelector((s) => s.business);
  const isLoading = isBusinessLoading;

  const [showPicker, setShowPicker] = useState<{ index: number; type: "open" | "close" } | null>(null);
  const [isMapModalVisible, setMapModalVisible] = useState(false);

  /** ---------- Form State ---------- */
  const [formData, setFormData] = useState({
    role: user?.businessProfile ? "business" : "user",
    fullName: user?.fullName || "",
    email: user?.email || "",
    mobileNumber: user?.mobileNumber || "",
    bio: user?.bio || "",
    avatarUrl: user?.avatarUrl || "",
    password: "",
    confirmPassword: "",
    address: defaultLocation, // ✨ Use the constant here
    businessProfile: {
      name: "",
      description: "",
      category: "",
      businessModel: "e-commerce" as const,
      logoUrl: "",
      contact: { phone: "", whatsapp: "", email: "" },
      location: defaultLocation, // ✨ And also here
      operatingHours: defaultOperatingHours,
    } as BusinessProfile,
  });

  // ✨ FIX 2: Add a fallback to the defaultLocation to prevent 'undefined'
  const locationData = (formData.role === 'business' ? formData.businessProfile.location : formData.address) || defaultLocation;
  const locationPath = formData.role === 'business' ? 'businessProfile.location' : 'address';

  /** ---------- Combined useEffect for Data Loading ---------- */
  useEffect(() => {
    let newFormData = { ...formData };

    if (user) {
      newFormData = {
        ...newFormData,
        role: user.businessProfile ? "business" : (newFormData.role || "user"),
        fullName: user.fullName || "",
        email: user.email || "",
        mobileNumber: user.mobileNumber || "",
        bio: user.bio || "",
        avatarUrl: user.avatarUrl || "",
        address: user.address || defaultLocation, // ✨ Use the fallback here too
      };
    }

    if (business) {
      newFormData = {
        ...newFormData,
        role: "business",
        businessProfile: {
          ...newFormData.businessProfile,
          ...business,
        },
      };
    }
    else if (user?.businessProfile) {
      newFormData = {
        ...newFormData,
        role: "business",
        businessProfile: {
          ...newFormData.businessProfile,
          ...user.businessProfile,
        },
      };
    }

    if (mode === 'edit' && user && !user.businessProfile && !business) {
      dispatch(fetchMyBusiness());
    }

    setFormData(newFormData);

  }, [user, business]);

  /** ---------- Update nested fields safely ---------- */
  const handleInputChange = (path: string, value: any) => {
    setFormData((prev) => {
      const keys = path.split(".");
      const newState: any = JSON.parse(JSON.stringify(prev));
      let current = newState;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newState;
    });

  };
  const handleRoleChange = (newRole: 'user' | 'business') => {
    // 1. लोकल फॉर्म की स्टेट को अपडेट करें
    handleInputChange("role", newRole);
    // 2. ग्लोबल Context को अपडेट करें (यह लोकल स्टोरेज में भी सेव करेगा)
    changeRole(newRole);
  };

  /** ---------- Toggle open/close day ---------- */
  const toggleDayOpen = (index: number) => {
    const updated = (formData.businessProfile.operatingHours || []).map((day, i) => ({
      ...day,
      isOpen: i === index ? !day.isOpen : day.isOpen,
    }));
    handleInputChange("businessProfile.operatingHours", updated);
  };

  /** ---------- Time Picker ---------- */
  const handleTimeChange = (event: any, selectedDate?: Date) => {
    const picker = showPicker;
    setShowPicker(null);
    if (!picker || !selectedDate) return;

    const updated = (formData.businessProfile.operatingHours || []).map((day, i) =>
      i === picker.index ? { ...day, [picker.type === "open" ? "openTime" : "closeTime"]: formatTime(selectedDate) } : day
    );
    handleInputChange("businessProfile.operatingHours", updated);
  };

  /** ---------- Save Logic ---------- */
  const handleSave = async () => {
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.mobileNumber.trim()) {
      return Alert.alert(t.validation.title, t.validation.requiredFields);
    }

    try {
      if (mode === "register") {
        if (!formData.password) return Alert.alert(t.validation.title, t.validation.passwordRequired);
        if (formData.password !== formData.confirmPassword)
          return Alert.alert(t.validation.title, t.validation.passwordMismatch);

        const payload: RegisterUserData = {
          fullName: formData.fullName.trim(),
          mobileNumber: formData.mobileNumber.trim(),
          email: formData.email.trim(),
          password: formData.password,
          role: formData.role as "user" | "business",
          avatarUrl: formData.avatarUrl,
          // ✨ FIX: Send address ONLY if the role is 'user'
          address: formData.role === 'user' ? formData.address : undefined,
        };

        const resultAction = await dispatch(registerUser(payload));

        // After successful registration, if role is business, create business profile
        if (registerUser.fulfilled.match(resultAction) && formData.role === 'business') {
          await dispatch(createBusiness(formData.businessProfile)).unwrap();
        }

        await dispatch(getMe());
        Alert.alert(t.validation.success, t.register.successMessage);
        onSuccess();
        return;
      }

      // EDIT MODE
      const userPayload: UpdateUserData = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        bio: formData.bio?.trim() || "",
        avatarUrl: formData.avatarUrl || "",
        role: formData.role as "user" | "business",
        // ✨ FIX: Send the user's personal address ONLY if the role is 'user'
        address: formData.role === 'user' ? formData.address : undefined,
      };

      await dispatch(updateUser(userPayload)).unwrap();

      if (formData.role === "business") {
        if (!formData.businessProfile.name?.trim()) return Alert.alert("Validation", "Business name is required");

        // When updating, we send the entire business profile, which includes the location
        await dispatch(updateBusiness(formData.businessProfile)).unwrap();
      }

      await dispatch(getMe());
      Alert.alert(t.validation.success, t.edit.successMessage);
      onSuccess();
    } catch (err: any) {
      const msg = err?.message || err?.payload || "Unknown error";
      Alert.alert("Error", msg);
    }
  };

  const handleLocationConfirm = (locationData: any) => {
    if (locationData) {
      if (formData.role === 'business') {
        handleInputChange("businessProfile.location", locationData);
      } else {
        handleInputChange("address", locationData);
      }
    }
    setMapModalVisible(false);
  };

  const formContent = mode === "register" ? t.register : t.edit;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={tw`p-6 pb-20`} keyboardShouldPersistTaps="handled">
        <LocationPickerModal
          visible={isMapModalVisible}
          onClose={() => setMapModalVisible(false)}
          onLocationSelect={handleLocationConfirm}
        />
        {onClose && (
          <TouchableOpacity onPress={onClose} style={tw`mb-4`}>
            <ArrowLeft size={24} color={theme.colors.text as string} />
          </TouchableOpacity>
        )}

        <Text style={[tw`text-3xl font-bold mt-4`, { color: theme.colors.text }]}>{formContent.title}</Text>
        <Text style={[tw`text-base mt-2 mb-8`, { color: theme.colors.textSecondary }]}>{formContent.subtitle}</Text>

        {/* Role Switch */}
        <View style={[tw`flex-row rounded-lg p-1 my-4`, { backgroundColor: theme.colors.card as string }]}>
          {["user", "business"].map((r) => (
            <TouchableOpacity
              key={r}
              onPress={() => handleRoleChange(r as 'user' | 'business')} // <-- नई लाइन
              style={[tw`flex-1 p-3 rounded-lg items-center`, { backgroundColor: formData.role === r ? theme.colors.primary : "transparent" }]}>
              <Text style={{ color: formData.role === r ? "white" : (theme.colors.text as string) }}>
                {t.common[r as "user" | "business"]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Avatar or Business Logo */}
        {formData.role === "user" ? (
          <UploadFile avatarUrl={formData.avatarUrl || undefined} onUploadComplete={({ url }) => handleInputChange("avatarUrl", url)} />
        ) : (
          <UploadFile avatarUrl={formData.businessProfile.logoUrl || undefined} onUploadComplete={({ url }) => handleInputChange("businessProfile.logoUrl", url)} />
        )}

        {/* Basic Fields */}
        <CustomInput label={t.fields.fullName} icon={User} value={formData.fullName} onChangeText={(v) => handleInputChange("fullName", v)} />
        <CustomInput label={t.fields.mobileNumber} icon={Phone} value={formData.mobileNumber} onChangeText={(v) => handleInputChange("mobileNumber", v)} keyboardType="phone-pad" maxLength={10} />
        <CustomInput label={t.fields.email} icon={Mail} value={formData.email} onChangeText={(v) => handleInputChange("email", v)} />

        {/* Passwords for Register */}
        {mode === "register" && (
          <>
            <CustomInput label={t.fields.password} icon={KeyRound} value={formData.password} onChangeText={(v) => handleInputChange("password", v)} isPassword />
            <CustomInput label={t.fields.confirmPassword} icon={KeyRound} value={formData.confirmPassword} onChangeText={(v) => handleInputChange("confirmPassword", v)} isPassword />
          </>
        )}

        {formData.role === "user" && (
          <CustomInput label={t.fields.bio} icon={Info} value={formData.bio} onChangeText={(v) => handleInputChange("bio", v)} multiline />
        )}

        {/* Business Fields */}
        {formData.role === "business" && (
          <>
            <CustomInput label={t.fields.businessName} icon={Building} value={formData.businessProfile.name} onChangeText={(v) => handleInputChange("businessProfile.name", v)} />
            <CustomInput label={t.fields.description} icon={Info} value={formData.businessProfile.description} onChangeText={(v) => handleInputChange("businessProfile.description", v)} multiline />
            <SearchableDropdown label={t.fields.category} data={businessTypes} selectedValue={formData.businessProfile.category} onSelect={(item) => handleInputChange("businessProfile.category", item.value)} />
            <SearchableDropdown
              label={t.fields.businessModel}
              data={[
                { label: "E-commerce", value: "e-commerce" },
                { label: "Booking", value: "booking" },
                { label: "Subscription", value: "subscription" },
              ]}
              selectedValue={formData.businessProfile.businessModel}
              onSelect={(item) => handleInputChange("businessProfile.businessModel", item.value)}
            />
            <CustomInput label={t.fields.phone} icon={Phone} value={formData.businessProfile.contact.phone} onChangeText={(v) => handleInputChange("businessProfile.contact.phone", v)} keyboardType="phone-pad" />
            <CustomInput label={t.fields.whatsapp} icon={Phone} value={formData.businessProfile.contact.whatsapp} onChangeText={(v) => handleInputChange("businessProfile.contact.whatsapp", v)} keyboardType="phone-pad" />
            <CustomInput label={t.fields.email} icon={Mail} value={formData.businessProfile.contact.email} onChangeText={(v) => handleInputChange("businessProfile.contact.email", v)} keyboardType="email-address" />
          </>
        )}

        {/* --- LOCATION SECTION (Works for both roles) --- */}
        <TouchableOpacity
          onPress={() => setMapModalVisible(true)}
          style={[
            tw`flex-row items-center justify-center p-4 rounded-xl my-4`,
            { backgroundColor: theme.colors.primary }
          ]}
        >
          <MapPin color="white" size={20} style={tw`mr-2`} />
          <Text style={tw`text-white font-bold text-base`}>
            Select Location on Map
          </Text>
        </TouchableOpacity>

        <CustomInput
          label={t.fields.address}
          icon={MapPin}
          value={locationData.address}
          onChangeText={(v) => handleInputChange(`${locationPath}.address`, v)}
        />
        <CustomInput
          label={t.fields.landmark}
          icon={MapPin}
          value={locationData.landmark}
          onChangeText={(v) => handleInputChange(`${locationPath}.landmark`, v)}
        />
        <CustomInput
          label={t.fields.city}
          icon={MapPin}
          value={locationData.city}
          onChangeText={(v) => handleInputChange(`${locationPath}.city`, v)}
        />
        <CustomInput
          label={t.fields.state}
          icon={MapPin}
          value={locationData.state}
          onChangeText={(v) => handleInputChange(`${locationPath}.state`, v)}
        />
        <CustomInput
          label={t.fields.pincode}
          icon={MapPin}
          value={locationData.pincode}
          onChangeText={(v) => handleInputChange(`${locationPath}.pincode`, v)}
          keyboardType="number-pad"
        />

        {/* Operating Hours (Only for business) */}
        {formData.role === "business" && (
          <View style={tw`mt-6`}>
            <Text style={[tw`text-lg font-bold mb-2`, { color: theme.colors.text as string }]}>{tCommon.business.operatingHoursTitle}</Text>
            {formData.businessProfile.operatingHours.map((day, index) => (
              <View key={index} style={[tw`flex-row items-center justify-between mb-3 p-3 rounded-lg`, { backgroundColor: theme.colors.card as string }]}>
                <Text style={[tw`w-24 font-semibold`, { color: theme.colors.text as string }]}>{day.day}</Text>
                {day.isOpen ? (
                  <View style={tw`flex-row items-center`}>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => setShowPicker({ index, type: "open" })} style={[tw`px-3 py-2 rounded-lg mr-2`, { backgroundColor: theme.colors.border as string }]}>
                      <Text style={{ color: theme.colors.text as string }}>{displayTime12hr(day.openTime) || "Open"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => setShowPicker({ index, type: "close" })} style={[tw`px-3 py-2 rounded-lg`, { backgroundColor: theme.colors.border as string }]}>
                      <Text style={{ color: theme.colors.text as string }}>{displayTime12hr(day.closeTime) || "Close"}</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Text style={{ color: theme.colors.textSecondary as string }}>Closed</Text>
                )}
                <TouchableOpacity activeOpacity={0.8} onPress={() => toggleDayOpen(index)} style={[tw`ml-3 px-2 py-2 rounded-lg`, { backgroundColor: day.isOpen ? (theme.colors.destructive as string) : (theme.colors.primary as string) }]}>
                  <Text style={{ color: "white" }}>{day.isOpen ? "Set Closed" : "Set Open"}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Save Button */}
        <TouchableOpacity onPress={handleSave} disabled={isLoading} style={[tw`mt-6 h-14 rounded-xl items-center justify-center`, { backgroundColor: theme.colors.primary as string, opacity: isLoading ? 0.7 : 1.0 }]}>
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={tw`text-white text-lg font-bold`}>{mode === "register" ? t.register.button : t.common.saveChanges}</Text>}
        </TouchableOpacity>

        {/* Time Picker */}
        {showPicker && Platform.OS !== "web" && (
          <DateTimePicker
            value={
              new Date(
                `1970-01-01T${showPicker.type === "open"
                  ? formData.businessProfile.operatingHours[showPicker.index].openTime
                  : formData.businessProfile.operatingHours[showPicker.index].closeTime
                }`
              )
            }
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

// ///