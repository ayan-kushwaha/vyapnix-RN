// src / sreeens /Contacts / contactsDetailScreen.tsx

import { ArrowLeft, MoreVertical, Phone, MessageSquare, IndianRupee, Briefcase, Users, MapPin, Trash2, Edit, Share2, Shield, Archive, Book, Clock, UserPlus, UserCheck, Heart } from 'lucide-react-native';
import { Dimensions, Image, ImageBackground, Modal, Pressable, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import React, { FC, useMemo, useState } from 'react';
import { BarChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';
import { format, formatRelative } from 'date-fns';
import tw from 'twrnc';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { AttendanceCalendar } from '../../components/ui/AttendanceCalendar';
// Make sure to import the new `mockContacts` and types from the updated data file
import { Contact, contactsScreenData, mockContacts, Product, Transaction, ContactRole } from '../../data/contactsData';

// --- Helper Components (Unchanged) ---
const ActionButton: FC<{ icon: FC<any>, label: string }> = ({ icon: Icon, label }) => { const { theme } = useTheme(); return (<TouchableOpacity style={tw`items-center flex-1`}><View style={[tw`w-14 h-14 rounded-full items-center justify-center mb-2`, { backgroundColor: `${theme.colors.primary}1A` }]}><Icon size={24} color={theme.colors.primary} /></View><Text style={[tw`text-xs font-medium`, { color: theme.colors.primary }]}>{label}</Text></TouchableOpacity>); };
const InfoCard: FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => { const { theme } = useTheme(); return (<View style={[tw`mx-4 mb-4 p-4 rounded-2xl`, { backgroundColor: theme.colors.card }]}><Text style={[tw`text-base font-bold mb-3`, { color: theme.colors.text }]}>{title}</Text>{children}</View>); };
const DetailRow: FC<{ icon: FC<any>; label: string; value: string | React.ReactNode }> = ({ icon: Icon, label, value }) => { const { theme } = useTheme(); return (<View style={tw`flex-row items-start mb-3`}><Icon size={16} color={theme.colors.textSecondary} style={tw`mr-4 mt-1`} /><View style={tw`flex-1`}><Text style={[tw`text-xs`, { color: theme.colors.textSecondary }]}>{label}</Text>{typeof value === 'string' ? (<Text style={[tw`text-sm font-medium`, { color: theme.colors.text }]}>{value}</Text>) : (value)}</View></View>); };
const Stat: FC<{ label: string, value: string | number }> = ({ label, value }) => { const { theme } = useTheme(); return (<View style={tw`items-center px-2`}><Text style={[tw`text-lg font-bold`, { color: theme.colors.text }]}>{value}</Text><Text style={[tw`text-xs mt-1`, { color: theme.colors.textSecondary }]}>{label}</Text></View>); };

// --- ✨ NEW & IMPROVED HisabKitab (LedgerBook) Component ---
const HisabKitab: FC<{ transactions: Transaction[]; t: any; }> = ({ transactions, t }) => {
    const { theme } = useTheme();
    const [showAll, setShowAll] = useState(false);

    // Sort transactions by date, most recent first
    const sortedTransactions = useMemo(() =>
        transactions.sort((a, b) => b.date.getTime() - a.date.getTime()),
        [transactions]);

    const visibleTransactions = showAll ? sortedTransactions : sortedTransactions.slice(0, 3);

    const { totalPaid, totalDue, advance } = useMemo(() => {
        let paid = 0;
        let totalBill = 0;
        transactions.forEach(tx => {
            paid += tx.paidAmount;
            if (tx.type === 'debit') {
                totalBill += tx.items.reduce((sum, item) => sum + item.price, 0);
            }
        });
        const balance = paid - totalBill;
        return {
            totalPaid: paid,
            totalDue: balance < 0 ? Math.abs(balance) : 0,
            advance: balance > 0 ? balance : 0
        };
    }, [transactions]);

    // --- ✨ New Ledger Entry Card with Detailed Breakdown ---
    const LedgerEntryCard: FC<{ tx: Transaction }> = ({ tx }) => {
        const { theme } = useTheme();
        const totalAmount = useMemo(() =>
            tx.type === 'credit'
                ? tx.paidAmount
                : tx.items.reduce((sum, item) => sum + item.price, 0),
            [tx]);

        const due = totalAmount - tx.paidAmount;

        const getStatusColor = () => {
            if (tx.type === 'credit') return '#22c55e'; // Green for credit
            if (due > 0) return '#ef4444'; // Red for due
            return theme.colors.textSecondary; // Grey for settled
        };
        const statusColor = getStatusColor();

        const itemSummary = tx.items.map(item => `${item.name} (${item.quantity})`).join(', ');

        return (
            <View style={[tw`mb-3 rounded-xl  p-3 border-l-4`, { backgroundColor: theme.colors.background, borderColor: statusColor }]}>
                <Text style={[tw`font-bold text-base`, { color: theme.colors.text }]}>{tx.title}</Text>
                {tx.items.length > 0 && <Text style={[tw`text-sm mt-1`, { color: theme.colors.textSecondary }]}>{itemSummary}</Text>}

                <View style={tw`border-t border-gray-500/10 my-3`} />

                {/* --- ✨ New Price Breakdown Section --- */}
                <View style={tw`px-1`}>
                    {/* Total Price (only for debit transactions) */}
                    {tx.type === 'debit' && (
                        <View style={tw`flex-row justify-between mb-1.5`}>
                            <Text style={[tw`text-sm font-semibold`, { color: theme.colors.textSecondary }]}>{t.labels.totalPrice}</Text>
                            <Text style={[tw`text-sm font-semibold`, { color: theme.colors.textSecondary }]}>₹{totalAmount}</Text>
                        </View>
                    )}
                    {/* Paid Amount */}
                    <View style={tw`flex-row justify-between mb-1.5`}>
                        <Text style={[tw`text-sm font-semibold`, { color: '#22c55e' }]}>{t.labels.paidAmount}</Text>
                        <Text style={[tw`text-sm font-semibold`, { color: '#22c55e' }]}>₹{tx.paidAmount}</Text>
                    </View>
                    {/* Remaining Due (only if due > 0) */}
                    {due > 0 && (
                        <View style={tw`flex-row justify-between`}>
                            <Text style={[tw`text-sm font-bold`, { color: '#ef4444' }]}>{t.labels.remainingDue}</Text>
                            <Text style={[tw`text-sm font-bold`, { color: '#ef4444' }]}>₹{due}</Text>
                        </View>
                    )}
                </View>
                <Text style={[tw`text-right text-xs mt-3`, { color: theme.colors.textSecondary }]}>{format(tx.date, 'dd MMM, yyyy, p')}</Text>
            </View>
        );
    };

    return (
        <InfoCard title={t.labels.ledgerTitle} >
            {/* --- New Summary Header --- */}
            <View style={tw`flex-row justify-around mb-4`}>
                <View style={tw`items-center`}>
                    <Text style={[tw`text-lg font-bold`, { color: '#22c55e' }]}>₹{totalPaid}</Text>
                    <Text style={[tw`text-xs`, { color: theme.colors.textSecondary }]}>{t.labels.totalPaid}</Text>
                </View>
                <View style={tw`items-center`}>
                    <Text style={[tw`text-lg font-bold`, { color: '#ef4444' }]}>₹{totalDue}</Text>
                    <Text style={[tw`text-xs`, { color: theme.colors.textSecondary }]}>{t.labels.totalDue}</Text>
                </View>
                {advance > 0 && (
                    <View style={tw`items-center`}>
                        <Text style={[tw`text-lg font-bold`, { color: '#f97316' }]}>₹{advance}</Text>
                        <Text style={[tw`text-xs`, { color: theme.colors.textSecondary }]}>{t.labels.advance}</Text>
                    </View>
                )}
            </View>

            {visibleTransactions.map(tx => <LedgerEntryCard key={tx.id} tx={tx} />)}

            {sortedTransactions.length > 3 && (
                <TouchableOpacity onPress={() => setShowAll(!showAll)} style={tw`items-center mt-2`}>
                    <Text style={[tw`font-bold`, { color: theme.colors.primary }]}>
                        {showAll ? t.labels.showLess : t.labels.viewAll}
                    </Text>
                </TouchableOpacity>
            )}
        </InfoCard>
    );
};


const ProductCatalogue: FC<{ products: Product[]; t: any }> = ({ products, t }) => { const { theme } = useTheme(); return (<InfoCard title={t.labels.catalogue}><ScrollView horizontal showsHorizontalScrollIndicator={false}>{products.map((product) => (<View key={product.id} style={tw`w-32 mr-3`}><Image source={{ uri: product.imageUrl }} style={tw`h-32 w-full rounded-lg bg-gray-200`} /><Text style={[tw`mt-2 font-semibold text-sm`, { color: theme.colors.text }]}>{product.name}</Text><Text style={[tw`text-xs`, { color: theme.colors.primary }]}>₹{product.price}</Text></View>))}</ScrollView></InfoCard>); };
const EmployeeDashboard: FC<{ contact: Contact; t: any }> = ({ contact, t }) => {
    const { theme } = useTheme();
    if (!contact.employeeDetails) return null;
    const chartData = { labels: contact.employeeDetails.salaryRecords.map((s) => s.month.substring(0, 3)), datasets: [{ data: contact.employeeDetails.salaryRecords.map((s) => s.amount / 1000) }] };
    return (<View><InfoCard title={t.employeeDashboard}><DetailRow icon={Briefcase} label={t.labels.position} value={contact.employeeDetails.position} /><DetailRow icon={Users} label={t.labels.department} value={contact.employeeDetails.department} /><DetailRow icon={MapPin} label={t.labels.location} value={contact.employeeDetails.location} /></InfoCard><InfoCard title="Salary Chart (in ₹ thousands)"><BarChart data={chartData} width={Dimensions.get('window').width - 64} height={220} yAxisLabel="₹" yAxisSuffix="k" chartConfig={{ backgroundColor: theme.colors.card, backgroundGradientFrom: theme.colors.card, backgroundGradientTo: theme.colors.card, decimalPlaces: 1, color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`, labelColor: (opacity = 1) => theme.colors.textSecondary }} style={{ borderRadius: 16 }} /></InfoCard><InfoCard title={t.labels.attendance}><AttendanceCalendar records={contact.employeeDetails.attendance} /></InfoCard></View>);
};
const ClientDashboard: FC<{ contact: Contact; t: any }> = ({ contact, t }) => { if (!contact.clientDetails) return null; return (<InfoCard title={t.clientDashboard}><DetailRow icon={IndianRupee} label={t.labels.balance} value={`₹ ${contact.clientDetails.khataBalance}`} /></InfoCard>); };
const BusinessDashboard: FC<{ contact: Contact; t: any }> = ({ contact, t }) => { if (!contact.businessDetails) return null; return (<View><InfoCard title={t.businessInfo}><DetailRow icon={Briefcase} label={t.labels.category} value={contact.businessDetails.category} /><DetailRow icon={MapPin} label={t.labels.location} value={contact.businessDetails.location} /><DetailRow icon={Clock} label={t.labels.openingHours} value={contact.businessDetails.hours} /><DetailRow icon={Book} label={t.labels.services} value={contact.businessDetails.services.join(', ')} /></InfoCard>{contact.businessDetails.products.length > 0 && <ProductCatalogue products={contact.businessDetails.products} t={t} />}</View>); };


// --- Main Contact Detail Screen ---
export default function ContactDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const { theme } = useTheme();
    const { locale } = useLanguage();
    const t = contactsScreenData[locale as 'en' | 'hi' | 'en-HI'] || contactsScreenData.en;

    const [contact, setContact] = useState(() => mockContacts.find((c) => c.id === id));
    const [isFollowing, setIsFollowing] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);
    const [isFavorite, setIsFavorite] = useState(contact?.isFavorite || false);

    if (!contact) {
        return (<SafeAreaView style={[tw`flex-1 items-center justify-center`, { backgroundColor: theme.colors.background }]}><Text style={{ color: theme.colors.text }}>Contact not found.</Text></SafeAreaView>);
    }

    const handleFollowToggle = () => {
        setIsFollowing(!isFollowing);
        if (!contact) return;
        const newFollowers = isFollowing ? contact.socialStats.followers - 1 : contact.socialStats.followers + 1;
        setContact({ ...contact, socialStats: { ...contact.socialStats, followers: newFollowers } });
    };

    const roleTagStyle = { client: tw`bg-blue-500/20 text-blue-500`, business: tw`bg-green-500/20 text-green-500`, employee: tw`bg-purple-500/20 text-purple-500`, user: tw`bg-gray-500/20 text-gray-500` }[contact.role];
    const menuOptions = [{ label: t.menu.edit, icon: Edit }, { label: t.menu.share, icon: Share2 }, { label: t.menu.block, icon: Shield }, { label: t.menu.archive, icon: Archive }, { label: t.menu.delete, icon: Trash2, isDestructive: true }];

    return (
        <SafeAreaView style={[tw`flex-1 mb-20`, { backgroundColor: theme.colors.background }]}>
            {/* Header Buttons */}
            <View style={tw`absolute top-0 left-0 right-0  z-10 flex-row items-center justify-between px-4 h-20 pt-8`}>
                <TouchableOpacity onPress={() => router.back()} style={tw`p-2 rounded-full bg-black/30`}><ArrowLeft size={24} color="white" /></TouchableOpacity>
                <View style={tw`flex-row items-center`}>
                    <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)} style={tw`mr-2 p-2 rounded-full bg-black/30`}><Heart size={22} color={isFavorite ? '#ef4444' : 'white'} fill={isFavorite ? '#ef4444' : 'transparent'} /></TouchableOpacity>
                    <TouchableOpacity onPress={() => setMenuVisible(true)} style={tw`p-2 rounded-full bg-black/30`}><MoreVertical size={24} color="white" /></TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
                {/* Profile Header */}
                <ImageBackground source={{ uri: contact.businessDetails?.bannerUrl || 'https://images.unsplash.com/photo-1614850523011-8f49ffc73908?q=80&w=2070&auto=format&fit=crop' }} style={tw`h-36 w-full justify-end`}>
                    <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={tw`absolute inset-0`} />
                </ImageBackground>
                <View style={tw`-mt-14 items-center px-4`}>
                    {/* Profile Image with Online Status Indicator */}
                    <View>
                        <Image
                            source={{ uri: contact.avatarUrl }}
                            style={[tw`w-28 h-28 rounded-full border-4`, { borderColor: theme.colors.background }]}
                        />

                        {/* --- Yahan Online Indicator add kiya gaya hai --- */}
                        {contact.isOnline && (
                            <View
                                style={[
                                    tw`absolute bottom-1 right-1 w-5 h-5 rounded-full border-4 bg-green-500`,
                                    { borderColor: theme.colors.background }
                                ]}
                            />
                        )}
                    </View>

                    <Text style={[tw`text-2xl font-bold mt-2 text-center`, { color: theme.colors.text }]}>{contact.name}</Text>
                    <Text style={[tw`text-base mt-1`, { color: theme.colors.textSecondary }]}>{contact.phone}</Text>
                    <View style={[tw`mt-2 `]}><Text style={[tw`text-xs font-bold capitalize py-1 px-3 rounded-full mb-4`, roleTagStyle]}>{contact.role}</Text></View>
                </View>

                {/* Action Buttons */}
                {/* <View style={[tw`flex-row justify-around mx-4 my-6 p-4 rounded-2xl`, { backgroundColor: theme.colors.card }]}>
                    <ActionButton icon={Phone} label={t.actions.call} />
                    <ActionButton icon={MessageSquare} label={t.actions.message} />
                    <ActionButton icon={IndianRupee} label={t.actions.pay} />
                    {contact.role === 'business' && <ActionButton icon={MapPin} label={t.actions.directions} />}
                </View> */}

                {/* Social Stats Section */}
                {/* <View style={[tw`flex-row justify-around items-center mx-4 mb-6 p-4 rounded-2xl`, { backgroundColor: theme.colors.card }]}>
                    {contact.role === 'business' && contact.socialStats.rating && <Stat label={t.labels.rating} value={contact.socialStats.rating} />}
                    <Stat label={t.labels.followers} value={contact.socialStats.followers} />
                    <TouchableOpacity onPress={handleFollowToggle} style={[tw`py-2 px-5 rounded-full`, { backgroundColor: isFollowing ? theme.colors.background : theme.colors.primary }]}>
                        <View style={tw`flex-row items-center`}>
                            {isFollowing ? <UserCheck size={16} color={theme.colors.primary} /> : <UserPlus size={16} color="white" />}
                            <Text style={[tw`ml-2 font-bold`, { color: isFollowing ? theme.colors.primary : 'white' }]}>{isFollowing ? 'Following' : 'Follow'}</Text>
                        </View>
                    </TouchableOpacity>
                </View> */}

                {/* ✨ New Hisab Kitab (Ledger) for all contacts with transactions */}

                {/* Role-specific Dashboards */}
                {contact.transactions && contact.transactions.length > 0 && <HisabKitab transactions={contact.transactions} t={t} />}
                {contact.role === 'employee' && contact.employeeDetails && <EmployeeDashboard contact={contact} t={t} />}
                {contact.role === 'client' && contact.clientDetails && <ClientDashboard contact={contact} t={t} />}
                {contact.role === 'business' && contact.businessDetails && <BusinessDashboard contact={contact} t={t} />}

                {/* Interaction History */}
                {contact.interactionHistory && (
                    <InfoCard title={t.history}>
                        {contact.interactionHistory.map((item, index) => (
                            <DetailRow key={index} icon={item.type === 'call' ? Phone : MessageSquare} label={formatRelative(item.time, new Date())} value={item.text || 'Call made'} />
                        ))}
                    </InfoCard>
                )}
            </ScrollView>

            {/* Menu Modal */}
            <Modal transparent visible={menuVisible} onRequestClose={() => setMenuVisible(false)} animationType="fade">
                <Pressable style={tw`flex-1 bg-black/60`} onPress={() => setMenuVisible(false)}>
                    <View style={[tw`absolute top-20 right-4 p-2 rounded-xl w-48`, { backgroundColor: theme.colors.card }]}>
                        {menuOptions.map((opt) => (
                            <TouchableOpacity key={opt.label} style={tw`flex-row items-center p-3 rounded-lg`} onPress={() => setMenuVisible(false)}>
                                <opt.icon size={20} color={opt.isDestructive ? '#ef4444' : theme.colors.text} />
                                <Text style={[tw`ml-3`, { color: opt.isDestructive ? '#ef4444' : theme.colors.text }]}>{opt.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Pressable>
            </Modal>
        </SafeAreaView>
    );
}