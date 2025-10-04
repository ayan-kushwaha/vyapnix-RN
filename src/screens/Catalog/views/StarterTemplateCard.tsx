import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, FlatList, ActivityIndicator, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { ArrowLeft, PlusCircle, Copy, ShoppingCart, Calendar, Repeat, Search, MoreVertical, Edit, Trash2, CheckCircle, Eye, AlertCircle } from 'lucide-react-native';

import { useTheme } from '@/src/context/ThemeContext';
import { useLanguage } from '@/src/context/LanguageContext';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { getPublicTemplates, adminDeleteTemplate, getMyTemplates } from '@/src/store/catalogSlice';
import { ItemTemplate } from '@/src/store/types';
import { chooseTemplateData } from '@/src/data/chooseTemplateData';
import { ActionsModal } from '../ActionsModal';
import { TemplatePreviewModal } from './TemplatePreviewModal';

// --- Interface ---
interface ChooseTemplateViewProps {
    onClose: () => void;
    onGoToBlankForm: () => void;
    onCloneTemplate: (templateId: string) => Promise<void>;
    onEditTemplate: (template: ItemTemplate) => void;
    onNavigateToUpdate: (template: ItemTemplate) => void;
}

// --- Helper ---
const getIconForModel = (modelType: string) => {
    switch (modelType) {
        case 'e-commerce': return ShoppingCart;
        case 'booking': return Calendar;
        case 'subscription': return Repeat;
        default: return Copy;
    }
};

// ✅ Props typing
interface StarterCardProps {
    template: ItemTemplate;
    onClone: () => void;
    cloneButtonText: string;
    onEdit: () => void;
    onDelete: () => void;
    onPreview: () => void;
    isCloning: boolean;
    onNavigateToUpdate: (template: ItemTemplate) => void;
}

// --- Card Component ---
const StarterTemplateCard: React.FC<StarterCardProps> = ({ template, onClone, cloneButtonText, onEdit, onDelete, onPreview, isCloning, onNavigateToUpdate }) => {
    const { theme } = useTheme();
    const { user } = useAppSelector(state => state.auth);
    const { templates: userTemplates } = useAppSelector(state => state.catalog);
    const ModelIcon = getIconForModel(template.modelType);
    const [isMenuVisible, setMenuVisible] = useState(false);

    const userCopy = userTemplates.find(t => (t.originTemplate as ItemTemplate)?._id === template._id);
    const isAlreadyCloned = !!userCopy;
    const isUpdateAvailable = isAlreadyCloned && userCopy.originVersion && template.version && userCopy.originVersion < template.version;

    const adminActions = [
        { title: "Edit Template", icon: Edit, onPress: onEdit },
        { title: "Delete Template", icon: Trash2, onPress: onDelete, isDestructive: true }
    ].map((action, index) => ({ ...action, key: `${action.title}-${index}` })); // ✅ unique key ensured

    return (
        <View style={[tw`rounded-xl p-3 mb-4`, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, borderWidth: 1 }]}>
            <ActionsModal
                visible={isMenuVisible}
                onClose={() => setMenuVisible(false)}
                actions={adminActions}
                title={template.templateName}
            />
            <View style={tw`flex-row items-start mb-2`}>
                <View style={[tw`p-3 rounded-full mr-4`, { backgroundColor: theme.colors.primary + '20' }]}>
                    <ModelIcon size={22} color={theme.colors.primary as string} />
                </View>
                <View style={tw`flex-1`}>
                    <Text style={[tw`text-lg font-bold`, { color: theme.colors.text }]}>
                        {template.templateName}
                    </Text>

                    <View style={tw`flex-row flex-wrap mt-1`}>
                        {Array.isArray(template.modelType) ? (
                            template.modelType.map((type, idx) => (
                                <View
                                    key={idx}
                                    style={[
                                        tw`px-2 py-1 mr-2 mb-2 rounded-full`,
                                        { backgroundColor: theme.colors.background }
                                    ]}
                                >
                                    <Text style={[tw`text-xs capitalize`, { color: theme.colors.textSecondary }]}>
                                        {type}
                                    </Text>
                                </View>
                            ))
                        ) : (
                            <View
                                style={[
                                    tw`px-2 py-1 rounded-full self-start`,
                                    { backgroundColor: theme.colors.background }
                                ]}
                            >
                                <Text style={[tw`text-xs capitalize`, { color: theme.colors.textSecondary }]}>
                                    {template.modelType}
                                </Text>
                            </View>
                        )}
                        <Text style={[tw`text-xs mt-1`, { color: theme.colors.textSecondary }]}>
                            v{template.version || 1}
                        </Text>
                    </View>

                </View>

                <View style={tw`flex-row items-center -mt-1`}>
                    <TouchableOpacity onPress={onPreview} style={tw`p-1`}>
                        <Eye size={20} color={theme.colors.textSecondary as string} />
                    </TouchableOpacity>
                    {user?.isAdmin && (
                        <TouchableOpacity onPress={() => setMenuVisible(true)} style={tw`p-1 ml-1 -mr-2`}>
                            <MoreVertical size={20} color={theme.colors.textSecondary as string} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* ✅ unique keys in map */}
            <View style={tw`flex-row flex-wrap mt-3`}>
                {template.fields.slice(0, 5).map((field, index) => (
                    <View key={field._id || field.fieldName || index} style={[tw`py-1 px-3 rounded-full mr-2 mb-2`, { backgroundColor: theme.colors.background }]}>
                        <Text style={[tw`text-xs font-medium`, { color: theme.colors.textSecondary }]}>{field.label}</Text>
                    </View>
                ))}
            </View>

            {isUpdateAvailable && userCopy ? (
                <TouchableOpacity
                    onPress={() => onNavigateToUpdate(userCopy)}
                    activeOpacity={0.7}
                    style={[tw`mt-4 w-full flex-row items-center justify-center py-3 rounded-lg`, { backgroundColor: theme.colors.secondary + '20' }]}
                >
                    <AlertCircle size={18} color={theme.colors.secondary as string} />
                    <Text style={[tw`font-bold ml-2`, { color: theme.colors.secondary as string }]}>Update Your Cloned Template</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    onPress={onClone}
                    disabled={isAlreadyCloned || isCloning}
                    activeOpacity={0.7}
                    style={[
                        tw`mt-4 w-full flex-row items-center justify-center py-3 rounded-lg`,
                        isAlreadyCloned
                            ? { backgroundColor: theme.colors.secondary + '20' }
                            : isCloning
                                ? { backgroundColor: theme.colors.border }
                                : { backgroundColor: theme.colors.primary as string }
                    ]}
                >
                    {isCloning
                        ? <ActivityIndicator color={theme.colors.textSecondary as string} />
                        : isAlreadyCloned
                            ? <CheckCircle size={18} color={theme.colors.secondary as string} />
                            : <Copy size={18} color="white" />}
                    <Text
                        style={[
                            tw`font-bold ml-2`,
                            isAlreadyCloned
                                ? { color: theme.colors.secondary as string }
                                : isCloning
                                    ? { color: theme.colors.textSecondary }
                                    : { color: 'white' }
                        ]}
                    >
                        {isCloning ? 'Copying...' : isAlreadyCloned ? 'Added & Up-to-date' : cloneButtonText}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

// --- Main View ---
export const ChooseTemplateView: React.FC<ChooseTemplateViewProps> = ({ onClose, onGoToBlankForm, onCloneTemplate, onEditTemplate, onNavigateToUpdate }) => {
    const { theme } = useTheme();
    const { locale } = useLanguage();
    const t = (chooseTemplateData as any)[locale] || chooseTemplateData.en;
    const dispatch = useAppDispatch();
    const { publicTemplates, isLoading } = useAppSelector(state => state.catalog);
    const [searchQuery, setSearchQuery] = useState('');
    const [cloningId, setCloningId] = useState<string | null>(null);
    const [previewTemplate, setPreviewTemplate] = useState<ItemTemplate | null>(null);

    useEffect(() => {
        dispatch(getPublicTemplates());
        dispatch(getMyTemplates());
    }, [dispatch]);

    const filteredTemplates = useMemo(() => {
        if (!searchQuery) return publicTemplates;
        return publicTemplates.filter(template => template.templateName.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [searchQuery, publicTemplates]);

    const handleDeleteTemplate = (template: ItemTemplate) => {
        Alert.alert(
            `Delete "${template.templateName}"?`,
            "This will permanently delete this public template.",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => dispatch(adminDeleteTemplate(template._id)) }
            ]
        );
    };

    const handleClone = async (templateId: string) => {
        setCloningId(templateId);
        await onCloneTemplate(templateId);
        setCloningId(null);
    };

    return (
        <SafeAreaView style={[tw`flex-1 mb-16`, { backgroundColor: theme.colors.background }]}>
            <TemplatePreviewModal visible={!!previewTemplate} onClose={() => setPreviewTemplate(null)} template={previewTemplate} />

            {/* ✅ Header wrapped in single View */}
            <View style={[tw`flex-row w-full items-center border-b`, { borderColor: theme.colors.border }]}>
                <TouchableOpacity onPress={onClose} style={tw`p-2`}>
                    <ArrowLeft size={24} color={theme.colors.text as string} />
                </TouchableOpacity>
                <Text style={[tw`text-lg w-full font-bold ml-2`, { color: theme.colors.text }]}>{t.title}</Text>
            </View>

            <FlatList
                data={filteredTemplates}
                keyExtractor={item => item._id}
                renderItem={({ item }) => (
                    <StarterTemplateCard
                        template={item}
                        onClone={() => handleClone(item._id)}
                        cloneButtonText={t.cloneButton}
                        onEdit={() => onEditTemplate(item)}
                        onDelete={() => handleDeleteTemplate(item)}
                        onPreview={() => setPreviewTemplate(item)}
                        isCloning={isLoading && cloningId === item._id}
                        onNavigateToUpdate={onNavigateToUpdate}
                    />
                )}
                contentContainerStyle={tw`p-2`}
                ListHeaderComponent={
                    <View key="header">
                        <View style={[tw`flex-row items-center p-3 rounded-xl h-14 mb-6`, { backgroundColor: theme.colors.card }]}>
                            <Search color={theme.colors.textSecondary as string} size={20} />
                            <TextInput
                                style={[tw`flex-1 ml-3 h-full p-0 text-base`, { color: theme.colors.text }]}
                                placeholder="Search templates..."
                                placeholderTextColor={theme.colors.textSecondary}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={onGoToBlankForm}
                                style={[tw`flex-row items-center justify-center p-1 rounded-lg border-2 border-dashed`, { borderColor: theme.colors.primary as string }]}
                            >
                                <PlusCircle size={22} color={theme.colors.primary as string} />
                            </TouchableOpacity>
                        </View>
                        <Text style={[tw`text-center mb-4`, { color: theme.colors.textSecondary }]}>{t.subtitle}</Text>
                    </View>
                }
                ListEmptyComponent={
                    <View style={tw`mt-10 items-center`}>
                        <Text style={[tw`text-lg font-bold`, { color: theme.colors.text }]}>No Templates Found</Text>
                    </View>
                }
                ListFooterComponent={isLoading && !cloningId ? <ActivityIndicator style={tw`my-4`} /> : null}
            />
        </SafeAreaView>
    );
};
