import { Users, Clock, Heart, Store, Briefcase } from 'lucide-react-native';

// --- Types ---
export type ContactRole = 'user' | 'business' | 'employee' | 'client';
export type AttendanceRecord = { date: string; status: 'present' | 'absent' | 'leave'; };
export type SalaryRecord = { month: string; amount: number; status: 'paid' | 'pending'; };
export type PurchaseRecord = { item: string; amount: number; date: string; };
export type Product = { id: string; name: string; price: number; imageUrl: string; };
export type SocialStats = { followers: number; following: number; rating?: number; likes?: string; };

// Detailed item for each transaction
export type TransactionItem = {
    name: string;
    quantity: string; // e.g., '2kg', '3 pc', '1 Ltr'
    price: number;
};

// Improved Transaction type to handle detailed ledgers
export type Transaction = {
    id: string;
    title: string; // e.g., "Monthly Grocery", "Salary Payment"
    type: 'credit' | 'debit'; // credit = paisa mila, debit = kharch/udhaar
    category: 'purchase' | 'salary' | 'advance' | 'payment';
    items: TransactionItem[]; // Array of items in the transaction
    paidAmount: number; // Kitna paisa diya ya mila
    date: Date;
};

export type Contact = {
    id: string;
    name: string;
    avatarUrl: string;
    phone: string;
    role: ContactRole;
    isFavorite: boolean;
    isOnline?: boolean;
    socialStats: SocialStats;
    interactionHistory?: { type: 'call' | 'sms'; time: Date; text?: string; }[];
    transactions?: Transaction[];
    businessDetails?: {
        bannerUrl: string;
        category: string;
        location: string;
        services: string[];
        hours: string;
        products: Product[];
    };
    employeeDetails?: {
        position: string;
        department: string;
        attendance: AttendanceRecord[];
        salaryRecords: SalaryRecord[];
        location: string;
    };
    clientDetails?: {
        khataBalance: number;
        purchaseHistory: PurchaseRecord[];
        lastPurchaseDate?: string;
    };
};


// --- Screen Text Data (Fully Populated for All Languages) ---
export const contactsScreenData = {
    en: {
        title: "Contacts",
        searchPlaceholder: "Search contacts...",
        filters: [
            { key: 'all', label: 'All', icon: Users },
            { key: 'recent', label: 'Recent', icon: Clock },
            { key: 'favorites', label: 'Favorites', icon: Heart },
            { key: 'business', label: 'Business', icon: Store },
            { key: 'clients', label: 'Clients', icon: Briefcase },
            { key: 'employees', label: 'Employees', icon: Users },
        ],
        headerMenu: { addContact: "Add New Contact", blockedList: "Blocked List", archivedList: "Archived List" },
        detailTitle: "Contact Info",
        actions: { call: "Call", message: "Message", pay: "Pay", directions: "Directions" },
        businessInfo: "Business Info",
        employeeDashboard: "Employee Dashboard",
        clientDashboard: "Client Ledger",
        history: "History",
        labels: {
            category: "Category", location: "Location", services: "Services", position: "Position",
            department: "Department", balance: "Balance", purchases: "Purchases",
            attendance: "Attendance", salary: "Salary", openingHours: 'Opening Hours',
            catalogue: 'Product Catalogue',
            ledgerTitle: "Ledger Book",
            totalPaid: "Total Credit",
            totalDue: "Total Due",
            advance: "Advance",
            totalPrice: "Total Price",
            paidAmount: "Paid Amount",
            remainingDue: "Remaining Due",
            viewAll: "View All",
            showLess: "Show Less",
            rating: 'Rating',
            followers: 'Followers',
        },
        menu: { edit: "Edit", share: "Share", block: "Block", archive: "Archive", delete: "Delete" },
    },
    hi: {
        title: "संपर्क",
        searchPlaceholder: "संपर्क खोजें...",
        filters: [
            { key: 'all', label: 'सभी', icon: Users },
            { key: 'recent', label: 'हाल के', icon: Clock },
            { key: 'favorites', label: 'पसंदीदा', icon: Heart },
            { key: 'business', label: 'बिजनेस', icon: Store },
            { key: 'clients', label: 'क्लाइंट', icon: Briefcase },
            { key: 'employees', label: 'कर्मचारी', icon: Users },
        ],
        headerMenu: { addContact: "नया संपर्क जोड़ें", blockedList: "ब्लॉक की गई सूची", archivedList: "आर्काइव सूची" },
        detailTitle: "संपर्क जानकारी",
        actions: { call: "कॉल", message: "संदेश", pay: "पे", directions: "दिशा" },
        businessInfo: "व्यापार की जानकारी",
        employeeDashboard: "कर्मचारी डैशबोर्ड",
        clientDashboard: "ग्राहक खाता",
        history: "हिस्ट्री",
        labels: {
            category: "श्रेणी", location: "स्थान", services: "सेवाएं", position: "पद",
            department: "विभाग", balance: "बकाया", purchases: "खरीदारी",
            attendance: "उपस्थिति", salary: "वेतन", openingHours: 'खुलने का समय',
            catalogue: 'उत्पाद सूची',
            ledgerTitle: "हिसाब किताब",
            totalPaid: "कुल जमा",
            totalDue: "कुल उधार",
            advance: "एडवांस",
            totalPrice: "कुल कीमत",
            paidAmount: "भुगतान किया",
            remainingDue: "बकाया",
            viewAll: "सभी देखें",
            showLess: "कम दिखाएं",
            rating: 'रेटिंग',
            followers: 'फ़ॉलोअर्स',
        },
        menu: { edit: "एडिट", share: "शेयर", block: "ब्लॉक", archive: "आर्काइव", delete: "डिलीट" },
    },
    'en-HI': {
        title: "Contacts",
        searchPlaceholder: "Contacts search karein...",
        filters: [
            { key: 'all', label: 'Sabhi', icon: Users },
            { key: 'recent', label: 'Recent', icon: Clock },
            { key: 'favorites', label: 'Favorites', icon: Heart },
            { key: 'business', label: 'Business', icon: Store },
            { key: 'clients', label: 'Clients', icon: Briefcase },
            { key: 'employees', label: 'Employees', icon: Users },
        ],
        headerMenu: { addContact: "Naya Contact jodein", blockedList: "Blocked List", archivedList: "Archived List" },
        detailTitle: "Contact ki Jaankari",
        actions: { call: "Call", message: "Message", pay: "Pay", directions: "Directions" },
        businessInfo: "Business ki Jaankari",
        employeeDashboard: "Employee ka Dashboard",
        clientDashboard: "Client ka Khata",
        history: "History",
        labels: {
            category: "Category", location: "Location", services: "Services", position: "Position",
            department: "Department", balance: "Balance Baaki", purchases: "Purchases",
            attendance: "Attendance", salary: "Salary", openingHours: "Khulne ka Time",
            catalogue: "Product Catalogue",
            ledgerTitle: "Hisab Kitab",
            totalPaid: "Total Jama",
            totalDue: "Total Udhaar",
            advance: "Advance",
            totalPrice: "Total Price",
            paidAmount: "Paid Amount",
            remainingDue: "Baaki Hai",
            viewAll: "Sabhi Dekhein",
            showLess: "Kam Dekhein",
            rating: "Rating",
            followers: "Followers",
        },
        menu: { edit: "Edit", share: "Share", block: "Block", archive: "Archive", delete: "Delete" },
    }
};


// --- Sample Data ---
export const mockContacts: Contact[] = [
    // 1. A BUSINESS: Grocery Store
    {
        id: '101', name: "Gupta General Store", avatarUrl: 'https://i.pravatar.cc/300?img=52', phone: '+91 98765 10101', role: 'business', isFavorite: true, isOnline: true,
        socialStats: { followers: 1250, following: 15, rating: 4.7 },
        businessDetails: {
            bannerUrl: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?q=80&w=1974&auto=format&fit=crop',
            category: 'Grocery Store', location: 'Katraj, Pune',
            services: ['Home Delivery', 'Daily Needs', 'Fresh Vegetables'], hours: '8:00 AM - 10:00 PM',
            products: [
                { id: 'p1', name: 'Aashirvaad Atta 10kg', price: 450, imageUrl: 'https://picsum.photos/id/201/300/300' },
                { id: 'p2', name: 'Fortune Soyabean Oil 1L', price: 155, imageUrl: 'https://picsum.photos/id/202/300/300' },
                { id: 'p3', name: 'Tata Salt 1kg', price: 25, imageUrl: 'https://picsum.photos/id/203/300/300' },
            ],
        },
        transactions: [
             { id: 'txn501', title: 'Payment from Anjali', type: 'credit', category: 'payment', items: [], paidAmount: 1000, date: new Date(2025, 7, 30, 11, 0) },
             { id: 'txn502', title: 'Stock Purchase', type: 'debit', category: 'purchase', items: [{ name: 'Bulk Sugar', quantity: '50kg', price: 2200 }, { name: 'Oil Cartons', quantity: '5 boxes', price: 4500 }], paidAmount: 6700, date: new Date(2025, 7, 28, 15, 0) },
        ],
    },
    // 2. A CLIENT: Regular customer of the grocery store
    {
        id: '102', name: 'Anjali Verma', avatarUrl: 'https://i.pravatar.cc/300?img=27', phone: '+91 98765 10202', role: 'client', isFavorite: true,
        socialStats: { followers: 210, following: 300 },
        clientDetails: { khataBalance: 795, lastPurchaseDate: '30 Aug, 2025', purchaseHistory: [] },
        transactions: [
            { id: 'txn601', title: 'Monthly Grocery', type: 'debit', category: 'purchase', 
              items: [
                { name: 'Aashirvaad Atta', quantity: '10kg', price: 450 }, 
                { name: 'Sugar', quantity: '2kg', price: 90 },
                { name: 'Amul Milk', quantity: '5L', price: 275 },
              ], 
              paidAmount: 500, date: new Date(2025, 7, 30, 10, 30) 
            },
            { id: 'txn602', title: 'Previous Due Cleared', type: 'credit', category: 'payment', items: [], paidAmount: 1000, date: new Date(2025, 7, 30, 11, 0) },
            { id: 'txn603', title: 'Vegetable Purchase', type: 'debit', category: 'purchase',
              items: [
                { name: 'Onions', quantity: '1kg', price: 40 },
                { name: 'Potatoes', quantity: '2kg', price: 60 }
              ],
              paidAmount: 100, date: new Date(2025, 7, 25, 18, 0)
            },
            { id: 'txn604', title: 'Emergency Purchase', type: 'debit', category: 'purchase',
              items: [ { name: 'Maggie Pack', quantity: '4 pc', price: 56 } ],
              paidAmount: 0, date: new Date(2025, 8, 1, 12, 0) // Note: Date is Sep 1, 2025
            },
        ],
    },
    // 3. AN EMPLOYEE
    {
        id: '3', name: 'Amit Kumar', avatarUrl: 'https://i.pravatar.cc/300?img=33', phone: '+91 98765 33333', role: 'employee', isFavorite: false,
        socialStats: { followers: 50, following: 110 },
        employeeDetails: {
            position: 'Delivery Staff', department: 'Logistics', location: 'Prayagraj, UP',
            attendance: [ { date: '2025-08-01', status: 'present' }, { date: '2025-08-04', status: 'absent' } ],
            salaryRecords: [ { month: 'July', amount: 15000, status: 'paid' }, { month: 'August', amount: 15500, status: 'pending' } ],
        },
        transactions: [
            { id: 'txn201', title: 'July Salary', type: 'credit', category: 'salary', items: [{ name: 'Base Salary', quantity: '1 month', price: 15000 }], paidAmount: 15000, date: new Date(2025, 7, 5) },
            { id: 'txn202', title: 'Advance for August', type: 'debit', category: 'advance', items: [{ name: 'Cash Advance', quantity: '1', price: 2000 }], paidAmount: 2000, date: new Date(2025, 7, 20) },
            { id: 'txn203', title: 'August Salary (Pending)', type: 'credit', category: 'salary', items: [{ name: 'Base Salary', quantity: '1 month', price: 15500 }], paidAmount: 0, date: new Date(2025, 8, 5) },
        ]
    },
    // 4. A REGULAR USER
    {
        id: '4', name: 'Neha Singh', avatarUrl: 'https://i.pravatar.cc/300?img=25', phone: '+91 98765 44444', role: 'user', isFavorite: false,
        socialStats: { followers: 250, following: 200 },
        transactions: [
            { id: 'txn301', title: 'Electricity Bill', type: 'debit', category: 'purchase', items: [{ name: 'Bill Payment', quantity: '1 month', price: 1250 }], paidAmount: 1050, date: new Date(2025, 8, 1, 9, 15) },
            { id: 'txn302', title: 'Cashback Received', type: 'credit', category: 'payment', items: [], paidAmount: 50, date: new Date(2025, 8, 1, 9, 16) },
            { id: 'txn303', title: 'Zomato Order', type: 'debit', category: 'purchase', items: [{ name: 'Pizza', quantity: '1', price: 450 }, { name: 'Coke', quantity: '1', price: 60 }], paidAmount: 510, date: new Date(2025, 7, 29, 20, 0) },
        ]
    },
];