// app/(profile)/index.tsx

import React, { useState } from "react";
// ✅ Alert ko import karein
import { ScrollView, View, Text, TouchableOpacity, SafeAreaView, Share, Alert } from "react-native";
import tw from "twrnc";
// ✅ Naye icons import karein
import { ArrowLeft, MoreVertical, Settings, Edit, Share2, LogOut } from "lucide-react-native";

import { useTheme } from "../../src/context/ThemeContext";
// ✅ Redux hooks aur actions import karein
import { useAppSelector, useAppDispatch } from "../../src/store/hooks";
import { logoutUser } from "../../src/store/authSlice";

// Screens & Components
import AppSettingsScreen from "../../src/screens/Profile/AppSettingsScreen";
import UserProfilePage from "../../src/screens/Profile/UserProfilePage";
import ProfileForm from "../../src/components/forms/ProfileForm";
import { ActionsModal } from "@/src/screens/Catalog/ActionsModal";

export default function Profile() {
  const { theme } = useTheme();
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch(); // ✅ dispatch ko initialize karein

  const [viewMode, setViewMode] = useState<'profile' | 'edit' | 'settings'>('profile');
  const [isMenuVisible, setMenuVisible] = useState(false);

  if (!user) return null;

  const role = user?.businessProfile ? 'Business' : 'User';

  // ✅ Logout ke liye confirmation wala function
  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => dispatch(logoutUser())
        },
      ]
    );
  };

  const menuActions = [
    {
      title: "Share Profile",
      icon: Share2,
      onPress: () => {
        Share.share({ message: `Check out my profile: ${user.fullName}!` });
      }
    },
    {
      title: "Edit Profile",
      icon: Edit,
      onPress: () => setViewMode('edit')
    },
    {
      title: "Settings",
      icon: Settings,
      onPress: () => setViewMode('settings')
    },
    // ✅ Logout ka naya action yahan add karein
    {
      title: "Logout",
      icon: LogOut,
      onPress: handleLogout
    },
  ];

  return (
    <View style={[tw`flex-1`, { backgroundColor: theme.colors.background }]}>
      {/* Dynamic Header */}
      <View style={[tw`flex-row items-center justify-between px-4 h-16 border-b `, { borderColor: theme.colors.border }]}>
        <View style={tw`flex-row items-center`}>
          {viewMode !== 'profile' && (
            <TouchableOpacity onPress={() => setViewMode('profile')} style={tw`mr-4 p-2 -ml-2`}>
              <ArrowLeft size={24} color={theme.colors.text} />
            </TouchableOpacity>
          )}
          <Text style={[tw`text-xl font-bold`, { color: theme.colors.text }]}>
            {viewMode === 'profile' && `${role} Profile`}
            {viewMode === 'edit' && `Edit Profile`}
            {viewMode === 'settings' && `Settings`}
          </Text>
        </View>

        {viewMode === 'profile' && (
          <TouchableOpacity onPress={() => setMenuVisible(true)}>
            <MoreVertical size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Dynamic Content */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {viewMode === 'edit' && (
          <ProfileForm mode="edit" onSuccess={() => setViewMode('profile')} onClose={() => setViewMode('profile')} />
        )}
        {viewMode === 'profile' && (
          <UserProfilePage onEditProfilePress={() => setViewMode('edit')} />
        )}
        {viewMode === 'settings' && (
          <AppSettingsScreen />
        )}
      </ScrollView>

      {/* ActionsModal */}
      <ActionsModal
        visible={isMenuVisible}
        onClose={() => setMenuVisible(false)}
        title="Profile Options"
        actions={menuActions}
      />
    </View>
  );
}