import React from "react";
import { View, Text, TouchableOpacity, Image, FlatList } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import tw from "twrnc";
import { MapPin } from "lucide-react-native";
import ProductCard from "./ProductCard";

export default function StoreCard({ store, isOwner }: { store: any; isOwner: boolean }) {
  const { theme } = useTheme();

  return (
    <View style={[tw`rounded-2xl p-4 mb-4 mx-4 shadow`, { backgroundColor: theme.colors.card }]}>
      {/* Header */}
      <View style={tw`flex-row items-center justify-between`}>
        <View style={tw`flex-row items-center`}>
          <Image source={{ uri: store.logo }} style={tw`w-12 h-12 rounded-full`} />
          <View style={tw`ml-3`}>
            <Text style={[tw`text-base font-bold`, { color: theme.colors.text }]}>{store.name}</Text>
            <View style={tw`flex-row items-center mt-1`}>
              <MapPin size={14} color={theme.colors.textSecondary} />
              <Text style={[tw`ml-1 text-xs`, { color: theme.colors.textSecondary }]}>{store.location}</Text>
            </View>
          </View>
        </View>
        {store.isOnline && <View style={tw`w-3 h-3 rounded-full bg-green-500`} />}
      </View>

      {/* Categories */}
      <View style={tw`flex-row flex-wrap mt-2`}>
        {store.categories.map((cat: string) => (
          <Text
            key={cat}
            style={[
              tw`text-xs font-medium px-2 py-0.5 mr-2 mb-2 rounded-full`,
              { backgroundColor: theme.colors.background, color: theme.colors.textSecondary },
            ]}
          >
            {cat}
          </Text>
        ))}
      </View>

      {/* Products */}
      <FlatList
        data={store.products}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => <ProductCard product={item} isOwner={isOwner} />}
        style={tw`mt-3`}
      />

      {/* Owner Actions */}
      {isOwner && (
        <TouchableOpacity style={[tw`mt-3 py-2 rounded-xl items-center`, { backgroundColor: theme.colors.primary }]}>
          <Text style={tw`text-white font-semibold`}>+ Add Product</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
