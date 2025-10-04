import { DynamicField } from "./AddTemplateForm";

export const defaultFields: Record<string, DynamicField[]> = {
    "e-commerce": [
        { fieldName: "delivery-date", label: "Preferred Delivery Date", fieldType: "date", options: [], validation: { isRequired: false }, isExpanded: true },
        { fieldName: "delivery-time", label: "Preferred Delivery Time", fieldType: "time", options: [], validation: { isRequired: false }, isExpanded: true },
        { fieldName: "gift-wrap", label: "Gift Wrap", fieldType: "switch", options: [], validation: { isRequired: false }, isExpanded: true },
        { fieldName: "instructions", label: "Special Instructions", fieldType: "textarea", options: [], validation: { isRequired: false }, isExpanded: true },
    ],
    "booking": [
        { fieldName: "date", label: "Booking Date", fieldType: "date", options: [], validation: { isRequired: true }, isExpanded: true },
        { fieldName: "time", label: "Booking Time", fieldType: "time", options: [], validation: { isRequired: true }, isExpanded: true },
        { fieldName: "duration", label: "Duration", fieldType: "number", options: [], validation: { isRequired: false }, isExpanded: true },
        { fieldName: "notes", label: "Notes", fieldType: "textarea", options: [], validation: { isRequired: false }, isExpanded: true },
    ],
    "subscription": [
        { fieldName: "plan-name", label: "Plan Name", fieldType: "text", options: [], validation: { isRequired: true }, isExpanded: true },
        { fieldName: "billing-cycle", label: "Billing Cycle", fieldType: "dropdown-single", options: ["Daily", "Weekly", "Monthly", "Yearly"], validation: { isRequired: true }, isExpanded: true },
        { fieldName: "start-date", label: "Start Date", fieldType: "date", options: [], validation: { isRequired: true }, isExpanded: true },
        { fieldName: "notes", label: "Notes", fieldType: "textarea", options: [], validation: { isRequired: false }, isExpanded: true },
    ]
};
