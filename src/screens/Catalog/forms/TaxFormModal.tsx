import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { Percent, Type, X } from 'lucide-react-native';

import { useTheme } from '@/src/context/ThemeContext';
import { useAppDispatch } from '@/src/store/hooks';
import { TaxRate } from '@/src/store/types';
import { createTax, updateTax } from '@/src/store/taxSlice';
import { CustomInput } from '@/src/components/forms/FormUI';

interface TaxFormModalProps {
    visible: boolean;
    onClose: () => void;
    taxToEdit?: TaxRate | null;
}

export const TaxFormModal: React.FC<TaxFormModalProps> = ({ visible, onClose, taxToEdit }) => {
    const { theme } = useTheme();
    const dispatch = useAppDispatch();
    const [name, setName] = useState('');
    const [rate, setRate] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (taxToEdit) {
            setName(taxToEdit.name);
            setRate(String(taxToEdit.rate));
            setDescription(taxToEdit.description || '');
        } else {
            setName('');
            setRate('');
            setDescription('');
        }
    }, [taxToEdit, visible]);

    const handleSave = async () => {
        if (!name || !rate) {
            return Alert.alert("Error", "Tax name and rate are required.");
        }
        setIsLoading(true);
        try {
            const taxData = { name, rate: Number(rate), description };
            if (taxToEdit) {
                await dispatch(updateTax({ taxId: taxToEdit._id, taxData })).unwrap();
            } else {
                await dispatch(createTax(taxData)).unwrap();
            }
            onClose();
        } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to save tax rate.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
                <View style={[tw`w-11/12 p-6 rounded-xl`, { backgroundColor: theme.colors.card }]}>
                    <View style={tw`flex-row justify-between items-center mb-4`}>
                        <Text style={[tw`text-xl font-bold`, { color: theme.colors.text }]}>
                            {taxToEdit ? "Edit Tax Rate" : "Add New Tax Rate"}
                        </Text>
                        <TouchableOpacity onPress={onClose}><X size={24} color={theme.colors.textSecondary as string} /></TouchableOpacity>
                    </View>
                    <CustomInput label="Tax Name" icon={Type} value={name} onChangeText={setName} placeholder="e.g., GST 18%" />
                    <CustomInput label="Rate (%)" icon={Percent} value={rate} onChangeText={setRate} keyboardType="numeric" placeholder="e.g., 18" />
                    <CustomInput label="Description (Optional)" icon={Type} value={description} onChangeText={setDescription} />
                    <TouchableOpacity onPress={handleSave} disabled={isLoading} style={[tw`mt-4 h-12 rounded-lg items-center justify-center`, { backgroundColor: theme.colors.primary as string, opacity: isLoading ? 0.7 : 1 }]}>
                        {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={tw`text-white font-bold`}>{taxToEdit ? "Update" : "Save"}</Text>}
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};