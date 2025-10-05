import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { ArrowLeft, Edit, Trash2, Plus } from 'lucide-react-native';

import { useTheme } from '@/src/context/ThemeContext';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { getTaxes, deleteTax } from '@/src/store/taxSlice';
import { TaxRate } from '@/src/store/types';
import { TaxFormModal } from '../forms/TaxFormModal';
import { useTabBar } from '@/src/context/TabBarContext';

interface TaxManagementViewProps { onClose: () => void; }

export const TaxManagementView: React.FC<TaxManagementViewProps> = ({ onClose }) => {
    const { theme } = useTheme();
    const dispatch = useAppDispatch();
    const { taxes, isLoading } = useAppSelector(state => state.tax);
    const { setTabBarVisible } = useTabBar();

    const [isModalVisible, setModalVisible] = useState(false);
    const [taxToEdit, setTaxToEdit] = useState<TaxRate | null>(null);

    useEffect(() => {
        setTabBarVisible(false); // page open → hide tab
        return () => setTabBarVisible(true); // page exit → show tab again
    }, []);
    useEffect(() => {
        dispatch(getTaxes());
    }, [dispatch]);

    const handleAdd = () => {
        setTaxToEdit(null);
        setModalVisible(true);
    };

    const handleEdit = (tax: TaxRate) => {
        setTaxToEdit(tax);
        setModalVisible(true);
    };

    const handleDelete = (tax: TaxRate) => {
        Alert.alert("Delete Tax", `Are you sure you want to delete "${tax.name}"?`, [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", style: "destructive", onPress: () => dispatch(deleteTax(tax._id)) }
        ]);
    };

    const renderItem = ({ item }: { item: TaxRate }) => (
        <View style={[tw`flex-row justify-between items-center p-4 rounded-lg mb-3`, { backgroundColor: theme.colors.card }]}>
            <View>
                <Text style={[tw`font-bold text-base`, { color: theme.colors.text }]}>{item.name}</Text>
                <Text style={[tw`text-sm`, { color: theme.colors.textSecondary }]}>{item.rate}%</Text>
            </View>
            <View style={tw`flex-row items-center`}>
                <TouchableOpacity onPress={() => handleEdit(item)} style={tw`p-2`}><Edit size={20} color={theme.colors.primary as string} /></TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item)} style={tw`p-2 ml-2`}><Trash2 size={20} color={theme.colors.destructive as string} /></TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={[tw`flex-1`, { backgroundColor: theme.colors.background }]}>
            <TaxFormModal visible={isModalVisible} onClose={() => setModalVisible(false)} taxToEdit={taxToEdit} />

            <View style={[tw`flex-row items-center justify-between p-4 border-b`, { borderColor: theme.colors.border }]}>
                <TouchableOpacity onPress={onClose} style={tw`p-2`}><ArrowLeft size={24} color={theme.colors.text as string} /></TouchableOpacity>
                <Text style={[tw`text-xl font-bold`, { color: theme.colors.text }]}>Manage Tax Rates</Text>
                <TouchableOpacity onPress={handleAdd} style={tw`p-2`}><Plus size={24} color={theme.colors.primary as string} /></TouchableOpacity>
            </View>

            {isLoading && !taxes.length ? <ActivityIndicator style={tw`mt-10`} /> : (
                <FlatList
                    data={taxes}
                    renderItem={renderItem}
                    keyExtractor={item => item._id}
                    contentContainerStyle={tw`p-4`}
                    ListEmptyComponent={<Text style={[tw`text-center mt-10`, { color: theme.colors.textSecondary }]}>No tax rates found. Add one to get started.</Text>}
                />
            )}
        </View>
    );
};