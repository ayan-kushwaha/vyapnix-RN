// src/screens/Catalog/AddItemModal.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Modal } from 'react-native';
import tw from 'twrnc';
import { Package, IndianRupee, Warehouse, Info, X } from 'lucide-react-native';

// Project Imports
import { useTheme } from '@/src/context/ThemeContext';
import { useLanguage } from '@/src/context/LanguageContext';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { createItem, updateItem } from '@/src/store/catalogSlice';
import { addItemData } from '@/src/data/addItemData';
import { CustomInput, SearchableDropdown } from '@/src/components/forms/FormUI';
import { UploadFile } from '@/src/components/upload/uploader'; // ✅ FIX: Ab yeh use hoga
import { ItemTemplate, CatalogItem } from '@/src/store/types';
import { SafeAreaView } from 'react-native-safe-area-context';

type Locale = "en" | "hi" | "en-HI";

interface AddItemModalProps {
    visible: boolean;
    onClose: () => void;
    template: ItemTemplate;
    itemToEdit?: CatalogItem | null;
}

export const AddItemModal: React.FC<AddItemModalProps> = ({ visible, onClose, template, itemToEdit }) => {
    const { theme } = useTheme();
    const { locale } = useLanguage();
    // ✅ FIX: Translation object ko safely access karein
    const t = (addItemData as any)[locale] || addItemData.en;

    const dispatch = useAppAppDispatch();
    const { isLoading } = useAppSelector(s => s.catalog);

    const [formData, setFormData] = useState<any>({ dynamicFields: {} });

    useEffect(() => {
        // ✅ FIX: Initial state ko aache se set karein taaki crash na ho
        const initialDynamicFields = template.fields.reduce((acc, field) => {
            acc[field.fieldName] = itemToEdit?.dynamicFields?.[field.fieldName] || '';
            return acc;
        }, {} as any);

        if (itemToEdit) {
            setFormData({
                name: itemToEdit.name || '',
                description: itemToEdit.description || '',
                // ✅ FIX: pricingOptions ko safely access karein
                sellingPrice: itemToEdit.pricing?.sellingPrice || '',
                stock: itemToEdit.stock || '',
                images: itemToEdit.images || [],
                dynamicFields: initialDynamicFields,
            });
        } else {
            setFormData({
                name: '',
                description: '',
                sellingPrice: '',
                stock: '',
                images: [],
                dynamicFields: {},
            });
        }
    }, [itemToEdit, visible, template]);

    const handleInputChange = (key: string, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleDynamicFieldChange = (fieldName: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            dynamicFields: {
                ...prev.dynamicFields,
                [fieldName]: value,
            }
        }));
    };

    const handleSaveItem = async () => {
        if (!formData.name || !formData.basePrice) {
            return Alert.alert(t.validation.title, t.validation.nameAndPriceRequired);
        }

        const payload = {
            templateId: template._id,
            name: formData.name,
            description: formData.description,
            pricing: { sellingPrice: Number(formData.sellingPrice) },
            stock: Number(formData.stock),
            images: formData.images,
            dynamicFields: formData.dynamicFields,
        };

        try {
            if (itemToEdit) {
                await dispatch(updateItem({ itemId: itemToEdit._id, itemData: payload })).unwrap();
                Alert.alert(t.validation.success, t.validation.updateSuccess);
            } else {
                await dispatch(createItem(payload)).unwrap();
                Alert.alert(t.validation.success, t.validation.saveSuccess);
            }
            onClose();
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Operation failed');
        }
    };

    const renderDynamicFields = () => {
        // ✅ FIX: template ya template.fields undefined ho to crash na ho
        if (!template?.fields) {
            return null;
        }
        return template.fields.map(field => {
            const fieldName = field.fieldName;
            if (field.fieldType === 'dropdown') {
                return (
                    <SearchableDropdown
                        key={fieldName}
                        label={field.label}
                        // ✅ FIX: field.options undefined ho to crash na ho
                        data={(field.options || []).map(opt => ({ label: opt, value: opt }))}
                        selectedValue={formData.dynamicFields?.[fieldName] || ''}
                        onSelect={item => handleDynamicFieldChange(fieldName, item.value)}
                    />
                );
            }
            return (
                <CustomInput
                    key={fieldName}
                    label={field.label}
                    icon={Info}
                    value={String(formData.sellingPrice)} // ✅ FIX
                    onChangeText={v => handleInputChange('sellingPrice', v)} // ✅ FIX

                    keyboardType={field.fieldType === 'number' ? 'numeric' : 'default'}
                />
            );
        });
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={false}>
            <SafeAreaView style={[tw`flex-1`, { backgroundColor: theme.colors.background }]}>
                <ScrollView contentContainerStyle={tw`p-6 pb-20`} keyboardShouldPersistTaps="handled">
                    <View style={tw`flex-row justify-between items-center mb-4`}>
                        <Text style={[tw`text-3xl font-bold`, { color: theme.colors.text }]}>
                            {itemToEdit ? t.editTitle : t.addTitle}
                        </Text>
                        <TouchableOpacity onPress={onClose} style={tw`p-2`}>
                            <X size={28} color={theme.colors.text} />
                        </TouchableOpacity>
                    </View>
                    <Text style={[tw`text-base mt-2 mb-8`, { color: theme.colors.textSecondary }]}>{t.subtitle}</Text>

                    {/* ✅ FIX: UploadFile component ko use karein */}
                    <Text style={[tw`text-sm font-medium mb-2`, { color: theme.colors.textSecondary }]}>{t.itemImages}</Text>
                    <UploadFile
                        avatarUrl={formData.images?.[0] || undefined}
                        onUploadComplete={({ url }) => handleInputChange('images', [url])}
                    />

                    <CustomInput label={t.itemName} icon={Package} value={formData.name} onChangeText={v => handleInputChange('name', v)} placeholder={t.itemNamePlaceholder} />
                    <CustomInput label={t.description} icon={Info} value={formData.description} onChangeText={v => handleInputChange('description', v)} placeholder={t.descriptionPlaceholder} multiline />
                    <CustomInput label={t.price} icon={IndianRupee} value={String(formData.basePrice)} onChangeText={v => handleInputChange('basePrice', v)} keyboardType="numeric" placeholder={t.pricePlaceholder} />
                    <CustomInput label={t.stock} icon={Warehouse} value={String(formData.stock)} onChangeText={v => handleInputChange('stock', v)} keyboardType="numeric" placeholder={t.stockPlaceholder} />

                    {renderDynamicFields()}

                    <TouchableOpacity onPress={handleSaveItem} disabled={isLoading} style={[tw`mt-8 h-14 rounded-xl items-center justify-center`, { backgroundColor: theme.colors.primary, opacity: isLoading ? 0.7 : 1.0 }]}>
                        {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={tw`text-white text-lg font-bold`}>{itemToEdit ? t.updateButton : t.saveButton}</Text>}
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        </Modal>
    );
};