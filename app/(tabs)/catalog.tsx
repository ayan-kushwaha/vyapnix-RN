//catalog
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, Alert, TouchableOpacity } from 'react-native'
import { useAppDispatch, useAppSelector } from '@/src/store/hooks'
import { ItemTemplate, CatalogItem } from '@/src/store/types'
import tw from 'twrnc'

import { CatalogListView } from '@/src/screens/Catalog/views/CatalogListView'
import { AddTemplateForm } from '@/src/screens/Catalog/forms/AddTemplateForm'
import { AddItemForm } from '@/src/screens/Catalog/forms/AddItemForm'
import { TaxManagementView } from '@/src/screens/Catalog/views/TaxManagementView'
import { ItemDetailView } from '@/src/screens/Catalog/views/ItemDetailView'
import { ChooseTemplateView } from '@/src/screens/Catalog/views/StarterTemplateCard'
import { deleteItem, cloneTemplate, updateTemplateWithMerge, getMyItems } from '@/src/store/catalogSlice'   // ✅ import kiya

export default function CatalogTabManager() {
  const [view, setView] = useState<{
    mode: 'list' | 'addTemplate' | 'editTemplate' | 'addItem' | 'editItem' | 'manageTax' | 'itemDetail' | 'chooseTemplate' | 'updateTemplate'
    template?: ItemTemplate | null
    item?: CatalogItem | null
  }>({ mode: 'list' })

  const { templates, isLoading, isError, message } = useAppSelector((state) => state.catalog)
  const { user } = useAppSelector((state) => state.auth)
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // डेटा fetch करें और जब fetch खत्म हो जाए, तो isFirstLoad को false कर दें
    dispatch(getMyItems())
      .unwrap()
      .finally(() => {
        setIsFirstLoad(false);
      });
  }, [dispatch]);

  const findTemplateForItem = (item: CatalogItem): ItemTemplate | undefined => {
    const templateId = typeof item.template === 'string' ? item.template : (item.template as any)?._id
    return templates.find(t => t._id === templateId)
  }

  if (!isLoading && templates.length === 0) {
    // Agar load ho gaya aur data empty hai
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text>No templates found</Text>
      </View>
    );
  }

  switch (view.mode) {
    case 'chooseTemplate':
      return <ChooseTemplateView
        onClose={() => setView({ mode: 'list' })}
        onGoToBlankForm={() => setView({ mode: 'addTemplate' })}
        onCloneTemplate={async (templateId) => {
          await dispatch(cloneTemplate(templateId))
          setView({ mode: 'list' })
        }}
        onEditTemplate={(template) => setView({ mode: 'editTemplate', template: template })}
        onNavigateToUpdate={(template) => setView({ mode: 'updateTemplate', template })}
      />


    case 'updateTemplate':
      if (!view.template) return null;

      const handleUpdate = async () => {
        try {
          // ✅ loader दिखेगा जब तक dispatch चल रहा है
          await dispatch(updateTemplateWithMerge(view.template!._id)).unwrap();
          Alert.alert("✅ Success", "Template updated successfully.");

          // ✅ Update के बाद auto close + list पर redirect
          setView({ mode: 'list' });

        } catch (err: any) {
          const msg = err?.data?.message || err?.message || "Update Failed";
          Alert.alert("❌ Error", msg);
        }
      };

      return (
        <View style={tw`flex-1 justify-center items-center p-4`}>
          <Text style={tw`text-lg text-gray-400 text-center font-bold`}>
            An update is available for "{view.template.templateName}".
          </Text>
          <Text style={tw`text-center my-2 text-gray-500`}>
            Updating will add new fields from the starter template to your cloned version.
            Your custom fields will not be affected. Are you sure?
          </Text>

          {isLoading ? (
            <ActivityIndicator size="large" color="green" style={tw`mt-4`} />
          ) : (
            <>
              <TouchableOpacity
                onPress={handleUpdate}
                style={tw`bg-green-500 p-3 rounded-lg mt-4 w-full items-center`}
              >
                <Text style={tw`text-white font-bold`}>Yes, Update Now</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setView({ mode: 'list' })}
                style={tw`mt-2 p-2 w-full items-center`}
              >
                <Text style={tw`text-gray-500`}>Maybe Later</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      );

    case 'addTemplate': return <AddTemplateForm onClose={() => setView({ mode: 'list' })} />
    case 'manageTax': return <TaxManagementView onClose={() => setView({ mode: 'list' })} />
    case 'itemDetail':
      if (!view.item) return null
      const templateForItemDetail = findTemplateForItem(view.item)
      if (!templateForItemDetail) return null
      return <ItemDetailView
        item={view.item}
        template={templateForItemDetail}
        onClose={() => setView({ mode: 'list' })}
        onEdit={() => setView({ mode: 'editItem', item: view.item })}
        onDelete={() => {
          Alert.alert("Delete Item", `Are you sure?`, [
            { text: "Cancel" },
            {
              text: "Delete",
              style: "destructive",
              onPress: () => { dispatch(deleteItem(view.item!._id)); setView({ mode: 'list' }) }
            }
          ])
        }}
      />
    case 'editTemplate':
      if (!view.template) return null
      return <AddTemplateForm
        onClose={() => {
          if (view.template?.isPublic) {
            setView({ mode: 'chooseTemplate' })
          } else {
            setView({ mode: 'list' })
          }
        }}
        templateToEdit={view.template}
        isAdminMode={!!(view.template.isPublic && user?.isAdmin)}
      />
    case 'addItem':
      if (!view.template) return null
      return <AddItemForm template={view.template} onClose={() => setView({ mode: 'list' })} />
    case 'editItem':
      if (!view.item) return null
      const templateForItem = findTemplateForItem(view.item)
      if (!templateForItem) {
        return <View style={tw`flex-1 justify-center items-center`}>
          <Text>Error: Could not find matching template.</Text>
        </View>
      }
      return <AddItemForm template={templateForItem} itemToEdit={view.item} onClose={() => setView({ mode: 'list' })} />
    case 'list':
    default:
      return (
        <CatalogListView
          onNavigateToChooseTemplate={() => setView({ mode: 'chooseTemplate' })}
          onNavigateToAddTemplate={() => setView({ mode: 'addTemplate' })}
          onNavigateToEditTemplate={(template) => setView({ mode: 'editTemplate', template })}
          onNavigateToUpdateTemplate={(template) => setView({ mode: 'updateTemplate', template })}
          onNavigateToAddItem={(template) => setView({ mode: 'addItem', template })}
          onNavigateToEditItem={(item) => setView({ mode: 'editItem', item })}
          onNavigateToTaxManagement={() => setView({ mode: 'manageTax' })}
          onNavigateToItemDetail={(item) => setView({ mode: 'itemDetail', item })}
        />
      )
  }
}
