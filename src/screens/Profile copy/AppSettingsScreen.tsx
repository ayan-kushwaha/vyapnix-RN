//AppSettingsScreen
import React, { FC, useContext, useEffect, useMemo, useState } from "react";
import { View, Text, TouchableOpacity, Switch, Alert, ActivityIndicator, ScrollView, SafeAreaView, Modal, Pressable } from "react-native";
import { ChevronRight, LogOut, Palette, Sun, Moon, User2, Store, Languages, LucideIcon, Bell, Lock, MapPin, Package, CreditCard, Truck, MessageSquare, Users, BookText, MessageCircle, Zap, PaintBucket } from "lucide-react-native";
import tw from "twrnc";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useRouter } from 'expo-router';

// --- Redux (For data and actions) ---
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logoutUser } from "../../store/authSlice";

// --- Contexts & Data (Using your provided files) ---
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { useRole } from "../../context/RoleContext"; // ✨ FIX 1: Import RoleContext directly
import { settingsScreenData } from "../../data/settingsScreenData";
import { LanguageModal } from "../../components/LanguageModal";
import tinycolor from "tinycolor2";
import { useTabBar } from "@/src/context/TabBarContext";

// --- Helper Components (From your reference) ---
const SectionHeader: FC<{ title: string }> = ({ title }) => (
    <Text style={tw`text-xs font-semibold uppercase text-gray-500 mt-6 mb-2 px-1`}>{title}</Text>
);

const Item: FC<{ icon: LucideIcon; text: string; type?: 'navigate' | 'switch'; value?: boolean; onValueChange?: (value: boolean) => void; onPress?: () => void; }> = ({ icon: Icon, text, type, value, onValueChange, onPress }) => {
    const { theme } = useTheme();
    return (
        <TouchableOpacity style={tw`flex-row items-center py-3.5 px-3`} activeOpacity={0.7} onPress={onPress}>
            <View style={[tw`w-10 h-10 rounded-lg items-center justify-center`, { backgroundColor: theme.colors.primary + "20" }]}>
                <Icon color={theme.colors.primary} size={20} />
            </View>
            <Text style={[tw`flex-1 ml-4 text-base font-medium`, { color: theme.colors.text }]}>{text}</Text>
            {type === "switch" ? (
                <Switch value={!!value} onValueChange={onValueChange} trackColor={{ false: "#767577", true: theme.colors.primary }} thumbColor={"#f4f3f4"} />
            ) : (
                <ChevronRight color={theme.colors.textSecondary} size={22} />
            )}
        </TouchableOpacity>
    );
};

// Map icon strings from your data file to actual Lucide components
const iconMap: { [key: string]: LucideIcon } = {
    MapPin, User: User2, Lock, Star: Bell, Bell, Truck, Package, Store, MessageSquare, CreditCard, Users, BookText, MessageCircle, Shield: Lock,
};

const generateCustomColors = (primaryColor: string) => {
    const color = tinycolor(primaryColor);
    return {
        primary: primaryColor,
        gradientStart: color.lighten(10).toString(),
        gradientEnd: primaryColor,
    };
};


const ThemeSelector = () => {
    const { theme, themeMode, setThemeMode, setCustomColors } = useTheme();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const options = [
        { key: "light", label: "Light", icon: Sun },
        { key: "dark", label: "Dark", icon: Moon },
        { key: "system", label: "System", icon: Zap },
        // ✨ FIX #2: Key ko lowercase 'custom' karein
        { key: "custom", label: "Custom", icon: PaintBucket },
    ];

    const colorPalette = [
        // Reds & Pinks
        '#EF4444', // Red
        '#EC4899', // Pink

        // Oranges & Yellows
        '#DA9100', // Amber
        '#94B447', // Yellow

        // Greens & Teals
        '#10B981', // Emerald
        '#14B8A6', // Teal

        // Blues
        '#3B82F6', // Blue
        '#0EA5E9', // Sky Blue

        // Purples & Violets (aapke pasand ke)
        '#8B5CF6', // Violet (Original)
        '#A78BFA', // Lighter Violet
        '#7C3AED', // Darker Violet
        '#D946EF', // Fuchsia
    ];

    const handlePress = (key: string) => {
        if (key === 'custom') {
            setIsModalVisible(true);
        } else {
            setThemeMode(key as any); // 'any' cast as key is one of the valid modes
        }
    };

    const handleColorSelect = (color: string) => {
        const newColors = generateCustomColors(color);
        setCustomColors(newColors);
        setThemeMode('custom');
        setIsModalVisible(false);
    };

    return (
        <>
            {/* Theme Selector UI */}
            <View
                style={[
                    tw`flex-row rounded-lg p-1 mt-2`,
                    { backgroundColor: theme.colors.background },
                ]}
            >
                {options.map((opt) => {
                    const isActive = themeMode === opt.key;
                    const Icon = opt.icon;
                    return (
                        <TouchableOpacity
                            key={opt.key}
                            // ✨ FIX #1: Sahi function `handlePress` ko call karein
                            onPress={() => handlePress(opt.key)}
                            style={[
                                tw`flex-1 flex-row items-center justify-center py-2 rounded-lg`,
                                isActive && [tw`shadow`, { backgroundColor: theme.colors.card }],
                            ]}
                        >
                            <Icon size={20} color={isActive ? theme.colors.primary : theme.colors.textSecondary} />
                            <Text
                                style={[
                                    tw`ml-2 text-sm font-medium`,
                                    isActive
                                        ? { color: theme.colors.primary, fontWeight: "bold" }
                                        : { color: theme.colors.textSecondary },
                                ]}
                            >
                                {opt.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Color Picker Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <Pressable
                    style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
                    onPress={() => setIsModalVisible(false)}
                >
                    <Pressable
                        style={[tw`p-6 rounded-2xl w-80`, { backgroundColor: theme.colors.card }]}
                        onPress={() => { }}
                    >
                        <Text style={[tw`text-lg font-bold mb-4`, { color: theme.colors.text }]}>
                            Choose a Custom Color
                        </Text>
                        <View style={tw`flex-row flex-wrap justify-center`}>
                            {colorPalette.map((color) => (
                                <TouchableOpacity
                                    key={color}
                                    style={[
                                        tw`w-14 h-14 rounded-full m-2`,
                                        { backgroundColor: color, borderWidth: 2, borderColor: theme.colors.border }
                                    ]}
                                    onPress={() => handleColorSelect(color)}
                                />
                            ))}
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        </>
    );
};

// --- Main Settings Screen Component ---
export default function AppSettingsScreen() {
    const router = useRouter();
    const { setTabBarVisible } = useTabBar();

    const { theme, themeMode, setThemeMode } = useTheme();
    const { locale, isLoading: isLangLoading } = useLanguage();
    // const { role, changeRole } = useContext(RoleContext); // ✨ FIX 1: Use 'useContext' directly
    const { role, changeRole } = useRole();
    const [notifications, setNotifications] = useState(true);
    const [isLangModalVisible, setLangModalVisible] = useState(false);

    const dispatch = useAppDispatch();
    const { user, isLoading: isAuthLoading } = useAppSelector((state) => state.auth);

    const t = settingsScreenData[locale as 'en' | 'hi' | 'en-HI'];
    useEffect(() => {
        setTabBarVisible(false); // page open → hide tab
        return () => setTabBarVisible(true); // page exit → show tab again
    }, []);

    // ✨ FIX 2: Logout function with confirmation
    const handleLogout = () => {
        Alert.alert(
            t.logout,
            "Are you sure you want to log out?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Log Out", style: "destructive", onPress: () => dispatch(logoutUser()) },
            ]
        );
    };

    if (isAuthLoading || isLangLoading || !t || !user) {
        return <View style={[tw`flex-1 justify-center items-center`, { backgroundColor: theme.colors.background }]}><ActivityIndicator size="large" color={theme.colors.primary} /></View>;
    }

    // ✨ Build sections dynamically from your settingsScreenData file
    const sections = role === 'business' ? [...t.userSections, ...t.businessSections] : t.userSections;

    return (
        <View style={[tw`flex-1 -mt-4`, { backgroundColor: theme.colors.background }]}>
            <ScrollView contentContainerStyle={tw`p-4 pb-12`}>
                <Animated.View entering={FadeInDown.duration(300)}>
                    {/* <Text style={[tw`text-3xl font-bold`, { color: theme.colors.text }]}>Settings</Text> */}

                    {/* Role Switch Card (using your reference design) */}
                    <SectionHeader title={t.role} />
                    <View style={[tw`rounded-xl p-1 flex-row`, { backgroundColor: theme.colors.card }]}>
                        {/* ✅ Teeno roles (user, business, employee) ko add karein */}
                        {(['user', 'business', 'employee'] as const).map((r) => {

                            // ✅ Agar user ka asli role 'user' hai, to use dusre role me switch na karne dein
                            if (user.role === 'user' && r !== 'user') {
                                return null;
                            }

                            return (
                                <TouchableOpacity
                                    key={r}
                                    onPress={() => changeRole(r)} // ✅ 'changeRole' context se call hoga
                                    style={[tw`flex-1 py-2.5 rounded-lg items-center`, role === r && [tw`shadow`, { backgroundColor: theme.colors.background }]]}
                                >
                                    <Text style={[tw`font-semibold capitalize`, { color: role === r ? theme.colors.primary : theme.colors.textSecondary }]}>
                                        {t.roles[r]} {/* Maan rahe hain ki settingsScreenData mein teeno roles ke label hain */}
                                    </Text>
                                </TouchableOpacity>
                            )
                        })}
                    </View>

                    {/* Appearance Section (using your reference design) */}
                    <SectionHeader title={t.appearance} />
                    <View style={[tw`rounded-xl`, { backgroundColor: theme.colors.card }]}>
                        <Item icon={Languages} text={t.language} type="navigate" onPress={() => setLangModalVisible(true)} />
                        <View style={[tw`border-b mx-4`, { borderColor: theme.colors.border }]}></View>

                        <View
                            style={[
                                tw`rounded-xl p-2 mb-4`,
                                { backgroundColor: theme.colors.card },
                            ]}
                        >
                            <View style={tw`flex-row items-center p-3.5 px-3`}>
                                <View style={[tw`w-10 h-10 rounded-lg items-center justify-center`, { backgroundColor: theme.colors.primary + "20" }]}><Palette color={theme.colors.primary} size={20} /></View>
                                <Text style={[tw`flex-1 ml-4 text-base font-medium`, { color: theme.colors.text }]}>{t.theme}</Text>

                            </View>
                            <ThemeSelector />
                        </View>
                    </View>

                    {/* Dynamic Sections from your data file */}
                    {sections.map(section => (
                        <View key={section.title}>
                            <SectionHeader title={section.title} />
                            <View style={[tw`rounded-xl`, { backgroundColor: theme.colors.card }]}>
                                {section.items.map((item, index) => (
                                    <React.Fragment key={item.key}>
                                        <Item
                                            icon={iconMap[item.icon] || User2}
                                            text={item.text}
                                            type={item.type as any}
                                            value={item.key === 'appNotifications' || item.key === 'twoFactorAuth' ? notifications : undefined}
                                            onValueChange={item.key === 'appNotifications' || item.key === 'twoFactorAuth' ? setNotifications : undefined}
                                            onPress={() => item.type === 'navigate' && router.push('/(tabs)/profile/edit-profile')}
                                        />
                                        {index < section.items.length - 1 && <View style={[tw`border-b mx-4`, { borderColor: theme.colors.border }]}></View>}
                                    </React.Fragment>
                                ))}
                            </View>
                        </View>
                    ))}

                    {/* Logout Button (using your reference design) */}
                    <View style={tw`mt-8`}>
                        <TouchableOpacity onPress={handleLogout} style={[tw`flex-row items-center justify-center p-4 rounded-xl`, { backgroundColor: theme.colors.card }]}>
                            <LogOut size={20} color={theme.colors.destructive} />
                            <Text style={[tw`ml-2 text-base font-bold`, { color: theme.colors.destructive }]}>{t.logout}</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                {/* This now uses your own LanguageModal component */}
                <LanguageModal isVisible={isLangModalVisible} onClose={() => setLangModalVisible(false)} />
            </ScrollView>
        </View >
    );
}
// done