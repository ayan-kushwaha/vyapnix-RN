// AddTemplateForm.tsx
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
import { defaultFields } from './defaultFields';

// --- Type Definitions ---
interface AddTemplateFormProps {
    onClose: () => void;
    templateToEdit?: ItemTemplate | null;
    isAdminMode?: boolean;
}
interface DynamicFieldValidation { isRequired: boolean; }
export interface DynamicField {
    fieldName: string;
    label: string;
    fieldType: 'text' | 'number' | 'textarea' | 'dropdown-single' | 'dropdown-multi' | 'switch' | 'checkbox' | 'date' | 'time' | 'file' | 'currency';
    options: string[];
    validation?: DynamicFieldValidation;
    isExpanded?: boolean;
    isSystemField?: boolean; // ✅ For default fields
}

// Helper to generate fieldName from label
const generateFieldName = (label: string): string => label.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

type ModelType = 'e-commerce' | 'booking' | 'subscription';

export const AddTemplateForm: React.FC<AddTemplateFormProps> = ({ onClose, templateToEdit, isAdminMode = false }) => {
    const { theme } = useTheme();
    const { locale } = useLanguage();
    const t = (addTemplateData as any)[locale] || addTemplateData.en;
    const dispatch = useAppDispatch();
    const { isLoading } = useAppSelector(s => s.catalog);

    const [formData, setFormData] = useState<{ templateName: string; modelType: ModelType[]; fields: DynamicField[] }>({
        templateName: '',
        modelType: [],
        fields: [],
    });

    // Load existing template & merge default fields
    useEffect(() => {
        if (templateToEdit) {
            const userFields = templateToEdit.fields.filter(f => !f.isSystemField);
            const selectedModels = Array.isArray(templateToEdit.modelType) ? templateToEdit.modelType : [templateToEdit.modelType];
            let mergedFields: DynamicField[] = [...userFields];

            selectedModels.forEach(model => {
                (defaultFields[model] || []).forEach(f => {
                    if (!mergedFields.find(nf => nf.fieldName === f.fieldName)) {
                        mergedFields.push({ ...f, isSystemField: true, isExpanded: false });
                    }
                });
            });

            setFormData({
                templateName: templateToEdit.templateName,
                modelType: selectedModels,
                fields: mergedFields,
            });
        }
    }, [templateToEdit]);

    // --- Field handlers ---
    const handleFieldChange = (index: number, key: keyof DynamicField, value: any) => {
        setFormData(prev => {
            const newFields = [...prev.fields];
            newFields[index] = { ...newFields[index], [key]: value };
            if (key === 'label') newFields[index].fieldName = generateFieldName(value);
            return { ...prev, fields: newFields };
        });
    };

    const handleValidationChange = (index: number, key: 'isRequired', value: boolean) => {
        const newFields = [...formData.fields];
        newFields[index].validation = { ...newFields[index].validation, [key]: value };
        setFormData(p => ({ ...p, fields: newFields }));
    };

    const handleAddField = useCallback(() => setFormData(p => ({
        ...p,
        fields: [...p.fields, { fieldName: '', label: '', fieldType: 'text', options: [], validation: { isRequired: false }, isExpanded: true }]
    })), []);

    const handleRemoveField = (index: number) => {
        setFormData(prev => {
            const field = prev.fields[index];
            if (field.isSystemField) return prev; // Default field delete nahi hoga
            const newFields = prev.fields.filter((_, i) => i !== index);
            return { ...prev, fields: newFields };
        });
    };

    const handleAddOption = (fieldIndex: number) => handleFieldChange(fieldIndex, 'options', [...formData.fields[fieldIndex].options, '']);
    const handleOptionChange = (fieldIndex: number, optionIndex: number, value: string) => {
        const newOptions = [...formData.fields[fieldIndex].options];
        newOptions[optionIndex] = value;
        handleFieldChange(fieldIndex, 'options', newOptions);
    };
    const handleRemoveOption = (fieldIndex: number, optionIndex: number) => handleFieldChange(fieldIndex, 'options', formData.fields[fieldIndex].options.filter((_, i) => i !== optionIndex));

    // --- Multi-model selection handler ---
    const handleModelTypeChange = (selection: string | string[]) => {
        const selectedModels = Array.isArray(selection) ? selection.filter(s => ['e-commerce', 'booking', 'subscription'].includes(s)) as ModelType[] : [];
        setFormData(prev => {
            const userFields = prev.fields.filter(f => !f.isSystemField);
            let mergedFields: DynamicField[] = [...userFields];

            selectedModels.forEach(model => {
                (defaultFields[model] || []).forEach(f => {
                    if (!mergedFields.find(nf => nf.fieldName === f.fieldName)) {
                        mergedFields.push({ ...f, isSystemField: true, isExpanded: false });
                    }
                });
            });

            return { ...prev, modelType: selectedModels, fields: mergedFields };
        });
    };

    // --- Save template ---
    const handleSaveTemplate = async () => {
        if (!formData.templateName.trim() || !formData.modelType.length) return Alert.alert(t.validation.title, t.validation.nameRequired);
        const payload: Partial<ItemTemplate> = {
            ...formData,
            modelType: formData.modelType.length === 1 ? formData.modelType[0] : formData.modelType,
            fields: formData.fields.map(f => ({
                ...f,
                options: (f.fieldType === 'dropdown-single' || f.fieldType === 'dropdown-multi') ? f.options.filter(opt => opt.trim() !== '') : [],
            })),
        };
        try {
            if (templateToEdit) {
                if (isAdminMode) await dispatch(adminUpdateTemplate({ templateId: templateToEdit._id, templateData: payload })).unwrap();
                else await dispatch(updateTemplate({ templateId: templateToEdit._id, templateData: payload })).unwrap();
            } else await dispatch(createTemplate(payload)).unwrap();
            onClose();
        } catch (error: any) { Alert.alert('Error', error.message); }
    };

    const fieldTypeOptions = Object.entries(t.fieldTypes).map(([value, label]) => ({ label: label as string, value: value }));

    const isEditMode = !!templateToEdit;

    return (
        <SafeAreaView style={[tw`flex-1`, { backgroundColor: theme.colors.background }]}>
            <View style={[tw`flex-row items-center p-4 border-b`, { borderColor: theme.colors.border }]}>
                <TouchableOpacity activeOpacity={0.7} onPress={onClose} style={tw`p-2`}>
                    <ArrowLeft size={24} color={theme.colors.text as string} />
                </TouchableOpacity>
                <Text style={[tw`text-xl font-bold ml-4`, { color: theme.colors.text }]}>{isEditMode ? t.editTitle : t.title} </Text>
            </View>
            <ScrollView contentContainerStyle={tw`p-6 pb-20`} keyboardShouldPersistTaps="handled">
                <CustomInput label={t.templateName} icon={ClipboardType} value={formData.templateName} onChangeText={v => setFormData(p => ({ ...p, templateName: v }))} />

                <SearchableDropdown
                    mode="multiple"
                    label={t.modelType}
                    data={[
                        { label: 'E-commerce', value: 'e-commerce' },
                        { label: 'Booking', value: 'booking' },
                        { label: 'Subscription', value: 'subscription' }
                    ]}
                    value={formData.modelType}
                    onSelectionChange={handleModelTypeChange}
                />

                {/* Dynamic Fields */}
                <View style={tw`mt-6`}>
                    <Text style={[tw`text-lg font-bold mb-3`, { color: theme.colors.text }]}>{t.dynamicFieldsTitle}</Text>
                    {formData.fields.map((field, index) => (
                        <View key={index} style={[tw`p-4 rounded-lg mb-4`, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, borderWidth: 1 }]}>
                            <TouchableOpacity activeOpacity={0.7} onPress={() => handleFieldChange(index, 'isExpanded', !field.isExpanded)} style={tw`flex-row justify-between items-center`}>
                                <Text style={[tw`font-bold flex-1 mr-2`, { color: theme.colors.text }]} numberOfLines={1}>{field.label || "New Field"}</Text>
                                <View style={tw`flex-row items-center`}>
                                    <View style={tw`p-1`}>{field.isExpanded ? <ChevronUp size={20} color={theme.colors.textSecondary as string} /> : <ChevronDown size={20} color={theme.colors.textSecondary as string} />}</View>
                                    {!field.isSystemField && (
                                        <TouchableOpacity activeOpacity={0.7} onPress={() => handleRemoveField(index)} style={tw`p-1 ml-1`}>
                                            <Trash2 size={20} color={theme.colors.destructive as string} />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </TouchableOpacity>

                            {field.isExpanded && (
                                <View style={[tw`mt-4 border-t pt-4`, { borderColor: theme.colors.border }]}>
                                    <CustomInput label={t.fieldLabel} icon={Type} value={field.label} onChangeText={v => handleFieldChange(index, 'label', v)} />
                                    <SearchableDropdown label={t.fieldType} data={fieldTypeOptions} value={field.fieldType} onSelectionChange={val => handleFieldChange(index, 'fieldType', val as any)} />
                                    <View style={[tw`flex-row justify-between items-center p-3 my-2 rounded-lg`, { backgroundColor: theme.colors.background }]}>
                                        <Text style={{ color: theme.colors.textSecondary }}>{t.isRequired}</Text>
                                        <Switch value={field.validation?.isRequired || false} onValueChange={v => handleValidationChange(index, 'isRequired', v)} trackColor={{ false: theme.colors.border as string, true: theme.colors.primary as string }} thumbColor={"white"} />
                                    </View>

                                    {(field.fieldType === 'dropdown-single' || field.fieldType === 'dropdown-multi') && (
                                        <View style={[tw`mt-2 p-3 rounded-lg border`, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
                                            <Text style={[tw`text-sm font-medium mb-2`, { color: theme.colors.textSecondary }]}>{t.fieldOptions}</Text>
                                            {field.options.map((option, optionIndex) => (
                                                <View key={optionIndex} style={tw`flex-row items-center mb-2`}>
                                                    <View style={tw`flex-1`}>
                                                        <CustomInput icon={ListChecks} value={option} onChangeText={v => handleOptionChange(index, optionIndex, v)} />
                                                    </View>
                                                    <TouchableOpacity activeOpacity={0.7} onPress={() => handleRemoveOption(index, optionIndex)} style={tw`p-2 ml-2`}>
                                                        <X size={20} color={theme.colors.textSecondary as string} />
                                                    </TouchableOpacity>
                                                </View>
                                            ))}
                                            <TouchableOpacity activeOpacity={0.7} onPress={() => handleAddOption(index)} style={[tw`flex-row items-center justify-center p-2 mt-2 rounded-lg`, { backgroundColor: theme.colors.primary + '20' }]}>
                                                <Plus size={16} color={theme.colors.primary as string} />
                                                <Text style={[tw`ml-2 text-sm font-semibold`, { color: theme.colors.primary as string }]}>{t.addOption}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            )}
                        </View>
                    ))}

                    <TouchableOpacity activeOpacity={0.7} onPress={handleAddField} style={[tw`flex-row items-center justify-center p-3 rounded-lg border-2 border-dashed`, { borderColor: theme.colors.primary as string }]}>
                        <Plus size={20} color={theme.colors.primary as string} />
                        <Text style={[tw`ml-2 font-semibold`, { color: theme.colors.primary as string }]}>{t.addField}</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    onPress={handleSaveTemplate}
                    disabled={isLoading}
                    style={[tw`mt-8 h-14 rounded-xl items-center justify-center`, { backgroundColor: theme.colors.primary as string, opacity: isLoading ? 0.7 : 1 }]}
                >
                    {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={tw`text-white text-md font-bold text-center`}>{isEditMode ? t.updateButton : t.saveButton}</Text>}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};
