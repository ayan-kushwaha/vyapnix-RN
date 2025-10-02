// src/ store/catalogSclice
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { CatalogItem, ItemTemplate } from './types';
import catalogService from './catalogService';

interface CatalogState {
    templates: ItemTemplate[];
    items: CatalogItem[];
    currentItem: CatalogItem | null;
    currentTemplateDetails: { template: ItemTemplate; items: CatalogItem[] } | null;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    message: string;
    publicTemplates: ItemTemplate[];
}

const initialState: CatalogState = {
    templates: [],
    items: [],
    currentItem: null,
    currentTemplateDetails: null,
    isLoading: false,
    isError: false,
    message: '',
    isSuccess: false,
    publicTemplates: [], // ✅ Initial state
};

// --- Async Thunks ---

export const createTemplate = createAsyncThunk('catalog/createTemplate', async (templateData: Partial<ItemTemplate>, thunkAPI) => {
    const token = (thunkAPI.getState() as RootState).auth.user!.token;
    return await catalogService.createTemplate(templateData, token);
});

export const getMyTemplates = createAsyncThunk<ItemTemplate[], void, { state: RootState; rejectValue: string }>(
    'catalog/getMyTemplates',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user!.token;
            return await catalogService.getMyTemplates(token);
        } catch (error: any) { return thunkAPI.rejectWithValue('Failed to fetch templates'); }
    }
);


export const createItem = createAsyncThunk('catalog/createItem', async (itemData: Partial<CatalogItem>, thunkAPI) => {
    const token = (thunkAPI.getState() as RootState).auth.user!.token;
    return await catalogService.createItem(itemData, token);
});
export const getMyItems = createAsyncThunk('catalog/getMyItems', async (_, thunkAPI) => {
    const token = (thunkAPI.getState() as RootState).auth.user!.token;
    return await catalogService.getMyItems(token);
});
export const updateItem = createAsyncThunk('catalog/updateItem', async ({ itemId, itemData }: { itemId: string; itemData: Partial<CatalogItem> }, thunkAPI) => {
    const token = (thunkAPI.getState() as RootState).auth.user!.token;
    return await catalogService.updateItem(itemId, itemData, token);
});
export const deleteItem = createAsyncThunk('catalog/deleteItem', async (itemId: string, thunkAPI) => {
    const token = (thunkAPI.getState() as RootState).auth.user!.token;
    await catalogService.deleteItem(itemId, token);
    return itemId; // Sirf ID wapas bhejein
});

export const deleteTemplate = createAsyncThunk('catalog/deleteTemplate', async (templateId: string, thunkAPI) => {
    const token = (thunkAPI.getState() as RootState).auth.user!.token;
    await catalogService.deleteTemplate(templateId, token);
    return templateId; // Sirf ID wapas bhejein
});

// ✅ NAYA THUNK: Template ko update karne ke liye
export const updateTemplate = createAsyncThunk('catalog/updateTemplate', async ({ templateId, templateData }: { templateId: string; templateData: Partial<ItemTemplate> }, thunkAPI) => {
    const token = (thunkAPI.getState() as RootState).auth.user!.token;
    return await catalogService.updateTemplate(templateId, templateData, token);
});

// ✅ NAYA THUNK: Item par event (like) track karne ke liye
export const trackItemEvent = createAsyncThunk('catalog/trackEvent', async ({ itemId, eventType }: { itemId: string; eventType: 'like' }, thunkAPI) => {
    // Note: 'view' jaise event ke liye humein authentication ki zaroorat nahi
    await catalogService.trackEvent(itemId, eventType);
    return { itemId, eventType }; // UI update karne ke liye data wapas bhejein
});

// ✨ NAYA THUNK: Template with items
export const getTemplateWithItems = createAsyncThunk<
    { template: ItemTemplate; items: CatalogItem[] },
    string,
    { state: RootState; rejectValue: string }
>(
    'catalog/getTemplateWithItems',
    async (templateId, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user!.token;
            return await catalogService.getTemplateWithItems(templateId, token);
        } catch (error: any) { return thunkAPI.rejectWithValue('Failed to fetch template details'); }
    }
);



export const addReview = createAsyncThunk('catalog/addReview', async ({ itemId, reviewData }: { itemId: string; reviewData: { rating: number; comment: string } }, thunkAPI) => {
    const token = (thunkAPI.getState() as RootState).auth.user!.token;
    return await catalogService.addReview(itemId, reviewData, token);
});



// ✅ NEW THUNK: Saare public templates fetch karne ke liye
export const getPublicTemplates = createAsyncThunk<ItemTemplate[], void, { rejectValue: string }>(
    'catalog/getPublicTemplates',
    async (_, thunkAPI) => {
        try {
            return await catalogService.getPublicTemplates();
        } catch (error: any) {
            return thunkAPI.rejectWithValue('Failed to fetch public templates.');
        }
    }
);

// ✅ NEW THUNK: Ek template ko clone karne ke liye
export const cloneTemplate = createAsyncThunk<ItemTemplate, string, { state: RootState; rejectValue: string }>(
    'catalog/cloneTemplate',
    async (templateId, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user!.token;
            return await catalogService.cloneTemplate(templateId, token);
        } catch (error: any) {
            return thunkAPI.rejectWithValue('Failed to clone template.');
        }
    }
);

// / --- Admin Thunks ---
// ✅ NEW: Naya public template banane ke liye
export const adminCreateTemplate = createAsyncThunk('catalog/adminCreateTemplate', async (templateData: Partial<ItemTemplate>, thunkAPI) => {
    const token = (thunkAPI.getState() as RootState).auth.user!.token;
    return await catalogService.adminCreateTemplate(templateData, token);
});
// ✅ NEW: Public template ko update karne ke liye
export const adminUpdateTemplate = createAsyncThunk('catalog/adminUpdateTemplate', async ({ templateId, templateData }: { templateId: string, templateData: Partial<ItemTemplate> }, thunkAPI) => {
    const token = (thunkAPI.getState() as RootState).auth.user!.token;
    return await catalogService.adminUpdateTemplate(templateId, templateData, token);
});
// ✅ NEW: Public template ko delete karne ke liye
export const adminDeleteTemplate = createAsyncThunk('catalog/adminDeleteTemplate', async (templateId: string, thunkAPI) => {
    const token = (thunkAPI.getState() as RootState).auth.user!.token;
    await catalogService.adminDeleteTemplate(templateId, token);
    return templateId; // Sirf ID wapas bhejein
});


// -------------------- Merge Update --------------------
export const updateTemplateWithMerge = createAsyncThunk<CatalogItem, string, { state: RootState }>(
    'catalog/updateTemplateWithMerge',
    async (templateId, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user?.token;
            if (!token) throw new Error('No auth token found');

            const data = await catalogService.updateTemplateWithMerge(templateId, token);
            return data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message || 'Update failed');
        }
    }
);



// --- Slice ---
const catalogSlice = createSlice({
    name: 'catalog',
    initialState,
    reducers: {
        reset: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
            // --- Get Templates ---
            .addCase(getMyTemplates.pending, (state) => { state.isLoading = true; })
            .addCase(getMyTemplates.fulfilled, (state, action) => {
                state.isLoading = false;
                state.templates = action.payload;
            })
            .addCase(getMyTemplates.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload as string;
            })
            // --- Create Template ---
            .addCase(createTemplate.fulfilled, (state, action) => {
                state.templates.push(action.payload);
            })
            // --- Get Items ---
            .addCase(getMyItems.pending, (state) => { state.isLoading = true; })
            .addCase(getMyItems.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload;
            })
            .addCase(getMyItems.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload as string;
            })
            // --- Create Item ---
            .addCase(createItem.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            // --- Update Item ---
            .addCase(updateItem.fulfilled, (state, action) => {
                const index = state.items.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            // --- Delete Item ---
            .addCase(deleteItem.fulfilled, (state, action) => {
                state.items = state.items.filter(item => item._id !== action.payload);
            })
            // --- Get Template With Items ---
            .addCase(getTemplateWithItems.pending, (state) => { state.isLoading = true; })
            .addCase(getTemplateWithItems.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentTemplateDetails = action.payload;
            })
            .addCase(getTemplateWithItems.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload as string;
            })
            // --- Add Review ---
            .addCase(addReview.fulfilled, (state) => {
                // Yahan aap state ko refresh karne ke liye logic likh sakte hain, jaise ki
                // currentItem ya items array ko update karna.
                console.log('Review added successfully!');
            })
            .addCase(addReview.rejected, (state, action) => {
                state.isError = true;
                state.message = action.payload as string;
            })
            .addCase(updateTemplate.fulfilled, (state, action) => {
                const index = state.templates.findIndex(t => t._id === action.payload._id);
                if (index !== -1) {
                    state.templates[index] = action.payload;
                }
            })
            .addCase(deleteTemplate.fulfilled, (state, action) => {
                // action.payload woh 'templateId' hai jo humne thunk se return ki thi
                state.templates = state.templates.filter(template => template._id !== action.payload);
            })
            // ... getMyItems, createItem, updateItem, deleteItem ke cases waise hi rahenge ...
            // ✅ TRACK EVENT ke liye naye cases (Optimistic Update)
            .addCase(trackItemEvent.fulfilled, (state, action) => {
                const { itemId, eventType } = action.payload;
                const itemIndex = state.items.findIndex(item => item._id === itemId);
                if (itemIndex !== -1 && eventType === 'like') {
                    // Hum maan lete hain ki like ho gaya aur UI turant update kar dete hain
                    state.items[itemIndex].likes += 1;
                }
            })
            // --- Public Templates ---
            .addCase(getPublicTemplates.pending, (state) => { state.isLoading = true; })
            .addCase(getPublicTemplates.fulfilled, (state, action: PayloadAction<ItemTemplate[]>) => {
                state.isLoading = false;
                state.publicTemplates = action.payload;
            })
            .addCase(getPublicTemplates.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload || 'Could not fetch public templates.';
            })

            // --- Clone Template ---
            .addCase(cloneTemplate.pending, (state) => { state.isLoading = true; })
            .addCase(cloneTemplate.fulfilled, (state, action: PayloadAction<ItemTemplate>) => {
                state.isLoading = false;
                // ✅ Jab template clone ho jaye, to use user ki private list mein jod do
                state.templates.push(action.payload);
            })
            .addCase(cloneTemplate.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload || 'Could not clone the template.';
            })
            // ✅ Admin Template Actions
            .addCase(adminCreateTemplate.fulfilled, (state, action: PayloadAction<ItemTemplate>) => {
                state.publicTemplates.push(action.payload);
            })
            .addCase(adminUpdateTemplate.fulfilled, (state, action: PayloadAction<ItemTemplate>) => {
                const index = state.publicTemplates.findIndex(t => t._id === action.payload._id);
                if (index !== -1) {
                    state.publicTemplates[index] = action.payload;
                }
            })
            .addCase(adminDeleteTemplate.fulfilled, (state, action: PayloadAction<string>) => {
                state.publicTemplates = state.publicTemplates.filter(t => t._id !== action.payload);
            })
            // updateTemplateWithMerge
            .addCase(updateTemplateWithMerge.pending, (state) => { state.isLoading = true; })
            .addCase(updateTemplateWithMerge.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const idx = state.items.findIndex(i => i._id === action.payload._id);
                if (idx !== -1) state.items[idx] = action.payload;
                else state.items.push(action.payload);
            })
            .addCase(updateTemplateWithMerge.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload as string;
            });


    },
});

export const { reset } = catalogSlice.actions;
export default catalogSlice.reducer;