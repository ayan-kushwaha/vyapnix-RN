import React, { useState } from 'react';
import { View, ActivityIndicator, Text, Alert } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks'; // ✅ useAppDispatch ko import karein
import { ItemTemplate, CatalogItem } from '@/src/store/types';
import tw from 'twrnc';

import { CatalogListView } from '@/src/screens/Catalog/views/CatalogListView';
import { AddTemplateForm } from '@/src/screens/Catalog/forms/AddTemplateForm';
import { AddItemForm } from '@/src/screens/Catalog/forms/AddItemForm';
import { TaxManagementView } from '@/src/screens/Catalog/views/TaxManagementView';
import { ItemDetailView } from '@/src/screens/Catalog/views/ItemDetailView';
import { deleteItem } from '@/src/store/catalogSlice'; // ✅ deleteItem ko import karein

export default function CatalogTabManager() {
  const [view, setView] = useState<{
    mode: 'list' | 'addTemplate' | 'editTemplate' | 'addItem' | 'editItem' | 'manageTax' | 'itemDetail';
    template?: ItemTemplate | null;
    item?: CatalogItem | null;
  }>({ mode: 'list' });

  const { templates, isLoading } = useAppSelector((state) => state.catalog);
  const dispatch = useAppDispatch(); // ✅ dispatch ko yahan initialize karein

  const findTemplateForItem = (item: CatalogItem): ItemTemplate | undefined => {
    // ✅ FIX: item.template._id wala error theek kiya gaya
    const templateId = typeof item.template === 'string' ? item.template : (item.template as any)?._id;
    if (!templateId) return undefined;
    return templates.find((t) => t._id === templateId);
  };

  if (isLoading && !templates.length) {
    return <View style={tw`flex-1 justify-center items-center`}><ActivityIndicator /></View>;
  }

  switch (view.mode) {
    case 'addTemplate':
      return <AddTemplateForm onClose={() => setView({ mode: 'list' })} />;
    case 'manageTax':
      return <TaxManagementView onClose={() => setView({ mode: 'list' })} />;
    case 'itemDetail':
      if (!view.item) return null;
      const templateForItemDetail = findTemplateForItem(view.item);
      if (!templateForItemDetail) return null;

      return <ItemDetailView
        item={view.item}
        template={templateForItemDetail}
        onClose={() => setView({ mode: 'list' })}
        onEdit={() => setView({ mode: 'editItem', item: view.item })}
        onDelete={() => {
          Alert.alert("Delete Item", `Are you sure you want to delete "${view.item?.name}"?`, [
            { text: "Cancel" },
            {
              text: "Delete", style: "destructive", onPress: () => {
                dispatch(deleteItem(view.item!._id));
                setView({ mode: 'list' });
              }
            }
          ]);
        }}
      />;
    case 'editTemplate':
      if (!view.template) return null;
      return <AddTemplateForm onClose={() => setView({ mode: 'list' })} templateToEdit={view.template} />;

    case 'addItem':
      if (!view.template) return null;
      return <AddItemForm template={view.template} onClose={() => setView({ mode: 'list' })} />;

    case 'editItem':
      if (!view.item) return null;
      const templateForItem = findTemplateForItem(view.item);
      if (!templateForItem) {
        console.error("Template not found for item:", view.item);
        return <View style={tw`flex-1 justify-center items-center`}><Text>Error: Could not find matching template.</Text></View>;
      }

      return <AddItemForm template={templateForItem} itemToEdit={view.item} onClose={() => setView({ mode: 'list' })} />;

    case 'list':
    default:
      return (
        <CatalogListView
          onNavigateToAddTemplate={() => setView({ mode: 'addTemplate' })}
          onNavigateToEditTemplate={(template) => setView({ mode: 'editTemplate', template })}
          onNavigateToAddItem={(template) => setView({ mode: 'addItem', template })}
          onNavigateToEditItem={(item) => setView({ mode: 'editItem', item })}
          onNavigateToTaxManagement={() => setView({ mode: 'manageTax' })}
          onNavigateToItemDetail={(item) => setView({ mode: 'itemDetail', item })}
        />
      );
  }
}

