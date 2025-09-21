import React from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import tw from "twrnc";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Edit, LogOut, Mail, Phone, MapPin, Briefcase, Clock, Globe } from "lucide-react-native";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { profileScreenData } from "../../data/profileScreenData";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logoutUser } from "../../store/authSlice";

type Locale = "en" | "hi" | "en-HI";

interface Props {
  onEditProfilePress: () => void;
}

// Chhota component jo ek detail line dikhata hai
const DetailRow = ({ icon: Icon, text, color }: { icon: any, text: string | undefined | null, color: string }) => {
      const { theme } = useTheme();
    if (!text) return null;
    return (
        <View style={tw`flex-row items-start mb-3`}>
            <Icon size={18} color={color} style={tw`mt-1`} />
            <Text style={[tw`ml-3 flex-1 text-base`, { color: theme.colors.textSecondary }]} selectable>{text}</Text>
        </View>
    );
};

export default function BusinessProfilePage({ onEditProfilePress }: Props) {
  const { theme } = useTheme();
  const { locale } = useLanguage();
  const t = profileScreenData[locale as Locale] || profileScreenData.en;
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state) => state.auth);

  if (isLoading || !user || !user.businessProfile) {
    return (
      <View style={[tw`flex-1 justify-center items-center`, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const business = user.businessProfile;
  const location = business.location;
  const contact = business.contact;

  const fullAddress = [location?.address, location?.city, location?.state, location?.pincode].filter(Boolean).join(', ');

  return (
    <ScrollView style={[tw`flex-1`, { backgroundColor: theme.colors.background }]}>
      {/* Business Header */}
      <Animated.View
        entering={FadeInDown.delay(200).duration(500)}
        style={[tw`m-4 p-4 rounded-xl`, { backgroundColor: theme.colors.card }]}
      >
        <View style={tw`flex-row items-center`}>
            <Image
              source={{ uri: business.logoUrl || "https://placehold.co/400x400/cccccc/ffffff?text=Logo" }}
              style={tw`w-20 h-20 rounded-full mr-4 border-2 border-gray-300`}
            />
            <View style={tw`flex-1`}>
              <Text style={[tw`text-2xl font-bold`, { color: theme.colors.text }]}>{business.name}</Text>
              <Text style={[tw`text-base mt-1`, { color: theme.colors.textSecondary }]}>{business.category}</Text>
            </View>
        </View>
        <Text style={[tw`text-base mt-4`, { color: theme.colors.textSecondary }]}>{business.description}</Text>
      </Animated.View>

      {/* Action Buttons */}
      <Animated.View entering={FadeInDown.delay(300).duration(500)} style={tw`flex-row mx-4 mb-4`}>
        <TouchableOpacity onPress={onEditProfilePress} style={[tw`flex-1 h-12 rounded-lg items-center justify-center mr-2`, { backgroundColor: theme.colors.primary }]}>
          <View style={tw`flex-row items-center`}><Edit size={16} color="white" /><Text style={tw`text-white font-bold ml-2`}>{t.common.editProfile}</Text></View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => dispatch(logoutUser())} style={[tw`flex-1 h-12 rounded-lg items-center justify-center ml-2`, { backgroundColor: theme.colors.card }]}>
          <View style={tw`flex-row items-center`}><LogOut size={16} color={String(theme.colors.destructive)} /><Text style={[tw`font-bold ml-2`, { color: String(theme.colors.destructive) }]}>{t.common.logout}</Text></View>
        </TouchableOpacity>
      </Animated.View>
      
      {/* Details Section */}
      <Animated.View entering={FadeInDown.delay(400).duration(500)} style={[tw`mx-4 p-4 rounded-xl mb-4`, { backgroundColor: theme.colors.card }]}>
        <Text style={[tw`text-lg font-bold mb-4`, { color: theme.colors.text }]}>{t.business.detailsTitle}</Text>
        <DetailRow icon={MapPin} text={fullAddress} color={theme.colors.primary} />
        <DetailRow icon={Phone} text={contact?.phone} color={theme.colors.primary} />
        <DetailRow icon={Mail} text={contact?.email} color={theme.colors.primary} />
        <DetailRow icon={Briefcase} text={business.businessModel} color={theme.colors.primary} />
      </Animated.View>

    </ScrollView>
  );
}
