import React, { useState, useRef, useEffect, JSX } from "react";
import { View, TouchableOpacity } from "react-native";
import {
  Home, User, Plus, ShoppingBag, Users, Search, Map, MessageSquare, Wallet, Heart,
  PackageSearch
} from "lucide-react-native";
import Animated, {
  useSharedValue, withTiming, useAnimatedStyle, Easing
} from "react-native-reanimated";
import { useRouter } from "expo-router";
import tw from "twrnc";
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from "../context/ThemeContext";

interface TabItem {
  name: string;
  icon: JSX.Element;
  route?: string;
}

// ✨ FIX: "Client" has been changed to "Contacts" and the route is updated.
// The "Home" route is also fixed to point to the index screen.
const mainTabs: TabItem[] = [
  { name: "Home", icon: <Home />, route: "/(tabs)/" },
  { name: "Store", icon: <ShoppingBag />, route: "/(tabs)/store" },
  { name: "Add", icon: <Plus /> },
  { name: "Contacts", icon: <Users />, route: "/(tabs)/contacts" },
  { name: "Profile", icon: <User />, route: "/(tabs)/profile" },
];

const floatingIcons: TabItem[] = [
  { name: "Catalog", icon: <PackageSearch />, route: "/(tabs)/catalog" },
  { name: "Map", icon: <Map />, route: "/(tabs)/map" },
  { name: "Chat", icon: <MessageSquare />, route: "/(tabs)/chat" },
  { name: "Wallet", icon: <Wallet />, route: "/(tabs)/wallet" },
  { name: "Like", icon: <Heart />, route: "/(tabs)/like" },
];

export default function BottomNav() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Home");
  const [addActiveIcon, setAddActiveIcon] = useState<JSX.Element | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { theme } = useTheme();

  const animValues = useRef(floatingIcons.map(() => useSharedValue(0))).current;
  const rotation = useSharedValue(0);

  useEffect(() => {
    animValues.forEach((val) => {
      val.value = withTiming(isMenuOpen ? 1 : 0, {
        duration: 300,
        easing: Easing.out(Easing.exp),
      });
    });
    rotation.value = withTiming(isMenuOpen ? 45 : 0, { duration: 300 });
  }, [isMenuOpen]);

  const handleFloatingIconPress = (item: TabItem) => {
    const styledIcon = React.cloneElement(item.icon, {
      color: theme.colors.iconColor,
      size: 30,
    });
    setAddActiveIcon(styledIcon);
    setActiveTab(item.name);
    setIsMenuOpen(false);
    if (item.route) router.push(item.route);
  };

  const handleMainTabPress = (tab: TabItem) => {
    if (tab.name === "Add") return;

    setActiveTab(tab.name);
    if (!floatingIcons.some(f => f.name === tab.name)) {
      setAddActiveIcon(null);
    }
    if (tab.route) router.push(tab.route);
  };

  const animatedRotation = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const renderFloatingIcons = () =>
    floatingIcons.map((item, i) => {
      const style = useAnimatedStyle(() => {
        const angle = -20 - (i * 35);
        const radius = 110;
        return {
          transform: [
            { translateX: animValues[i].value * radius * Math.cos((angle * Math.PI) / 180) },
            { translateY: animValues[i].value * radius * Math.sin((angle * Math.PI) / 180) },
            { scale: animValues[i].value },
          ],
          opacity: animValues[i].value,
        };
      });

      return (
        <Animated.View key={item.name} style={[tw`absolute`, style]}>
          <TouchableOpacity
            onPress={() => handleFloatingIconPress(item)}
            style={[tw`w-14 h-14 rounded-full items-center justify-center`, theme.shadows.md, { backgroundColor: theme.colors.card }]}
          >
            {React.cloneElement(item.icon, { color: theme.colors.primary, size: 24 })}
          </TouchableOpacity>
        </Animated.View>
      );
    });

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
      <View style={[tw`flex-row w-full h-20 items-center justify-around`, { backgroundColor: theme.colors.tabBar, borderTopWidth: 1, borderTopColor: theme.colors.border }]}>
        <Tab tab={mainTabs[0]} />
        <Tab tab={mainTabs[1]} />

        <View style={tw`relative items-center justify-center -mt-8 z-10`}>
          {renderFloatingIcons()}
          <TouchableOpacity
            onPress={() => {
              if (addActiveIcon) {
                setAddActiveIcon(null);
                setActiveTab("Home");
                router.push('/(tabs)/');
              } else {
                setIsMenuOpen(!isMenuOpen);
              }
            }}
          >
            <LinearGradient
              colors={addActiveIcon ? theme.gradients.card : theme.gradients.primaryButton}
              style={[tw`w-16 h-16 rounded-full items-center justify-center`, theme.shadows.lg]}
            >
              {addActiveIcon ? (
                React.cloneElement(addActiveIcon, { color: theme.colors.primary })
              ) : (
                <Animated.View style={animatedRotation}>
                  <Plus size={30} color={theme.colors.iconColor} />
                </Animated.View>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <Tab tab={mainTabs[3]} />
        <Tab tab={mainTabs[4]} />
      </View>
    </View>
  );
}
