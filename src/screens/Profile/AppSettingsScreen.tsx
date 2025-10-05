// src/screens/AppSettingsScreen.tsx

import React, { FC, useMemo, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Switch, Alert, ActivityIndicator, ScrollView, SafeAreaView, Modal, Pressable } from "react-native";
import { ChevronRight, LogOut, Palette, Sun, Moon, User2, Store, Languages, LucideIcon, Bell, Lock, MapPin, Package, CreditCard, Truck, MessageSquare, Users, BookText, MessageCircle, Zap, PaintBucket } from "lucide-react-native";
import tw from "twrnc";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useRouter } from 'expo-router';
import tinycolor from "tinycolor2";

// --- Redux & Contexts ---
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logoutUser } from "../../store/authSlice";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { useRole } from "../../context/RoleContext";
import { useTabBar } from "../../context/TabBarContext";
import { settingsScreenData } from "../../data/settingsScreenData";
import { LanguageModal } from "../../components/LanguageModal";

// --- Helper Components ---
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

const iconMap: { [key: string]: LucideIcon } = { MapPin, User: User2, Lock, Star: Bell, Bell, Truck, Package, Store, MessageSquare, CreditCard, Users, BookText, MessageCircle, Shield: Lock };

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
        { key: "custom", label: "Custom", icon: PaintBucket },
    ];

    const colorPalette = ['#EF4444', '#EC4899', '#DA9100', '#94B447', '#10B981', '#14B8A6', '#3B82F6', '#0EA5E9', '#8B5CF6', '#A78BFA', '#7C3AED', '#D946EF'];

    const handlePress = (key: string) => {
        if (key === 'custom') {
            setIsModalVisible(true);
        } else {
            setThemeMode(key as any);
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
            <View style={[tw`flex-row rounded-lg p-1 mt-2`, { backgroundColor: theme.colors.background }]}>
                {options.map((opt) => {
                    const isActive = themeMode === opt.key;
                    const Icon = opt.icon;
                    return (
                        <TouchableOpacity
                            key={opt.key}
                            onPress={() => handlePress(opt.key)}
                            style={[tw`flex-1 flex-row items-center justify-center py-2 rounded-lg`, isActive && [tw`shadow`, { backgroundColor: theme.colors.card }]]}
                        >
                            <Icon size={20} color={isActive ? theme.colors.primary : theme.colors.textSecondary} />
                            <Text style={[tw`ml-2 text-sm font-medium`, isActive ? { color: theme.colors.primary, fontWeight: "bold" } : { color: theme.colors.textSecondary }]}>
                                {opt.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            <Modal animationType="fade" transparent={true} visible={isModalVisible} onRequestClose={() => setIsModalVisible(false)}>
                <Pressable style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`} onPress={() => setIsModalVisible(false)}>
                    <Pressable style={[tw`p-6 rounded-2xl w-80`, { backgroundColor: theme.colors.card }]} onPress={() => { }}>
                        <Text style={[tw`text-lg font-bold mb-4`, { color: theme.colors.text }]}>Choose a Custom Color</Text>
                        <View style={tw`flex-row flex-wrap justify-center`}>
                            {colorPalette.map((color) => (
                                <TouchableOpacity key={color} style={[tw`w-14 h-14 rounded-full m-2`, { backgroundColor: color, borderWidth: 2, borderColor: theme.colors.border }]} onPress={() => handleColorSelect(color)} />
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
    const { theme } = useTheme();
    const { locale, isLoading: isLangLoading } = useLanguage();
    const { role, changeRole } = useRole();
    const [isLangModalVisible, setLangModalVisible] = useState(false);

    const dispatch = useAppDispatch();
    const { user, isLoading: isAuthLoading, availableRoles } = useAppSelector((state) => state.auth);

    const t = settingsScreenData[locale as 'en' | 'hi' | 'en-HI'];

    useEffect(() => {
        setTabBarVisible(false);
        return () => setTabBarVisible(true);
    }, [setTabBarVisible]);

    const handleLogout = () => {
        Alert.alert(t.logout, "Are you sure you want to log out?", [
            { text: "Cancel", style: "cancel" },
            { text: "Log Out", style: "destructive", onPress: () => dispatch(logoutUser()) },
        ]);
    };

    console.log('availableRoles', availableRoles)

    if (isAuthLoading || isLangLoading || !t || !user) {
        return <View style={[tw`flex-1 justify-center items-center`, { backgroundColor: theme.colors.background }]}><ActivityIndicator size="large" color={theme.colors.primary} /></View>;
    }

    const sections = role === 'business' ? [...(t.userSections || []), ...(t.businessSections || [])] : (t.userSections || []);

    return (
        <View style={[tw`flex-1`, { backgroundColor: theme.colors.background }]}>
            <ScrollView contentContainerStyle={tw`p-4 pb-12`}>
                <Animated.View entering={FadeInDown.duration(300)}>

                    {/* --- Role Switcher --- */}
                    {availableRoles && availableRoles.length > 1 && (
                        <>
                            <SectionHeader title={t.role} />
                            <View style={[tw`rounded-xl p-1 flex-row`, { backgroundColor: theme.colors.card }]}>
                                {availableRoles.map((r) => (
                                    <TouchableOpacity
                                        key={r}
                                        onPress={() => changeRole(r)}
                                        style={[tw`flex-1 py-2.5 rounded-lg items-center`, role === r && [tw`shadow`, { backgroundColor: theme.colors.background }]]}
                                    >
                                        <Text style={[tw`font-semibold capitalize`, { color: role === r ? theme.colors.primary : theme.colors.textSecondary }]}>
                                            {t.roles[r]}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </>
                    )}

                    {/* --- Appearance Section --- */}
                    <SectionHeader title={t.appearance} />
                    <View style={[tw`rounded-xl`, { backgroundColor: theme.colors.card }]}>
                        <Item icon={Languages} text={t.language} type="navigate" onPress={() => setLangModalVisible(true)} />
                        <View style={[tw`border-b mx-4`, { borderColor: theme.colors.border }]} />
                        <View style={[tw`rounded-xl p-2`, { backgroundColor: theme.colors.card }]}>
                            <View style={tw`flex-row items-center py-3.5 px-1`}>
                                <View style={[tw`w-10 h-10 rounded-lg items-center justify-center`, { backgroundColor: theme.colors.primary + "20" }]}>
                                    <Palette color={theme.colors.primary} size={20} />
                                </View>
                                <Text style={[tw`flex-1 ml-4 text-base font-medium`, { color: theme.colors.text }]}>{t.theme}</Text>
                            </View>
                            <ThemeSelector />
                        </View>
                    </View>

                    {/* --- Dynamic Sections --- */}
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
                                            onPress={() => {
                                                if (item.type === 'navigate' && item.key === 'editProfile') {
                                                    router.push('/(tabs)/profile'); // Navigate to ProfileScreen which shows the modal
                                                }
                                                // Handle other navigation items if any
                                            }}
                                        />
                                        {index < section.items.length - 1 && <View style={[tw`border-b mx-4`, { borderColor: theme.colors.border }]} />}
                                    </React.Fragment>
                                ))}
                            </View>
                        </View>
                    ))}

                    {/* --- Logout Button --- */}
                    <View style={tw`mt-8`}>
                        <TouchableOpacity onPress={handleLogout} style={[tw`flex-row items-center justify-center p-4 rounded-xl`, { backgroundColor: theme.colors.card }]}>
                            <LogOut size={20} color={theme.colors.destructive} />
                            <Text style={[tw`ml-2 text-base font-bold`, { color: theme.colors.destructive }]}>{t.logout}</Text>
                        </TouchableOpacity>
                    </View>

                </Animated.View>
                <LanguageModal isVisible={isLangModalVisible} onClose={() => setLangModalVisible(false)} />
            </ScrollView>
        </View>
    );
}