// app/(profile)/index.tsx

import React, { useState } from "react"; // Removed useContext
import { ScrollView, View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import tw from "twrnc";
import { ArrowLeft, Settings } from "lucide-react-native";

import { useTheme } from "../../src/context/ThemeContext";
// ❌ No need for RoleContext anymore
// import { RoleContext } from "../../src/context/RoleContext";

// ✅ Import Redux hooks instead
import { useAppSelector } from "../../src/store/hooks";

// Screens
import AppSettingsScreen from "../../src/screens/Profile/AppSettingsScreen";
import UserProfilePage from "../../src/screens/Profile/UserProfilePage";
// import EditProfileForm from "../../src/screens/Profile/EditProfileForm";
import ProfileForm from "../../src/components/forms/ProfileForm";

export default function Profile() {
  const { theme } = useTheme();
  const { user } = useAppSelector((state) => state.auth);
  const [viewMode, setViewMode] = useState<'profile' | 'edit' | 'settings'>('profile');

  const role = user?.businessProfile ? 'Business' : 'User';
  const [isEditing, setIsEditing] = useState(false);

  const toggleEditMode = () => setIsEditing(prev => !prev);

  if (!user) return null;

  const handleFormClose = () => {
    // ✅ Sirf edit mode ko false karo
    setIsEditing(false);
  };

  return (
    <SafeAreaView style={[tw`flex-1 mt-5`, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={tw`flex-row items-center justify-between px-4 h-16`}>
        <View style={tw`flex-row items-center`}>
          {isEditing && (
            <TouchableOpacity onPress={handleFormClose} style={tw`mr-3`}>
              <ArrowLeft size={24} color={theme.colors.text} />
            </TouchableOpacity>
          )}
          <Text style={[tw`text-lg font-bold`, { color: theme.colors.text }]}>
            {role} Profile
          </Text>
        </View>
        {!isEditing && (
          <TouchableOpacity>
            <Settings size={22} color={theme.colors.iconColor} />
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {isEditing ? (
          <ProfileForm
            mode="edit"
            onSuccess={handleFormClose} // ✅ Sirf form band karega
            onClose={handleFormClose}   // ✅ Back button ke liye
          />
        ) : (
          <>
            <UserProfilePage onEditProfilePress={toggleEditMode} />
            <AppSettingsScreen />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
