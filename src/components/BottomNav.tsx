// src/components/BottomNav.tsx
import React, { JSX } from "react";
import { View, TouchableOpacity } from "react-native";
import { Home, User, ShoppingBag, Users, PackageSearch } from "lucide-react-native";
import { useRouter, useSegments } from "expo-router";
import tw from "twrnc";
import { useTheme } from "../context/ThemeContext";
import { useTabBar } from "../context/TabBarContext";
import { useRole } from "../context/RoleContext";

// ✅ STEP 1: Update the TabItem interface to include an optional 'roles' array
interface TabItem {
  name: string;
  icon: JSX.Element;
  route?: string;
  roles?: ('user' | 'business' | 'employee')[]; // Roles that can see this tab
}

// ✅ STEP 2: Define all possible tabs in one list with their visibility rules
const allTabs: TabItem[] = [
  { name: "Home", icon: <Home />, route: "/(tabs)/" }, // No 'roles' property = visible to all
  { name: "Store", icon: <ShoppingBag />, route: "/(tabs)/store" },
  { name: "Catalog", icon: <PackageSearch />, route: "/(tabs)/catalog", roles: ['business'] }, // Visible only to 'business' role
  { name: "Contacts", icon: <Users />, route: "/(tabs)/contacts" },
  { name: "Profile", icon: <User />, route: "/(tabs)/profile" },
  // Example for the future: 
  // { name: "Dashboard", icon: <LayoutDashboard />, route: "/(tabs)/dashboard", roles: ['business', 'employee'] },
];

export default function BottomNav() {
  const { role } = useRole();
  const router = useRouter();
  const segments = useSegments();
  const { theme } = useTheme();
  const { isTabBarVisible } = useTabBar();

  // ✅ STEP 3: The filtering logic is now simple and works for all tabs
  const visibleTabs = React.useMemo(() => {
    return allTabs.filter(tab => {
      // If the tab has a 'roles' array, check if the current role is included.
      // If not, the tab is hidden.
      if (tab.roles) {
        return tab.roles.includes(role);
      }
      // If the tab does not have a 'roles' property, it is visible to everyone.
      return true;
    });
  }, [role]); // This logic re-runs only when the user's role changes.

  if (!isTabBarVisible) return null;

  const handleMainTabPress = (tab: TabItem) => {
    if (tab.route) router.push(tab.route);
  };

  const Tab = ({ tab }: { tab: TabItem }) => {
    const currentPath = `/${segments.join('/')}`;
    const isActive = currentPath === tab.route || (tab.route === "/(tabs)/" && currentPath === "/");

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
          tw`flex-row w-full h-16 items-center justify-around`,
          { backgroundColor: theme.colors.background, borderTopWidth: 0.5, borderTopColor: theme.colors.border },
        ]}
      >
        {visibleTabs.map(tab => (
          <Tab key={tab.name} tab={tab} />
        ))}
      </View>
    </View>
  );
}