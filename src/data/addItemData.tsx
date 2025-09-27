// src/data/addItemData.ts

export const addItemData = {
  en: {
    addTitle: "Add New Item",
    editTitle: "Edit Item",
    subtitle: "Fill in the details for this item.",
    itemName: "Item Name",
    itemNamePlaceholder: "e.g., Classic Polo T-Shirt",
    description: "Description",
    descriptionPlaceholder: "Tell us more about this item...",
    price: "Base Price",
    pricePlaceholder: "e.g., 999",
    stock: "Stock Quantity",
    stockPlaceholder: "e.g., 100",
    itemImages: "Item Images",
    saveButton: "Save Item",
    updateButton: "Update Item",
    tags: "Tags (comma-separated)", // ✅ Nayi line
    tagsPlaceholder: "e.g., new arrival, sale", // ✅ Nayi line
    status: { // ✅ Naya section
      title: "Item Status",
      publicLabel: "Public",
      privateLabel: "Private",
      publicDesc: "Visible to everyone.",
      privateDesc: "Only visible to you."
    },
    validation: {
      title: "Error",
      success: "Success!",
      nameAndPriceRequired: "Item Name and Price are required.",
      saveSuccess: "Item added successfully.",
      updateSuccess: "Item updated successfully.",
    }
  },
  hi: {
    addTitle: "नया आइटम जोड़ें",
    editTitle: "आइटम एडिट करें",
    subtitle: "इस आइटम का विवरण भरें।",
    itemName: "आइटम का नाम",
    itemNamePlaceholder: "उदा., क्लासिक पोलो टी-शर्ट",
    description: "विवरण",
    descriptionPlaceholder: "इस आइटम के बारे में और बताएं...",
    price: "मूल कीमत",
    pricePlaceholder: "उदा., 999",
    stock: "स्टॉक मात्रा",
    stockPlaceholder: "उदा., 100",
    tags: "टैग (अल्पविराम से अलग)", // ✅ Nayi line
    tagsPlaceholder: "उदा., नया आगमन, बिक्री",
    itemImages: "आइटम की छवियां",
    saveButton: "आइटम सहेजें",
    updateButton: "आइटम अपडेट करें",
    status: { // ✅ Naya section
      title: "आइटम की स्थिति",
      publicLabel: "सार्वजनिक",
      privateLabel: "निजी",
      publicDesc: "सभी को दिखाई दे रहा है।",
      privateDesc: "केवल आपको दिखाई दे रहा है।"
    },
    validation: {
      title: "त्रुटि",
      success: "सफलता!",
      nameAndPriceRequired: "आइटम का नाम और कीमत आवश्यक है।",
      saveSuccess: "आइटम सफलतापूर्वक जोड़ा गया।",
      updateSuccess: "आइटम सफलतापूर्वक अपडेट किया गया।",
    }
  },
  "en-HI": {
    addTitle: "Naya Item Add Karein",
    editTitle: "Item Edit Karein",
    subtitle: "Is item ki details bharein.",
    itemName: "Item ka Naam",
    description: "Description",
    price: "Base Price",
    stock: "Stock Quantity",
    tags: "Tags (comma-separated)",
    tagsPlaceholder: "jaise, new arrival, sale",
    itemImages: "Item Images",
    saveButton: "Item Save Karein",
    updateButton: "Item Update Karein",
    status: { // ✅ Naya section
      title: "Item Status",
      publicLabel: "Public",
      privateLabel: "Private",
      publicDesc: "Sabko dikhega.",
      privateDesc: "Sirf aapko dikhega."
    },
    validation: {
      title: "Galti",
      success: "Safal!",
      nameAndPriceRequired: "Item ka naam aur price zaroori hai.",
    }
  }
};