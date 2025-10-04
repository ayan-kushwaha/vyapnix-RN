import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions, NativeSyntheticEvent, NativeScrollEvent, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { ArrowLeft, Edit, Trash2, Tag, Info, Warehouse, Eye, ThumbsUp, Star, MoreVertical, Globe, Lock, ImageIcon } from 'lucide-react-native';

import { useTheme } from '@/src/context/ThemeContext';
import { CatalogItem, ItemTemplate } from '@/src/store/types';
import { itemDetailData } from '@/src/data/itemDetailData';
import { useLanguage } from '@/src/context/LanguageContext';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { updateItem } from '@/src/store/catalogSlice';
import { ActionsModal } from '../ActionsModal';

const { width } = Dimensions.get('window');

// --- Interface ---
interface ItemDetailViewProps {
    item: CatalogItem;
    template: ItemTemplate;
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

// --- DetailRow Sub-component ---
const DetailRow = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string }) => {
    const { theme } = useTheme();
    return (
        <View style={[tw`flex-row items-start py-3 border-b`, { borderColor: theme.colors.border }]}>
            <Icon size={18} color={theme.colors.textSecondary as string} style={tw`mt-1 mr-4`} />
            <View style={tw`flex-1`}>
                <Text style={[tw`text-sm`, { color: theme.colors.textSecondary }]}>{label}</Text>
                <Text style={[tw`text-base font-semibold`, { color: theme.colors.text }]}>{value}</Text>
            </View>
        </View>
    );
};

// --- Main Component ---
export const ItemDetailView: React.FC<ItemDetailViewProps> = ({ item, template, onClose, onEdit, onDelete }) => {
    const { theme } = useTheme();
    const { locale } = useLanguage();
    const t = (itemDetailData as any)[locale] || itemDetailData.en;
    const dispatch = useAppDispatch();
    const [activeIndex, setActiveIndex] = useState(0);
    const [isMenuVisible, setMenuVisible] = useState(false);

    // Get the latest version of the item from the Redux store
    const itemFromStore = useAppSelector((state) =>
        state.catalog.items.find(i => i._id === item._id)
    );
    const displayItem = itemFromStore || item;

    const price = (displayItem as any).pricingOptions?.[0];

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const index = Math.round(scrollPosition / width);
        setActiveIndex(index);
    };

    const handleToggleStatus = () => {
        const newStatus = !displayItem.isActive;
        dispatch(updateItem({ itemId: displayItem._id, itemData: { isActive: newStatus } }));
    };

    const menuActions = [
        { title: "Edit Item", icon: Edit, onPress: onEdit },
        { title: "Delete Item", icon: Trash2, onPress: onDelete, isDestructive: true }
    ];

    return (
        <SafeAreaView style={[tw`flex-1`, { backgroundColor: theme.colors.background }]}>
            <ActionsModal visible={isMenuVisible} onClose={() => setMenuVisible(false)} actions={menuActions} title={`Actions for ${displayItem.name}`} />

            {/* Header */}
            <View style={[tw`flex-row items-center justify-between p-4 border-b`, { borderColor: theme.colors.border }]}>
                <TouchableOpacity onPress={onClose} style={tw`p-2`}><ArrowLeft size={24} color={theme.colors.text as string} /></TouchableOpacity>
                <Text style={[tw`text-xl font-bold flex-1 text-center mx-2`, { color: theme.colors.text }]} numberOfLines={1}>{displayItem.name}</Text>
                <TouchableOpacity onPress={() => setMenuVisible(true)} style={tw`p-2`}>
                    <MoreVertical size={24} color={theme.colors.text as string} />
                </TouchableOpacity>
            </View>

            <ScrollView style={tw`flex-1 mb-16`}>
                {/* Image Slider Section */}
                <View style={tw`h-72 bg-gray-200 dark:bg-gray-800`}>
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                    >
                        {displayItem.images && displayItem.images.length > 0 ? (
                            displayItem.images.map((img, index) => <Image key={index} source={{ uri: img }} style={{ width, height: '100%' }} />)
                        ) : (
                            <View style={[tw`h-full w-full  items-center justify-center`, { backgroundColor: theme.colors.border, width }]}>
                                <ImageIcon size={60} color={theme.colors.textSecondary as string} />
                                <Text style={{ color: theme.colors.textSecondary as string }}>
                                    {t.noImage}
                                </Text>
                            </View>
                        )}
                    </ScrollView>
                    {displayItem.images && displayItem.images.length > 1 && (
                        <View style={tw`absolute bottom-4 left-0 right-0 flex-row justify-center items-center`}>
                            {displayItem.images.map((_, index) => (<View key={index} style={[tw`h-2 w-2 rounded-full mx-1.5`, { backgroundColor: activeIndex === index ? theme.colors.primary as string : 'rgba(255, 255, 255, 0.5)' }]} />))}
                        </View>
                    )}
                </View>

                {/* Content Section */}
                <View style={tw`p-4`}>
                    <Text style={[tw`text-3xl font-bold`, { color: theme.colors.text }]}>{displayItem.name}</Text>

                    {/* Analytics */}
                    <View style={tw`flex-row items-center my-3`}>
                        <View style={tw`flex-row items-center mr-4`}><Eye size={16} color={theme.colors.textSecondary as string} /><Text style={tw`ml-1.5 text-sm text-gray-500`}>{displayItem.views || 0}</Text></View>
                        <View style={tw`flex-row items-center mr-4`}><ThumbsUp size={16} color={theme.colors.textSecondary as string} /><Text style={tw`ml-1.5 text-sm text-gray-500`}>{displayItem.likes || 0}</Text></View>
                        <View style={tw`flex-row items-center`}><Star size={16} color={theme.colors.textSecondary as string} /><Text style={tw`ml-1.5 text-sm text-gray-500`}>{displayItem.rating?.toFixed(1) || 'N/A'}</Text></View>
                    </View>

                    {/* Public/Private Status Toggle */}
                    <View style={[tw`flex-row justify-between items-center p-4 my-2 rounded-lg`, { backgroundColor: theme.colors.card }]}>
                        <View style={tw`flex-1 mr-4`}>
                            <View style={tw`flex-row items-center`}>
                                {displayItem.isActive ? <Globe size={18} color={theme.colors.secondary as string} /> : <Lock size={18} color={theme.colors.textSecondary as string} />}
                                <Text style={[tw`font-bold ml-2`, { color: theme.colors.text }]}>{displayItem.isActive ? t.status.publicLabel : t.status.privateLabel}</Text>
                            </View>
                            <Text style={[tw`text-xs mt-1`, { color: theme.colors.textSecondary }]}>{displayItem.isActive ? t.status.publicDesc : t.status.privateDesc}</Text>
                        </View>
                        <Switch
                            trackColor={{ false: theme.colors.border as string, true: theme.colors.secondary as string }}
                            thumbColor={"white"}
                            ios_backgroundColor={theme.colors.border as string}
                            onValueChange={handleToggleStatus}
                            value={displayItem.isActive}
                        />
                    </View>

                    {/* Price Breakdown */}
                    {price && (
                        <View style={[tw`p-4 my-2 rounded-lg`, { backgroundColor: theme.colors.card }]}>
                            <View style={tw`flex-row justify-between items-center`}><Text style={{ color: theme.colors.textSecondary }}>{t.price.basePrice}</Text><Text style={{ color: theme.colors.textSecondary }}>₹{(price.basePrice || 0).toFixed(2)}</Text></View>
                            <View style={tw`flex-row justify-between items-center my-1`}><Text style={{ color: theme.colors.textSecondary }}>{t.price.tax} ({displayItem.tax?.name || 'N/A'})</Text><Text style={{ color: theme.colors.textSecondary }}>+ ₹{(price.taxAmount || 0).toFixed(2)}</Text></View>
                            <View style={[tw`border-t mt-2 pt-2`, { borderColor: theme.colors.border }]}><View style={tw`flex-row justify-between items-center`}><Text style={[tw`font-bold`, { color: theme.colors.text }]}>{t.price.totalPrice}</Text><Text style={[tw`font-bold text-lg`, { color: theme.colors.primary as string }]}>₹{(price.totalPrice || 0).toFixed(2)}</Text></View></View>
                        </View>
                    )}

                    {/* Other Details */}
                    <DetailRow icon={Info} label={t.description} value={displayItem.description || "No description provided."} />
                    <DetailRow icon={Warehouse} label={t.stock} value={`${displayItem.stock || 0} ${t.stockUnit}`} />

                    {/* Dynamic Fields */}
                    <Text style={[tw`text-lg font-bold mt-6 mb-2`, { color: theme.colors.text }]}>{t.specifications}</Text>
                    {Object.entries(displayItem.dynamicFields).map(([key, value]) => {
                        const fieldLabel = template.fields.find((f: { fieldName: string, label: string }) => f.fieldName === key)?.label || key;
                        return <DetailRow key={key} icon={Tag} label={fieldLabel} value={String(value)} />
                    })}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

