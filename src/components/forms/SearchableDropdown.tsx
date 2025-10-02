import React, { useState, FC, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Modal, Pressable } from 'react-native';
import tw from 'twrnc';
import { useTheme } from '../../context/ThemeContext';
import { ChevronDown, Search, X, CheckSquare, Square } from 'lucide-react-native';

// ✅ Nayi, powerful props
interface DropdownProps {
    label: string;
    data: { label: string; value: string }[];
    mode?: 'single' | 'multiple';
    value: string | string[]; // Single ke liye string, multiple ke liye array
    onSelectionChange: (selection: string | string[]) => void;
}

export const SearchableDropdown: FC<DropdownProps> = ({ label, data, mode = 'single', value, onSelectionChange }) => {
    const { theme } = useTheme();
    const [visible, setVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    // ✅ Multi-select ke liye temporary state
    const [tempSelection, setTempSelection] = useState<string[]>([]);
    const isMulti = mode === 'multiple';

    useEffect(() => {
        // Modal khulte waqt temporary state ko set karein
        if (visible && isMulti) {
            setTempSelection(Array.isArray(value) ? value : []);
        }
    }, [visible, value, isMulti]);

    const filteredData = data.filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase()));

    const getDisplayText = () => {
        if (isMulti) {
            const count = Array.isArray(value) ? value.length : 0;
            return count > 0 ? `${count} option(s) selected` : 'Select options...';
        }
        return data.find(item => item.value === value)?.label || 'Select an option...';
    };

    const handleSingleSelect = (item: { label: string; value: string }) => {
        onSelectionChange(item.value);
        setVisible(false);
        setSearchQuery('');
    };
    
    const handleMultiSelectToggle = (selectedValue: string) => {
        const newSelection = tempSelection.includes(selectedValue)
            ? tempSelection.filter(item => item !== selectedValue)
            : [...tempSelection, selectedValue];
        setTempSelection(newSelection);
    };

    const confirmMultiSelect = () => {
        onSelectionChange(tempSelection);
        setVisible(false);
        setSearchQuery('');
    };

    return (
        <View style={tw`mb-4`}>
            <Text style={[tw`text-sm font-medium mb-2`, { color: theme.colors.textSecondary }]}>{label}</Text>
            <TouchableOpacity onPress={() => setVisible(true)} style={[tw`h-14 flex-row items-center justify-between rounded-xl px-4`, { backgroundColor: theme.colors.card, borderWidth: 1, borderColor: theme.colors.border }]}>
                <Text style={[tw`text-base`, { color: theme.colors.text }]} numberOfLines={1}>{getDisplayText()}</Text>
                <ChevronDown size={20} color={theme.colors.textSecondary as string} />
            </TouchableOpacity>

            <Modal visible={visible} transparent={true} animationType="fade">
                <Pressable style={[tw`flex-1 justify-end`, { backgroundColor: 'rgba(0,0,0,0.6)' }]} onPress={() => setVisible(false)}>
                    <Pressable style={[tw`h-4/5 rounded-t-3xl p-4`, { backgroundColor: theme.colors.background }]}>
                        <View style={tw`flex-row justify-between items-center mb-4`}>
                            <Text style={[tw`text-2xl font-bold`, { color: theme.colors.text }]}>{label}</Text>
                            <TouchableOpacity onPress={() => setVisible(false)} style={tw`p-2`}><X size={24} color={theme.colors.text} /></TouchableOpacity>
                        </View>
                        <View style={[tw`flex-row items-center rounded-xl px-4 mb-4`, { backgroundColor: theme.colors.card }]}><Search size={20} color={theme.colors.textSecondary as string} /><TextInput placeholder="Search..." placeholderTextColor={theme.colors.textSecondary as string} style={[tw`flex-1 h-12 ml-2 text-base`, { color: theme.colors.text }]} value={searchQuery} onChangeText={setSearchQuery} /></View>
                        
                        <FlatList
                            data={filteredData}
                            keyExtractor={(item) => item.value}
                            renderItem={({ item }) => {
                                if (isMulti) {
                                    const isSelected = tempSelection.includes(item.value);
                                    return (
                                        <TouchableOpacity onPress={() => handleMultiSelectToggle(item.value)} style={[tw`flex-row items-center p-4 border-b-2`, {borderColor: theme.colors.border}]}>
                                            <View style={[tw`w-6 h-6 rounded border-2 justify-center items-center`, {borderColor: theme.colors.primary as string, backgroundColor: isSelected ? theme.colors.primary as string : 'transparent'}]}>{isSelected && <CheckSquare size={16} color="white" />}</View>
                                            <Text style={[tw`ml-4 text-lg`, { color: theme.colors.text }]}>{item.label}</Text>
                                        </TouchableOpacity>
                                    );
                                }
                                return (
                                    <TouchableOpacity onPress={() => handleSingleSelect(item)} style={[tw`p-4 border-b-2`, {borderColor: theme.colors.border}]}><Text style={[tw`text-lg`, { color: theme.colors.text }]}>{item.label}</Text></TouchableOpacity>
                                );
                            }}
                        />
                        {isMulti && <TouchableOpacity onPress={confirmMultiSelect} style={[tw`mt-4 p-4 rounded-xl`, {backgroundColor: theme.colors.primary}]}><Text style={tw`text-white text-center font-bold text-lg`}>Done</Text></TouchableOpacity>}
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
};