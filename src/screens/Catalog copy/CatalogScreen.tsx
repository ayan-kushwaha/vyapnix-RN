// src/screens/Catalog/CatalogScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, FlatList, TextInput, TouchableOpacity } from "react-native";
import tw from "twrnc";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getMyTemplates, getMyItems } from "../../store/catalogSlice";
import { useTheme } from "../../context/ThemeContext";
import { catalogText, Locale } from "./templatesData";
import { TemplateCard } from "./TemplateCard";
import AddTemplateModal from "./AddTemplateModal";
import AddItemModal from "./AddItemModal";

interface CatalogScreenProps {
  locale: Locale;
}

export const CatalogScreen: React.FC<CatalogScreenProps> = ({ locale }) => {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const templates = useAppSelector((state) => state.catalog.templates);

  const [searchQuery, setSearchQuery] = useState("");
  const [showAddTemplate, setShowAddTemplate] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [showAddItem, setShowAddItem] = useState(false);

  useEffect(() => {
    dispatch(getMyTemplates());
    dispatch(getMyItems());
  }, []);

  const filteredTemplates = templates.filter((t) =>
    t.templateName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={tw`p-4`}>
        <TextInput
          style={[tw`p-3 rounded-lg mb-4`, { backgroundColor: theme.colors.card, color: theme.colors.text }]}
          placeholder={catalogText[locale].searchPlaceholder}
          placeholderTextColor={theme.colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <TouchableOpacity
          onPress={() => setShowAddTemplate(true)}
          style={[tw`mb-4 p-3 rounded-lg items-center`, { backgroundColor: theme.colors.primary }]}
        >
          <Text style={tw`text-white font-bold`}>{catalogText[locale].addTemplate}</Text>
        </TouchableOpacity>

        <FlatList
          data={filteredTemplates}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TemplateCard
              templateId={item._id}
              locale={locale}
              onAddItem={(templateId) => { setSelectedTemplateId(templateId); setShowAddItem(true); }}
              onEditTemplate={(templateId) => { setSelectedTemplateId(templateId); setShowAddTemplate(true); }}
            />
          )}
        />
      </View>

      <AddTemplateModal
        visible={showAddTemplate}
        onClose={() => { setShowAddTemplate(false); setSelectedTemplateId(null); }}
        editTemplateId={selectedTemplateId}
      />

      {selectedTemplateId && (
        <AddItemModal
          visible={showAddItem}
          onClose={() => { setShowAddItem(false); setSelectedTemplateId(null); }}
          templateId={selectedTemplateId}
        />
      )}
    </SafeAreaView>
  );
};
