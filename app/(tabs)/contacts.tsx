import React, { useState } from 'react';
import { View, Text, SafeAreaView, TextInput, Modal, Pressable, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import { MoreVertical, Search, UserPlus, Shield, Archive } from 'lucide-react-native';

import { useTheme } from '../../src/context/ThemeContext';
import { useLanguage } from '../../src/context/LanguageContext';
import { contactsScreenData } from '../../src/data/contactsData';
import ContactsListScreen from '../../src/screens/Contacts/ContactsListScreen';
import { FilterButtons } from '../../src/components/ui/FilterButtons';

export default function ContactsTab() {
    const { theme } = useTheme();
    const { locale } = useLanguage();
    const t = contactsScreenData[locale as 'en' | 'hi' | 'en-HI'] || contactsScreenData.en;

    const [searchQuery, setSearchQuery] = useState('');
    const [menuVisible, setMenuVisible] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('all'); // Filter ki state yahan hai

    const menuOptions = [
        { label: t.headerMenu.addContact, icon: UserPlus },
        { label: t.headerMenu.blockedList, icon: Shield },
        { label: t.headerMenu.archivedList, icon: Archive },
    ];

    return (
        <SafeAreaView style={[tw`flex-1`, { backgroundColor: theme.colors.background }]}>
            {/* Header */}
            <View style={tw`flex-row items-center justify-between px-4 h-16`}>
                <View style={[tw`flex-row items-center h-12 flex-1 mr-4 rounded-full px-3`, { backgroundColor: theme.colors.card }]}>
                    <Search size={20} color={theme.colors.textSecondary} />
                    <TextInput
                        style={[tw`flex-1 ml-2 text-base`, { color: theme.colors.text }]}
                        placeholder={t.searchPlaceholder}
                        placeholderTextColor={theme.colors.textSecondary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
                <TouchableOpacity onPress={() => setMenuVisible(true)}>
                    <MoreVertical size={24} color={theme.colors.text} />
                </TouchableOpacity>
            </View>

            {/* Filter Buttons */}
            <FilterButtons filters={t.filters} selectedFilter={selectedFilter} onFilterPress={setSelectedFilter} />

            {/* Contact List */}
            {/* ✨ FIX: Yahan 'selectedFilter' prop ko pass kar diya gaya hai */}
            <ContactsListScreen searchQuery={searchQuery} selectedFilter={selectedFilter} />

            {/* Header Menu Modal */}
            <Modal transparent visible={menuVisible} onRequestClose={() => setMenuVisible(false)} animationType="fade">
                <Pressable style={tw`flex-1 bg-black/60`} onPress={() => setMenuVisible(false)}>
                    <View style={[tw`absolute top-20 right-4 p-2 rounded-xl w-56`, { backgroundColor: theme.colors.card }]}>
                        {menuOptions.map((opt) => (
                            <TouchableOpacity key={opt.label} style={tw`flex-row items-center p-3 rounded-lg`} onPress={() => setMenuVisible(false)}>
                                <opt.icon size={20} color={theme.colors.text} />
                                <Text style={[tw`ml-3`, { color: theme.colors.text }]}>{opt.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Pressable>
            </Modal>
        </SafeAreaView>
    );
}

