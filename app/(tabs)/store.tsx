import React, { useContext, useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, SafeAreaView, TextInput, FlatList } from "react-native";
import { Search, MoreVertical, MapPin } from "lucide-react-native";
import tw from "twrnc";
import { useTheme } from "../../src/context/ThemeContext";
import { RoleContext } from "../../src/context/RoleContext";
import { CustomTabs } from "../../src/components/ui/CustomTabs";
// import { LanguageModal } from "../src/components/LanguageModal";
import StoreCard from "../../src/screens/Store/StoreCard";
import { mockStores } from "../../src/data/storeData"; // 🔹 dummy stores data

export default function Store() {
  const { theme } = useTheme();
  const { role } = useContext(RoleContext);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("nearby");
  const [langModalVisible, setLangModalVisible] = useState(false);

  const tabs = [
    { key: "nearby", label: "Nearby", icon: MapPin },
    { key: "popular", label: "Popular", icon: Search },
    { key: "favorites", label: "Favorites", icon: MoreVertical },
  ];

  return (
    <SafeAreaView style={[tw`flex-1`, { backgroundColor: theme.colors.background }]}>
      {/* 🔹 Header */}
      <View style={tw`flex-row items-center justify-between px-4 py-3`}>
        <View style={[tw`flex-row items-center flex-1 bg-white rounded-xl px-3 py-2 mr-3`, { backgroundColor: theme.colors.card }]}>
          <Search size={18} color={theme.colors.textSecondary} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search store or products"
            placeholderTextColor={theme.colors.textSecondary}
            style={[tw`ml-2 flex-1 text-sm`, { color: theme.colors.text }]}
          />
        </View>
        <TouchableOpacity onPress={() => setLangModalVisible(true)}>
          <MoreVertical size={22} color={theme.colors.iconColor} />
        </TouchableOpacity>
      </View>

      {/* 🔹 Tabs */}
      <CustomTabs tabs={tabs} selectedTab={selectedTab} onTabPress={setSelectedTab} />

      {/* 🔹 Store List */}
      <FlatList
        data={mockStores}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <StoreCard store={item} isOwner={role === "Business"} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 150 }}
      />

      {/* 🔹 Language Modal */}
      {/* <LanguageModal visible={langModalVisible} onClose={() => setLangModalVisible(false)} /> */}
    </SafeAreaView>
  );
}
