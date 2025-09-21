// src/screens/profile/EditProfileForm.tsx
import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import tw from "twrnc";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Globe,
  Clock,
  MapPinIcon as MapPin,
  Info,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";

// Contexts & Store
import { useTheme } from "../../context/ThemeContext";
import { RoleContext } from "../../context/RoleContext";
import { useLanguage } from "../../context/LanguageContext";
import { profileScreenData } from "../../data/profileScreenData";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { updateUser, reset } from "../../store/authSlice";
import { createBusiness, updateBusiness } from "../../store/businessSlice";

// Components
import { CustomInput, SearchableDropdown } from "../../components/forms/FormUI";
import { UploadFile } from "../../components/upload/uploader";
import { businessTypes } from "../../data/businessTypesData";

type Locale = "en" | "hi" | "en-HI";

// Days for operating hours
const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function EditProfileForm({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const { theme } = useTheme();
  const { role, changeRole } = useContext(RoleContext);
  const { locale } = useLanguage();
  const t = profileScreenData[locale as Locale] || profileScreenData["en"];

  const dispatch = useAppDispatch();
  const { user, isLoading, isError, isSuccess, message } = useAppSelector(
    (state: any) => state.auth
  );

  const [showOpenPicker, setShowOpenPicker] = useState<number | null>(null);
  const [showClosePicker, setShowClosePicker] = useState<number | null>(null);

  // ---------- INITIAL FORM STATE ----------
  const [formData, setFormData] = useState({
    role: user?.role || "user", // default role
    fullName: user?.fullName || "",
    email: user?.email || "",
    mobileNumber: user?.mobileNumber || "",
    bio: user?.bio || "",
    businessProfile: {
      businessName: user?.businessProfile?.businessName || "",
      description: user?.businessProfile?.description || "",
      category: user?.businessProfile?.category || "",
      businessModel: user?.businessProfile?.businessModel || "e-commerce",
      contact: {
        phone: user?.businessProfile?.contact?.phone || "",
        whatsapp: user?.businessProfile?.contact?.whatsapp || "",
        email: user?.businessProfile?.contact?.email || "",
      },
      location: {
        address: user?.businessProfile?.location?.address || "",
        city: user?.businessProfile?.location?.city || "",
        state: user?.businessProfile?.location?.state || "",
        pincode: user?.businessProfile?.location?.pincode || "",
      },
      operatingHours:
        user?.businessProfile?.operatingHours || [
          { day: "Monday", isOpen: false, openTime: "", closeTime: "" },
          { day: "Tuesday", isOpen: false, openTime: "", closeTime: "" },
          { day: "Wednesday", isOpen: false, openTime: "", closeTime: "" },
          { day: "Thursday", isOpen: false, openTime: "", closeTime: "" },
          { day: "Friday", isOpen: false, openTime: "", closeTime: "" },
          { day: "Saturday", isOpen: false, openTime: "", closeTime: "" },
          { day: "Sunday", isOpen: false, openTime: "", closeTime: "" },
        ],
    },
  });

  const [newAvatarUrl, setNewAvatarUrl] = useState<string | null>(null);

  // ---------- EFFECTS ----------
  useEffect(() => {
    if (isError) {
      Alert.alert("Error", String(message || "Something went wrong"));
      dispatch(reset());
    }
    if (isSuccess) {
      Alert.alert("Success", "Profile updated successfully!");
      dispatch(reset());
      onClose();
    }
  }, [isError, isSuccess, message]);

  // ---------- HANDLERS ----------
  const handleRoleChange = (newRole: "user" | "business" | "employee") => {
    setFormData((prev) => ({ ...prev, role: newRole }));
    changeRole(newRole.charAt(0).toUpperCase() + newRole.slice(1));
  };

  const handleInputChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleBusinessInputChange = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      businessProfile: { ...prev.businessProfile, [key]: value },
    }));
  };

  const handleContactChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      businessProfile: {
        ...prev.businessProfile,
        contact: { ...prev.businessProfile.contact, [key]: value },
      },
    }));
  };

  const handleLocationChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      businessProfile: {
        ...prev.businessProfile,
        location: { ...prev.businessProfile.location, [key]: value },
      },
    }));
  };

  const toggleDayOpen = (dayIndex: number) => {
    const updatedHours = [...formData.businessProfile.operatingHours];
    updatedHours[dayIndex].isOpen = !updatedHours[dayIndex].isOpen;
    handleBusinessInputChange("operatingHours", updatedHours);
  };

const handleSave = async () => {
  if (!formData.fullName.trim()) {
    Alert.alert("Validation", "Full name is required.");
    return;
  }

  try {
    if (formData.role === "business") {
      const payload = {
        name: formData.businessProfile.businessName.trim(),
        logoUrl: newAvatarUrl || user?.avatarUrl || "",
        description: formData.businessProfile.description.trim(),
        category: formData.businessProfile.category,
        businessModel: formData.businessProfile.businessModel,
        contact: {
          phone: formData.businessProfile.contact.phone || null,
          whatsapp: formData.businessProfile.contact.whatsapp || null,
          email: formData.businessProfile.contact.email || null,
        },
        location: {
          address: formData.businessProfile.location.address || null,
          city: formData.businessProfile.location.city || null,
          state: formData.businessProfile.location.state || null,
          pincode: formData.businessProfile.location.pincode || null,
        },
        operatingHours: formData.businessProfile.operatingHours.map((day) => ({
          ...day,
          openTime: day.isOpen ? day.openTime : null,
          closeTime: day.isOpen ? day.closeTime : null,
        })),
      };

      console.log("Saving Business Payload: ", payload); // ✅ Debugging
      await dispatch(updateBusiness(payload)).unwrap();

      Alert.alert("Success", "Business profile updated successfully!");
      dispatch(reset());
    } else {
      const userPayload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        mobileNumber: formData.mobileNumber,
        bio: formData.bio.trim(),
        avatarUrl: newAvatarUrl || user?.avatarUrl,
      };

      await dispatch(updateUser(userPayload)).unwrap();
      Alert.alert("Success", "User profile updated successfully!");
      dispatch(reset());
    }
  } catch (err: any) {
    Alert.alert("Error", err.message || "Failed to save profile");
  }
};


  // ---------- UI ----------
  return (
    <SafeAreaView
      style={[tw`flex-1 pt-6 mb-20`, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={tw`p-6 pb-20`}>
        <TouchableOpacity onPress={onClose} style={tw`mb-4`}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>

        {/* Role Switch */}
        <View
          style={[
            tw`flex-row rounded-lg p-1 my-4`,
            { backgroundColor: theme.colors.card },
          ]}
        >
          {["user", "business", "employee"].map((r) => (
            <TouchableOpacity
              key={r}
              onPress={() => handleRoleChange(r as any)}
              style={[
                tw`flex-1 p-3 rounded-lg items-center`,
                {
                  backgroundColor:
                    formData.role === r ? theme.colors.primary : "transparent",
                },
              ]}
            >
              <Text
                style={{
                  color: formData.role === r ? "white" : theme.colors.text,
                }}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Avatar Upload */}
        <UploadFile
          avatarUrl={newAvatarUrl || user?.avatarUrl || undefined}
          onUploadComplete={({ url }: { url: string }) => setNewAvatarUrl(url)}
        />

        {/* USER FIELDS */}
        {formData.role === "user" && (
          <>
            <CustomInput
              label="Full Name"
              icon={User}
              value={formData.fullName}
              onChangeText={(v) => handleInputChange("fullName", v)}
            />
            <CustomInput
              label="Mobile Number"
              icon={Phone}
              value={formData.mobileNumber}
              editable={false}
            />
            <CustomInput
              label="Email"
              icon={Mail}
              value={formData.email}
              onChangeText={(v) => handleInputChange("email", v)}
            />
            <CustomInput
              label="Bio"
              icon={User}
              value={formData.bio}
              onChangeText={(v) => handleInputChange("bio", v)}
            />
          </>
        )}

        {/* BUSINESS FIELDS */}
        {formData.role === "business" && (
          <>
            <CustomInput
              label="Business Name"
              icon={User}
              value={formData.businessProfile.businessName}
              onChangeText={(v) => handleBusinessInputChange("businessName", v)}
            />
            <CustomInput
              label="Description"
              icon={Info}
              value={formData.businessProfile.description}
              onChangeText={(v) => handleBusinessInputChange("description", v)}
            />
            <SearchableDropdown
              label="Category"
              data={businessTypes}
              selectedValue={formData.businessProfile.category}
              onSelect={(item: any) =>
                handleBusinessInputChange("category", item.value)
              }
            />

            {/* Business Model Dropdown */}
            <SearchableDropdown
              label="Business Model"
              data={[
                { label: "E-commerce", value: "e-commerce" },
                { label: "Booking", value: "booking" },
                { label: "Subscription", value: "subscription" },
              ]}
              selectedValue={formData.businessProfile.businessModel}
              onSelect={(item: any) =>
                handleBusinessInputChange("businessModel", item.value)
              }
            />

            {/* Contact Section */}
            <CustomInput
              label="Phone"
              icon={Phone}
              value={formData.businessProfile.contact.phone}
              onChangeText={(v) => handleContactChange("phone", v)}
            />
            <CustomInput
              label="WhatsApp"
              icon={Phone}
              value={formData.businessProfile.contact.whatsapp}
              onChangeText={(v) => handleContactChange("whatsapp", v)}
            />
            <CustomInput
              label="Email"
              icon={Mail}
              value={formData.businessProfile.contact.email}
              onChangeText={(v) => handleContactChange("email", v)}
            />

            {/* Location Section */}
            <CustomInput
              label="Address"
              icon={MapPin}
              value={formData.businessProfile.location.address}
              onChangeText={(v) => handleLocationChange("address", v)}
            />
            <CustomInput
              label="City"
              icon={MapPin}
              value={formData.businessProfile.location.city}
              onChangeText={(v) => handleLocationChange("city", v)}
            />
            <CustomInput
              label="State"
              icon={MapPin}
              value={formData.businessProfile.location.state}
              onChangeText={(v) => handleLocationChange("state", v)}
            />
            <CustomInput
              label="Pincode"
              icon={MapPin}
              value={formData.businessProfile.location.pincode}
              onChangeText={(v) => handleLocationChange("pincode", v)}
            />

            {/* Operating Hours */}
            <View style={tw`mt-6`}>
              <Text
                style={[tw`text-lg font-bold mb-2`, { color: theme.colors.text }]}
              >
                Operating Hours
              </Text>

              {formData.businessProfile.operatingHours.map((day, index) => (
                <View
                  key={day.day}
                  style={[
                    tw`flex-row items-center justify-between mb-3 p-3 rounded-lg`,
                    { backgroundColor: theme.colors.card },
                  ]}
                >
                  {/* Day Name */}
                  <Text
                    style={[tw`w-20 font-semibold`, { color: theme.colors.text }]}
                  >
                    {day.day}
                  </Text>

                  {/* If day is open → show open & close time pickers */}
                  {day.isOpen ? (
                    <View style={tw`flex-row items-center`}>
                      {/* Open Time Picker */}
                      <TouchableOpacity
                        onPress={() => setShowOpenPicker(index)}
                        style={[
                          tw`px-3 py-2 rounded-lg mr-2`,
                          { backgroundColor: theme.colors.border },
                        ]}
                      >
                        <Text style={{ color: theme.colors.text }}>
                          {day.openTime || "Open"}
                        </Text>
                      </TouchableOpacity>

                      {/* Close Time Picker */}
                      <TouchableOpacity
                        onPress={() => setShowClosePicker(index)}
                        style={[
                          tw`px-3 py-2 rounded-lg`,
                          { backgroundColor: theme.colors.border },
                        ]}
                      >
                        <Text style={{ color: theme.colors.text }}>
                          {day.closeTime || "Close"}
                        </Text>
                      </TouchableOpacity>

                      {/* Toggle Open */}
                      <TouchableOpacity
                        onPress={() => toggleDayOpen(index)}
                        style={[
                          tw`ml-3 px-3 py-2 rounded-lg`,
                          { backgroundColor: theme.colors.primary },
                        ]}
                      >
                        <Text style={{ color: "white" }}>Open</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={() => toggleDayOpen(index)}
                      style={[
                        tw`ml-auto px-3 py-2 rounded-lg`,
                        { backgroundColor: theme.colors.border },
                      ]}
                    >
                      <Text style={{ color: theme.colors.text }}>Closed</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}

              {/* Time Pickers */}
              {showOpenPicker !== null && (
                <DateTimePicker
                  value={
                    formData.businessProfile.operatingHours[showOpenPicker].openTime
                      ? new Date(
                          `1970-01-01T${formData.businessProfile.operatingHours[showOpenPicker].openTime}:00`
                        )
                      : new Date()
                  }
                  mode="time"
                  is24Hour={true}
                  display="default"
                  onChange={(event, selectedDate) => {
                    if (selectedDate) {
                      const hours = [...formData.businessProfile.operatingHours];
                      hours[showOpenPicker].openTime = selectedDate.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      });
                      handleBusinessInputChange("operatingHours", hours);
                    }
                    setShowOpenPicker(null);
                  }}
                />
              )}

              {showClosePicker !== null && (
                <DateTimePicker
                  value={
                    formData.businessProfile.operatingHours[showClosePicker].closeTime
                      ? new Date(
                          `1970-01-01T${formData.businessProfile.operatingHours[showClosePicker].closeTime}:00`
                        )
                      : new Date()
                  }
                  mode="time"
                  is24Hour={true}
                  display="default"
                  onChange={(event, selectedDate) => {
                    if (selectedDate) {
                      const hours = [...formData.businessProfile.operatingHours];
                      hours[showClosePicker].closeTime = selectedDate.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      });
                      handleBusinessInputChange("operatingHours", hours);
                    }
                    setShowClosePicker(null);
                  }}
                />
              )}
            </View>
          </>
        )}

        {/* SAVE BUTTON */}
        <TouchableOpacity
          onPress={handleSave}
          disabled={isLoading}
          style={[
            tw`mt-6 h-14 rounded-xl items-center justify-center`,
            { backgroundColor: theme.colors.primary },
          ]}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={tw`text-white text-lg font-bold`}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
