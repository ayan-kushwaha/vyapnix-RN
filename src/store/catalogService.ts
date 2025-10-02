// src/ store/catalogServoce
import axios from 'axios';
import { CatalogItem, ItemTemplate } from './types';

const API_URL = `${process.env.EXPO_PUBLIC_API_BASE_URL}/catalog`;

// --- Template (Blueprint) Service ---

// Naya Blueprint banana
const createTemplate = async (templateData: Partial<ItemTemplate>, token: string) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(`${API_URL}/templates`, templateData, config);
    return response.data;
};

// Apne sabhi Blueprints ki list laana
const getMyTemplates = async (token: string) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(`${API_URL}/templates`, config);
    return response.data;
};

// ✨ NAYA: Ek Blueprint ko update karna
const updateTemplate = async (templateId: string, templateData: Partial<ItemTemplate>, token: string) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.put(`${API_URL}/templates/${templateId}`, templateData, config);
    return response.data;
};

// ✨ NAYA: Ek Blueprint ko delete karna
const deleteTemplate = async (templateId: string, token: string) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.delete(`${API_URL}/templates/${templateId}`, config);
    return response.data;
};



const getTemplateWithItems = async (templateId: string, token: string) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(`${API_URL}/templates/${templateId}`, config);
    return response.data;
};

// --- Catalog Item (Product/Service) Service ---

// Naya Item banana
const createItem = async (itemData: Partial<CatalogItem>, token: string) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(`${API_URL}/items`, itemData, config);
    return response.data;
};

// Apne sabhi Items ki list laana
const getMyItems = async (token: string) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(`${API_URL}/items`, config);
    return response.data;
};

// ✨ NAYA: Ek Item ki detail laana (public)
const getItemById = async (itemId: string) => {
    const response = await axios.get(`${API_URL}/items/${itemId}`);
    return response.data;
};

// ✨ NAYA: Ek Item ko update karna
const updateItem = async (itemId: string, itemData: Partial<CatalogItem>, token: string) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.put(`${API_URL}/items/${itemId}`, itemData, config);
    return response.data;
};

// ✨ NAYA: Ek Item ko delete karna
const deleteItem = async (itemId: string, token: string) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.delete(`${API_URL}/items/${itemId}`, config);
    return response.data;
};


// ✨ NAYA: Analytics event track karne ke liye
const trackEvent = async (itemId: string, eventType: 'view' | 'click' | 'like' | 'share') => {
    const response = await axios.post(`${API_URL}/items/${itemId}/track`, { eventType });
    return response.data;
};

// ✨ NAYA: Review jodne ke liye
const addReview = async (itemId: string, reviewData: { rating: number, comment: string }, token: string) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(`${API_URL}/items/${itemId}/reviews`, reviewData, config);
    return response.data;
};




// ... (updateTemplate, deleteTemplate, etc. waise hi rahenge)

// --- Public & Clone Template Service ---

// ✅ NEW: Saare public starter templates laane ke liye
const getPublicTemplates = async () => {
    // Iske liye token ki zaroorat nahi hai
    const response = await axios.get(`${API_URL}/public-templates`);
    return response.data;
};

// ✅ NEW: Ek public template ko user ke account mein copy (clone) karne ke liye
const cloneTemplate = async (templateId: string, token: string) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(`${API_URL}/templates/clone/${templateId}`, {}, config); // Body khaali bhej sakte hain
    return response.data;
};


// ✅ NEW: Admin ke liye naye service functions
const adminCreateTemplate = async (templateData: Partial<ItemTemplate>, token: string) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(`${API_URL}/admin/templates`, templateData, config);
    return response.data;
};
const adminUpdateTemplate = async (templateId: string, templateData: Partial<ItemTemplate>, token: string) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.put(`${API_URL}/admin/templates/${templateId}`, templateData, config);
    return response.data;
};
const adminDeleteTemplate = async (templateId: string, token: string) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    await axios.delete(`${API_URL}/admin/templates/${templateId}`, config);
    return templateId; // Delete ke baad ID wapas bhejein
};



const updateTemplateWithMerge = async (templateId: string, token: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const { data } = await axios.put(`${API_URL}/templates/${templateId}/merge-update`, {}, config);
    return data;
};



const catalogService = {
    createTemplate,
    getMyTemplates,
    updateTemplate,
    deleteTemplate,
    getTemplateWithItems,
    createItem,
    getMyItems,
    getItemById,
    updateItem,
    deleteItem,
    trackEvent,         // ✨ Joda gaya
    addReview,
    getPublicTemplates,
    cloneTemplate,
    // ✅ Admin functions
    adminCreateTemplate, adminUpdateTemplate, adminDeleteTemplate, updateTemplateWithMerge
};

export default catalogService;