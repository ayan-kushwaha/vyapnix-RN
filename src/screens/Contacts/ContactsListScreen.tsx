// src / sreeens /Contacts / contactsListScreen.tsx
import React, { useMemo, FC } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { ArrowUpRight, ArrowDownLeft, Phone, MessageSquare, IndianRupee } from 'lucide-react-native';
import tw from 'twrnc';
import { useRouter } from 'expo-router';
import { formatDistanceToNowStrict } from 'date-fns';

import { useTheme } from '../../context/ThemeContext';
import { mockContacts, Contact, Transaction } from '../../data/contactsData';

// --- Helper: get latest activity (call/sms/transaction) ---
const getLatestActivity = (contact: Contact) => {
  const lastInteraction = contact.interactionHistory?.[0];
  const lastTransaction = contact.transactions?.sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  )[0];

  if (!lastInteraction && !lastTransaction) return null;

  if (lastInteraction && (!lastTransaction || lastInteraction.time >= lastTransaction.date)) {
    return { type: lastInteraction.type, data: lastInteraction, time: lastInteraction.time };
  }

  return { type: 'transaction', data: lastTransaction, time: lastTransaction!.date };
};

// --- Contact Card ---
const ContactCard: FC<{ item: Contact; onPress: () => void }> = ({ item, onPress }) => {
  const { theme } = useTheme();
  const latestActivity = getLatestActivity(item);

  // Split role style into bg + text
  const roleTag = {
    client: { bg: tw`bg-blue-500/20`, text: tw`text-blue-500` },
    business: { bg: tw`bg-green-500/20`, text: tw`text-green-500` },
    employee: { bg: tw`bg-purple-500/20`, text: tw`text-purple-500` },
    user: { bg: tw`bg-gray-500/20`, text: tw`text-gray-500` },
  }[item.role];

  const ActivitySnippet = () => {
    if (!latestActivity) return null;

    let icon, text;
    let textColor = theme.colors.textSecondary;

    switch (latestActivity.type) {
      case 'call':
        icon = <Phone size={14} color={theme.colors.textSecondary} />;
        text = latestActivity.data.direction === 'outgoing' ? 'Outgoing call' : 'Incoming call';
        break;
      case 'sms':
        icon = <MessageSquare size={14} color={theme.colors.textSecondary} />;
        text = latestActivity.data.text;
        break;
      case 'transaction':
        const tx = latestActivity.data as Transaction;
        icon = (
          <IndianRupee
            size={14}
            color={tx.type === 'credit' ? '#22c55e' : theme.colors.textSecondary}
          />
        );
        text =
          tx.type === 'credit'
            ? `₹${tx.paidAmount} received`
            : `₹${tx.items.reduce((s, i) => s + i.price, 0)} spent`;
        textColor = tx.type === 'credit' ? '#22c55e' : theme.colors.textSecondary;
        break;
    }

    return (
      <View style={tw`flex-row items-center mt-1`}>
        {icon}
        <Text style={[tw`text-xs ml-1.5`, { color: textColor }]} numberOfLines={1}>
          {text}
        </Text>
      </View>
    );
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        tw`flex-row items-center p-3 rounded-2xl mb-2 mx-4`,
        { backgroundColor: theme.colors.card },
      ]}
    >
      {/* Avatar */}
      <View>
        <Image source={{ uri: item.avatarUrl }} style={tw`w-14 h-14 rounded-full`} />
        {item.isOnline && (
          <View
            style={[
              tw`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 bg-green-500`,
              { borderColor: theme.colors.card },
            ]}
          />
        )}
      </View>

      {/* Name + role + activity */}
      <View style={tw`  ml-4`}>
        <Text
          style={[tw`text-base text-sm font-medium`, { color: theme.colors.text }]}
          numberOfLines={1}
        >
          {item.name}
        </Text>
        {/* <ActivitySnippet /> */}
          <View style={[tw`py-0.5 px-2   rounded-full mt-1.5`, roleTag.bg]}>
            <Text style={[tw`text-xs font-bold capitalize`, roleTag.text]}>{item.role}</Text>
          </View>
      </View>

      {/* Right side: time + role */}
      {/* {latestActivity && (
        <View style={tw`items-end `}>
          <Text style={[tw`text-xs`, { color: theme.colors.textSecondary }]}>
            {formatDistanceToNowStrict(latestActivity.time, { addSuffix: true })}
          </Text>
        </View>
      )} */}
    </TouchableOpacity>
  );
};

// --- Contacts List Screen ---
export default function ContactsListScreen({
  searchQuery,
  selectedFilter,
}: {
  searchQuery: string;
  selectedFilter: string;
}) {
  const router = useRouter();

  const filteredContacts = useMemo(() => {
    let contacts = [...mockContacts].sort((a, b) => {
      const timeA = getLatestActivity(a)?.time.getTime() || 0;
      const timeB = getLatestActivity(b)?.time.getTime() || 0;
      return timeB - timeA;
    });

    if (selectedFilter !== 'all' && selectedFilter !== 'recent') {
      contacts =
        selectedFilter === 'favorites'
          ? contacts.filter((c) => c.isFavorite)
          : contacts.filter((c) => c.role === selectedFilter);
    }

    if (searchQuery) {
      contacts = contacts.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.phone.includes(searchQuery)
      );
    }

    return contacts;
  }, [selectedFilter, searchQuery]);

  return (
    <FlatList
      data={filteredContacts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ContactCard item={item} onPress={() => router.push(`/contact-detail?id=${item.id}`)} />
      )}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 150, paddingTop: 8 }}
    />
  );
}
