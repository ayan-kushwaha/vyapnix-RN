// src/screens/Catalog/TemplateCard.tsx
import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import tw from "twrnc";
import { useTheme } from "../../context/ThemeContext";
import { ItemCard } from "./ItemCard";
import { useAppSelector } from "../../store/hooks";
import { catalogText, Locale } from "./templatesData";

interface TemplateCardProps {
  templateId: string;
  locale: Locale;
  onAddItem: (templateId: string) => void;
  onEditTemplate: (templateId: string) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ templateId, locale, onAddItem, onEditTemplate }) => {
  const { theme } = useTheme();
  const template = useAppSelector((state) => state.catalog.templates.find((t) => t._id === templateId));
  const items = useAppSelector((state) =>
    state.catalog.items.filter((i) => i.template?._id === templateId)
  );

  if (!template) return null;

  return (
    <View style={tw`mb-6`}>
      <View style={tw`flex-row justify-between items-center mb-2`}>
        <Text style={[tw`text-lg font-bold`, { color: theme.colors.text }]}>{template.templateName}</Text>
        <View style={tw`flex-row`}>
          <TouchableOpacity onPress={() => onEditTemplate(templateId)} style={tw`mr-2`}>
            <Text style={{ color: theme.colors.primary }}>{catalogText[locale].edit}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onAddItem(templateId)}>
            <Text style={{ color: theme.colors.destructive }}>{catalogText[locale].addItem}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={items}
        horizontal
        keyExtractor={(item) => item._id}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => <ItemCard item={item} locale={locale} />}
        ListEmptyComponent={
          <Text style={[tw`text-sm`, { color: theme.colors.textSecondary }]}>
            {catalogText[locale].noItems}
          </Text>
        }
      />
    </View>
  );
};
