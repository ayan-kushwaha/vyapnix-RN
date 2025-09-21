import React, { useContext } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import { useTheme } from "../../src/context/ThemeContext";
import AppSettingsScreen from "../../src/screens/Profile/AppSettingsScreen";
import UserProfilePage from "../../src/screens/Profile/UserProfilePage";
import { BlurView } from "expo-blur";
import { Text, TouchableOpacity } from "react-native";
import { Settings } from "lucide-react-native";
import { RoleContext } from "../../src/context/RoleContext";
import Animated from "react-native-reanimated";

export default function Profile() {
  const { theme } = useTheme();
  const { role } = useContext(RoleContext);
  const [menuVisible, setMenuVisible] = React.useState(false);

  return (
    <SafeAreaView
      style={[tw`flex-1`, { backgroundColor: theme.colors.background }]}>
      {/* Fixed Blur Header */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 64,
          zIndex: 50,
          backgroundColor: theme.colors.background,
          backdropFilter: "blur(12px)",
        }}>
        <View style={tw`flex-row items-center justify-between px-4 h-16`}>
          <Text style={[tw`text-lg font-bold`, { color: theme.colors.text }]}>
            {role} Profile
          </Text>
          <TouchableOpacity onPress={() => setMenuVisible((p) => !p)}>
            <Settings size={22} color={theme.colors.iconColor} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 64 }}>
        <UserProfilePage />
        <AppSettingsScreen />
      </ScrollView>
    </SafeAreaView>
  );
}
