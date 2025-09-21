import React, { useContext, useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import tw from "twrnc";
import { ArrowLeft, Settings } from "lucide-react-native";

// --- Contexts ---
import { useTheme } from "../../src/context/ThemeContext";
import { RoleContext } from "../../src/context/RoleContext";

// --- Screens ---
import AppSettingsScreen from "../../src/screens/Profile/AppSettingsScreen";
import UserProfilePage from "../../src/screens/Profile/UserProfilePage";
import EditProfileForm from "../../src/screens/Profile/EditProfileForm";

export default function Profile() {
    const { theme } = useTheme();
    const { role } = useContext(RoleContext);

    // State to track edit mode
    const [isEditing, setIsEditing] = useState(false);

    const toggleEditMode = () => setIsEditing((prev) => !prev);

    return (
        <SafeAreaView style={[tw`flex-1`, { backgroundColor: theme.colors.background }]}>
            {/* Header */}
            <View style={tw`flex-row items-center justify-between px-4 h-16`}>
                <View style={tw`flex-row items-center`}>
                    {isEditing && (
                        <TouchableOpacity onPress={toggleEditMode} style={tw`mr-3`}>
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
                    <EditProfileForm onClose={toggleEditMode} />
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
