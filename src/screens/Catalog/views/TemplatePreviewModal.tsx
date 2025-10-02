import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import tw from 'twrnc';
import { X, Type } from 'lucide-react-native';
import { useTheme } from '@/src/context/ThemeContext';
import { ItemTemplate } from '@/src/store/types';

interface TemplatePreviewModalProps {
  visible: boolean;
  onClose: () => void;
  template: ItemTemplate | null;
}

export const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({ visible, onClose, template }) => {
    const { theme } = useTheme();
    if (!template) return null;

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={tw`flex-1 justify-center items-center bg-black/60`}>
                <View style={[tw`w-11/12 max-h-4/5 rounded-xl p-5`, {backgroundColor: theme.colors.card}]}>
                    <TouchableOpacity onPress={onClose} style={tw`absolute top-4 right-4`}><X size={24} color={theme.colors.textSecondary as string} /></TouchableOpacity>
                    <Text style={[tw`text-2xl font-bold mb-1`, {color: theme.colors.text}]}>{template.templateName}</Text>
                    <Text style={[tw`mb-4 capitalize`, {color: theme.colors.textSecondary}]}>{template.modelType} Template</Text>
                    <ScrollView>
                        <Text style={[tw`font-bold mb-2`, {color: theme.colors.text}]}>Fields included:</Text>
                        {template.fields.map(field => (
                            <View key={field.fieldName} style={[tw`flex-row items-center p-3 mb-2 rounded-lg`, {backgroundColor: theme.colors.background}]}>
                                <Type size={16} color={theme.colors.textSecondary as string} />
                                <Text style={[tw`ml-3`, {color: theme.colors.textSecondary}]}>{field.label}</Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};