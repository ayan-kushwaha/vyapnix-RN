// src/screens/Catalog/ItemCard.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import tw from "twrnc";
import { useTheme } from "../../context/ThemeContext";
import { catalogText, Locale } from "./templatesData";

interface ItemCardProps {
  item: any;
  locale: Locale;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, locale }) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity style={[tw`p-4 mr-3 rounded-lg`, { backgroundColor: theme.colors.card }]}>
      <Text style={[tw`font-bold`, { color: theme.colors.text }]}>{item.name}</Text>
      {item.pricingOptions?.[0] && (
        <Text style={{ color: theme.colors.textSecondary }}>
          {item.pricingOptions[0].basePrice} + Tax {item.pricingOptions[0].taxAmount}
        </Text>
      )}
      {item.dynamicFields && Object.keys(item.dynamicFields).map((key) => (
        <Text key={key} style={{ color: theme.colors.textSecondary, fontSize: 12 }}>
          {key}: {item.dynamicFields[key]}
        </Text>
      ))}
    </TouchableOpacity>
  );
};
