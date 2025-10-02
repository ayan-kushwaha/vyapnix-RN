// TemplateCard
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import tw from 'twrnc';
import { MoreVertical, Plus, Trash2, Edit, AlertCircle } from 'lucide-react-native';
import { useAppDispatch } from '@/src/store/hooks';
import { deleteTemplate, deleteItem } from '@/src/store/catalogSlice';
import { useTheme } from '@/src/context/ThemeContext';
import { ItemTemplate, CatalogItem } from '@/src/store/types';
import { ActionsModal } from '../ActionsModal';
import { ItemCard } from './ItemCard';

interface TemplateCardProps {
  template: ItemTemplate;
  allItems: CatalogItem[];
  onAddItem: () => void;
  onEditItem: (item: CatalogItem) => void;
  onEditTemplate: () => void;
  onItemPress: (item: CatalogItem) => void;
  onNavigateToUpdate: (template: ItemTemplate) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ template, allItems, onAddItem, onEditItem, onEditTemplate, onItemPress, onNavigateToUpdate }) => {
  const dispatch = useAppDispatch();
  const { theme } = useTheme();
  const [isActionsModalVisible, setActionsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);

  const templateItems = allItems.filter(item => {
    if (typeof item.template === 'string') return item.template === template._id;
    return (item.template as any)?._id === template._id;
  });

  // ✅ FIX: Ab `originTemplate` `ItemTemplate` type par मौजूद hai, isliye error nahi aayega
  const isUpdateAvailable =
    template.originTemplate &&
    typeof template.originTemplate === 'object' && // Check karein ki originTemplate populate hua hai
    template.originVersion &&
    template.originTemplate.version &&
    template.originVersion < template.originTemplate.version;


  const handleDelete = () => {
    if (selectedItem) {
      Alert.alert("Delete Item", `Are you sure you want to delete "${selectedItem.name}"?`,
        [{ text: "Cancel", style: "cancel" }, { text: "Delete", style: "destructive", onPress: () => dispatch(deleteItem(selectedItem._id)) }]
      );
    } else {
      Alert.alert("Delete Template", `Are you sure? This will delete all items inside.`,
        [{ text: "Cancel", style: "cancel" }, { text: "Delete", style: "destructive", onPress: () => dispatch(deleteTemplate(template._id)) }]
      );
    }
  };
  const openMenuFor = (target: 'template' | CatalogItem) => {
    setSelectedItem(target === 'template' ? null : target);
    setActionsModalVisible(true);
  };

  const modalActions = [
    { title: 'Edit Template', icon: Edit, onPress: onEditTemplate },
    ...(isUpdateAvailable ? [{ title: 'Update Available', icon: AlertCircle, onPress: () => onNavigateToUpdate(template) }] : []),
    { title: 'Delete Template', icon: Trash2, onPress: handleDelete, isDestructive: true }
  ];

  return (
    <>
      <ActionsModal
        visible={isActionsModalVisible}
        onClose={() => setActionsModalVisible(false)}
        actions={modalActions}
        title={`Actions for '${template.templateName}'`}
      />
      <View style={tw`my-3`}>
        <View style={tw`flex-row justify-between items-center px-4 mb-3`}>
          <View style={tw`flex-1 mr-2`}>
            <Text style={[tw`text-xl font-bold`, { color: theme.colors.text }]}>{template.templateName}</Text>
            {isUpdateAvailable && (
              <TouchableOpacity onPress={() => onNavigateToUpdate(template)} style={tw`mt-1 self-start`}>
                <View style={[tw`flex-row items-center py-1 px-2 rounded-full`, { backgroundColor: theme.colors.secondary + '20' }]}>
                  <AlertCircle size={12} color={theme.colors.secondary as string} />
                  <Text style={[tw`text-xs font-bold ml-1`, { color: theme.colors.secondary as string }]}>Update Available</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
          <View style={tw`flex-row items-center`}>
            <TouchableOpacity onPress={onAddItem} style={[tw`flex-row items-center p-2 rounded-lg mr-2`, { backgroundColor: theme.colors.primary + '20' }]}>
              <Plus size={16} color={theme.colors.primary as string} /><Text style={[tw`ml-1 font-semibold`, { color: theme.colors.primary as string }]}>Add Item</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openMenuFor('template')}><MoreVertical size={24} color={theme.colors.textSecondary as string} /></TouchableOpacity>
          </View>
        </View>
        <FlatList
          horizontal
          data={templateItems}
          renderItem={({ item }) => <ItemCard item={item} onPress={() => onItemPress(item)} onOpenMenu={() => openMenuFor(item)} />}
          keyExtractor={(item) => item._id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={tw`px-4`}
          ListEmptyComponent={() => (<View style={tw`h-24 w-40 justify-center items-center`}><Text style={{ color: theme.colors.textSecondary as string }}>No items yet.</Text></View>)}
        />
      </View>
    </>
  );
};
//