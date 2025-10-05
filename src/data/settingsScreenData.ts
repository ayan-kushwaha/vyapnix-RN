// 📍 src/data/settingsScreenData.ts

// ✨ FIX: Added Business Sections to each language
// This makes sure the correct options appear when the user switches to the Business role.



export const settingsScreenData = {
    // English
    en: {
        role: "Role",
        roles: { user: "User", business: "Business", employee: "Employee" },
        appearance: "Appearance",
        language: "Language",
        theme: "Theme",
        logout: "Log Out",
        userSections: [
            { title: "Preferences", items: [{ key: "manageAddresses", icon: "MapPin", text: "Manage Addresses", type: "navigate" }, { key: "editProfile", icon: "User", text: "Edit Profile", type: "navigate" }] },
            { title: "Security & Privacy", items: [{ key: "changePassword", icon: "Lock", text: "Change Password", type: "navigate" }, { key: "twoFactorAuth", icon: "Shield", text: "2-Factor Authentication", type: "switch" }] },
            { title: "Subscription", items: [{ key: "manageSubscription", icon: "Star", text: "Manage Subscription", type: "navigate" }] },
            { title: "Notifications", items: [{ key: "appNotifications", icon: "Bell", text: "App Notifications", type: "switch" }] },
        ],
        businessSections: [{
            title: "Business",
            items: [
                { key: "deliverySettings", icon: "Truck", text: "Delivery Settings", type: "navigate" },
                { key: "inventoryStock", icon: "Package", text: "Inventory & Stock", type: "navigate" },
                { key: "shopSettings", icon: "Store", text: "Shop Settings", type: "navigate" },
                { key: "messaging", icon: "MessageSquare", text: "Notifications & Messaging", type: "navigate" },
                { key: "paymentsLedger", icon: "CreditCard", text: "Payments & Ledger", type: "navigate" },
                { key: "employeeMgmt", icon: "Users", text: "Employee Management", type: "navigate" },
                { key: "khataMgmt", icon: "BookText", text: "Khata / Ledger", type: "navigate" },
                { key: "whatsapp", icon: "MessageCircle", text: "WhatsApp Business", type: "navigate" },

            ],
        }],
    },
    // Hindi
    hi: {
        role: "भूमिका",
        roles: { user: "उपयोगकर्ता", business: "व्यापार", employee: "कर्मचारी" },
        appearance: "दिखावट",
        language: "भाषा",
        theme: "थीम",
        logout: "लॉग आउट",
        userSections: [
            { title: "वरीयताएँ", items: [{ key: "manageAddresses", icon: "MapPin", text: "पते प्रबंधित करें", type: "navigate" }, { key: "editProfile", icon: "User", text: "प्रोफ़ाइल एडिट करें", type: "navigate" }] },
            { title: "सुरक्षा और गोपनीयता", items: [{ key: "changePassword", icon: "Lock", text: "पासवर्ड बदलें", type: "navigate" }, { key: "twoFactorAuth", icon: "Shield", text: "2-फैक्टर ऑथेंटिकेशन", type: "switch" }] },
            { title: "सदस्यता", items: [{ key: "manageSubscription", icon: "Star", text: "सदस्यता प्रबंधित करें", type: "navigate" }] },
            { title: "सूचनाएं", items: [{ key: "appNotifications", icon: "Bell", text: "ऐप सूचनाएं", type: "switch" }] },
        ],
        businessSections: [{
            title: "व्यापार",
            items: [
                { key: "deliverySettings", icon: "Truck", text: "डिलीवरी सेटिंग्स", type: "navigate" },
                { key: "inventoryStock", icon: "Package", text: "इन्वेंटरी और स्टॉक", type: "navigate" },
                { key: "shopSettings", icon: "Store", text: "दुकान सेटिंग्स", type: "navigate" },
                { key: "messaging", icon: "MessageSquare", text: "सूचनाएं और संदेश", type: "navigate" },
                { key: "paymentsLedger", icon: "CreditCard", text: "भुगतान और लेजर", type: "navigate" },
                { key: "employeeMgmt", icon: "Users", text: "कर्मचारी मैनेजमेंट", type: "navigate" },
                { key: "khataMgmt", icon: "BookText", text: "खाता / लेजर", type: "navigate" },
                { key: "whatsapp", icon: "MessageCircle", text: "व्हाट्सएप बिजनेस", type: "navigate" },

            ],
        }],
    },
    // Hinglish
    'en-HI': {
        role: "Role",
        roles: { user: "User", business: "Business", employee: "Employee" },
        appearance: "Appearance",
        language: "Bhasha",
        theme: "Theme",
        logout: "Log Out",
        userSections: [
            { title: "Preferences", items: [{ key: "manageAddresses", icon: "MapPin", text: "Address Manage Karein", type: "navigate" }, { key: "editProfile", icon: "User", text: "Profile Edit Karein", type: "navigate" }] },
            { title: "Security aur Privacy", items: [{ key: "changePassword", icon: "Lock", text: "Password Badlein", type: "navigate" }, { key: "twoFactorAuth", icon: "Shield", text: "2-Factor Authentication", type: "switch" }] },
            { title: "Subscription", items: [{ key: "manageSubscription", icon: "Star", text: "Subscription Manage Karein", type: "navigate" }] },
            { title: "Notifications", items: [{ key: "appNotifications", icon: "Bell", text: "App Notifications", type: "switch" }] },
        ],
        businessSections: [{
            title: "Business",
            items: [
                { key: "deliverySettings", icon: "Truck", text: "Delivery Settings", type: "navigate" },
                { key: "inventoryStock", icon: "Package", text: "Inventory & Stock", type: "navigate" },
                { key: "shopSettings", icon: "Store", text: "Shop Settings", type: "navigate" },
                { key: "messaging", icon: "MessageSquare", text: "Notifications & Messaging", type: "navigate" },
                { key: "paymentsLedger", icon: "CreditCard", text: "Payments & Ledger", type: "navigate" },
                { key: "employeeMgmt", icon: "Users", text: "Employee Management", type: "navigate" },
                { key: "khataMgmt", icon: "BookText", text: "Khata / Ledger", type: "navigate" },
                { key: "whatsapp", icon: "MessageCircle", text: "WhatsApp Business", type: "navigate" },

            ],
        }],
    },
};

// Language Modal ka text
export const languageModalData = {
    en: { selectLanguage: "Select Language", continue: "Continue", english: "English (EN)", hindi: "Hindi (HI)", hinglish: "Hinglish (HI-EN)" },
    hi: { selectLanguage: "भाषा चुनें", continue: "जारी रखें", english: "अंग्रेजी (EN)", hindi: "हिन्दी (HI)", hinglish: "हिंग्लिश (HI-EN)" },
    'en-HI': { selectLanguage: "Bhasha Chunein", continue: "Continue", english: "English (EN)", hindi: "Hindi (HI)", hinglish: "Hinglish (HI-EN)" },
};

// old