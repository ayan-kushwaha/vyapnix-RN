// src/screens/Catalog/ItemCard.tsx

import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import { MoreVertical, Image as ImageIcon } from 'lucide-react-native';
import { useTheme } from '@/src/context/ThemeContext';
import { CatalogItem } from '@/src/store/types';

interface ItemCardProps {
  item: CatalogItem;
  onEdit: (item: CatalogItem) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onOpenMenu }) => {
  const { theme } = useTheme();

  // Price ko format karne ke liye helper
  const getPrice = () => {
    if (item.pricingOptions && item.pricingOptions.length > 0) {
      return `₹${item.pricingOptions[0].basePrice}`;
    }
    return 'N/A';
  };

  return (
    <View style={[tw`w-40 mr-4 rounded-xl overflow-hidden`, { backgroundColor: theme.colors.card }, theme.shadows.md]}>
      {/* Item Image */}
      <View style={[tw`h-24 w-full items-center justify-center`, { backgroundColor: theme.colors.border }]}>
        {item.images && item.images.length > 0 ? (
          <Image source={{ uri: item.images[0] }} style={tw`h-full w-full`} resizeMode="cover" />
        ) : (
          <ImageIcon size={40} color={theme.colors.textSecondary} />
        )}
      </View>

      {/* Item Details */}
      <View style={tw`p-3`}>
        <Text style={[tw`font-bold`, { color: theme.colors.text }]} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={tw`flex-row justify-between items-center mt-2`}>
          <Text style={[tw`text-lg font-bold`, { color: theme.colors.primary }]}>{getPrice()}</Text>
          <TouchableOpacity onPress={onOpenMenu}>
            <MoreVertical size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};