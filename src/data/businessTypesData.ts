// src/data/businessTypesData.ts

// export const businessTypes = [
//     { label: 'Kirana Store', value: 'kirana_store' },
//     { label: 'Mechanic', value: 'mechanic' },
//     { label: 'Mistry (Construction)', value: 'mistry' },
//     { label: 'Restaurant / Hotel', value: 'restaurant' },
//     { label: 'Clothing Store', value: 'clothing' },
//     { label: 'Electronics Shop', value: 'electronics' },
//     { label: 'Mobile Repair', value: 'mobile_repair' },
//     { label: 'Vegetable Vendor', value: 'vegetable_vendor' },
//     { label: 'Bakery', value: 'bakery' },
//     { label: 'Salon / Barber', value: 'salon' },
//     { label: 'Medical Store', value: 'medical_store' },
//     { label: 'Tailor', value: 'tailor' },
//     { label: 'Plumber', value: 'plumber' },
//     { label: 'Electrician', value: 'electrician' },
//     { label: 'Other', value: 'other' },
// ];


export const businessTypes = [
    // E-commerce Model
    { label: 'Kirana Store', value: 'kirana_store', modelType: 'e-commerce' },
    { label: 'Clothing Store', value: 'clothing', modelType: 'e-commerce' },
    { label: 'Electronics Shop', value: 'electronics', modelType: 'e-commerce' },
    { label: 'Medical Store', value: 'medical_store', modelType: 'e-commerce' },
    { label: 'Bakery & Cake Shop', value: 'bakery', modelType: 'e-commerce' },
    { label: 'Vegetable & Fruit Vendor', value: 'vegetable_vendor', modelType: 'e-commerce' },

    // Booking Model
    { label: 'Salon / Barber', value: 'salon', modelType: 'booking' },
    { label: 'Doctor / Clinic', value: 'doctor', modelType: 'booking' },
    { label: 'Mechanic / Garage', value: 'mechanic', modelType: 'booking' },
    { label: 'Plumber / Electrician', value: 'home_service', modelType: 'booking' },
    { label: 'Photographer', value: 'photographer', modelType: 'booking' },
    { label: 'Sports Court / Turf', value: 'sports_facility', modelType: 'booking' },
    { label: 'Tent House', value: 'tent_house', modelType: 'booking' },

    // Subscription Model
    { label: 'Tiffin / Mess Service', value: 'tiffin_service', modelType: 'subscription' },
    { label: 'Milk Vendor', value: 'milk_vendor', modelType: 'subscription' },
    { label: 'Newspaper Hawker', value: 'newspaper', modelType: 'subscription' },
    { label: 'Water Jar Supplier', value: 'water_supplier', modelType: 'subscription' },
    { label: 'Gym / Fitness Center', value: 'gym', modelType: 'subscription' },
    { label: 'Coaching / Tuition Class', value: 'coaching', modelType: 'subscription' },
    { label: 'Car Cleaning Service', value: 'car_cleaning', modelType: 'subscription' },
    { label: 'Cable / Internet Provider', value: 'cable_provider', modelType: 'subscription' },

    // Other
    { label: 'Other', value: 'other', modelType: 'booking' }, // Default for others
];