import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { Plus, Trash2, ClipboardType, Type, ListChecks, ArrowLeft, X, ChevronUp, ChevronDown } from 'lucide-react-native';

import { useTheme } from '@/src/context/ThemeContext';
import { useLanguage } from '@/src/context/LanguageContext';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { ItemTemplate } from '@/src/store/types';
import { addTemplateData } from '@/src/data/addTemplateData';
import { CustomInput, SearchableDropdown } from '@/src/components/forms/FormUI';
import { updateTemplate, createTemplate, adminUpdateTemplate } from '@/src/store/catalogSlice';

// --- Type Definitions (Upgraded) ---
interface AddTemplateFormProps { onClose: () => void; templateToEdit?: ItemTemplate | null; isAdminMode?: boolean; }
interface DynamicFieldValidation { isRequired: boolean; }
interface DynamicField {
    fieldName: string;
    label: string;
    fieldType: 'text' | 'number' | 'textarea' | 'dropdown-single' | 'dropdown-multi' | 'switch' | 'checkbox' | 'date' | 'time' | 'file' | 'currency';
    options: string[];
    validation?: DynamicFieldValidation;
    isExpanded?: boolean;
}

// Helper function to create a unique ID from a label
const generateFieldName = (label: string): string => {
    return label.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
};

export const AddTemplateForm: React.FC<AddTemplateFormProps> = ({ onClose, templateToEdit, isAdminMode = false }) => {
    const { theme } = useTheme();
    const { locale } = useLanguage();
    const t = (addTemplateData as any)[locale] || addTemplateData.en;
    const dispatch = useAppDispatch();
    const { isLoading } = useAppSelector(s => s.catalog);
    const [formData, setFormData] = useState<{ templateName: string; modelType: ItemTemplate['modelType'] | ''; fields: DynamicField[] }>({
        templateName: '', modelType: '', fields: [],
    });

    useEffect(() => {
        if (templateToEdit) {
            setFormData({
                templateName: templateToEdit.templateName,
                modelType: templateToEdit.modelType,
                fields: templateToEdit.fields.map(f => ({
                    ...f,
                    options: f.options || [],
                    validation: f.validation || { isRequired: false },
                    isExpanded: true,
                }))
            });
        }
    }, [templateToEdit]);

    const handleFieldChange = (index: number, key: keyof DynamicField, value: any) => {
        setFormData(p => {
            const newFields = [...p.fields];
            newFields[index] = { ...newFields[index], [key]: value };
            if (key === 'label') { newFields[index].fieldName = generateFieldName(value); }
            return { ...p, fields: newFields };
        });
    };

    const handleValidationChange = (index: number, key: 'isRequired', value: boolean) => {
        const newFields = [...formData.fields];
        newFields[index].validation = { ...newFields[index].validation, [key]: value };
        setFormData(p => ({ ...p, fields: newFields }));
    };
    const handleAddField = useCallback(() => setFormData(p => ({ ...p, fields: [...p.fields, { fieldName: '', label: '', fieldType: 'text', options: [], validation: { isRequired: false }, isExpanded: true }] })), []);
    const handleRemoveField = useCallback((index: number) => setFormData(p => ({ ...p, fields: p.fields.filter((_, i) => i !== index) })), []);
    const handleAddOption = (fieldIndex: number) => handleFieldChange(fieldIndex, 'options', [...formData.fields[fieldIndex].options, '']);
    const handleOptionChange = (fieldIndex: number, optionIndex: number, value: string) => { const newOptions = [...formData.fields[fieldIndex].options]; newOptions[optionIndex] = value; handleFieldChange(fieldIndex, 'options', newOptions); };
    const handleRemoveOption = (fieldIndex: number, optionIndex: number) => handleFieldChange(fieldIndex, 'options', formData.fields[fieldIndex].options.filter((_, i) => i !== optionIndex));

    const handleSaveTemplate = async () => {
        if (!formData.templateName.trim() || !formData.modelType) return Alert.alert(t.validation.title, t.validation.nameRequired);
        const payload: Partial<ItemTemplate> = { ...formData, modelType: formData.modelType as ItemTemplate['modelType'], fields: formData.fields.map(f => ({ ...f, options: (f.fieldType === 'dropdown-single' || f.fieldType === 'dropdown-multi') ? f.options.filter(opt => opt.trim() !== '') : [] })) };
        try {
            if (templateToEdit) {
                // ✅ FIX: Ab yeh check karega ki Admin mode hai ya nahi
                if (isAdminMode) {
                    // Agar Admin hai, to admin wala action call karo
                    await dispatch(adminUpdateTemplate({ templateId: templateToEdit._id, templateData: payload })).unwrap();
                } else {
                    // Agar normal user hai, to normal action call karo
                    await dispatch(updateTemplate({ templateId: templateToEdit._id, templateData: payload })).unwrap();
                }
            } else {
                await dispatch(createTemplate(payload)).unwrap();
            }
            onClose();
        } catch (error: any) { Alert.alert('Error', error.message); }
    };

    // ✅ NEW: Field type options ab language file se dynamically ban rahe hain
    const fieldTypeOptions = Object.entries(t.fieldTypes).map(([value, label]) => ({
        label: label as string,
        value: value,
    }));

    const isEditMode = !!templateToEdit;

    return (
        <SafeAreaView style={[tw`flex-1`, { backgroundColor: theme.colors.background }]}>
            <View style={[tw`flex-row items-center p-4 border-b`, { borderColor: theme.colors.border }]}>
                <TouchableOpacity activeOpacity={0.7} onPress={onClose} style={tw`p-2`}><ArrowLeft size={24} color={theme.colors.text as string} />
                </TouchableOpacity><Text style={[tw`text-xl font-bold ml-4`, { color: theme.colors.text }]}>{isEditMode ? t.editTitle : t.title}</Text>
            </View>
            <ScrollView contentContainerStyle={tw`p-6 pb-20`} keyboardShouldPersistTaps="handled">
                <CustomInput label={t.templateName} icon={ClipboardType} value={formData.templateName} onChangeText={v => setFormData(p => ({ ...p, templateName: v }))} />
                <SearchableDropdown label={t.modelType} data={[{ label: 'E-commerce', value: 'e-commerce' }, { label: 'Booking', value: 'booking' }, { label: 'Subscription', value: 'subscription' }]} value={formData.modelType} onSelectionChange={val => setFormData(p => ({ ...p, modelType: val as any }))} />
                <View style={tw`mt-6`}>
                    <Text style={[tw`text-lg font-bold mb-3`, { color: theme.colors.text }]}>{t.dynamicFieldsTitle}</Text>
                    {formData.fields.map((field, index) => (
                        <View key={index} style={[tw`p-4 rounded-lg mb-4`, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, borderWidth: 1 }]}>
                            <TouchableOpacity activeOpacity={0.7} onPress={() => handleFieldChange(index, 'isExpanded', !field.isExpanded)} style={tw`flex-row justify-between items-center`}>
                                <Text style={[tw`font-bold flex-1 mr-2`, { color: theme.colors.text }]} numberOfLines={1}>{field.label || "New Field"}</Text>
                                <View style={tw`flex-row items-center`}><View style={tw`p-1`}>{field.isExpanded ? <ChevronUp size={20} color={theme.colors.textSecondary as string} /> : <ChevronDown size={20} color={theme.colors.textSecondary as string} />}</View><TouchableOpacity activeOpacity={0.7} onPress={() => handleRemoveField(index)} style={tw`p-1 ml-1`}><Trash2 size={20} color={theme.colors.destructive as string} /></TouchableOpacity></View>
                            </TouchableOpacity>
                            {field.isExpanded && (<View style={[tw`mt-4 border-t pt-4`, { borderColor: theme.colors.border }]}>
                                <CustomInput label={t.fieldLabel} icon={Type} value={field.label} onChangeText={v => handleFieldChange(index, 'label', v)} />
                                <SearchableDropdown
                                    label={t.fieldType}
                                    data={fieldTypeOptions} // ✅ Data ab dynamic hai
                                    value={field.fieldType}
                                    onSelectionChange={val => handleFieldChange(index, 'fieldType', val as any)}
                                />
                                <View style={[tw`flex-row justify-between items-center p-3 my-2 rounded-lg`, { backgroundColor: theme.colors.background }]}>
                                    <Text style={{ color: theme.colors.textSecondary }}>{t.isRequired}</Text>
                                    <Switch value={field.validation?.isRequired || false} onValueChange={v => handleValidationChange(index, 'isRequired', v)} trackColor={{ false: theme.colors.border as string, true: theme.colors.primary as string }} thumbColor={"white"} />
                                </View>
                                {(field.fieldType === 'dropdown-single' || field.fieldType === 'dropdown-multi') && (
                                    <View style={[tw`mt-2 p-3 rounded-lg border`, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
                                        <Text style={[tw`text-sm font-medium mb-2`, { color: theme.colors.textSecondary }]}>{t.fieldOptions}</Text>
                                        {field.options.map((option, optionIndex) => (
                                            <View key={optionIndex} style={tw`flex-row items-center mb-2`}><View style={tw`flex-1`}><CustomInput icon={ListChecks} value={option} onChangeText={v => handleOptionChange(index, optionIndex, v)} /></View><TouchableOpacity activeOpacity={0.7} onPress={() => handleRemoveOption(index, optionIndex)} style={tw`p-2 ml-2`}><X size={20} color={theme.colors.textSecondary as string} /></TouchableOpacity></View>
                                        ))}
                                        <TouchableOpacity activeOpacity={0.7} onPress={() => handleAddOption(index)} style={[tw`flex-row items-center justify-center p-2 mt-2 rounded-lg`, { backgroundColor: theme.colors.primary + '20' }]}><Plus size={16} color={theme.colors.primary as string} /><Text style={[tw`ml-2 text-sm font-semibold`, { color: theme.colors.primary as string }]}>{t.addOption}</Text></TouchableOpacity>
                                    </View>
                                )}
                            </View>)}
                        </View>
                    ))}
                    <TouchableOpacity activeOpacity={0.7} onPress={handleAddField} style={[tw`flex-row items-center justify-center p-3 rounded-lg border-2 border-dashed`, { borderColor: theme.colors.primary as string }]}><Plus size={20} color={theme.colors.primary as string} /><Text style={[tw`ml-2 font-semibold`, { color: theme.colors.primary as string }]}>{t.addField}</Text></TouchableOpacity>
                </View>
                <TouchableOpacity onPress={handleSaveTemplate} disabled={isLoading} style={[tw`mt-8 h-14 rounded-xl items-center justify-center`, { backgroundColor: theme.colors.primary as string, opacity: isLoading ? 0.7 : 1 }]}>{isLoading ? <ActivityIndicator color="#fff" /> : <Text style={tw`text-white text-lg font-bold`}>{isEditMode ? t.updateButton : t.saveButton}</Text>}</TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

//////////////old