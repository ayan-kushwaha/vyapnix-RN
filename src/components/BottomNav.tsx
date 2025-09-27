import React, { useState, JSX } from "react";
import { View, TouchableOpacity } from "react-native";
import { Home, User, Plus, ShoppingBag, Users, PackageSearch } from "lucide-react-native";
import { useRouter } from "expo-router";
import tw from "twrnc";
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from "../context/ThemeContext";

interface TabItem {
  name: string;
  icon: JSX.Element;
  route?: string;
}

const mainTabs: TabItem[] = [
  { name: "Home", icon: <Home />, route: "/(tabs)/" },
  { name: "Store", icon: <ShoppingBag />, route: "/(tabs)/store" },
  { name: "Catalog", icon: <PackageSearch />, route: "/(tabs)/catalog" },
  { name: "Contacts", icon: <Users />, route: "/(tabs)/contacts" },
  { name: "Profile", icon: <User />, route: "/(tabs)/profile" },
];

export default function BottomNav() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Home");
  const { theme } = useTheme();

  const handleMainTabPress = (tab: TabItem) => {
    setActiveTab(tab.name);
    if (tab.route) router.push(tab.route);
  };

  const Tab = ({ tab }: { tab: TabItem }) => {
    const isActive = activeTab === tab.name;
    return (
      <TouchableOpacity
        onPress={() => handleMainTabPress(tab)}
        style={tw`flex-1 h-full items-center justify-center`}
      >
        <View style={[tw`p-3 rounded-full`, isActive && { backgroundColor: theme.colors.tabBarActive + '20' }]}>
          {React.cloneElement(tab.icon, {
            size: 26,
            color: isActive ? theme.colors.tabBarActive : theme.colors.tabBarInactive,
          })}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={tw`absolute bottom-0 left-0 right-0 items-center`}>
      <View
        style={[
          tw`flex-row w-full h-20 items-center justify-around`,
          { backgroundColor: theme.colors.tabBar, borderTopWidth: 1, borderTopColor: theme.colors.border },
        ]}
      >
        {mainTabs.map(tab => (
          <Tab key={tab.name} tab={tab} />
        ))}
      </View>
    </View>
  );
}
