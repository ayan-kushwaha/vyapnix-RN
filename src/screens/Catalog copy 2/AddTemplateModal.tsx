// src/screens/Catalog/AddTemplateModal.tsx

import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import tw from 'twrnc';
import { Plus, Trash2, ClipboardType, Type, ListChecks } from 'lucide-react-native';

// Project Imports
import { useTheme } from '@/src/context/ThemeContext';
import { useLanguage } from '@/src/context/LanguageContext';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { createTemplate } from '@/src/store/catalogSlice';
import { addTemplateData } from '@/src/data/addTemplateData';
import { CustomInput, SearchableDropdown } from '@/src/components/forms/FormUI';
import { SafeAreaView } from 'react-native-safe-area-context';

type Locale = "en" | "hi" | "en-HI";

// Ek dynamic field kaisa dikhega, uska type
interface DynamicField {
  fieldName: string;
  label: string;
  fieldType: 'text' | 'number' | 'dropdown';
  options: string; // Comma-separated string
}

export const AddTemplateModal = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { theme } = useTheme();
  const { locale } = useLanguage();
  const t = addTemplateData[locale as Locale] || addTemplateData.en;
  const { isLoading } = useAppSelector(s => s.catalog);

  // Form ki poori state ek hi object mein
  const [formData, setFormData] = useState<{
    templateName: string;
    modelType: 'e-commerce' | 'booking' | 'subscription' | '';
    fields: DynamicField[];
  }>({
    templateName: '',
    modelType: '',
    fields: [],
  });
  
  // Naya field add karne ka function
  const handleAddField = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, { fieldName: '', label: '', fieldType: 'text', options: '' }],
    }));
  }, []);

  // Field ko remove karne ka function
  const handleRemoveField = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index),
    }));
  }, []);

  // Kisi bhi input ko update karne ka function
  const handleInputChange = (key: 'templateName' | 'modelType', value: string) => {
      setFormData(prev => ({...prev, [key]: value}));
  };

  // Dynamic field ke input ko update karne ka function
  const handleFieldChange = (index: number, key: keyof DynamicField, value: string) => {
      const updatedFields = [...formData.fields];
      updatedFields[index] = { ...updatedFields[index], [key]: value };
      setFormData(prev => ({...prev, fields: updatedFields }));
  };
  
  // Template ko save karne ka function
  const handleSaveTemplate = async () => {
    if (!formData.templateName || !formData.modelType) {
      return Alert.alert(t.validation.title, t.validation.nameRequired);
    }
    for (const field of formData.fields) {
        if (!field.fieldName || !field.label) {
            return Alert.alert(t.validation.title, t.validation.fieldRequired);
        }
    }

    // API ke liye data prepare karein
    const payload = {
      ...formData,
      fields: formData.fields.map(f => ({
        ...f,
        // Options string ko array mein convert karein agar dropdown hai
        options: f.fieldType === 'dropdown' ? f.options.split(',').map(opt => opt.trim()) : undefined,
      })),
    };

    try {
        await dispatch(createTemplate(payload)).unwrap();
        Alert.alert(t.validation.success, t.validation.successMessage);
        router.back();
    } catch (error: any) {
        Alert.alert('Error', error.message || 'Failed to create template');
    }
  };

  return (
    <SafeAreaView style={[tw`flex-1`, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
      <ScrollView contentContainerStyle={tw`p-6 pb-20`} keyboardShouldPersistTaps="handled">
        <Text style={[tw`text-3xl font-bold`, { color: theme.colors.text }]}>{t.title}</Text>
        <Text style={[tw`text-base mt-2 mb-8`, { color: theme.colors.textSecondary }]}>{t.subtitle}</Text>
        
        {/* Basic Details */}
        <CustomInput label={t.templateName} icon={ClipboardType} value={formData.templateName} onChangeText={v => handleInputChange('templateName', v)} placeholder={t.templateNamePlaceholder} />
        <SearchableDropdown
          label={t.modelType}
          data={[
            { label: 'E-commerce (Products)', value: 'e-commerce' },
            { label: 'Booking (Services)', value: 'booking' },
            { label: 'Subscription (Plans)', value: 'subscription' },
          ]}
          selectedValue={formData.modelType}
          onSelect={item => handleInputChange('modelType', item.value)}
        />
        
        {/* Dynamic Fields Section */}
        <View style={tw`mt-6`}>
            <Text style={[tw`text-lg font-bold mb-3`, { color: theme.colors.text }]}>{t.dynamicFieldsTitle}</Text>
            {formData.fields.map((field, index) => (
                <View key={index} style={[tw`p-4 rounded-lg mb-4`, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, borderWidth: 1}]}>
                    <TouchableOpacity onPress={() => handleRemoveField(index)} style={tw`absolute top-2 right-2 p-1`}>
                        <Trash2 size={20} color={theme.colors.destructive as string} />
                    </TouchableOpacity>
                    <CustomInput label={t.fieldName} icon={Type} value={field.fieldName} onChangeText={v => handleFieldChange(index, 'fieldName', v.toLowerCase().replace(/\s/g, ''))} placeholder={t.fieldNamePlaceholder}/>
                    <CustomInput label={t.fieldLabel} icon={Type} value={field.label} onChangeText={v => handleFieldChange(index, 'label', v)} placeholder={t.fieldLabelPlaceholder}/>
                    <SearchableDropdown
                        label={t.fieldType}
                        data={[
                            { label: 'Text', value: 'text' },
                            { label: 'Number', value: 'number' },
                            { label: 'Dropdown', value: 'dropdown' },
                        ]}
                        selectedValue={field.fieldType}
                        onSelect={item => handleFieldChange(index, 'fieldType', item.value)}
                    />
                    {field.fieldType === 'dropdown' && (
                        <CustomInput label={t.fieldOptions} icon={ListChecks} value={field.options} onChangeText={v => handleFieldChange(index, 'options', v)} placeholder={t.fieldOptionsPlaceholder}/>
                    )}
                </View>
            ))}
            <TouchableOpacity onPress={handleAddField} style={[tw`flex-row items-center justify-center p-3 rounded-lg border-2 border-dashed`, { borderColor: theme.colors.primary }]}>
                <Plus size={20} color={theme.colors.primary} />
                <Text style={[tw`ml-2 font-semibold`, { color: theme.colors.primary }]}>{t.addField}</Text>
            </TouchableOpacity>
        </View>

         {/* Save Button */}
        <TouchableOpacity onPress={handleSaveTemplate} disabled={isLoading} style={[tw`mt-8 h-14 rounded-xl items-center justify-center`, { backgroundColor: theme.colors.primary, opacity: isLoading ? 0.7 : 1.0 }]}>
            {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={tw`text-white text-lg font-bold`}>{t.saveButton}</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};