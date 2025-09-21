import React, { useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator, ScrollView, StyleSheet } from "react-native";
import tw from "twrnc";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Edit, Mail, Phone, MapPin, Building, Settings, Clock, Users, FileText, Briefcase } from "lucide-react-native";

// --- Contexts, Redux & Data ---
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchMyBusiness } from "../../store/businessSlice";
import { profileScreenData } from "../../data/profileScreenData";

// --- Reusable Helper Components (Styled for your design) ---
const InfoCard = ({ children, title, delay = 200 }: { children: React.ReactNode, title: string, delay?: number }) => {
    const { theme } = useTheme();
    return (
        <Animated.View entering={FadeInDown.delay(delay).duration(500)} style={[tw`mx-4 p-4 rounded-xl mb-4`, { backgroundColor: theme.colors.card }]}>
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
                <Text style={[tw`text-base`, { color: theme.colors.textSecondary }]} selectable>{value}</Text>
            </View>
        </View>
    );
};

// --- Main Profile Page Component ---
interface Props {
  onEditProfilePress: () => void;
  onSettingsPress: () => void;
}

export default function UserProfilePage({ onEditProfilePress, onSettingsPress }: Props) {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const { locale } = useLanguage();
  const t = profileScreenData[locale as 'en' | 'hi' | 'en-HI'];

  const { user, isLoading: authLoading } = useAppSelector((state) => state.auth);
  const { business, isLoading: businessLoading } = useAppSelector((state) => state.business);
  
  // Fetch business profile only if the role is business
  useEffect(() => {
    if (user?.role === "business") {
      dispatch(fetchMyBusiness());
    }
  }, [user, dispatch]);

  if (authLoading || !user) {
    return (
      <View style={[tw`flex-1 justify-center items-center`, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // Helper to format address string safely
  const formatAddress = (location: any) => {
    if (!location) return t.user.bioPlaceholder;
    return [location.address, location.landmark, location.city, location.state, location.pincode].filter(Boolean).join(', ');
  }

  return (
    <ScrollView style={[tw`flex-1 mb-14`, { backgroundColor: theme.colors.background }]}>
        {/* ===== PROFILE HEADER (Your Reference Design) ===== */}
        <Animated.View entering={FadeInDown.duration(500)} style={[tw` mx-4 p-4 rounded-xl mb-4`, { backgroundColor: theme.colors.card }]}>
            <View style={tw`flex-row items-center`}>
                <View>
                    <Image
                        source={{ uri: (user.role === 'business' ? business?.logoUrl : user.avatarUrl) || `https://ui-avatars.com/api/?name=${user.fullName}&background=random` }}
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
                    <Text style={[tw`text-2xl font-bold`, { color: theme.colors.text }]}>{user.role === 'business' ? business?.name : user.fullName}</Text>
                    <Text style={[tw`text-sm mt-1`, { color: theme.colors.textSecondary }]} selectable>{user.email}</Text>
                    <Text style={[tw`text-sm`, { color: theme.colors.textSecondary }]}>{user.mobileNumber}</Text>
                </View>

                <TouchableOpacity onPress={onSettingsPress} style={[tw`p-2 rounded-full`, { backgroundColor: theme.colors.background }]}>
                    <Settings size={22} color={theme.colors.textSecondary} />
                </TouchableOpacity>
            </View>
        </Animated.View>

        {/* ===== CONDITIONAL CONTENT BASED ON ROLE ===== */}
        {user.role === 'business' ? (
            <>
                {businessLoading && !business ? <ActivityIndicator style={tw`mt-8`} size="small" color={theme.colors.primary} /> : null}
                {business && (
                    <View>
                        <InfoCard title={t.business.detailsTitle}>
                            <InfoRow icon={FileText} label={t.business.details.description} value={business.description} />
                            <InfoRow icon={Briefcase} label={t.business.details.category} value={business.category} />
                            <InfoRow icon={Phone} label={t.business.details.phone} value={business.contact?.phone} />
                            <InfoRow icon={Mail} label={t.business.details.email} value={business.contact?.email} />
                        </InfoCard>

                        <InfoCard title="Location">
                            <InfoRow icon={MapPin} label={t.business.details.address} value={formatAddress(business.location)} />
                        </InfoCard>
                        
                        <InfoCard title={t.business.operatingHoursTitle}>
                            {business.operatingHours?.map(day => (
                                <View key={day.day} style={tw`flex-row justify-between py-1.5`}>
                                    <Text style={{color: theme.colors.textSecondary}}>{day.day}</Text>
                                    <Text style={{color: day.isOpen ? theme.colors.primary : theme.colors.textSecondary, fontWeight: '500'}}>
                                        {day.isOpen ? `${day.openTime} - ${day.closeTime}` : t.business.time.closed}
                                    </Text>
                                </View>
                            ))}
                        </InfoCard>
                    </View>
                )}
            </>
        ) : (
            <>
                {/* USER-ONLY DETAILS SECTION */}
                <InfoCard title={t.user.bioTitle}>
                    <Text style={[tw`text-sm leading-6`, { color: theme.colors.textSecondary }]}>
                        {user.bio || t.user.bioPlaceholder}
                    </Text>
                </InfoCard>
                <InfoCard title="My Address">
                     <InfoRow icon={MapPin} label={t.business.details.address} value={formatAddress(user.address)} />
                </InfoCard>
            </>
        )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    editButton: {
        position: 'absolute',
        right: -2,
        bottom: -2,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
    }
});