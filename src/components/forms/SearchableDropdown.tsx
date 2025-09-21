// src/components/forms/SearchableDropdown.tsx

import React, { useState, FC } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Modal } from 'react-native';
import tw from 'twrnc';
import { useTheme } from '../../context/ThemeContext';
import { ChevronDown, Search, X } from 'lucide-react-native';

interface DropdownProps {
    label: string;
    data: { label: string; value: string }[];
    onSelect: (item: { label: string; value: string }) => void;
    selectedValue: string;
}

export const SearchableDropdown: FC<DropdownProps> = ({ label, data, onSelect, selectedValue }) => {
    const { theme } = useTheme();
    const [visible, setVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredData = data.filter(item =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectedLabel = data.find(item => item.value === selectedValue)?.label || 'Select Type';

    return (
        <View style={tw`mb-4`}>
            <Text style={[tw`text-sm font-medium mb-2`, { color: theme.colors.textSecondary }]}>{label}</Text>
            <TouchableOpacity
                onPress={() => setVisible(true)}
                style={[
                    tw`h-14 flex-row items-center justify-between rounded-xl px-4`,
                    { backgroundColor: theme.colors.card, borderWidth: 1, borderColor: theme.colors.border }
                ]}
            >
                <Text style={[tw`text-base`, { color: theme.colors.text }]}>{selectedLabel}</Text>
                <ChevronDown size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>

            <Modal visible={visible} transparent={true} animationType="fade">
                <View style={[tw`flex-1 justify-end`, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
                    <View style={[tw`h-4/5 rounded-t-3xl p-4`, { backgroundColor: theme.colors.background }]}>
                        <TouchableOpacity onPress={() => setVisible(false)} style={tw`absolute top-4 right-4 z-10 p-2`}>
                            <X size={24} color={theme.colors.text} />
                        </TouchableOpacity>
                        
                        <Text style={[tw`text-2xl font-bold mb-4`, { color: theme.colors.text }]}>Select Business Type</Text>
                        
                        <View style={[tw`flex-row items-center rounded-xl px-4 mb-4`, { backgroundColor: theme.colors.card }]}>
                            <Search size={20} color={theme.colors.textSecondary} />
                            <TextInput
                                placeholder="Search..."
                                placeholderTextColor={theme.colors.textSecondary}
                                style={[tw`flex-1 h-12 ml-2 text-base`, { color: theme.colors.text }]}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>

                        <FlatList
                            data={filteredData}
                            keyExtractor={(item) => item.value}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        onSelect(item);
                                        setVisible(false);
                                        setSearchQuery('');
                                    }}
                                    style={tw`p-4 border-b-2 border-gray-200/10`}
                                >
                                    <Text style={[tw`text-lg`, { color: theme.colors.text }]}>{item.label}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
};