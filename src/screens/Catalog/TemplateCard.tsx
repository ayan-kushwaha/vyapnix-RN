// src/screens/Catalog/TemplateCard.tsx

import React, { useState } from 'react'; // <-- useState import karein
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import tw from 'twrnc';
import { MoreVertical, Plus, Trash2, Edit } from 'lucide-react-native'; // Icons import karein
import { useTheme } from '@/src/context/ThemeContext';
import { useLanguage } from '@/src/context/LanguageContext';
import { catalogScreenData } from '@/src/data/catalogScreenData';
import { ItemTemplate, CatalogItem } from '@/src/store/types'; // Apne types import karein
import { AddItemModal } from './AddItemModal';
import { useAppDispatch } from '@/src/store/hooks'; // dispatch ke liye
import { deleteTemplate, deleteItem } from '@/src/store/catalogSlice'; // thunks import karein
import { ActionsModal } from './ActionsModal'; // Naya modal import karein

// Components
import { ItemCard } from './ItemCard';

type Locale = "en" | "hi" | "en-HI";

interface TemplateCardProps {
    template: ItemTemplate;
    allItems: CatalogItem[];
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ template, allItems }) => {
    const { theme } = useTheme();
    const { locale } = useLanguage();
    const t = catalogScreenData[locale as Locale] || catalogScreenData.en;

    const [isModalVisible, setModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);

    // Modal states
    const [isActionsModalVisible, setActionsModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);
    const [isAddItemModalVisible, setAddItemModalVisible] = useState(false);

    // Sirf is template se jude items ko filter karein
    const templateItems = allItems.filter(item => item.templateId === template._id);



    const handleDeleteTemplate = () => {
        Alert.alert(
            "Delete Template",
            `Are you sure you want to delete "${template.templateName}"? This will delete all its items.`,
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => dispatch(deleteTemplate(template._id)) }
            ]
        );
    };

    // Delete Item ka function
    const handleDeleteItem = (item: CatalogItem) => {
        Alert.alert("Delete Item", `Are you sure you want to delete "${item.name}"?`,
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => dispatch(deleteItem(item._id)) }
            ]
        );
    };


    // Menu kiske liye kholna hai - template ya item?
    const openMenuFor = (target: 'template' | CatalogItem) => {
        setSelectedItem(target === 'template' ? null : target);
        setActionsModalVisible(true);
    };

    // Modal ke liye actions define karein
    const modalActions = selectedItem
        ? [ // Item ke liye actions
            { title: 'Edit Item', icon: Edit, onPress: () => { setEditingItem(selectedItem); setAddItemModalVisible(true); } },
            { title: 'Delete Item', icon: Trash2, onPress: () => handleDeleteItem(selectedItem), isDestructive: true },
        ]
        : [ // Template ke liye actions
            { title: 'Edit Template', icon: Edit, onPress: () => { /* TODO */ } },
            { title: 'Delete Template', icon: Trash2, onPress: handleDeleteTemplate, isDestructive: true },
        ];


    // Edit ke liye modal kholne ka function
    const handleEditItem = (item: CatalogItem) => {
        setEditingItem(item);
        setModalVisible(true);
    };

    // Naya item add karne ke liye modal kholne ka function
    const handleAddItem = () => {
        setEditingItem(null); // Edit mode reset karein
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setEditingItem(null); // Modal band hone par state reset karein
    }



    return (
        <>
            <ActionsModal
                visible={isActionsModalVisible}
                onClose={() => setActionsModalVisible(false)}
                actions={modalActions}
                title={selectedItem ? selectedItem.name : template.templateName}
            />
            <ActionsModal
                visible={isAddItemModalVisible}
                onClose={() => setAddItemModalVisible(false)}
                actions={modalActions}
                title={selectedItem ? selectedItem.name : template.templateName}
            />

            <View style={tw`mb-6`}>
                {/* Template Header */}
                <View style={tw`flex-row justify-between items-center px-4 mb-3`}>
                    <Text style={[tw`text-xl font-bold`, { color: theme.colors.text }]}>
                        {template.templateName}
                    </Text>
                    <View style={tw`flex-row items-center`}>
                        <TouchableOpacity
                            onPress={handleAddItem}
                            style={[tw`flex-row items-center p-2 rounded-lg mr-2`, { backgroundColor: theme.colors.primary + '20' }]} // Lighter primary color
                        >
                            <Plus size={16} color={theme.colors.primary} />
                            <Text style={[tw`ml-1 font-semibold`, { color: theme.colors.primary }]}>{t.addItem}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => openMenuFor('template')}>
                            <MoreVertical size={24} color={theme.colors.textSecondary} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Items ki Horizontal List */}
                <FlatList
                    horizontal
                    data={templateItems}
                    renderItem={({ item }) => <ItemCard item={item} onOpenMenu={() => openMenuFor(item)} />} 
                    keyExtractor={(item) => item._id}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={tw`px-4`}
                    ListEmptyComponent={() => (
                        <View style={tw`h-24 justify-center items-center`}>
                            <Text style={{ color: theme.colors.textSecondary }}>No items in this template.</Text>
                        </View>
                    )}
                />
            </View>
        </>
    );
};