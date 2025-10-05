// src/data/businessTypesData.ts


export type BusinessCategoryKey =
    | "eCommerce"
    | "booking"
    | "subscription"
    | "wholesale"
    | "manufacturing"
    | "services"
    | "online"
    | "agriculture";


export interface ModelType {
    code: string;
    labels: {
        en: string;
        hi: string;
        hinglish: string;
    };
}


export const businessTypesData = {
    // =================================================================
    // English Language Data
    // =================================================================
    en: {
        eCommerce: [
            { label: "🛒 Grocery / Kirana Store", value: "kirana_store", modelType: "e-commerce" },
            { label: "👕 Fashion & Apparel Store", value: "clothing", modelType: "e-commerce" },
            { label: "👟 Footwear & Accessories Shop", value: "footwear", modelType: "e-commerce" },
            { label: "💍 Jewellery & Ornaments Shop", value: "jewellery", modelType: "e-commerce" },
            { label: "📱 Electronics & Mobile Shop", value: "electronics", modelType: "e-commerce" },
            { label: "🛋️ Furniture & Home Decor Store", value: "furniture", modelType: "e-commerce" },
            { label: "📚 Stationery & Book Store", value: "stationery", modelType: "e-commerce" },
            { label: "💊 Medical Store / Pharmacy", value: "medical_store", modelType: "e-commerce" },
            { label: "🍰 Bakery & Cake Shop", value: "bakery", modelType: "e-commerce" },
            { label: "🍬 Sweet & Namkeen Store", value: "sweet_shop", modelType: "e-commerce" },
            { label: "🍎 Vegetable & Fruit Vendor", value: "vegetable_vendor", modelType: "e-commerce" },
            { label: "🥩 Meat / Fish / Poultry Shop", value: "meat_shop", modelType: "e-commerce" },
            { label: "💄 Cosmetics & Beauty Store", value: "cosmetics", modelType: "e-commerce" },
            { label: "🎁 Gift & Toy Shop", value: "gift_toy", modelType: "e-commerce" },
            { label: "🐾 Pet Supplies Store", value: "pet_supplies", modelType: "e-commerce" },
            { label: "🛠️ Hardware Store", value: "hardware_store", modelType: "e-commerce" },
            { label: "⚽ Sports Goods Shop", value: "sports_goods", modelType: "e-commerce" },
            { label: "🚗 Auto Parts Store", value: "auto_parts", modelType: "e-commerce" },
            { label: "🪴 Plant Nursery / Garden Store", value: "garden_store", modelType: "e-commerce" },
            { label: "📦 Other Retail Store", value: "other_store", modelType: "e-commerce" },
        ],
        booking: [
            { label: "💇‍♂️ Salon / Barber Shop", value: "salon", modelType: "booking" },
            { label: "💆‍♀️ Spa & Wellness Center", value: "spa", modelType: "booking" },
            { label: "👨‍⚕️ Doctor / Clinic", value: "doctor", modelType: "booking" },
            { label: "🧪 Diagnostic / Pathology Lab", value: "diagnostic_lab", modelType: "booking" },
            { label: "🏥 Hospital / Nursing Home", value: "hospital", modelType: "booking" },
            { label: "🧑‍⚕️ Veterinarian (Pet Doctor)", value: "veterinarian", modelType: "booking" },
            { label: "🛠️ Mechanic / Garage", value: "mechanic", modelType: "booking" },
            { label: "🔧 Plumber / Electrician / Carpenter", value: "home_service", modelType: "booking" },
            { label: "🧊 AC / Appliance Repair", value: "appliance_repair", modelType: "booking" },
            { label: "🧹 Home Cleaning / Pest Control", value: "home_cleaning", modelType: "booking" },
            { label: "📸 Photographer / Videographer", value: "photographer", modelType: "booking" },
            { label: "🎪 Event Planner / Tent House", value: "tent_house", modelType: "booking" },
            { label: "🏟️ Sports Court / Turf Booking", value: "sports_facility", modelType: "booking" },
            { label: "🏨 Hotel / Lodge / Banquet", value: "hotel", modelType: "booking" },
            { label: "🚗 Car Rental / Taxi Service", value: "car_rental", modelType: "booking" },
            { label: "✈️ Travel Agent / Tour Operator", value: "travel_agent", modelType: "booking" },
            { label: "🧑‍🏫 Private Tutor / Teacher", value: "tutor", modelType: "booking" },
            { label: "📦 Other Booking Service", value: "other_booking", modelType: "booking" },
        ],
        subscription: [
            { label: "🥗 Tiffin / Mess Service", value: "tiffin_service", modelType: "subscription" },
            { label: "🥛 Milk Delivery", value: "milk_vendor", modelType: "subscription" },
            { label: "📰 Newspaper Delivery", value: "newspaper", modelType: "subscription" },
            { label: "💧 Drinking Water / RO Jar Supply", value: "water_supplier", modelType: "subscription" },
            { label: "🧺 Laundry / Dhobi Service", value: "laundry", modelType: "subscription" },
            { label: "🏋️ Gym / Fitness Center", value: "gym", modelType: "subscription" },
            { label: "🧘 Yoga / Wellness Class", value: "yoga", modelType: "subscription" },
            { label: "🎓 Coaching / Tuition Class", value: "coaching", modelType: "subscription" },
            { label: "🧼 Car / Bike Cleaning Service", value: "car_cleaning", modelType: "subscription" },
            { label: "📺 Cable / DTH Provider", value: "cable_provider", modelType: "subscription" },
            { label: "🌐 Internet / WiFi Provider", value: "internet_provider", modelType: "subscription" },
            { label: "💻 Software as a Service (SaaS)", value: "saas", modelType: "subscription" },
            { label: "🥦 Grocery Box Subscription", value: "grocery_box", modelType: "subscription" },
            { label: "📦 Other Subscription", value: "other_subscription", modelType: "subscription" },
        ],
        wholesale: [
            { label: "📦 Wholesaler / Stockist", value: "wholesaler", modelType: "wholesale" },
            { label: "🚚 Distributor / Dealer", value: "distributor", modelType: "wholesale" },
            { label: "🏭 Supplier / Trader", value: "supplier", modelType: "wholesale" },
            { label: "🥫 FMCG Distributor", value: "fmcg_distributor", modelType: "wholesale" },
            { label: "💊 Pharma Distributor", value: "pharma_distributor", modelType: "wholesale" },
            { label: "🌾 Agricultural Produce Trader", value: "agri_trader", modelType: "wholesale" },
            { label: "🧱 Building Material Supplier", value: "building_material", modelType: "wholesale" },
        ],
        manufacturing: [
            { label: "🏭 Factory / Plant", value: "factory", modelType: "manufacturing" },
            { label: "🛠️ Workshop / Production Unit", value: "workshop", modelType: "manufacturing" },
            { label: "👕 Garment / Textile Manufacturing", value: "garment_manufacturing", modelType: "manufacturing" },
            { label: "🎨 Handicraft / Artisan Production", value: "handicraft", modelType: "manufacturing" },
            { label: "🍔 Food Processing Unit", value: "food_unit", modelType: "manufacturing" },
            { label: "📦 Printing & Packaging Unit", value: "printing_packaging", modelType: "manufacturing" },
            { label: "🔩 Metal Fabrication", value: "metal_fabrication", modelType: "manufacturing" },
        ],
        services: [
            { label: "📱 Repair Service (Mobile, Laptop)", value: "repair_service", modelType: "service" },
            { label: "🚚 Courier / Logistics Service", value: "logistics", modelType: "service" },
            { label: "🎓 Education / Training Center", value: "training", modelType: "service" },
            { label: "💼 Consultant / CA / Lawyer", value: "consultant", modelType: "service" },
            { label: "🏡 Real Estate Agent / Broker", value: "real_estate", modelType: "service" },
            { label: "📢 Marketing / Advertising Agency", value: "agency", modelType: "service" },
            { label: "🍽️ Catering Service", value: "catering", modelType: "service" },
            { label: "🎉 Event / Wedding Planner", value: "event_planner", modelType: "service" },
            { label: "🛡️ Security Services", value: "security_service", modelType: "service" },
            { label: "📦 Other Service Provider", value: "other_service", modelType: "service" },
        ],
        online: [
            { label: "🌐 E-Commerce Website / Online Store", value: "online_store", modelType: "online" },
            { label: "🛍️ Marketplace Seller (Amazon, etc.)", value: "marketplace_seller", modelType: "online" },
            { label: "🎨 Graphic Designer / Web Developer", value: "web_developer", modelType: "online" },
            { label: "✍️ Content Creator / Writer", value: "content_creator", modelType: "online" },
            { label: "📈 Digital Marketing / SEO Specialist", value: "seo_specialist", modelType: "online" },
            { label: "💻 IT / Software Services", value: "it_services", modelType: "online" },
            { label: "🧑‍🏫 Online Coaching / Course Creator", value: "online_course", modelType: "online" },
            { label: "🤳 Blogger / Vlogger / Influencer", value: "influencer", modelType: "online" },
            { label: "🚚 Dropshipping Business", value: "dropshipping", modelType: "online" },
        ],
        agriculture: [
            { label: "🧑‍🌾 Farmer / Agriculture", value: "farmer", modelType: "agriculture" },
            { label: "🐄 Dairy Farm", value: "dairy_farm", modelType: "agriculture" },
            { label: "🐔 Poultry Farm", value: "poultry_farm", modelType: "agriculture" },
            { label: "🐟 Fish Farm (Fishery)", value: "fish_farm", modelType: "agriculture" },
            { label: "🌱 Plant Nursery", value: "plant_nursery", modelType: "agriculture" },
            { label: "🌾 Agricultural Supplier", value: "agri_supplier", modelType: "agriculture" },
        ],
    },
    // =================================================================
    // Hindi Language Data
    // =================================================================
    hi: {
        eCommerce: [
            { label: "🛒 किराना स्टोर", value: "kirana_store", modelType: "e-commerce" },
            { label: "👕 फैशन और परिधान की दुकान", value: "clothing", modelType: "e-commerce" },
            { label: "👟 जूते-चप्पल की दुकान", value: "footwear", modelType: "e-commerce" },
            { label: "💍 ज्वेलरी की दुकान", value: "jewellery", modelType: "e-commerce" },
            { label: "📱 इलेक्ट्रॉनिक्स और मोबाइल दुकान", value: "electronics", modelType: "e-commerce" },
            { label: "🛋️ फर्नीचर और होम डेकोर स्टोर", value: "furniture", modelType: "e-commerce" },
            { label: "📚 स्टेशनरी और किताबों की दुकान", value: "stationery", modelType: "e-commerce" },
            { label: "💊 मेडिकल स्टोर / फार्मेसी", value: "medical_store", modelType: "e-commerce" },
            { label: "🍰 बेकरी और केक शॉप", value: "bakery", modelType: "e-commerce" },
            { label: "🍬 मिठाई / नमकीन की दुकान", value: "sweet_shop", modelType: "e-commerce" },
            { label: "🍎 सब्जी और फल विक्रेता", value: "vegetable_vendor", modelType: "e-commerce" },
            { label: "🥩 मांस / मछली / पोल्ट्री की दुकान", value: "meat_shop", modelType: "e-commerce" },
            { label: "💄 कॉस्मेटिक्स और ब्यूटी शॉप", value: "cosmetics", modelType: "e-commerce" },
            { label: "🎁 गिफ्ट और खिलौने की दुकान", value: "gift_toy", modelType: "e-commerce" },
            { label: "🐾 पालतू जानवर के सामान की दुकान", value: "pet_supplies", modelType: "e-commerce" },
            { label: "🛠️ हार्डवेयर की दुकान", value: "hardware_store", modelType: "e-commerce" },
            { label: "⚽ खेल के सामान की दुकान", value: "sports_goods", modelType: "e-commerce" },
            { label: "🚗 ऑटो पार्ट्स की दुकान", value: "auto_parts", modelType: "e-commerce" },
            { label: "🪴 प्लांट नर्सरी / बागवानी स्टोर", value: "garden_store", modelType: "e-commerce" },
            { label: "📦 अन्य खुदरा स्टोर", value: "other_store", modelType: "e-commerce" },
        ],
        booking: [
            { label: "💇‍♂️ सैलून / नाई की दुकान", value: "salon", modelType: "booking" },
            { label: "💆‍♀️ स्पा और वेलनेस सेंटर", value: "spa", modelType: "booking" },
            { label: "👨‍⚕️ डॉक्टर / क्लिनिक", value: "doctor", modelType: "booking" },
            { label: "🧪 डायग्नोस्टिक / पैथोलॉजी लैब", value: "diagnostic_lab", modelType: "booking" },
            { label: "🏥 अस्पताल / नर्सिंग होम", value: "hospital", modelType: "booking" },
            { label: "🧑‍⚕️ पशु चिकित्सक", value: "veterinarian", modelType: "booking" },
            { label: "🛠️ मिस्त्री / गैराज", value: "mechanic", modelType: "booking" },
            { label: "🔧 प्लंबर / इलेक्ट्रीशियन / बढ़ई", value: "home_service", modelType: "booking" },
            { label: "🧊 एसी / उपकरण रिपेयर", value: "appliance_repair", modelType: "booking" },
            { label: "🧹 घर की सफाई / पेस्ट कंट्रोल", value: "home_cleaning", modelType: "booking" },
            { label: "📸 फ़ोटोग्राफ़र / वीडियोग्राफ़र", value: "photographer", modelType: "booking" },
            { label: "🎪 इवेंट प्लानर / टेंट हाउस", value: "tent_house", modelType: "booking" },
            { label: "🏟️ स्पोर्ट्स कोर्ट / टर्फ बुकिंग", value: "sports_facility", modelType: "booking" },
            { label: "🏨 होटल / लॉज / बैंक्वेट", value: "hotel", modelType: "booking" },
            { label: "🚗 कार रेंटल / टैक्सी सेवा", value: "car_rental", modelType: "booking" },
            { label: "✈️ ट्रैवल एजेंट / टूर ऑपरेटर", value: "travel_agent", modelType: "booking" },
            { label: "🧑‍🏫 प्राइवेट ट्यूटर / शिक्षक", value: "tutor", modelType: "booking" },
            { label: "📦 अन्य बुकिंग सेवा", value: "other_booking", modelType: "booking" },
        ],
        subscription: [
            { label: "🥗 टिफिन / मैस सेवा", value: "tiffin_service", modelType: "subscription" },
            { label: "🥛 दूध की डिलीवरी", value: "milk_vendor", modelType: "subscription" },
            { label: "📰 अखबार की डिलीवरी", value: "newspaper", modelType: "subscription" },
            { label: "💧 पीने का पानी / आरओ जार सप्लाई", value: "water_supplier", modelType: "subscription" },
            { label: "🧺 लॉन्ड्री / धोबी सेवा", value: "laundry", modelType: "subscription" },
            { label: "🏋️ जिम / फिटनेस सेंटर", value: "gym", modelType: "subscription" },
            { label: "🧘 योगा / वेलनेस क्लास", value: "yoga", modelType: "subscription" },
            { label: "🎓 कोचिंग / ट्यूशन क्लास", value: "coaching", modelType: "subscription" },
            { label: "🧼 कार / बाइक क्लीनिंग सेवा", value: "car_cleaning", modelType: "subscription" },
            { label: "📺 केबल / डीटीएच प्रदाता", value: "cable_provider", modelType: "subscription" },
            { label: "🌐 इंटरनेट / वाईफाई प्रदाता", value: "internet_provider", modelType: "subscription" },
            { label: "💻 सॉफ्टवेयर सेवा (SaaS)", value: "saas", modelType: "subscription" },
            { label: "🥦 किराना बॉक्स सब्सक्रिप्शन", value: "grocery_box", modelType: "subscription" },
            { label: "📦 अन्य सब्सक्रिप्शन", value: "other_subscription", modelType: "subscription" },
        ],
        wholesale: [
            { label: "📦 थोक व्यापारी / स्टॉकिस्ट", value: "wholesaler", modelType: "wholesale" },
            { label: "🚚 डिस्ट्रिब्यूटर / डीलर", value: "distributor", modelType: "wholesale" },
            { label: "🏭 सप्लायर / व्यापारी", value: "supplier", modelType: "wholesale" },
            { label: "🥫 एफएमसीजी डिस्ट्रिब्यूटर", value: "fmcg_distributor", modelType: "wholesale" },
            { label: "💊 फार्मा डिस्ट्रिब्यूटर", value: "pharma_distributor", modelType: "wholesale" },
            { label: "🌾 कृषि उपज व्यापारी", value: "agri_trader", modelType: "wholesale" },
            { label: "🧱 भवन निर्माण सामग्री सप्लायर", value: "building_material", modelType: "wholesale" },
        ],
        manufacturing: [
            { label: "🏭 फैक्ट्री / प्लांट", value: "factory", modelType: "manufacturing" },
            { label: "🛠️ वर्कशॉप / उत्पादन इकाई", value: "workshop", modelType: "manufacturing" },
            { label: "👕 कपड़ा / टेक्सटाइल निर्माण", value: "garment_manufacturing", modelType: "manufacturing" },
            { label: "🎨 हस्तशिल्प / कारीगर उत्पादन", value: "handicraft", modelType: "manufacturing" },
            { label: "🍔 फूड प्रोसेसिंग यूनिट", value: "food_unit", modelType: "manufacturing" },
            { label: "📦 प्रिंटिंग और पैकेजिंग यूनिट", value: "printing_packaging", modelType: "manufacturing" },
            { label: "🔩 मेटल फैब्रिकेशन", value: "metal_fabrication", modelType: "manufacturing" },
        ],
        services: [
            { label: "📱 मरम्मत सेवा (मोबाइल, लैपटॉप)", value: "repair_service", modelType: "service" },
            { label: "🚚 कूरियर / लॉजिस्टिक्स सेवा", value: "logistics", modelType: "service" },
            { label: "🎓 शिक्षा / प्रशिक्षण केंद्र", value: "training", modelType: "service" },
            { label: "💼 कंसल्टेंट / सीए / वकील", value: "consultant", modelType: "service" },
            { label: "🏡 रियल एस्टेट एजेंट / ब्रोकर", value: "real_estate", modelType: "service" },
            { label: "📢 मार्केटिंग / विज्ञापन एजेंसी", value: "agency", modelType: "service" },
            { label: "🍽️ कैटरिंग सेवा", value: "catering", modelType: "service" },
            { label: "🎉 इवेंट / वेडिंग प्लानर", value: "event_planner", modelType: "service" },
            { label: "🛡️ सुरक्षा सेवाएँ", value: "security_service", modelType: "service" },
            { label: "📦 अन्य सेवा प्रदाता", value: "other_service", modelType: "service" },
        ],
        online: [
            { label: "🌐 ई-कॉमर्स वेबसाइट / ऑनलाइन स्टोर", value: "online_store", modelType: "online" },
            { label: "🛍️ मार्केटप्लेस सेलर (अमेज़ॅन, आदि)", value: "marketplace_seller", modelType: "online" },
            { label: "🎨 ग्राफिक डिजाइनर / वेब डेवलपर", value: "web_developer", modelType: "online" },
            { label: "✍️ कंटेंट क्रिएटर / लेखक", value: "content_creator", modelType: "online" },
            { label: "📈 डिजिटल मार्केटिंग / एसईओ विशेषज्ञ", value: "seo_specialist", modelType: "online" },
            { label: "💻 आईटी / सॉफ्टवेयर सेवाएँ", value: "it_services", modelType: "online" },
            { label: "🧑‍🏫 ऑनलाइन कोचिंग / कोर्स निर्माता", value: "online_course", modelType: "online" },
            { label: "🤳 ब्लॉगर / व्लॉगर / इन्फ्लुएंसर", value: "influencer", modelType: "online" },
            { label: "🚚 ड्रॉपशीपिंग व्यवसाय", value: "dropshipping", modelType: "online" },
        ],
        agriculture: [
            { label: "🧑‍🌾 किसान / कृषि", value: "farmer", modelType: "agriculture" },
            { label: "🐄 डेयरी फार्म", value: "dairy_farm", modelType: "agriculture" },
            { label: "🐔 पोल्ट्री फार्म", value: "poultry_farm", modelType: "agriculture" },
            { label: "🐟 मछली फार्म (मत्स्य पालन)", value: "fish_farm", modelType: "agriculture" },
            { label: "🌱 प्लांट नर्सरी", value: "plant_nursery", modelType: "agriculture" },
            { label: "🌾 कृषि सप्लायर", value: "agri_supplier", modelType: "agriculture" },
        ],
    },
    // =================================================================
    // Hinglish (en-HI) Language Data
    // =================================================================
    "en-HI": {
        eCommerce: [
            { label: "🛒 Kirana Store", value: "kirana_store", modelType: "e-commerce" },
            { label: "👕 Kapde & Apparel Store", value: "clothing", modelType: "e-commerce" },
            { label: "👟 Footwear ki Dukaan", value: "footwear", modelType: "e-commerce" },
            { label: "💍 Jewellery ki Dukaan", value: "jewellery", modelType: "e-commerce" },
            { label: "📱 Electronics & Mobile Dukaan", value: "electronics", modelType: "e-commerce" },
            { label: "🛋️ Furniture & Home Decor Store", value: "furniture", modelType: "e-commerce" },
            { label: "📚 Stationery & Book Dukaan", value: "stationery", modelType: "e-commerce" },
            { label: "💊 Medical Store / Pharmacy", value: "medical_store", modelType: "e-commerce" },
            { label: "🍰 Bakery & Cake Shop", value: "bakery", modelType: "e-commerce" },
            { label: "🍬 Mithai & Namkeen ki Dukaan", value: "sweet_shop", modelType: "e-commerce" },
            { label: "🍎 Sabzi & Phal Vendor", value: "vegetable_vendor", modelType: "e-commerce" },
            { label: "🥩 Meat / Fish / Poultry Dukaan", value: "meat_shop", modelType: "e-commerce" },
            { label: "💄 Cosmetics & Beauty Store", value: "cosmetics", modelType: "e-commerce" },
            { label: "🎁 Gift & Khilone ki Dukaan", value: "gift_toy", modelType: "e-commerce" },
            { label: "🐾 Pet Supplies Store", value: "pet_supplies", modelType: "e-commerce" },
            { label: "🛠️ Hardware ki Dukaan", value: "hardware_store", modelType: "e-commerce" },
            { label: "⚽ Sports ke Samaan ki Dukaan", value: "sports_goods", modelType: "e-commerce" },
            { label: "🚗 Auto Parts ki Dukaan", value: "auto_parts", modelType: "e-commerce" },
            { label: "🪴 Plant Nursery / Garden Store", value: "garden_store", modelType: "e-commerce" },
            { label: "📦 Other Retail Store", value: "other_store", modelType: "e-commerce" },
        ],
        booking: [
            { label: "💇‍♂️ Salon / Nai ki Dukaan", value: "salon", modelType: "booking" },
            { label: "💆‍♀️ Spa & Wellness Center", value: "spa", modelType: "booking" },
            { label: "👨‍⚕️ Doctor / Clinic", value: "doctor", modelType: "booking" },
            { label: "🧪 Diagnostic / Pathology Lab", value: "diagnostic_lab", modelType: "booking" },
            { label: "🏥 Hospital / Nursing Home", value: "hospital", modelType: "booking" },
            { label: "🧑‍⚕️ Veterinarian (Janwaron ka Doctor)", value: "veterinarian", modelType: "booking" },
            { label: "🛠️ Mechanic / Garage", value: "mechanic", modelType: "booking" },
            { label: "🔧 Plumber / Electrician / Carpenter", value: "home_service", modelType: "booking" },
            { label: "🧊 AC / Appliance Repair", value: "appliance_repair", modelType: "booking" },
            { label: "🧹 Ghar ki Safai / Pest Control", value: "home_cleaning", modelType: "booking" },
            { label: "📸 Photographer / Videographer", value: "photographer", modelType: "booking" },
            { label: "🎪 Event Planner / Tent House", value: "tent_house", modelType: "booking" },
            { label: "🏟️ Sports Court / Turf Booking", value: "sports_facility", modelType: "booking" },
            { label: "🏨 Hotel / Lodge / Banquet", value: "hotel", modelType: "booking" },
            { label: "🚗 Car Rental / Taxi Service", value: "car_rental", modelType: "booking" },
            { label: "✈️ Travel Agent / Tour Operator", value: "travel_agent", modelType: "booking" },
            { label: "🧑‍🏫 Private Tutor / Teacher", value: "tutor", modelType: "booking" },
            { label: "📦 Other Booking Service", value: "other_booking", modelType: "booking" },
        ],
        subscription: [
            { label: "🥗 Tiffin / Mess Service", value: "tiffin_service", modelType: "subscription" },
            { label: "🥛 Doodh ki Delivery", value: "milk_vendor", modelType: "subscription" },
            { label: "📰 Akhbaar ki Delivery", value: "newspaper", modelType: "subscription" },
            { label: "💧 Peene ka Paani / RO Jar Supply", value: "water_supplier", modelType: "subscription" },
            { label: "🧺 Laundry / Dhobi Service", value: "laundry", modelType: "subscription" },
            { label: "🏋️ Gym / Fitness Center", value: "gym", modelType: "subscription" },
            { label: "🧘 Yoga / Wellness Class", value: "yoga", modelType: "subscription" },
            { label: "🎓 Coaching / Tuition Class", value: "coaching", modelType: "subscription" },
            { label: "🧼 Car / Bike Cleaning Service", value: "car_cleaning", modelType: "subscription" },
            { label: "📺 Cable / DTH Provider", value: "cable_provider", modelType: "subscription" },
            { label: "🌐 Internet / WiFi Provider", value: "internet_provider", modelType: "subscription" },
            { label: "💻 Software as a Service (SaaS)", value: "saas", modelType: "subscription" },
            { label: "🥦 Grocery Box Subscription", value: "grocery_box", modelType: "subscription" },
            { label: "📦 Other Subscription", value: "other_subscription", modelType: "subscription" },
        ],
        wholesale: [
            { label: "📦 Wholesaler / Stockist", value: "wholesaler", modelType: "wholesale" },
            { label: "🚚 Distributor / Dealer", value: "distributor", modelType: "wholesale" },
            { label: "🏭 Supplier / Trader", value: "supplier", modelType: "wholesale" },
            { label: "🥫 FMCG Distributor", value: "fmcg_distributor", modelType: "wholesale" },
            { label: "💊 Pharma Distributor", value: "pharma_distributor", modelType: "wholesale" },
            { label: "🌾 Kheti ke Samaan ka Vyapari", value: "agri_trader", modelType: "wholesale" },
            { label: "🧱 Building Material Supplier", value: "building_material", modelType: "wholesale" },
        ],
        manufacturing: [
            { label: "🏭 Factory / Plant", value: "factory", modelType: "manufacturing" },
            { label: "🛠️ Workshop / Production Unit", value: "workshop", modelType: "manufacturing" },
            { label: "👕 Kapda / Textile Manufacturing", value: "garment_manufacturing", modelType: "manufacturing" },
            { label: "🎨 Dastkari / Karigar Production", value: "handicraft", modelType: "manufacturing" },
            { label: "🍔 Food Processing Unit", value: "food_unit", modelType: "manufacturing" },
            { label: "📦 Printing & Packaging Unit", value: "printing_packaging", modelType: "manufacturing" },
            { label: "🔩 Metal Fabrication", value: "metal_fabrication", modelType: "manufacturing" },
        ],
        services: [
            { label: "📱 Repair Service (Mobile, Laptop)", value: "repair_service", modelType: "service" },
            { label: "🚚 Courier / Logistics Service", value: "logistics", modelType: "service" },
            { label: "🎓 Education / Training Center", value: "training", modelType: "service" },
            { label: "💼 Consultant / CA / Lawyer", value: "consultant", modelType: "service" },
            { label: "🏡 Real Estate Agent / Broker", value: "real_estate", modelType: "service" },
            { label: "📢 Marketing / Advertising Agency", value: "agency", modelType: "service" },
            { label: "🍽️ Catering Service", value: "catering", modelType: "service" },
            { label: "🎉 Event / Shaadi Planner", value: "event_planner", modelType: "service" },
            { label: "🛡️ Security Services", value: "security_service", modelType: "service" },
            { label: "📦 Other Service Provider", value: "other_service", modelType: "service" },
        ],
        online: [
            { label: "🌐 E-Commerce Website / Online Store", value: "online_store", modelType: "online" },
            { label: "🛍️ Marketplace Seller (Amazon, etc.)", value: "marketplace_seller", modelType: "online" },
            { label: "🎨 Graphic Designer / Web Developer", value: "web_developer", modelType: "online" },
            { label: "✍️ Content Creator / Writer", value: "content_creator", modelType: "online" },
            { label: "📈 Digital Marketing / SEO Specialist", value: "seo_specialist", modelType: "online" },
            { label: "💻 IT / Software Services", value: "it_services", modelType: "online" },
            { label: "🧑‍🏫 Online Coaching / Course Creator", value: "online_course", modelType: "online" },
            { label: "🤳 Blogger / Vlogger / Influencer", value: "influencer", modelType: "online" },
            { label: "🚚 Dropshipping Business", value: "dropshipping", modelType: "online" },
        ],
        agriculture: [
            { label: "🧑‍🌾 Kisaan / Kheti", value: "farmer", modelType: "agriculture" },
            { label: "🐄 Dairy Farm", value: "dairy_farm", modelType: "agriculture" },
            { label: "🐔 Poultry Farm", value: "poultry_farm", modelType: "agriculture" },
            { label: "🐟 Fish Farm (Machli Palan)", value: "fish_farm", modelType: "agriculture" },
            { label: "🌱 Plant Nursery", value: "plant_nursery", modelType: "agriculture" },
            { label: "🌾 Kheti ka Samaan Supplier", value: "agri_supplier", modelType: "agriculture" },
        ],
    }
};


export const modelTypesMaster: ModelType[] = [
    {
        code: "e-commerce",
        labels: {
            en: "🛒 Retail & eCommerce",
            hi: "🛒 खुदरा और ई-कॉमर्स",
            hinglish: "🛒 Retail aur e-Commerce",
        },
    },
    {
        code: "booking",
        labels: {
            en: "📅 Booking Based Services",
            hi: "📅 बुकिंग आधारित सेवाएँ",
            hinglish: "📅 Booking Based Services",
        },
    },
    {
        code: "subscription",
        labels: {
            en: "🔄 Subscription Based",
            hi: "🔄 सदस्यता आधारित",
            hinglish: "🔄 Subscription Based",
        },
    },
    {
        code: "wholesale",
        labels: {
            en: "📦 Wholesale",
            hi: "📦 थोक व्यापार",
            hinglish: "📦 Wholesale",
        },
    },
    {
        code: "manufacturing",
        labels: {
            en: "🏭 Manufacturing",
            hi: "🏭 विनिर्माण",
            hinglish: "🏭 Manufacturing",
        },
    },
    {
        code: "service",
        labels: {
            en: "💼 Services",
            hi: "💼 सेवाएँ",
            hinglish: "💼 Services",
        },
    },
    {
        code: "online",
        labels: {
            en: "🌐 Online",
            hi: "🌐 ऑनलाइन",
            hinglish: "🌐 Online",
        },
    },
    {
        code: "agriculture",
        labels: {
            en: "🚜 Agriculture & Farming",
            hi: "🚜 कृषि और खेती",
            hinglish: "🚜 Agriculture & Farming",
        },
    },
];


// ✅ Helper functions
export const getCategoryLabel = (
    value: string,
    lang: keyof typeof businessTypesData = "en"
): string => {
    const data = Object.values(businessTypesData[lang]).flat();
    const found = data.find((item) => item.value === value);
    return found ? found.label : value;
};


// src/data/modelTypesMaster.ts




export const getModelFullNames = (
    modelTypes: string[],
    lang: "en" | "hi" | "hinglish" = "en"
): string[] => {
    return modelTypes
        .map((mt) => {
            const found = modelTypesMaster.find((item) => item.code === mt);
            return found ? found.labels[lang] : mt;
        })
        .filter(Boolean);
};


