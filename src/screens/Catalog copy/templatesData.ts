// src/screens/Catalog/templatesData.ts
export type Locale = "en" | "hi" | "en-HI";

export const catalogText: Record<Locale, any> = {
  en: {
    searchPlaceholder: "Search templates...",
    addTemplate: "Add Template",
    addItem: "Add Item",
    template: "Template",
    items: "Items",
    edit: "Edit",
    delete: "Delete",
    noItems: "No items found",
  },
  hi: {
    searchPlaceholder: "टेम्पलेट खोजें...",
    addTemplate: "टेम्पलेट जोड़ें",
    addItem: "आइटम जोड़ें",
    template: "टेम्पलेट",
    items: "आइटम्स",
    edit: "संपादित करें",
    delete: "हटाएँ",
    noItems: "कोई आइटम नहीं मिला",
  },
  "en-HI": {
    searchPlaceholder: "Search ya टेम्पलेट...",
    addTemplate: "Add Template",
    addItem: "Add Item",
    template: "Template",
    items: "Items",
    edit: "Edit",
    delete: "Delete",
    noItems: "No items found",
  },
};
