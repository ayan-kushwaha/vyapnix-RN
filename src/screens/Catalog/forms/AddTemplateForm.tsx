import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { Plus, Trash2, ClipboardType, Type, ListChecks, ArrowLeft, Info, X, ChevronDown, ChevronUp } from 'lucide-react-native';

import { useTheme } from '@/src/context/ThemeContext';
import { useLanguage } from '@/src/context/LanguageContext';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { ItemTemplate } from '@/src/store/types';
import { addTemplateData } from '@/src/data/addTemplateData';
import { CustomInput, SearchableDropdown } from '@/src/components/forms/FormUI';
import { updateTemplate, createTemplate } from '@/src/store/catalogSlice';

// --- Type Definitions ---
interface AddTemplateFormProps { onClose: () => void; templateToEdit?: ItemTemplate | null; }
interface DynamicField { fieldName: string; label: string; fieldType: 'text' | 'number' | 'dropdown'; options: string[]; isExpanded?: boolean; }


export const AddTemplateForm: React.FC<AddTemplateFormProps> = ({ onClose, templateToEdit }) => {
    const { theme } = useTheme();
    const { locale } = useLanguage();
    const t = (addTemplateData as any)[locale] || addTemplateData.en;
    const dispatch = useAppDispatch();
    const { isLoading } = useAppSelector(s => s.catalog);
    const [formData, setFormData] = useState<{ templateName: string; modelType: ItemTemplate['modelType'] | ''; fields: DynamicField[] }>({ templateName: '', modelType: '', fields: [] });

    useEffect(() => { if (templateToEdit) { setFormData({ templateName: templateToEdit.templateName, modelType: templateToEdit.modelType, fields: templateToEdit.fields.map(f => ({ ...f, options: f.options || [], isExpanded: true })) }); } }, [templateToEdit]);

    const handleFieldChange = (index: number, key: keyof DynamicField, value: any) => setFormData(p => { const newFields = [...p.fields]; newFields[index] = { ...newFields[index], [key]: value }; return { ...p, fields: newFields }; });
    const handleAddField = useCallback(() => setFormData(p => ({ ...p, fields: [...p.fields, { fieldName: '', label: '', fieldType: 'text', options: [], isExpanded: true }] })), []);
    const handleRemoveField = useCallback((index: number) => setFormData(p => ({ ...p, fields: p.fields.filter((_, i) => i !== index) })), []);
    const handleAddOption = (fieldIndex: number) => handleFieldChange(fieldIndex, 'options', [...formData.fields[fieldIndex].options, '']);
    const handleOptionChange = (fieldIndex: number, optionIndex: number, value: string) => { const newOptions = [...formData.fields[fieldIndex].options]; newOptions[optionIndex] = value; handleFieldChange(fieldIndex, 'options', newOptions); };
    const handleRemoveOption = (fieldIndex: number, optionIndex: number) => handleFieldChange(fieldIndex, 'options', formData.fields[fieldIndex].options.filter((_, i) => i !== optionIndex));

    const handleSaveTemplate = async () => {
        if (!formData.templateName.trim() || !formData.modelType) return Alert.alert(t.validation.title, t.validation.nameRequired);
        const payload: Partial<ItemTemplate> = { ...formData, modelType: formData.modelType as ItemTemplate['modelType'], fields: formData.fields.map(f => ({ ...f, options: f.fieldType === 'dropdown' ? f.options.filter(opt => opt.trim() !== '') : [] })) };
        try {
            if (templateToEdit) { await dispatch(updateTemplate({ templateId: templateToEdit._id, templateData: payload })).unwrap(); }
            else { await dispatch(createTemplate(payload)).unwrap(); }
            onClose();
        } catch (error: any) { Alert.alert('Error', error.message); }
    };
    const isEditMode = !!templateToEdit;

    return (
        <SafeAreaView style={[tw`flex-1`, { backgroundColor: theme.colors.background }]}>
            <View style={[tw`flex-row items-center p-4 border-b`, { borderColor: theme.colors.border }]}><TouchableOpacity onPress={onClose} style={tw`p-2`}><ArrowLeft size={24} color={theme.colors.text as string} /></TouchableOpacity><Text style={[tw`text-xl font-bold ml-4`, { color: theme.colors.text }]}>{isEditMode ? t.editTitle : t.title}</Text></View>
            <ScrollView contentContainerStyle={tw`p-6 pb-20`} keyboardShouldPersistTaps="handled">
                {/* Template Name */}
                <View style={tw`mb-4`}>
                    <CustomInput
                        label={t.templateName} // Label directly yaha
                        icon={ClipboardType}
                        value={formData.templateName}
                        onChangeText={v => setFormData(p => ({ ...p, templateName: v }))}
                    />
                </View>

                {/* Model Type */}
                <View style={tw`mb-4`}>
                    <SearchableDropdown
                        label={t.modelType} // Label directly yaha
                        data={[
                            { label: 'E-commerce', value: 'e-commerce' },
                            { label: 'Booking', value: 'booking' },
                            { label: 'Subscription', value: 'subscription' }
                        ]}
                        selectedValue={formData.modelType}
                        onSelect={item => setFormData(p => ({ ...p, modelType: item.value }))}
                    />
                </View>

                {/* Dynamic Fields */}
                <View style={tw`mt-6`}>
                    <Text style={[tw`text-lg font-bold mb-3`, { color: theme.colors.text }]}>
                        {t.dynamicFieldsTitle}
                    </Text>

                    {formData.fields.map((field, index) => (
                        <View
                            key={index}
                            style={[
                                tw`p-4 rounded-lg mb-4`,
                                { backgroundColor: theme.colors.card, borderColor: theme.colors.border, borderWidth: 1 }
                            ]}
                        >
                            {/* Field Header */}
                            <TouchableOpacity activeOpacity={0.7}
                                style={tw`flex-row justify-between items-center `}
                                onPress={() => handleFieldChange(index, 'isExpanded', !field.isExpanded)}>
                                <Text
                                    style={[tw`font-bold flex-1 mr-2`, { color: theme.colors.text }]}
                                    numberOfLines={1}
                                >
                                    {field.label || "New Field"}
                                </Text>
                                <View style={tw`flex-row items-center`}>
                                    <TouchableOpacity onPress={() => handleFieldChange(index, 'isExpanded', !field.isExpanded)} style={tw`p-1`}>
                                        {field.isExpanded
                                            ? <ChevronUp size={20} color={theme.colors.textSecondary as string} />
                                            : <ChevronDown size={20} color={theme.colors.textSecondary as string} />}
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleRemoveField(index)} style={tw`p-1 ml-1`}>
                                        <Trash2 size={20} color={theme.colors.destructive as string} />
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>

                            {/* Expanded Field */}
                            {field.isExpanded && (
                                <View style={tw`mt-4 border-t pt-4`} >
                                    {/* Field Name */}
                                    <View style={tw`mb-4`}>
                                        <CustomInput
                                            label={t.fieldName} // Label directly
                                            icon={Type}
                                            value={field.fieldName}
                                            onChangeText={v => handleFieldChange(index, 'fieldName', v.toLowerCase().replace(/\s/g, ''))}
                                        />
                                    </View>

                                    {/* Field Label */}
                                    <View style={tw`mb-4`}>
                                        <CustomInput
                                            label={t.fieldLabel}
                                            icon={Type}
                                            value={field.label}
                                            onChangeText={v => handleFieldChange(index, 'label', v)}
                                        />
                                    </View>

                                    {/* Field Type */}
                                    <View style={tw`mb-4`}>
                                        <SearchableDropdown
                                            label={t.fieldType}
                                            data={[
                                                { label: 'Text', value: 'text' },
                                                { label: 'Number', value: 'number' },
                                                { label: 'Dropdown', value: 'dropdown' }
                                            ]}
                                            selectedValue={field.fieldType}
                                            onSelect={item => handleFieldChange(index, 'fieldType', item.value)}
                                        />
                                    </View>

                                    {/* Dropdown Options */}
                                    {field.fieldType === 'dropdown' && (
                                        <View style={[tw`mb-2 p-3 rounded-lg`, { borderColor: theme.colors.border }]}>
                                            {field.options.map((option, optionIndex) => (
                                                <View key={optionIndex} style={tw`flex-row items-center mb-2`}>
                                                    <View style={tw`flex-1`}>
                                                        <CustomInput
                                                            label={t.fieldOptions} // Label directly
                                                            icon={ListChecks}
                                                            value={option}
                                                            onChangeText={v => handleOptionChange(index, optionIndex, v)}
                                                        />
                                                    </View>
                                                    <TouchableOpacity activeOpacity={0.7} onPress={() => handleRemoveOption(index, optionIndex)} style={tw`p-2 ml-2`}>
                                                        <X size={20} color={theme.colors.textSecondary as string} />
                                                    </TouchableOpacity>
                                                </View>
                                            ))}

                                            <TouchableOpacity activeOpacity={0.7} onPress={() => handleAddOption(index)} style={[tw`flex-row items-center justify-center p-2 mt-2 rounded-lg`, { backgroundColor: theme.colors.primary + '20' }]}>
                                                <Plus size={16} color={theme.colors.primary as string} />
                                                <Text style={[tw`ml-2 text-sm font-semibold`, { color: theme.colors.primary as string }]}>
                                                    {t.addOption}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            )}
                        </View>
                    ))}

                    {/* Add New Field Button */}
                    <TouchableOpacity activeOpacity={0.7}
                        onPress={handleAddField}
                        style={[tw`flex-row items-center justify-center p-3 rounded-lg border-2 border-dashed`, { borderColor: theme.colors.primary as string }]}
                    >
                        <Plus size={20} color={theme.colors.primary as string} />
                        <Text style={[tw`ml-2 font-semibold`, { color: theme.colors.primary as string }]}>{t.addField}</Text>
                    </TouchableOpacity>
                </View>

                {/* Save / Update Button */}
                <TouchableOpacity
                    onPress={handleSaveTemplate}
                    disabled={isLoading}
                    style={[tw`mt-8 h-14  rounded-xl items-center justify-center`, { backgroundColor: theme.colors.primary as string, opacity: isLoading ? 0.7 : 1 }]}
                >
                    {isLoading
                        ? <ActivityIndicator color="#fff" />
                        : <Text style={tw`text-white flex text-md font-bold`}>
                            {isEditMode ? t.updateButton : t.saveButton}
                        </Text>
                    }
                </TouchableOpacity>
            </ScrollView>

        </SafeAreaView>
    );
};