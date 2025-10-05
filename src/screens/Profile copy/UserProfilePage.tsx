// UserProfilePage.tsx
import React, { useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator, ScrollView, StyleSheet } from "react-native";
import tw from "twrnc";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Edit, Mail, Phone, MapPin, FileText, Briefcase } from "lucide-react-native";

// --- Contexts, Redux & Data ---
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchMyBusiness } from "../../store/businessSlice";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { profileFormData } from "@/src/data/profileFormData";
import { useRole } from "@/src/context/RoleContext";

// --- Reusable Helper Components ---
const InfoCard = ({ children, title, delay = 200 }: { children: React.ReactNode, title: string, delay?: number }) => {
    const { theme } = useTheme();
    return (
        <Animated.View
            entering={FadeInDown.delay(delay).duration(500)}
            style={[tw`mx-4 p-4 rounded-xl mb-4`, { backgroundColor: theme.colors.card }]}
        >
            <Text style={[tw`text-lg font-bold mb-3`, { color: theme.colors.text }]}>{title}</Text>
            {children}
        </Animated.View>
    );
};

const InfoRow = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value?: string | null }) => {
    const { theme } = useTheme();
    if (!value) return null;
    return (
        <View style={tw`flex-row items-start mb-3`}>
            <Icon size={16} color={theme.colors.primary} style={tw`mt-1`} />
            <View style={tw`flex-1 ml-3`}>
                <Text style={[tw`text-sm font-semibold capitalize`, { color: theme.colors.text }]}>{label}</Text>
                <Text style={[tw`text-base`, { color: theme.colors.textSecondary }]} selectable>
                    {value}
                </Text>
            </View>
        </View>
    );
};

// --- Main Profile Page ---
interface Props {
    onEditProfilePress: () => void;
    onSettingsPress?: () => void;
}

export default function UserProfilePage({ onEditProfilePress }: Props) {
    const { theme } = useTheme();
    const dispatch = useAppDispatch();
    const { locale } = useLanguage();
    const t = profileFormData[locale as "en" | "hi" | "en-HI"];
    const router = useRouter();
    const { role, changeRole } = useRole();

    const { user, isLoading: authLoading } = useAppSelector((state) => state.auth);
    const { business, isLoading: businessLoading } = useAppSelector((state) => state.business);

    // Fetch business profile if role is business
    useEffect(() => {
        if (role === "business") {
            dispatch(fetchMyBusiness());
        }
    }, [user, role, dispatch]);

    if (authLoading || !user) {
        return (
            <View style={[tw`flex-1 justify-center items-center`, { backgroundColor: theme.colors.background }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    // Helper to format address for user (non-business)
    const formatAddress = (location: any) => {
        if (!location) return t.fields.address;
        return [location.landmark, location.city, location.state, location.pincode].filter(Boolean).join(", ");
    };

    const displayTime12hr = (time24: string | null) => {
        if (!time24) return "N/A";
        const [h, m] = time24.split(":");
        return new Date(1970, 0, 1, +h, +m).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    return (
        <SafeAreaView style={[tw`flex-1 -mt-4`, { backgroundColor: theme.colors.background }]}>
            <ScrollView style={[tw`flex-1 mb-14`, { backgroundColor: theme.colors.background }]}>
                {/* ===== PROFILE HEADER ===== */}
                <Animated.View
                    entering={FadeInDown.duration(500)}
                    style={[tw`mx-4 p-4 rounded-xl mb-4`, { backgroundColor: theme.colors.card }]}
                >
                    <View style={tw`flex-row items-center`}>
                        <View>
                            <Image
                                source={{
                                    uri:
                                        (user.role === "business" ? business?.logoUrl : user.avatarUrl) ||
                                        `https://ui-avatars.com/api/?name=${user.fullName}&background=random`,
                                }}
                                style={tw`w-20 h-20 rounded-full border-2 border-gray-300`}
                            />
                            <TouchableOpacity
                                onPress={onEditProfilePress}
                                style={[styles.editButton, { backgroundColor: theme.colors.primary, borderColor: theme.colors.card }]}
                            >
                                <Edit size={14} color="white" />
                            </TouchableOpacity>
                        </View>

                        <View style={tw`flex-1 ml-4`}>
                            <Text style={[tw`text-2xl font-bold`, { color: theme.colors.text }]}>
                                {user.role === "business" ? business?.name : user.fullName}
                            </Text>
                            <Text style={[tw`text-sm mt-1`, { color: theme.colors.textSecondary }]} selectable>
                                {user.email}
                            </Text>
                            <Text style={[tw`text-sm`, { color: theme.colors.textSecondary }]}>{user.mobileNumber}</Text>
                        </View>
                    </View>
                </Animated.View>

                {/* ===== BUSINESS PROFILE ===== */}
                {user.role === "business" ? (
                    <>
                        {businessLoading && !business ? (
                            <ActivityIndicator style={tw`mt-8`} size="small" color={theme.colors.primary} />
                        ) : null}

                        {business && (
                            <View>
                                <InfoCard title={t.business?.detailsTitle || "Business Details"}>
                                    <InfoRow icon={Briefcase} label={t.fields.category} value={business.category} />
                                    <InfoRow icon={Phone} label={t.fields.phone} value={business.contact?.phone} />
                                    <InfoRow icon={Mail} label={t.fields.email} value={business.contact?.email} />
                                    <InfoRow icon={FileText} label={t.fields.description} value={business.description} />
                                </InfoCard>

                                <InfoCard title={t.fields.address}>
                                    <InfoRow icon={MapPin} label={t.fields.address} value={business.location?.address} />
                                    <InfoRow icon={MapPin} label={t.fields.landmark} value={business.location?.landmark} />
                                    <InfoRow icon={MapPin} label={t.fields.city} value={business.location?.city} />
                                    <InfoRow icon={MapPin} label={t.fields.state} value={business.location?.state} />
                                    <InfoRow icon={MapPin} label={t.fields.pincode} value={business.location?.pincode} />
                                </InfoCard>

                                <InfoCard title={t.business?.operatingHoursTitle || "Operating Hours"}>
                                    {business.operatingHours?.map((day) => (
                                        <View key={day.day} style={tw`flex-row justify-between py-1.5`}>
                                            <Text style={{ color: theme.colors.textSecondary }}>{day.day}</Text>
                                            <Text
                                                style={{
                                                    color: day.isOpen ? theme.colors.primary : theme.colors.textSecondary,
                                                    fontWeight: "500",
                                                }}
                                            >
                                                {day.isOpen
                                                    ? `${displayTime12hr(day.openTime)} - ${displayTime12hr(day.closeTime)}`
                                                    : t.business?.time.closed || "Closed"}
                                            </Text>
                                        </View>
                                    ))}
                                </InfoCard>
                            </View>
                        )}
                    </>
                ) : (
                    <>
                        {/* ===== USER PROFILE ===== */}
                        <InfoCard title={t.user?.bioTitle || "About Me"}>
                            <Text style={[tw`text-sm leading-6`, { color: theme.colors.textSecondary }]}>
                                {user.bio || t.user?.bioPlaceholder || "No bio available."}
                            </Text>
                        </InfoCard>

                        <InfoCard title={t.fields.address}>
                            <InfoRow icon={MapPin} label={t.fields.address} value={formatAddress(user.address)} />
                        </InfoCard>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    editButton: {
        position: "absolute",
        right: -2,
        bottom: -2,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
    },
});
