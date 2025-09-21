import React, { FC } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import tw from 'twrnc';
import { useTheme } from '../../context/ThemeContext';

type Filter = { key: string; label: string; icon: FC<any>; };
type FilterButtonsProps = {
    filters: Filter[];
    selectedFilter: string;
    onFilterPress: (key: string) => void;
};

export const FilterButtons: FC<FilterButtonsProps> = ({ filters, selectedFilter, onFilterPress }) => {
    const { theme } = useTheme();
    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={tw`px-4 py-2`}>
            {filters.map(filter => {
                const isActive = selectedFilter === filter.key;
                const Icon = filter.icon;
                return (
                    <TouchableOpacity
                        key={filter.key}
                        onPress={() => onFilterPress(filter.key)}
                        style={[
                            tw`items-center justify-center w-20 h-20 rounded-2xl mr-2`,
                            { backgroundColor: isActive ? theme.colors.primary : theme.colors.card }
                        ]}
                    >
                        <Icon size={24} color={isActive ? 'white' : theme.colors.primary} />
                        <Text style={[tw`mt-1 text-xs font-semibold`, { color: isActive ? 'white' : theme.colors.textSecondary }]}>
                            {filter.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
};