import React, { FC } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import tw from 'twrnc';
import { useTheme } from '../../context/ThemeContext';

type Filter = { key: string; label: string; };
type RoleFilterTabsProps = {
    filters: Filter[];
    selectedFilter: string;
    onFilterPress: (key: string) => void;
};

export const RoleFilterTabs: FC<RoleFilterTabsProps> = ({ filters, selectedFilter, onFilterPress }) => {
    const { theme } = useTheme();
    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={tw`py-2`}>
            {filters.map(filter => {
                const isActive = selectedFilter === filter.key;
                return (
                    <TouchableOpacity
                        key={filter.key}
                        onPress={() => onFilterPress(filter.key)}
                        style={[
                            tw`py-2 px-4 rounded-full mr-2 border-2`,
                            { 
                                backgroundColor: isActive ? theme.colors.primary : 'transparent',
                                borderColor: isActive ? theme.colors.primary : theme.colors.border,
                            }
                        ]}
                    >
                        <Text style={[tw`font-semibold capitalize`, { color: isActive ? 'white' : theme.colors.textSecondary }]}>
                            {filter.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
};
