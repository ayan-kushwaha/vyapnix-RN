import React, { useState, useMemo, FC } from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Check, X, Coffee, ChevronLeft, ChevronRight, Clock, Award, Calendar } from 'lucide-react-native';
import tw from 'twrnc';
import { useTheme } from '../../context/ThemeContext';
import { AttendanceRecord } from '../../data/contactsData';

type AttendanceCalendarProps = {
    records: AttendanceRecord[];
};

// --- Chhote, Saaf-Suthre Helper Components ---

const DayCell: FC<{ day: number; record?: AttendanceRecord; onDayPress: () => void }> = ({ day, record, onDayPress }) => {
    const { theme } = useTheme();
    
    const getStatusStyle = () => {
        switch (record?.status) {
            case 'present': return { icon: Check, color: theme.colors.primary, bgColor: theme.colors.primary + '20' };
            case 'absent': return { icon: X, color: '#ef4444', bgColor: '#ef444420' };
            case 'leave': return { icon: Coffee, color: '#f97316', bgColor: '#f9731620' };
            default: return null;
        }
    };

    const style = getStatusStyle();

    return(
        <TouchableOpacity onPress={onDayPress} style={tw`w-1/7 aspect-square items-center justify-center p-1`}>
            <View style={[tw`w-full h-full rounded-full items-center justify-center`, style ? { backgroundColor: style.bgColor } : null]}>
                {style?.icon ? (
                    <style.icon size={16} color={style.color} />
                ) : (
                    <Text style={[tw`text-sm`, { color: theme.colors.textSecondary }]}>{day}</Text>
                )}
            </View>
        </TouchableOpacity>
    );
};

// ✨ FIX: DetailRow component ko is file mein define kiya gaya hai
const DetailRow: FC<{ icon: FC<any>; label: string; value: string | React.ReactNode }> = ({ icon: Icon, label, value }) => {
    const { theme } = useTheme();
    return(
        <View style={tw`flex-row items-start mb-3`}>
            <Icon size={16} color={theme.colors.textSecondary} style={tw`mr-4 mt-1`} />
            <View style={tw`flex-1`}>
                <Text style={[tw`text-xs`, { color: theme.colors.textSecondary }]}>{label}</Text>
                {typeof value === 'string' ? (
                    <Text style={[tw`text-sm font-medium`, { color: theme.colors.text }]}>{value}</Text>
                ) : (
                    value
                )}
            </View>
        </View>
    );
};


export const AttendanceCalendar: FC<AttendanceCalendarProps> = ({ records }) => {
    const { theme } = useTheme();
    const [currentDate, setCurrentDate] = useState(new Date('2025-08-31'));
    const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);

    const handlePrevMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    const handleNextMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));

    const { calendarGrid, summary } = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const grid = Array(firstDay).fill(null); // Khaali din
        for (let i = 1; i <= daysInMonth; i++) {
            grid.push(i);
        }

        const stats = { present: 0, absent: 0, leave: 0 };
        records.forEach(rec => {
            const recDate = new Date(rec.date);
            if (recDate.getFullYear() === year && recDate.getMonth() === month) {
                stats[rec.status]++;
            }
        });

        return { calendarGrid: grid, summary: stats };
    }, [currentDate, records]);

    const findRecordForDay = (day: number) => {
        return records.find(rec => {
            const recDate = new Date(rec.date);
            return recDate.getFullYear() === currentDate.getFullYear() &&
                   recDate.getMonth() === currentDate.getMonth() &&
                   recDate.getDate() === day;
        });
    };

    return (
        <View>
            {/* Header with Navigation */}
            <View style={tw`flex-row items-center justify-between px-2 mb-4`}>
                <TouchableOpacity onPress={handlePrevMonth} style={tw`p-2`}><ChevronLeft size={20} color={theme.colors.text} /></TouchableOpacity>
                <Text style={[tw`text-base font-semibold`, { color: theme.colors.text }]}>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</Text>
                <TouchableOpacity onPress={handleNextMonth} style={tw`p-2`}><ChevronRight size={20} color={theme.colors.text} /></TouchableOpacity>
            </View>

            {/* Weekday Headers */}
            <View style={tw`flex-row mb-2`}>
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => <Text key={day} style={[tw`w-1/7 text-center text-xs`, { color: theme.colors.textSecondary }]}>{day}</Text>)}
            </View>

            {/* Calendar Grid */}
            <View style={tw`flex-row flex-wrap`}>
                {calendarGrid.map((day, index) => (
                    day ? <DayCell key={index} day={day} record={findRecordForDay(day)} onDayPress={() => setSelectedRecord(findRecordForDay(day) || null)} /> : <View key={index} style={tw`w-1/7 aspect-square`} />
                ))}
            </View>

            {/* Summary */}
            <View style={[tw`mt-4 p-3 rounded-xl flex-row justify-around`, { backgroundColor: theme.colors.background }]}>
                <View style={tw`items-center`}><Text style={[tw`font-bold`, {color: theme.colors.primary}]}>{summary.present}</Text><Text style={[tw`text-xs`, {color: theme.colors.textSecondary}]}>Present</Text></View>
                <View style={tw`items-center`}><Text style={[tw`font-bold`, {color: '#ef4444'}]}>{summary.absent}</Text><Text style={[tw`text-xs`, {color: theme.colors.textSecondary}]}>Absent</Text></View>
                <View style={tw`items-center`}><Text style={[tw`font-bold`, {color: '#f97316'}]}>{summary.leave}</Text><Text style={[tw`text-xs`, {color: theme.colors.textSecondary}]}>Leave</Text></View>
            </View>

            {/* Details Modal */}
            <Modal transparent visible={!!selectedRecord} onRequestClose={() => setSelectedRecord(null)} animationType="fade">
                <Pressable style={tw`flex-1 justify-center items-center bg-black/60 p-6`} onPress={() => setSelectedRecord(null)}>
                    <Pressable style={[tw`w-full p-6 rounded-2xl`, { backgroundColor: theme.colors.card }]}>
                        <Text style={[tw`text-lg font-bold mb-4`, { color: theme.colors.text }]}>Attendance Details</Text>
                        {selectedRecord && (
                            <>
                                <DetailRow icon={Calendar} label="Date" value={new Date(selectedRecord.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} />
                                <DetailRow icon={Award} label="Status" value={selectedRecord.status.charAt(0).toUpperCase() + selectedRecord.status.slice(1)} />
                                {selectedRecord.status === 'present' && (
                                    <>
                                        <View style={tw`border-b border-gray-200/10 my-2`} />
                                        <DetailRow icon={Clock} label="Check In" value={selectedRecord.checkIn || '--'} />
                                        <DetailRow icon={Clock} label="Check Out" value={selectedRecord.checkOut || '--'} />
                                        <DetailRow icon={Clock} label="Hours Worked" value={`${selectedRecord.hoursWorked || 0} hrs`} />
                                    </>
                                )}
                            </>
                        )}
                        <TouchableOpacity onPress={() => setSelectedRecord(null)} style={[tw`mt-4 h-12 rounded-lg items-center justify-center`, { backgroundColor: theme.colors.primary }]}>
                            <Text style={tw`text-white font-bold`}>Close</Text>
                        </TouchableOpacity>
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
};

