// Har contact ka role kya ho sakta hai
export type ContactRole = 'user' | 'business' | 'employee' | 'client';

// Naye dashboards ke liye data structure
export type AttendanceRecord = {
    date: string;
    status: 'present' | 'absent' | 'leave';
    checkIn?: string;
    checkOut?: string;
    hoursWorked?: number;
};
export type SalaryRecord = { month: string; amount: number; status: 'paid' | 'pending'; };
export type PurchaseRecord = { item: string; amount: number; date: string; };

// Contact ka structure
export type Contact = {
    id: string;
    name: string;
    avatarUrl: string;
    phone: string;
    role: ContactRole;
    isFavorite: boolean;
    interactionHistory?: { type: 'call' | 'sms'; time: string; text?: string; }[];
    businessDetails?: { bannerUrl: string; category: string; rating: number; location: string; services: string[]; };
    employeeDetails?: {
        position: string;
        department: string;
        attendance: AttendanceRecord[];
        salaryRecords: SalaryRecord[];
    };
    clientDetails?: {
        khataBalance: number;
        purchaseHistory: PurchaseRecord[];
    };
};

// Screen par dikhne wala text
export const contactsScreenData = {
    en: {
        title: "Contacts",
        tabs: { all: "All", favorites: "Favorites", recent: "Recent" },
        detailTitle: "Contact Info",
        actions: { call: "Call", message: "Message", pay: "Pay", directions: "Directions" },
        businessInfo: "Business Info",
        employeeDashboard: "Employee Dashboard",
        clientDashboard: "Client Dashboard",
        searchPlaceholder: "Search contacts...",
        headerMenu: {
            addContact: "Add New Contact",
            blockedList: "Blocked List",
            archivedList: "Archived List",
        },
         filters: [
            { key: 'all', label: 'All', icon: 'Users' },
            { key: 'recent', label: 'Recent', icon: 'Clock' },
            { key: 'favorites', label: 'Favorites', icon: 'Star' },
            { key: 'business', label: 'Business', icon: 'Store' },
            { key: 'clients', label: 'Clients', icon: 'Briefcase' },
            { key: 'employees', label: 'Employees', icon: 'Users' },
        ],
        history: "History",
        labels: { category: "Category", location: "Location", services: "Services", position: "Position", department: "Department", balance: "Balance Due", purchases: "Purchases", attendance: "Attendance", salary: "Salary" },
        menu: { edit: "Edit", share: "Share", block: "Block", archive: "Archive", delete: "Delete" },
    },
    hi: {
        title: "संपर्क",
        tabs: { all: "सभी", favorites: "पसंदीदा", recent: "हाल के" },
        detailTitle: "संपर्क जानकारी",
        actions: { call: "कॉल", message: "संदेश", pay: "पे", directions: "दिशा" },
        businessInfo: "व्यापार की जानकारी",
        employeeDashboard: "कर्मचारी डैशबोर्ड",
        clientDashboard: "ग्राहक डैशबोर्ड",
        history: "हिस्ट्री",
        labels: { category: "श्रेणी", location: "स्थान", services: "सेवाएं", position: "पद", department: "विभाग", balance: "बकाया राशि", purchases: "खरीदारी", attendance: "उपस्थिति", salary: "वेतन" },
        menu: { edit: "एडिट", share: "शेयर", block: "ब्लॉक", archive: "आर्काइव", delete: "डिलीट" },
    },
    'en-HI': {
        title: "Contacts",
        tabs: { all: "Sabhi", favorites: "Favorites", recent: "Recent" },
        detailTitle: "Contact ki Jaankari",
        actions: { call: "Call", message: "Message", pay: "Pay", directions: "Directions" },
        businessInfo: "Business ki Jaankari",
        employeeDashboard: "Employee ka Dashboard",
        clientDashboard: "Client ka Dashboard",
        history: "History",
        labels: { category: "Category", location: "Location", services: "Services", position: "Position", department: "Department", balance: "Balance Baaki Hai", purchases: "Purchases", attendance: "Attendance", salary: "Salary" },
        menu: { edit: "Edit", share: "Share", block: "Block", archive: "Archive", delete: "Delete" },
    }
};

// Sample data (Asli app mein yeh database se aayega)
export const mockContacts: Contact[] = [
    {
        id: '1', name: 'Rohan Sharma', avatarUrl: 'https://i.pravatar.cc/300?img=11', phone: '+91 98765 11111', role: 'client', isFavorite: true,
        interactionHistory: [
            { type: 'sms', time: 'Yesterday', text: 'Okay, will send the payment...' },
            { type: 'call', time: '2 days ago' },
        ],
        clientDetails: {
            khataBalance: 500,
            purchaseHistory: [
                { item: 'Custom T-Shirt', amount: 800, date: '25 Aug, 2025' },
                { item: 'Jeans Alteration', amount: 200, date: '15 Aug, 2025' },
            ]
        }
    },
    {
        id: '2', name: 'Priya\'s Boutique', avatarUrl: 'https://i.pravatar.cc/300?img=20', phone: '+91 98765 22222', role: 'business', isFavorite: true,
        interactionHistory: [{ type: 'call', time: '3 days ago' }],
        businessDetails: { bannerUrl: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9e?q=80&w=2070&auto=format&fit=crop', category: 'Fashion Store', rating: 4.8, location: 'Civil Lines, Prayagraj', services: ['Custom Tailoring', 'Bridal Wear', 'Alterations'] }
    },
    {
        id: '3', name: 'Amit Kumar', avatarUrl: 'https://i.pravatar.cc/300?img=33', phone: '+91 98765 33333', role: 'employee', isFavorite: false,
        interactionHistory: [{ type: 'call', time: 'Today, 10:15 AM' }],
        employeeDetails: {
            position: 'Delivery Staff',
            department: 'Logistics',
            attendanceDetails: "Attendance Details",
            status: "Status",
            checkIn: "Check In",
            checkOut: "Check Out",
            hoursWorked: "Hours Worked",
            summary: { present: "Present", absent: "Absent", leave: "Leave" },
            attendance: [
                { date: '2025-08-01', status: 'present', checkIn: '09:02 AM', checkOut: '06:10 PM', hoursWorked: 9.1 },
                { date: '2025-08-02', status: 'present', checkIn: '08:58 AM', checkOut: '06:05 PM', hoursWorked: 9.1 },
                { date: '2025-08-04', status: 'absent' },
                { date: '2025-08-05', status: 'present', checkIn: '09:00 AM', checkOut: '06:00 PM', hoursWorked: 9.0 },
                { date: '2025-08-06', status: 'leave' },
                { date: '2025-08-25', status: 'present', checkIn: '09:15 AM', checkOut: '06:30 PM', hoursWorked: 9.2 },
                { date: '2025-08-26', status: 'present', checkIn: '09:05 AM', checkOut: '06:00 PM', hoursWorked: 8.9 },
            ],
            salaryRecords: [
                { month: 'July', amount: 15000, status: 'paid' },
                { month: 'August', amount: 15000, status: 'pending' },
            ]
        }
    },
    {
        id: '4', name: 'Neha Singh', avatarUrl: 'https://i.pravatar.cc/300?img=25', phone: '+91 98765 44444', role: 'user', isFavorite: false,
        interactionHistory: [{ type: 'sms', time: '1 week ago', text: 'Hey! Long time no see. Are you free this weekend?' }]
    },
];

// old is golad