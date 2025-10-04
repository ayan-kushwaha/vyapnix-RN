import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import { MoreVertical, Image as ImageIcon } from 'lucide-react-native';
import { useTheme } from '@/src/context/ThemeContext';
import { CatalogItem } from '@/src/store/types';

interface ItemCardProps {
  item: CatalogItem;
  onOpenMenu: () => void;
  onPress: () => void; // This was missing
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onOpenMenu, onPress }) => { // ✅ FIX: Added 'onPress' here
  const { theme } = useTheme();

  // Using type casting to safely access 'pricingOptions' which might not be in the base type yet
  const price = (item as any).pricingOptions?.[0]?.totalPrice
    ? `₹${(item as any).pricingOptions[0].totalPrice.toFixed(2)}`
    : 'N/A';

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={[tw`w-48 mr-4 mb-3 rounded-md overflow-hidden`, { backgroundColor: theme.colors.card }, theme.shadows.md]} >
        <View style={[tw`h-40 w-full  items-center justify-center`, { backgroundColor: theme.colors.border }]}>
          {item.images && item.images.length > 0 ?
            <Image source={{ uri: item.images[0] }} style={tw`h-full w-full`} resizeMode="cover" /> :
            <ImageIcon size={40} color={theme.colors.textSecondary as string} />
          }
        </View>
        <View style={tw`p-3`}>
          <Text style={[tw`font-bold`, { color: theme.colors.text }]} numberOfLines={1}>{item.name}</Text>
          <View style={tw`flex-row justify-between items-center mt-2`}>
            <Text style={[tw`text-lg font-bold`, { color: theme.colors.primary as string }]}>{price}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

