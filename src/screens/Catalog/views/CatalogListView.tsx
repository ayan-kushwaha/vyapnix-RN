import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, FlatList, ActivityIndicator, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { MoreVertical, Search, SlidersHorizontal, Plus } from 'lucide-react-native';

import { useTheme } from '@/src/context/ThemeContext';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { getMyTemplates, getMyItems } from '@/src/store/catalogSlice';
import { catalogScreenData } from '@/src/data/catalogScreenData';
import { ItemTemplate, CatalogItem } from '@/src/store/types';
import { TemplateCard } from './TemplateCard';
import { ActionsModal } from '../ActionsModal';

interface CatalogListViewProps {
    onNavigateToAddTemplate: () => void;
    onNavigateToEditTemplate: (template: ItemTemplate) => void;
    onNavigateToAddItem: (template: ItemTemplate) => void;
    onNavigateToEditItem: (item: CatalogItem) => void;
    onNavigateToTaxManagement: () => void;
    onNavigateToItemDetail: (item: CatalogItem) => void;
}

export const CatalogListView: React.FC<CatalogListViewProps> = ({
    onNavigateToAddTemplate, 
    onNavigateToEditTemplate, 
    onNavigateToAddItem, 
    onNavigateToEditItem, 
    onNavigateToTaxManagement,
    onNavigateToItemDetail // ✅ FIX: Is function ko yahan props se liya gaya hai
}) => {
    const dispatch = useAppDispatch();
    const { theme } = useTheme();
    const t = catalogScreenData.en;
    const [searchQuery, setSearchQuery] = useState('');
    const { templates, items, isLoading } = useAppSelector((state) => state.catalog);
    const [isMenuVisible, setMenuVisible] = useState(false);

    useEffect(() => {
        dispatch(getMyTemplates());
        dispatch(getMyItems());
    }, [dispatch]);

    const filteredTemplates = useMemo(() => {
        if (!searchQuery) return templates;
        return templates.filter(t => t.templateName.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [templates, searchQuery]);

    const menuActions = [
        { title: "Add New Template", icon: Plus, onPress: onNavigateToAddTemplate },
        { title: "Manage Tax Rates", icon: SlidersHorizontal, onPress: onNavigateToTaxManagement }
    ];

    return (
        <SafeAreaView style={[tw`flex-1`, { backgroundColor: theme.colors.background }]}>
            <ActionsModal
                visible={isMenuVisible}
                onClose={() => setMenuVisible(false)}
                actions={menuActions}
                title="Catalog Options"
            />

            <View style={[tw`p-4 border-b`, { borderColor: theme.colors.border }]}>
                <Text style={[tw`text-3xl font-bold`, { color: theme.colors.text }]}>{t.title}</Text>
                <View style={tw`flex-row items-center mt-4`}>
                    <View style={[tw`flex-1 flex-row items-center p-3 rounded-xl h-14`, { backgroundColor: theme.colors.card }]}>
                        <Search color={theme.colors.textSecondary as string} size={20} />
                        <TextInput style={[tw`flex-1 ml-3 h-full p-0 text-base`, { color: theme.colors.text }]} placeholder={t.searchPlaceholder} value={searchQuery} onChangeText={setSearchQuery} />
                    </View>
                    <TouchableOpacity onPress={() => setMenuVisible(true)} style={tw`ml-3 p-2`}>
                        <MoreVertical color={theme.colors.textSecondary as string} size={28} />
                    </TouchableOpacity>
                </View>
            </View>
            <FlatList
                data={filteredTemplates}
                renderItem={({ item }) => (
                    <TemplateCard 
                        template={item} 
                        allItems={items} 
                        onAddItem={() => onNavigateToAddItem(item)} 
                        onEditItem={onNavigateToEditItem} 
                        onEditTemplate={() => onNavigateToEditTemplate(item)}
                        // ✅ FIX: Ab yeh function aage pass ho raha hai
                        onItemPress={onNavigateToItemDetail} 
                    />
                )}
                keyExtractor={(item) => item._id}
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}
                ListEmptyComponent={!isLoading ? (<View style={tw`flex-1 justify-center items-center`}><Text style={{ color: theme.colors.textSecondary as string }}>No templates found.</Text></View>) : null}
            />
        </SafeAreaView>
    );
};

