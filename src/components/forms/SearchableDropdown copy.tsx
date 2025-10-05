import React, { FC, useState, useEffect, useMemo } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Modal, Pressable, SectionList } from 'react-native';
import tw from 'twrnc';
import { useTheme } from '../../context/ThemeContext';
import { ChevronDown, Search, X, CheckSquare } from 'lucide-react-native';

// Types ko saaf-saaf define kiya
interface DropdownItem {
    label: string;
    value: string;
    [key: string]: any; // Extra properties jaise modelType ke liye
}

interface SectionData {
    title: string;
    data: DropdownItem[];
}

// ✅ Final Props: Ismein puraane aur naye, dono props hain
interface DropdownProps {
    label: string;
    data: DropdownItem[] | SectionData[];
    subType?: boolean;
    mode?: 'single' | 'multiple';
    // Puraane props (optional)
    value?: string | string[];
    onSelectionChange?: (selection: string | string[]) => void;
    disabled?: boolean;
    // Naye props (optional)
    selectedValue?: string | string[];
    onSelect?: (selection: DropdownItem | string[]) => void;
}

export const SearchableDropdown: FC<DropdownProps> = ({
    label,
    data,
    subType = false,
    mode = 'single',
    value,
    onSelectionChange,
    selectedValue,
    onSelect,
    disabled = false,
}) => {
    const { theme } = useTheme();
    const [visible, setVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [tempSelection, setTempSelection] = useState<string[]>([]);
    const isMulti = mode === 'multiple';

    // ✅ Step 1: "Prop Adapter" - Puraane aur Naye props ko ek jaisa banaya
    // Agar selectedValue hai to use lo, nahi to value ko. Isse dono component call kaam karenge.
    const currentVal = selectedValue ?? value;

    useEffect(() => {
        if (visible && isMulti) {
            setTempSelection(Array.isArray(currentVal) ? currentVal : []);
        }
    }, [visible, currentVal, isMulti]);

    const filteredData = useMemo(() => {
        if (!searchQuery) return data;
        if (subType) {
            return (data as SectionData[])
                .map(section => ({
                    ...section,
                    data: section.data.filter(item =>
                        item.label.toLowerCase().includes(searchQuery.toLowerCase())
                    ),
                }))
                .filter(section => section.data.length > 0);
        } else {
            return (data as DropdownItem[]).filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase()));
        }
    }, [searchQuery, data, subType]);

    const getDisplayText = () => {
        if (isMulti) {
            const count = Array.isArray(currentVal) ? currentVal.length : 0;
            return count > 0 ? `${count} option(s) selected` : 'Select options...';
        }

        const allItems: DropdownItem[] = subType
            ? (data as SectionData[]).flatMap(section => section.data)
            : (data as DropdownItem[]);

        return allItems.find(item => item.value === currentVal)?.label || 'Select an option...';
    };

    // ✅ Step 2: "Smart Handler" - Yeh check karta hai ki konsa function bheja gaya hai
    const handleSingleSelect = (item: DropdownItem) => {
        // Agar 'onSelect' prop bheja hai, to poora 'item' object pass karo
        if (onSelect) {
            onSelect(item);
        }
        // Agar 'onSelectionChange' (puraana wala) bheja hai, to sirf 'item.value' pass karo
        else if (onSelectionChange) {
            onSelectionChange(item.value);
        }

        setVisible(false);
        setSearchQuery('');
    };

    const handleMultiSelectToggle = (valueToToggle: string) => {
        const newSelection = tempSelection.includes(valueToToggle)
            ? tempSelection.filter(item => item !== valueToToggle)
            : [...tempSelection, valueToToggle];
        setTempSelection(newSelection);
    };

    const confirmMultiSelect = () => {
        if (onSelect) {
            onSelect(tempSelection);
        } else if (onSelectionChange) {
            onSelectionChange(tempSelection);
        }
        setVisible(false);
        setSearchQuery('');
    };

    const renderListItem = ({ item }: { item: DropdownItem }) => {
        if (isMulti) {
            const isSelected = tempSelection.includes(item.value);
            return (
                <TouchableOpacity onPress={() => handleMultiSelectToggle(item.value)} style={[tw`flex-row items-center p-4 border-b-2`, { borderColor: theme.colors.border }]}>
                    <View style={[tw`w-6 h-6 rounded border-2 justify-center items-center`, { borderColor: theme.colors.primary as string, backgroundColor: isSelected ? theme.colors.primary as string : 'transparent' }]}>{isSelected && <CheckSquare size={16} color="white" />}</View>
                    <Text style={[tw`ml-4 text-lg`, { color: theme.colors.text }]}>{item.label}</Text>
                </TouchableOpacity>
            );
        }
        return (
            <TouchableOpacity onPress={() => handleSingleSelect(item)} style={[tw`p-4 border-b-2`, { borderColor: theme.colors.border }]}><Text style={[tw`text-lg`, { color: theme.colors.text }]}>{item.label}</Text></TouchableOpacity>
        );
    };

    return (
        <View style={[tw`mb-4`, { opacity: disabled ? 0.6 : 1 }]}>
            <Text style={[tw`text-sm font-medium mb-2`, { color: theme.colors.textSecondary }]}>{label}</Text>
            <TouchableOpacity onPress={disabled ? undefined : () => setVisible(true)} style={[tw`h-14 flex-row items-center justify-between rounded-xl px-4`, { backgroundColor: theme.colors.card, borderWidth: 1, borderColor: theme.colors.border }]}>
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

                        {subType ? (
                            <SectionList
                                style={tw`flex-1`}
                                sections={filteredData as SectionData[]}
                                keyExtractor={(item, index) => item.value + index}
                                renderItem={renderListItem}
                                renderSectionHeader={({ section: { title } }) => (
                                    <Text style={[tw`p-3 text-xl font-bold`, { color: theme.colors.primary, backgroundColor: theme.colors.card }]}>
                                        {title}
                                    </Text>
                                )}
                                stickySectionHeadersEnabled={true}

                            />
                        ) : (
                            <FlatList
                                style={tw`flex-1`}
                                data={filteredData as DropdownItem[]}
                                keyExtractor={(item) => item.value}
                                renderItem={renderListItem}
                            />
                        )}

                        {isMulti && <TouchableOpacity onPress={confirmMultiSelect} style={[tw`mt-4 p-4 rounded-xl`, { backgroundColor: theme.colors.primary }]}><Text style={tw`text-white text-center font-bold text-lg`}>Done</Text></TouchableOpacity>}
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
};
// 