// src/screens/Catalog/CatalogScreen.tsx

import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import tw from 'twrnc';
import { PlusCircle, Search } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/src/context/ThemeContext';
import { useLanguage } from '@/src/context/LanguageContext';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { getMyTemplates, getMyItems } from '@/src/store/catalogSlice';
import { catalogScreenData } from '@/src/data/catalogScreenData';

import { TemplateCard } from './TemplateCard';

type Locale = "en" | "hi" | "en-HI";

export const CatalogScreen = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { theme } = useTheme();
    const { locale } = useLanguage();
    const t = (catalogScreenData as any)[locale] || catalogScreenData.en;
    const [searchQuery, setSearchQuery] = useState('');

    const { templates, items, isLoading } = useAppSelector((state) => state.catalog);

    useEffect(() => {
        dispatch(getMyTemplates());
        dispatch(getMyItems());
    }, [dispatch]);

    const filteredTemplates = useMemo(() => {
        if (!searchQuery) {
            return templates;
        }
        return templates.filter(template =>
            template.templateName.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [templates, searchQuery]);

    const renderEmptyComponent = () => (
        <View style={tw`flex-1 justify-center items-center p-8`}>
            <Text style={[tw`text-xl font-bold`, { color: theme.colors.text }]}>{t.noTemplatesFound}</Text>
            <Text style={[tw`text-center mt-2`, { color: theme.colors.textSecondary }]}>{t.noTemplatesDescription}</Text>
            <TouchableOpacity
                onPress={() => router.push('/catalog/add-template')}
                style={[tw`mt-6 py-3 px-6 rounded-lg`, { backgroundColor: theme.colors.primary as string }]}
            >
                <Text style={tw`text-white font-semibold`}>{t.addTemplate}</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={[tw`flex-1`, { backgroundColor: theme.colors.background }]}>
            {/* ✅ FIX: Header ko FlatList se bahar, yahan render kiya gaya hai */}
            <View style={tw`p-4`}>
                <Text style={[tw`text-3xl font-bold`, { color: theme.colors.text }]}>{t.title}</Text>
                <View style={tw`flex-row items-center mt-4`}>
                    <View style={[tw`flex-1 flex-row items-center p-3 rounded-xl h-14`, { backgroundColor: theme.colors.card }]}>
                        <Search color={theme.colors.textSecondary as string} size={20} />
                        <TextInput
                            style={[tw`flex-1 ml-3 h-full p-0 text-base`, { color: theme.colors.text }]}
                            placeholder={t.searchPlaceholder}
                            placeholderTextColor={theme.colors.textSecondary as string}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                    <TouchableOpacity
                        onPress={() => router.push('/catalog/add-template')}
                        style={tw`ml-3`}
                    >
                        <PlusCircle color={theme.colors.primary as string} size={40} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Ab FlatList yahan se shuru hogi */}
            {isLoading && templates.length === 0 ? (
                <ActivityIndicator size="large" color={theme.colors.primary as string} style={tw`mt-10`} />
            ) : (
                <FlatList
                    data={filteredTemplates}
                    renderItem={({ item }) => <TemplateCard template={item} allItems={items} />}
                    keyExtractor={(item) => item._id}
                    // ✅ FIX: ListHeaderComponent yahan se hata diya gaya hai
                    ListEmptyComponent={!isLoading ? renderEmptyComponent : null}
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }} // Thodi padding add kar di hai
                />
            )}
        </SafeAreaView>
    );
};

///2