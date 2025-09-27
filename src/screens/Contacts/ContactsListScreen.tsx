import React, { useEffect, FC } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import tw from 'twrnc';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getMyContacts, Contact } from '../../store/contactSlice';

// --- Contact Card (Uses real data now) ---
const ContactCard: FC<{ item: Contact; onPress: () => void }> = ({ item, onPress }) => {
  const { theme } = useTheme();

  const roleTag = {
    client: { bg: tw`bg-blue-500/20`, text: tw`text-blue-500` },
    business: { bg: tw`bg-green-500/20`, text: tw`text-green-500` },
    employee: { bg: tw`bg-purple-500/20`, text: tw`text-purple-500` },
    user: { bg: tw`bg-gray-500/20`, text: tw`text-gray-500` },
  }[item.role];

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[tw`flex-row items-center p-3 rounded-2xl mb-2 mx-4`, { backgroundColor: theme.colors.card }]}
    >
      <Image 
        source={{ uri: item.contactUser.avatarUrl || `https://ui-avatars.com/api/?name=${item.contactUser.fullName}` }} 
        style={tw`w-14 h-14 rounded-full`} 
      />
      <View style={tw`flex-1 ml-4`}>
        <Text style={[tw`text-base font-bold`, { color: theme.colors.text }]} numberOfLines={1}>
          {item.contactUser.fullName}
        </Text>
        <View style={[tw`py-0.5 px-2 rounded-full mt-1.5 self-start`, roleTag.bg]}>
          <Text style={[tw`text-xs font-bold capitalize`, roleTag.text]}>{item.role}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// --- Contacts List Screen ---
export default function ContactsListScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { theme } = useTheme();
  const { contacts, isLoading, isError, message } = useAppSelector((state) => state.contacts);

  useEffect(() => {
    // Fetch contacts when the screen loads
    dispatch(getMyContacts());
  }, [dispatch]);

  if (isLoading) {
    return <ActivityIndicator style={tw`mt-10`} size="large" color={theme.colors.primary} />;
  }

  if (isError) {
    return <Text style={[tw`text-center mt-10`, { color: theme.colors.destructive }]}>{message}</Text>;
  }

  return (
    <FlatList
      data={contacts}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <ContactCard 
          item={item} 
          onPress={() => router.push(`/contact-detail?contactId=${item._id}`)} 
        />
      )}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 150, paddingTop: 8 }}
      ListEmptyComponent={<Text style={[tw`text-center mt-10`, { color: theme.colors.textSecondary }]}>No contacts found.</Text>}
    />
  );
}