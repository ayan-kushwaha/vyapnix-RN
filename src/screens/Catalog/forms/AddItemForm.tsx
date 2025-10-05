import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { Package, IndianRupee, Info, ArrowLeft, Warehouse, Tag, Globe, Lock, Type, File } from 'lucide-react-native';

import { useTheme } from '@/src/context/ThemeContext';
import { useLanguage } from '@/src/context/LanguageContext';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { createItem, updateItem } from '@/src/store/catalogSlice';
import { getTaxes } from '@/src/store/taxSlice';
import { addItemData } from '@/src/data/addItemData';
import { CustomInput, SearchableDropdown, SwitchInput, DateTimeInput, CheckboxInput } from '@/src/components/forms/FormUI';
import { ImageUploader } from '@/src/components/upload/ImageUploader';
import { ItemTemplate, CatalogItem } from '@/src/store/types';
import { useTabBar } from '@/src/context/TabBarContext';

type Locale = "en" | "hi" | "en-HI";
interface AddItemFormProps { onClose: () => void; template: ItemTemplate; itemToEdit?: CatalogItem | null; }
type FormData = { name: string; description: string; basePrice: string; stock: string; images: string[]; tags: string; isActive: boolean; dynamicFields: { [key: string]: any }; taxId: string | null; };

export const AddItemForm: React.FC<AddItemFormProps> = ({ onClose, template, itemToEdit }) => {
    const { theme } = useTheme();
    const { locale } = useLanguage();
    const { setTabBarVisible } = useTabBar();
    const t = (addItemData as any)[locale as Locale] || addItemData.en;
    const dispatch = useAppDispatch();
    const { isLoading } = useAppSelector(s => s.catalog);
    const { taxes } = useAppSelector(s => s.tax);
    const [formData, setFormData] = useState<FormData>({ name: '', description: '', basePrice: '', stock: '', images: [], tags: '', isActive: true, dynamicFields: {}, taxId: null });

    useEffect(() => { dispatch(getTaxes()); }, [dispatch]);
    useEffect(() => {
        setFormData({
            name: itemToEdit?.name || '',
            description: itemToEdit?.description || '',
            basePrice: String((itemToEdit as any)?.pricingOptions?.[0]?.basePrice || ''),
            stock: String(itemToEdit?.stock || ''),
            images: itemToEdit?.images || [],
            tags: itemToEdit?.tags?.join(', ') || '',
            isActive: itemToEdit?.isActive ?? true,
            dynamicFields: itemToEdit?.dynamicFields || {},
            taxId: (itemToEdit?.tax as any)?._id || null,
        });
    }, [itemToEdit]);

    const priceDetails = useMemo(() => {
        const basePrice = parseFloat(formData.basePrice) || 0;
        const selectedTax = taxes.find(tax => tax._id === formData.taxId);
        if (!selectedTax || !basePrice) return { base: basePrice, taxAmount: 0, total: basePrice, taxName: 'No Tax' };
        const taxAmount = (basePrice * selectedTax.rate) / 100;
        return { base: basePrice, taxAmount, total: basePrice + taxAmount, taxName: `${selectedTax.name} (${selectedTax.rate}%)` };
    }, [formData.basePrice, formData.taxId, taxes]);

    const handleInputChange = (key: keyof FormData, value: any) => setFormData(p => ({ ...p, [key]: value }));
    const handleDynamicFieldChange = (fieldName: string, value: any) => setFormData(p => ({ ...p, dynamicFields: { ...p.dynamicFields, [fieldName]: value } }));

    const handleSaveItem = async () => {
        // --- ✅ FIX START: Added comprehensive validation ---
        if (!formData.name || !formData.basePrice || formData.images.length === 0) {
            return Alert.alert(t.validation.title, t.validation.nameAndPriceRequired);
        }


        // 2. Validate all dynamic fields marked as required in the template
        for (const field of template.fields) {
            if (field.validation?.isRequired) {
                const value = formData.dynamicFields[field.fieldName];
                const isValueMissing = value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0);


            }
        }
        // --- ✅ FIX END ---

        const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        const payload: Partial<CatalogItem> = {
            template: template._id,
            name: formData.name,
            description: formData.description,
            pricingOptions: [{ label: "Standard Price", basePrice: Number(formData.basePrice), cycle: 'one-time', taxAmount: 0, totalPrice: 0 }],
            stock: Number(formData.stock),
            images: formData.images,
            tags: tagsArray,
            isActive: formData.isActive,
            dynamicFields: formData.dynamicFields,
            tax: formData.taxId || undefined,
        };
        try {
            if (itemToEdit) { await dispatch(updateItem({ itemId: itemToEdit._id, itemData: payload })).unwrap(); }
            else { await dispatch(createItem(payload)).unwrap(); }
            onClose();
        } catch (error: any) { Alert.alert('Error', error.message); }
    };


    const taxOptions: { label: string, value: string | null }[] = useMemo(() => [{ label: "No Tax", value: null }, ...taxes.map(tax => ({ label: tax.name, value: tax._id }))], [taxes]);

    const renderCustomerField = (field: ItemTemplate['fields'][0]) => {
        const fieldName = field.fieldName;
        const value = formData.dynamicFields[fieldName];

        // Display value logic
        const displayValue = (() => {
            switch (field.fieldType) {
                case 'textarea':
                case 'file':
                case 'currency':
                case 'text':
                case 'number':
                    return value ? String(value) : '';
                case 'switch':
                case 'checkbox':
                    return value ? 'Yes' : 'No';
                case 'date':
                    return value ? new Date(value).toLocaleDateString() : '';
                case 'time':
                    return value ? new Date(value).toLocaleTimeString() : '';
                case 'dropdown-single':
                    return value || '-';
                case 'dropdown-multi':
                    return Array.isArray(value) ? value.join(', ') : '';
                default:
                    return value ? String(value) : '';
            }
        })();

        // Field type for display
        const typeName = (() => {
            switch (field.fieldType) {
                case 'textarea': return 'Text';
                case 'file': return 'File';
                case 'currency': return 'Number';
                case 'text': return 'Text';
                case 'number': return 'Number';
                case 'switch': return 'Switch Option';
                case 'checkbox': return 'checkbox (Yas/No)';
                case 'date': return 'Date';
                case 'time': return 'Time';
                case 'dropdown-single': return 'Single Select';
                case 'dropdown-multi': return 'Multi Select';
                default: return 'Unknown';
            }
        })();

        const isRequired = field.validation?.isRequired;

        return (
            <View key={fieldName} style={[tw`mb-4 p-4 rounded-xl border-2`, { borderColor: theme.colors.border, backgroundColor: theme.colors.card }]}>
                <View style={tw`flex-row justify-between items-center mb-1`}>
                    <Text style={[tw`text-sm font-semibold`, { color: theme.colors.textSecondary }]}>{field.label}</Text>
                    {isRequired && <Text style={[tw`text-xs font-bold`, { color: 'red' }]}>Required</Text>}
                </View>
                <Text style={[tw`text-xs mb-2`, { color: theme.colors.textSecondary }]}>Field Type: {typeName}</Text>
                {field.options && (field.fieldType === 'dropdown-single' || field.fieldType === 'dropdown-multi') && (
                    <View style={tw`flex-row flex-wrap `}>
                        {(field.options || []).map((opt: string) => {
                            const isSelected = field.fieldType === 'dropdown-multi'
                                ? Array.isArray(value) && value.includes(opt)
                                : value === opt;

                            return (
                                <View
                                    key={opt}
                                    style={[
                                        tw`px-3 py-1 mr-2 mb-2 rounded-full`,
                                        {
                                            backgroundColor: isSelected ? theme.colors.primary : theme.colors.card,
                                            borderWidth: 1,
                                            borderColor: theme.colors.border
                                        }
                                    ]}
                                >
                                    <Text style={{ color: isSelected ? 'white' : theme.colors.text }}>{opt}</Text>
                                </View>
                            );
                        })}
                    </View>
                )}

                {/* <Text style={[tw`text-base`, { color: theme.colors.text }]}>{displayValue}</Text> */}
            </View>
        );
    };

    useEffect(() => {
        setTabBarVisible(false); // page open → hide tab
        return () => setTabBarVisible(true); // page exit → show tab again
    }, []);

    return (
        <View style={[tw`flex-1 `, { backgroundColor: theme.colors.background }]}>
            <View style={[tw`flex-row items-center p-4 border-b`, { borderColor: theme.colors.border }]}><TouchableOpacity onPress={onClose} style={tw`p-2`}><ArrowLeft size={24} color={theme.colors.text as string} /></TouchableOpacity><Text style={[tw`text-xl font-bold ml-4 w-full`, { color: theme.colors.text }]}>{itemToEdit ? t.editTitle : t.addTitle}</Text></View>
            <ScrollView contentContainerStyle={tw`p-6 pb-20`} keyboardShouldPersistTaps="handled">
                <ImageUploader initialImages={formData.images} onImagesChanged={(newImages) => handleInputChange('images', newImages)} />
                <CustomInput label={t.itemName} icon={Package} value={formData.name} onChangeText={v => handleInputChange('name', v)} />
                <CustomInput label={t.description} icon={Info} value={formData.description} onChangeText={v => handleInputChange('description', v)} multiline />
                <CustomInput label={t.tags} icon={Tag} value={formData.tags} onChangeText={v => handleInputChange('tags', v)} placeholder={t.tagsPlaceholder} />

                <View style={[tw`p-4 rounded-lg my-4`, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, borderWidth: 1 }]}>
                    <View style={tw`flex-row justify-between items-center`}><View style={tw`flex-1 mr-4`}>
                        <View style={tw`flex-row items-center`}>{formData.isActive ? <Globe size={18} color={theme.colors.secondary as string} /> : <Lock size={18} color={theme.colors.textSecondary as string} />}
                            <Text style={[tw`font-bold ml-2`, { color: theme.colors.text }]}>{formData.isActive ? t.status.publicLabel : t.status.privateLabel}</Text></View><Text style={[tw`text-xs mt-1`, { color: theme.colors.textSecondary }]}>{formData.isActive ? t.status.publicDesc : t.status.privateDesc}</Text></View>
                        <Switch trackColor={{ false: theme.colors.border as string, true: theme.colors.secondary as string }} thumbColor={"white"} onValueChange={v => handleInputChange('isActive', v)} value={formData.isActive} /></View></View>
                <View style={[tw`p-4 rounded-lg mb-4`, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, borderWidth: 1 }]}>
                    <CustomInput label={t.price} icon={IndianRupee} value={String(formData.basePrice)} onChangeText={v => handleInputChange('basePrice', v)} keyboardType="numeric" />
                    <SearchableDropdown label="Tax Rate" data={taxOptions as any} value={formData.taxId || ''} onSelectionChange={v => handleInputChange('taxId', v as string | null)} />
                    <View style={[tw`mt-4 pt-4 border-t`, { borderColor: theme.colors.border }]}><View style={tw`flex-row justify-between mb-1`}><Text style={{ color: theme.colors.textSecondary }}>Base Price</Text><Text style={{ color: theme.colors.textSecondary }}>₹{priceDetails.base.toFixed(2)}</Text></View><View style={tw`flex-row justify-between mb-1`}><Text style={{ color: theme.colors.textSecondary }}>{priceDetails.taxName}</Text><Text style={{ color: theme.colors.textSecondary }}>+ ₹{priceDetails.taxAmount.toFixed(2)}</Text></View><View style={[tw`flex-row justify-between mt-2 pt-2 border-t`, { borderColor: theme.colors.border }]}><Text style={[tw`font-bold`, { color: theme.colors.text }]}>Total Price</Text><Text style={[tw`font-bold`, { color: theme.colors.text }]}>₹{priceDetails.total.toFixed(2)}</Text></View></View>
                </View>
                {/* --- Stock for e-commerce --- */}
                {template.modelType?.includes('e-commerce') && (
                    <CustomInput
                        label={t.stock}
                        icon={Warehouse}
                        value={String(formData.stock)}
                        onChangeText={v => handleInputChange('stock', v)}
                        keyboardType="numeric"
                    />
                )}

                {template.modelType === 'e-commerce' && (<CustomInput label={t.stock} icon={Warehouse} value={String(formData.stock)} onChangeText={v => handleInputChange('stock', v)} keyboardType="numeric" />)}

                {template.fields.map(field => renderCustomerField(field))}

                <TouchableOpacity onPress={handleSaveItem} disabled={isLoading} style={[tw`mt-8 h-14 rounded-xl items-center justify-center`, { backgroundColor: theme.colors.primary as string, opacity: isLoading ? 0.9 : 1 }]}>{isLoading ? <ActivityIndicator color={theme.colors.text} /> : <Text style={tw`text-white text-md font-bold`}>{itemToEdit ? t.updateButton : t.saveButton}</Text>}</TouchableOpacity>
            </ScrollView>
        </View>
    );
};