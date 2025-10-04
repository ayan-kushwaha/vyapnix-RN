// src/store/catalogSlice.ts
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
    publicTemplates: [],
};

// -------------------- ASYNC THUNKS --------------------

// Template CRUD
export const createTemplate = createAsyncThunk(
    'catalog/createTemplate',
    async (templateData: Partial<ItemTemplate>, thunkAPI) => {
        const token = (thunkAPI.getState() as RootState).auth.user!.token;
        return await catalogService.createTemplate(templateData, token);
    }
);

export const getMyTemplates = createAsyncThunk<ItemTemplate[], void, { state: RootState; rejectValue: string }>(
    'catalog/getMyTemplates',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user!.token;
            return await catalogService.getMyTemplates(token);
        } catch (error: any) {
            return thunkAPI.rejectWithValue('Failed to fetch templates');
        }
    }
);

export const updateTemplate = createAsyncThunk(
    'catalog/updateTemplate',
    async ({ templateId, templateData }: { templateId: string; templateData: Partial<ItemTemplate> }, thunkAPI) => {
        const token = (thunkAPI.getState() as RootState).auth.user!.token;
        return await catalogService.updateTemplate(templateId, templateData, token);
    }
);

export const deleteTemplate = createAsyncThunk(
    'catalog/deleteTemplate',
    async (templateId: string, thunkAPI) => {
        const token = (thunkAPI.getState() as RootState).auth.user!.token;
        await catalogService.deleteTemplate(templateId, token);
        return templateId;
    }
);

// Item CRUD
export const createItem = createAsyncThunk(
    'catalog/createItem',
    async (itemData: Partial<CatalogItem>, thunkAPI) => {
        const token = (thunkAPI.getState() as RootState).auth.user!.token;
        return await catalogService.createItem(itemData, token);
    }
);

export const getMyItems = createAsyncThunk(
    'catalog/getMyItems',
    async (_, thunkAPI) => {
        const token = (thunkAPI.getState() as RootState).auth.user!.token;
        return await catalogService.getMyItems(token);
    }
);

export const updateItem = createAsyncThunk(
    'catalog/updateItem',
    async ({ itemId, itemData }: { itemId: string; itemData: Partial<CatalogItem> }, thunkAPI) => {
        const token = (thunkAPI.getState() as RootState).auth.user!.token;
        return await catalogService.updateItem(itemId, itemData, token);
    }
);


export const deleteItem = createAsyncThunk(
    'catalog/deleteItem',
    async (itemId: string, thunkAPI) => {
        try {
            const token = (thunkAPI.getState() as RootState).auth.user!.token;
            await catalogService.deleteItem(itemId, token);
            return itemId;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.message || 'Failed to delete item');
        }
    }
);

// Template with items
export const getTemplateWithItems = createAsyncThunk<{ template: ItemTemplate; items: CatalogItem[] }, string, { state: RootState; rejectValue: string }>(
    'catalog/getTemplateWithItems',
    async (templateId, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user!.token;
            return await catalogService.getTemplateWithItems(templateId, token);
        } catch (error: any) {
            return thunkAPI.rejectWithValue('Failed to fetch template details');
        }
    }
);

// Public templates
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

// Clone template
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

// -------------------- ADDITIONAL THUNKS --------------------
export const addReview = createAsyncThunk(
    'catalog/addReview',
    async ({ itemId, reviewData }: { itemId: string; reviewData: { rating: number; comment: string } }, thunkAPI) => {
        const token = (thunkAPI.getState() as RootState).auth.user!.token;
        return await catalogService.addReview(itemId, reviewData, token);
    }
);

export const trackItemEvent = createAsyncThunk(
    'catalog/trackEvent',
    async ({ itemId, eventType }: { itemId: string; eventType: 'like' }, thunkAPI) => {
        await catalogService.trackEvent(itemId, eventType);
        return { itemId, eventType };
    }
);

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

// Admin template thunks
export const adminCreateTemplate = createAsyncThunk(
    'catalog/adminCreateTemplate',
    async (templateData: Partial<ItemTemplate>, thunkAPI) => {
        const token = (thunkAPI.getState() as RootState).auth.user!.token;
        return await catalogService.adminCreateTemplate(templateData, token);
    }
);

export const adminUpdateTemplate = createAsyncThunk(
    'catalog/adminUpdateTemplate',
    async ({ templateId, templateData }: { templateId: string; templateData: Partial<ItemTemplate> }, thunkAPI) => {
        const token = (thunkAPI.getState() as RootState).auth.user!.token;
        return await catalogService.adminUpdateTemplate(templateId, templateData, token);
    }
);

export const adminDeleteTemplate = createAsyncThunk(
    'catalog/adminDeleteTemplate',
    async (templateId: string, thunkAPI) => {
        const token = (thunkAPI.getState() as RootState).auth.user!.token;
        await catalogService.adminDeleteTemplate(templateId, token);
        return templateId;
    }
);

// -------------------- SLICE --------------------
const catalogSlice = createSlice({
    name: 'catalog',
    initialState,
    reducers: {
        reset: (state) => initialState,
    },
    extraReducers: (builder) => {
        // -------------------- ALL PENDING / FULFILLED / REJECTED --------------------
        const thunks = [
            getMyTemplates, createTemplate, updateTemplate, deleteTemplate,
            getMyItems, createItem, updateItem, deleteItem,
            getTemplateWithItems, getPublicTemplates, cloneTemplate,
            addReview, trackItemEvent, updateTemplateWithMerge,
            adminCreateTemplate, adminUpdateTemplate, adminDeleteTemplate
        ];

        thunks.forEach(thunk => {
            builder
                .addCase(thunk.pending, (state) => {
                    state.isLoading = true;
                    state.isError = false;
                    state.message = '';
                })
                .addCase(thunk.fulfilled, (state, action: PayloadAction<any>) => {
                    state.isLoading = false;
                    state.isSuccess = true;

                    // Specific updates
                    switch (thunk) {
                        case getMyTemplates:
                            state.templates = action.payload;
                            break;
                        case createTemplate:
                            state.templates.push(action.payload);
                            break;
                        case updateTemplate:
                            const idxT = state.templates.findIndex(t => t._id === action.payload._id);
                            if (idxT !== -1) state.templates[idxT] = action.payload;
                            break;
                        case deleteTemplate:
                            state.templates = state.templates.filter(t => t._id !== action.payload);
                            break;
                        case getMyItems:
                            state.items = action.payload;
                            break;

                        case createItem:
                            state.items.push(action.payload);
                            break;
                        case updateItem:
                            const idxI = state.items.findIndex(i => i._id === action.payload._id);
                            if (idxI !== -1) state.items[idxI] = action.payload;
                            break;
                        case deleteItem:
                            state.items = state.items.filter(i => i._id !== action.payload);
                            break;
                        case getTemplateWithItems:
                            state.currentTemplateDetails = action.payload;
                            break;
                        case getPublicTemplates:
                            state.publicTemplates = action.payload;
                            break;
                        case cloneTemplate:
                            state.templates.push(action.payload);
                            break;
                        case addReview:
                            // Optional: refresh current item / items if needed
                            break;
                        case trackItemEvent:
                            const { itemId, eventType } = action.payload;
                            const itemIndex = state.items.findIndex(item => item._id === itemId);
                            if (itemIndex !== -1 && eventType === 'like') state.items[itemIndex].likes += 1;
                            break;
                        case updateTemplateWithMerge:
                            const idxM = state.items.findIndex(i => i._id === action.payload._id);
                            if (idxM !== -1) state.items[idxM] = action.payload;
                            else state.items.push(action.payload);
                            break;
                        case adminCreateTemplate:
                            state.publicTemplates.push(action.payload);
                            break;
                        case adminUpdateTemplate:
                            const idxA = state.publicTemplates.findIndex(t => t._id === action.payload._id);
                            if (idxA !== -1) state.publicTemplates[idxA] = action.payload;
                            break;
                        case adminDeleteTemplate:
                            state.publicTemplates = state.publicTemplates.filter(t => t._id !== action.payload);
                            break;
                    }
                })
                .addCase(thunk.rejected, (state, action) => {
                    state.isLoading = false;
                    state.isError = true;
                    state.message = typeof action.payload === 'string' ? action.payload : 'Failed';
                });
        });
    }
});

export const { reset } = catalogSlice.actions;
export default catalogSlice.reducer;
