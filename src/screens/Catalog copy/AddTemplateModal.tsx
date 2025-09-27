    // src/screens/Catalog/AddTemplateModal.tsx
import React, { useState, useEffect } from "react";
import { View, Text, Modal, TouchableOpacity, TextInput, ScrollView, Alert } from "react-native";
import tw from "twrnc";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { createTemplate, updateTemplate } from "../../store/catalogSlice";
import { useTheme } from "../../context/ThemeContext";

interface AddTemplateModalProps {
  visible: boolean;
  onClose: () => void;
  editTemplateId?: string | null;
}

const AddTemplateModal: React.FC<AddTemplateModalProps> = ({ visible, onClose, editTemplateId }) => {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const editTemplate = useAppSelector((s) => s.catalog.templates.find((t) => t._id === editTemplateId));

  const [templateName, setTemplateName] = useState("");
  const [modelType, setModelType] = useState("e-commerce");

  useEffect(() => {
    if (editTemplate) {
      setTemplateName(editTemplate.templateName);
      setModelType(editTemplate.modelType);
    }
  }, [editTemplate]);

  const handleSave = async () => {
    if (!templateName.trim()) return Alert.alert("Validation", "Template name is required");
    try {
      if (editTemplate) {
        await dispatch(updateTemplate({ _id: editTemplate._id, templateName, modelType })).unwrap();
      } else {
        await dispatch(createTemplate({ templateName, modelType })).unwrap();
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
            {editTemplate ? "Edit Template" : "Add Template"}
          </Text>

          <TextInput
            placeholder="Template Name"
            value={templateName}
            onChangeText={setTemplateName}
            style={[tw`p-3 mb-4 rounded-lg`, { backgroundColor: theme.colors.background, color: theme.colors.text }]}
          />

          <TextInput
            placeholder="Model Type (e-commerce / booking / subscription)"
            value={modelType}
            onChangeText={setModelType}
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

export default AddTemplateModal;
