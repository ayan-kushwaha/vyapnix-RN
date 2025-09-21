import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import tw from "twrnc";

export default function ProductCard({ product, isOwner }: { product: any; isOwner: boolean }) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity style={[tw`w-36 mr-3 p-2 rounded-xl`, { backgroundColor: theme.colors.background }]}>
      <Image source={{ uri: product.image }} style={tw`w-full h-24 rounded-lg`} resizeMode="cover" />
      <Text style={[tw`mt-2 text-sm font-semibold`, { color: theme.colors.text }]} numberOfLines={1}>
        {product.name}
      </Text>
      <Text style={[tw`text-xs mt-1`, { color: theme.colors.textSecondary }]}>₹{product.price}</Text>
      {isOwner && <Text style={tw`text-xs mt-1 text-blue-500`}>Edit</Text>}
    </TouchableOpacity>
  );
}
