import React, { FC } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Users, Star, Clock } from 'lucide-react-native';
import tw from 'twrnc';
import { useTheme } from '../../context/ThemeContext';

type Tab = { key: string; label: string; icon: FC<any>; };
type CustomTabsProps = {
    tabs: Tab[];
    selectedTab: string;
    onTabPress: (key: string) => void;
};

export const CustomTabs: FC<CustomTabsProps> = ({ tabs, selectedTab, onTabPress }) => {
    const { theme } = useTheme();
    return (
        <View style={[tw`flex-row rounded-xl p-1 my-4`, { backgroundColor: theme.colors.background }]}>
            {tabs.map(tab => {
                const isActive = selectedTab === tab.key;
                const Icon = tab.icon;
                return (
                    <TouchableOpacity
                        key={tab.key}
                        onPress={() => onTabPress(tab.key)}
                        style={[tw`flex-1 flex-row items-center justify-center py-2.5 rounded-lg`, isActive && { backgroundColor: theme.colors.card }]}
                    >
                        <Icon size={18} color={isActive ? theme.colors.primary : theme.colors.textSecondary} />
                        <Text style={[tw`ml-2 text-sm font-medium`, { color: isActive ? theme.colors.primary : theme.colors.textSecondary }]}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};
