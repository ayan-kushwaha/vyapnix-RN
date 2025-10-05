import React, { useEffect, useState, useMemo, JSX } from 'react';
import { View, Text, FlatList, ActivityIndicator, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { ArrowLeft, PlusCircle, Copy, ShoppingCart, Calendar, Repeat, Search, MoreVertical, Edit, Trash2, CheckCircle, Eye, AlertCircle, Briefcase, Package, Factory, Globe, Truck, HandFist } from 'lucide-react-native';

import { useTheme } from '@/src/context/ThemeContext';
import { useLanguage } from '@/src/context/LanguageContext';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { getPublicTemplates, adminDeleteTemplate, getMyTemplates } from '@/src/store/catalogSlice';
import { ItemTemplate } from '@/src/store/types';
import { chooseTemplateData } from '@/src/data/chooseTemplateData';
import { ActionsModal } from '../ActionsModal';
import { TemplatePreviewModal } from './TemplatePreviewModal';
import { useTabBar } from '@/src/context/TabBarContext';
import { LoopingWords } from '@/src/components/ui/LoopingWords';
import { getCategoryLabel, getModelFullNames } from '@/src/data/businessTypesData';

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

// --- StarterTemplateCard ---
const StarterTemplateCard: React.FC<StarterCardProps> = ({
    template,
    onClone,
    cloneButtonText,
    onEdit,
    onDelete,
    onPreview,
    isCloning,
    onNavigateToUpdate,
}) => {
    const { theme } = useTheme();
    const { user } = useAppSelector((state) => state.auth);
    const { templates: userTemplates } = useAppSelector((state) => state.catalog);
    const [isMenuVisible, setMenuVisible] = useState(false);
    const { locale } = useLanguage();
    const t = locale ? locale.slice(0, 2).toLowerCase() : 'en';

    const userCopy = userTemplates.find((t) => (t.originTemplate as ItemTemplate)?._id === template._id);
    const isAlreadyCloned = !!userCopy;
    const isUpdateAvailable =
        isAlreadyCloned &&
        userCopy.originVersion &&
        template.version &&
        userCopy.originVersion < template.version;

    const adminActions = [
        { title: "Edit Template", icon: Edit, onPress: onEdit },
        { title: "Delete Template", icon: Trash2, onPress: onDelete, isDestructive: true },
    ].map((action, index) => ({ ...action, key: `${action.title}-${index}` }));

    const modelIcons: Record<string, any> = {
        "e-commerce": ShoppingCart,
        "booking": Calendar,
        "subscription": Repeat,
        "services": Briefcase,
        "wholesale": Package,
        "manufacturing": Factory,
        "online": Globe,
        "agriculture": Truck,
    };

    const modelTypeNames = getModelFullNames(
        Array.isArray(template.modelType) ? template.modelType : [template.modelType],
        t
    );

    const categoryNames = (Array.isArray(template.categories) ? template.categories : [template.categories]).map(
        (cat: string) => getCategoryLabel(cat, t)
    );

    // --- Helper Component for badge ---
    const Badge: React.FC<{ text: string; color: string; icon?: JSX.Element }> = ({ text, color, icon }) => (
        <View
            style={[
                tw`px-3 py-1 mr-2 mb-2 rounded-full flex-row items-center`,
                { backgroundColor: color + "20" },
            ]}
        >
            {icon && <View style={tw`mr-1`}>{icon}</View>}
            <Text style={[tw`text-xs font-semibold`, { color: theme.colors.text }]} numberOfLines={1}>
                {text}
            </Text>
        </View>
    );

    return (
        <View
            style={[
                tw`rounded-xl p-4 mb-4 shadow-sm`,
                { backgroundColor: theme.colors.card, borderColor: theme.colors.border, borderWidth: 1 },
            ]}
        >
            {/* Actions Modal */}
            <ActionsModal
                visible={isMenuVisible}
                onClose={() => setMenuVisible(false)}
                actions={adminActions}
                title={template.templateName + " " + "v" + template.version}
            />

            {/* Header */}
            <View style={tw`flex-row items-center justify-between mb-3`}>
                <View style={tw`flex-row items-center`}>
                    <View
                        style={[tw`p-3 rounded-full w-5 h-5 mr-3 w-10 h-10`, { backgroundColor: theme.colors.primary + "20" }]}
                    >
                        {/* Shart (Condition) lagayi gayi hai */}
                        {(Array.isArray(template.modelType) && template.modelType.length > 1) ? (
                            // Agar array me 1 se zyada item hain, to ye "dusra icon" dikhega
                            <HandFist size={16} color={theme.colors.primary} />
                        ) : (
                            // Agar nahi, to purana code chalega jo ek icon dikhata hai
                            (Array.isArray(template.modelType) ? template.modelType : [template.modelType]).map((type, idx) => {
                                const Icon = modelIcons[type] || Copy;
                                return (
                                    <Icon key={idx} size={16} color={theme.colors.primary} />
                                );
                            })
                        )}
                    </View>
                    <Text style={[tw`text-lg font-bold`, { color: theme.colors.text }]} numberOfLines={1}>
                        {template.templateName}

                    </Text>
                </View>

                <View style={tw`flex-row items-center`}>
                    {/* <TouchableOpacity onPress={onPreview} style={tw`p-1`}>
                        <Eye size={20} color={theme.colors.textSecondary} />
                    </TouchableOpacity> */}
                    {user?.isAdmin && (
                        <TouchableOpacity onPress={() => setMenuVisible(true)} style={tw`p-1 ml-2`}>
                            <MoreVertical size={20} color={theme.colors.textSecondary} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Model Types & Categories */}
            <Text style={[tw`text-sm font-bold mb-1`, { color: theme.colors.text }]}>Model Types:</Text>
            <View style={tw`flex-row flex-wrap mt-1`}>
                {modelTypeNames.map((name, idx) => (
                    <Badge
                        key={`model-${idx}`}
                        text={name}
                        color={theme.colors.primary}
                    />
                ))}
            </View>
            <Text style={[tw`text-sm font-semibold my-1`, { color: theme.colors.text }]}>Categories:</Text>
            <View style={tw`flex-row flex-wrap mt-1`}>
                {categoryNames.map((name, idx) => (
                    <Badge key={`cat-${idx}`} text={name} color={theme.colors.secondary} />
                ))}
            </View>


            {/* Fields */}
            <Text style={[tw`text-sm font-bold mb-1`, { color: theme.colors.text }]}>Features:</Text>
            <View style={tw`flex-row flex-wrap mt-1`}>
                {template.fields.slice(0, 5).map((field, index) => (
                    <Badge
                        key={field._id || index}
                        text={field.label}
                        color={theme.colors.background}
                    />
                ))}
            </View>

            {/* Clone / Update Button */}
            <TouchableOpacity
                onPress={isUpdateAvailable && userCopy ? () => onNavigateToUpdate(userCopy) : onClone}
                disabled={isAlreadyCloned || isCloning}
                style={[
                    tw`mt-2 w-full flex-row items-center justify-center py-3 rounded-lg`,
                    isAlreadyCloned
                        ? { backgroundColor: theme.colors.secondary + "20" }
                        : isCloning
                            ? { backgroundColor: theme.colors.border }
                            : { backgroundColor: theme.colors.primary },
                ]}
            >
                {isCloning ? (
                    <ActivityIndicator color={theme.colors.textSecondary} />
                ) : isAlreadyCloned && !isUpdateAvailable ? (
                    <CheckCircle size={18} color={theme.colors.secondary} />
                ) : isUpdateAvailable ? (
                    <AlertCircle size={18} color={theme.colors.secondary} />
                ) : (
                    <Copy size={18} color="white" />
                )}
                <Text
                    style={[
                        tw`ml-2 font-bold`,
                        isAlreadyCloned || isUpdateAvailable
                            ? { color: theme.colors.secondary }
                            : isCloning
                                ? { color: theme.colors.textSecondary }
                                : { color: "white" },
                    ]}
                >
                    {isCloning
                        ? "Copying..."
                        : isUpdateAvailable
                            ? "Update Your Cloned Template"
                            : isAlreadyCloned
                                ? "Added & Up-to-date"
                                : cloneButtonText}
                </Text>
            </TouchableOpacity>
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
    const { setTabBarVisible } = useTabBar();

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

    useEffect(() => {
        setTabBarVisible(false); // page open → hide tab
        return () => setTabBarVisible(true); // page exit → show tab again
    }, []);
    const handleClone = async (templateId: string) => {
        setCloningId(templateId);
        await onCloneTemplate(templateId);
        setCloningId(null);
    };

    return (
        <View style={[tw`flex-1 `, { backgroundColor: theme.colors.background }]}>
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
        </View>
    );
};
