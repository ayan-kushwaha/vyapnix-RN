// src/screens/Catalog/AddItemModal.tsx
import React, { useState, useEffect } from "react";
import { View, Text, Modal, TouchableOpacity, TextInput, ScrollView, Alert } from "react-native";
import tw from "twrnc";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { createItem, updateItem } from "../../store/catalogSlice";
import { useTheme } from "../../context/ThemeContext";

interface AddItemModalProps {
  visible: boolean;
  onClose: () => void;
  templateId: string;
  editItemId?: string;
}

const AddItemModal: React.FC<AddItemModalProps> = ({ visible, onClose, templateId, editItemId }) => {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const editItem = useAppSelector((s) => s.catalog.items.find((i) => i._id === editItemId));

  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);

  useEffect(() => {
    if (editItem) {
      setName(editItem.name);
      setPrice(editItem.pricingOptions?.[0]?.basePrice || 0);
    }
  }, [editItem]);

  const handleSave = async () => {
    if (!name.trim() || price <= 0) return Alert.alert("Validation", "Name and price required");

    try {
      const payload = {
        templateId,
        name,
        pricing: { sellingPrice: price },
      };

      if (editItem) {
        await dispatch(updateItem({ _id: editItem._id, ...payload })).unwrap();
      } else {
        await dispatch(createItem(payload)).unwrap();
      }

      onClose();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Unknown error");
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
        <View style={[tw`bg-white p-6 rounded-lg w-11/12`, { backgroundColor: theme.colors.card }]}>
          <Text style={[tw`text-lg font-bold mb-4`, { color: theme.colors.text }]}>
            {editItem ? "Edit Item" : "Add Item"}
          </Text>

          <TextInput
            placeholder="Item Name"
            value={name}
            onChangeText={setName}
            style={[tw`p-3 mb-4 rounded-lg`, { backgroundColor: theme.colors.background, color: theme.colors.text }]}
          />

          <TextInput
            placeholder="Price"
            value={price.toString()}
            onChangeText={(v) => setPrice(Number(v))}
            keyboardType="number-pad"
            style={[tw`p-3 mb-4 rounded-lg`, { backgroundColor: theme.colors.background, color: theme.colors.text }]}
          />

          <View style={tw`flex-row justify-end`}>
            <TouchableOpacity onPress={onClose} style={tw`mr-4`}>
              <Text style={{ color: theme.colors.destructive }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave}>
              <Text style={{ color: theme.colors.primary }}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddItemModal;
