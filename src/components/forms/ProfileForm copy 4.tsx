// src/components/forms/ProfileForm.tsx
import React, { useEffect, useState } from "react";
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
    address:defaultLocation,
    businessProfile: {
      name: "",
      description: "",
      category: "",
      businessModel: "e-commerce" as "e-commerce" | "booking" | "subscription",
      logoUrl: "",
      contact: { phone: "", whatsapp: "", email: "" },
      location: defaultLocation,
      operatingHours: defaultOperatingHours,
    } as BusinessProfile,
  });

 const locationData = (formData.role === 'business' ? formData.businessProfile.location : formData.address) || defaultLocation;

  const locationPath = formData.role === 'business' ? 'businessProfile.location' : 'address';

  /** ---------- Load user data ---------- */
  // useEffect(() => {
  //   if (user) {
  //     setFormData((prev) => ({
  //       ...prev,
  //       role: user.businessProfile ? "business" : prev.role || "user",
  //       fullName: user.fullName || "",
  //       email: user.email || "",
  //       mobileNumber: user.mobileNumber || "",
  //       bio: user.bio || "",
  //       avatarUrl: user.avatarUrl || "",
  //       address: user.address || { address: "", city: "", state: "", pincode: "", landmark: "", latitude: null, longitude: null },
  //     }));
  //   }
  // }, [user]);

  // /** ---------- Fetch business profile if needed ---------- */
  // useEffect(() => {
  //   if (mode === "edit" && user) {
  //     if (!user.businessProfile) {
  //       dispatch(fetchMyBusiness());
  //     } else {
  //       setFormData((prev) => ({
  //         ...prev,
  //         businessProfile: {
  //           ...user.businessProfile,
  //           contact: user.businessProfile.contact || { phone: "", whatsapp: "", email: "" },
  //           location: user.businessProfile.location || { address: "", city: "", state: "", pincode: "", landmark: "", latitude: null, longitude: null },
  //           operatingHours: user.businessProfile.operatingHours?.map((d) => ({ ...d })) || defaultOperatingHours,
  //         },
  //         role: "business",
  //       }));
  //     }
  //   }
  // }, [mode, user, dispatch]);

  // /** ---------- Populate form when business slice updates ---------- */
  // useEffect(() => {
  //   if (business) {
  //     setFormData((prev) => ({
  //       ...prev,
  //       role: "business",
  //       businessProfile: {
  //         ...business,
  //         contact: business.contact || { phone: "", whatsapp: "", email: "" },
  //         location: business.location || { address: "", city: "", state: "", pincode: "", landmark: "", latitude: null, longitude: null },
  //         operatingHours: business.operatingHours?.map((d) => ({ ...d })) || defaultOperatingHours,
  //       },
  //     }));
  //   }
  // }, [business]);


  // ✨ DELETE the 3 old useEffect hooks and REPLACE them with this one
  useEffect(() => {
    // Start with a new, empty form data object
    let newFormData = { ...formData };

    // Part 1: Populate with basic user data if available
    if (user) {
      newFormData = {
        ...newFormData,
        role: user.businessProfile ? "business" : (newFormData.role || "user"),
        fullName: user.fullName || "",
        email: user.email || "",
        mobileNumber: user.mobileNumber || "",
        bio: user.bio || "",
        avatarUrl: user.avatarUrl || "",
        address: user.address || defaultLocation,
      };
    }

    // Part 2: Populate with business data from the Redux 'business' slice if it exists
    // This is useful after a fresh fetch
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
    // Or, if business data is already part of the main 'user' object, use that
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

    // Part 3: In 'edit' mode, if there's a user but no business data yet, fetch it
    if (mode === 'edit' && user && !user.businessProfile && !business) {
      dispatch(fetchMyBusiness());
    }

    // Finally, update the state once with the complete object
    setFormData(newFormData);

  }, [user, business, mode, dispatch]);

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
          address: formData.address,

        };

        await dispatch(registerUser(payload)).unwrap();
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
        address: formData.address,

      };

      await dispatch(updateUser(userPayload)).unwrap();

      if (formData.role === "business") {
        if (!formData.businessProfile.name?.trim()) return Alert.alert("Validation", "Business name is required");
        if (!formData.businessProfile.category?.trim()) return Alert.alert("Validation", "Business category is required");

        const businessPayload: Partial<BusinessProfile> = {
          ...formData.businessProfile,
          operatingHours: (formData.businessProfile.operatingHours || []).map((d) => ({
            ...d,
            openTime: d.isOpen ? d.openTime : null,
            closeTime: d.isOpen ? d.closeTime : null,
          })),
        };

        const existingId =
          (user as any)?.businessProfile?._id || (business as any)?._id;

        if (existingId) {
          await dispatch(updateBusiness(businessPayload)).unwrap();
        } else {
          await dispatch(createBusiness(businessPayload)).unwrap();
        }
      }

      await dispatch(getMe());
      Alert.alert(t.validation.success, t.edit.successMessage);
      onSuccess();
    } catch (err: any) {
      const msg = err?.message || err?.payload || "Unknown error";
      Alert.alert("Error", msg);
    }
  };
  // handleSave function ke neeche yeh naya function add karein
  const handleLocationConfirm = (locationData: any) => {
    if (locationData) {
      if (formData.role === 'business') {
        // Form ke hisab se data set karein
        handleInputChange("businessProfile.location.landmark", locationData.landmark);
        handleInputChange("businessProfile.location.address", locationData.address);
        handleInputChange("businessProfile.location.city", locationData.city);
        handleInputChange("businessProfile.location.state", locationData.state);
        handleInputChange("businessProfile.location.pincode", locationData.pincode);
        handleInputChange("businessProfile.location.latitude", locationData.latitude);
        handleInputChange("businessProfile.location.longitude", locationData.longitude);
      } else {
        // Agar role user hai, to user ka address update karein
        handleInputChange("address", locationData);
      }
    }
    setMapModalVisible(false); // Modal ko band karein
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
              onPress={() => handleInputChange("role", r)}
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

            {/* Contact */}
            <CustomInput label={t.fields.phone} icon={Phone} value={formData.businessProfile.contact.phone} onChangeText={(v) => handleInputChange("businessProfile.contact.phone", v)} keyboardType="phone-pad" />
            <CustomInput label={t.fields.whatsapp} icon={Phone} value={formData.businessProfile.contact.whatsapp} onChangeText={(v) => handleInputChange("businessProfile.contact.whatsapp", v)} keyboardType="phone-pad" />
            <CustomInput label={t.fields.email} icon={Mail} value={formData.businessProfile.contact.email} onChangeText={(v) => handleInputChange("businessProfile.contact.email", v)} keyboardType="email-address" />

            {/* Location */}
            {/* Select on Map Button */}

            {/* Operating Hours */}
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
          </>
        )}
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
          value={locationData.address} // ✨ Dynamic value
          onChangeText={(v) => handleInputChange(`${locationPath}.address`, v)} // ✨ Dynamic path
        />
        <CustomInput
          label={t.fields.landmark}
          icon={MapPin}
          value={locationData.landmark} // ✨ Dynamic value
          onChangeText={(v) => handleInputChange(`${locationPath}.landmark`, v)} // ✨ Dynamic path
        />
        <CustomInput
          label={t.fields.city}
          icon={MapPin}
          value={locationData.city} // ✨ Dynamic value
          onChangeText={(v) => handleInputChange(`${locationPath}.city`, v)} // ✨ Dynamic path
        />
        <CustomInput
          label={t.fields.state}
          icon={MapPin}
          value={locationData.state} // ✨ Dynamic value
          onChangeText={(v) => handleInputChange(`${locationPath}.state`, v)} // ✨ Dynamic path
        />
        <CustomInput
          label={t.fields.pincode}
          icon={MapPin}
          value={locationData.pincode} // ✨ Dynamic value
          onChangeText={(v) => handleInputChange(`${locationPath}.pincode`, v)} // ✨ Dynamic path
          keyboardType="number-pad"
        />

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

        {/* Web fallback for time picker */}
        {showPicker && Platform.OS === "web" && (
          <TextInput
            style={tw`mt-4 border rounded p-2`}
            placeholder="Select time"
            onChangeText={(time) => {
              const updated = formData.businessProfile.operatingHours.map((day, i) =>
                i === showPicker.index ? { ...day, [showPicker.type === "open" ? "openTime" : "closeTime"]: time } : day
              );
              handleInputChange("businessProfile.operatingHours", updated);
            }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
// 