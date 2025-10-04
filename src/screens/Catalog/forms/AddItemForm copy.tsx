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

type Locale = "en" | "hi" | "en-HI";
interface AddItemFormProps { onClose: () => void; template: ItemTemplate; itemToEdit?: CatalogItem | null; }
type FormData = { name: string; description: string; basePrice: string; stock: string; images: string[]; tags: string; isActive: boolean; dynamicFields: { [key: string]: any }; taxId: string | null; };

export const AddItemForm: React.FC<AddItemFormProps> = ({ onClose, template, itemToEdit }) => {
    const { theme } = useTheme();
    const { locale } = useLanguage();
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
        // 1. Validate standard fields
        if (!formData.name || !formData.basePrice) {
            return Alert.alert(t.validation.title, t.validation.nameAndPriceRequired);
        }

        // 2. Validate all dynamic fields marked as required in the template
        for (const field of template.fields) {
            if (field.validation?.isRequired) {
                const value = formData.dynamicFields[field.fieldName];
                const isValueMissing = value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0);

                if (isValueMissing) {
                    return Alert.alert(
                        'Required Field', // Generic title
                        `Please fill in the "${field.label}" field.` // Dynamic message
                    );
                }
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

    const renderDynamicField = (field: ItemTemplate['fields'][0]) => {
        const fieldName = field.fieldName;
        const value = formData.dynamicFields[fieldName];
        switch (field.fieldType) {
            case 'textarea': return <CustomInput key={fieldName} label={field.label} icon={Info} value={value || ''} onChangeText={(v: string) => handleDynamicFieldChange(fieldName, v)} multiline />;
            case 'switch': return <SwitchInput key={fieldName} label={field.label} value={!!value} onValueChange={(v: boolean) => handleDynamicFieldChange(fieldName, v)} />;
            case 'checkbox': return <CheckboxInput key={fieldName} label={field.label} value={!!value} onValueChange={(v: boolean) => handleDynamicFieldChange(fieldName, v)} />;
            case 'date': return <DateTimeInput key={fieldName} label={field.label} mode="date" value={value ? new Date(value) : new Date()} onValueChange={(v: Date) => handleDynamicFieldChange(fieldName, v.toISOString())} />;
            case 'time': return <DateTimeInput key={fieldName} label={field.label} mode="time" value={value ? new Date(value) : new Date()} onValueChange={(v: Date) => handleDynamicFieldChange(fieldName, v.toISOString())} />;
            case 'currency': return <CustomInput key={fieldName} label={field.label} icon={IndianRupee} value={String(value || '')} onChangeText={(v: string) => handleDynamicFieldChange(fieldName, v)} keyboardType="numeric" />;
            case 'dropdown-single':
                return <SearchableDropdown
                    key={fieldName}
                    label={field.label}
                    data={(field.options || []).map((o: string) => ({ label: o, value: o }))}
                    value={value || ''}
                    onSelectionChange={(v) => handleDynamicFieldChange(fieldName, v)}
                />;
            case 'dropdown-multi':
                return <SearchableDropdown
                    key={fieldName}
                    label={field.label}
                    mode="multiple"
                    data={(field.options || []).map((o: string) => ({ label: o, value: o }))}
                    value={value || []}
                    onSelectionChange={(v) => handleDynamicFieldChange(fieldName, v)}
                />;
            case 'file': return <CustomInput key={fieldName} label={field.label} icon={File} value={value || ''} placeholder="Tap to upload file" editable={false} />;
            default: return <CustomInput key={fieldName} label={field.label} icon={Type} value={String(value || '')} onChangeText={(v: string) => handleDynamicFieldChange(fieldName, v)} keyboardType={field.fieldType === 'number' ? 'numeric' : 'default'} />;
        }
    }

    return (
        <SafeAreaView style={[tw`flex-1 mb-10`, { backgroundColor: theme.colors.background }]}>
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

                {template.modelType === 'e-commerce' && (<CustomInput label={t.stock} icon={Warehouse} value={String(formData.stock)} onChangeText={v => handleInputChange('stock', v)} keyboardType="numeric" />)}

                {template.fields.map(field => renderDynamicField(field))}

                <TouchableOpacity onPress={handleSaveItem} disabled={isLoading} style={[tw`mt-8 h-14 rounded-xl items-center justify-center`, { backgroundColor: theme.colors.primary as string, opacity: isLoading ? 0.9 : 1 }]}>{isLoading ? <ActivityIndicator color={theme.colors.text} /> : <Text style={tw`text-white text-md font-bold`}>{itemToEdit ? t.updateButton : t.saveButton}</Text>}</TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};