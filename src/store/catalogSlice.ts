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
    isError: boolean;
    message: string;
}

const initialState: CatalogState = {
    templates: [],
    items: [],
    currentItem: null,
    currentTemplateDetails: null,
    isLoading: false,
    isError: false,
    message: '',
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

export const updateTemplate = createAsyncThunk('catalog/updateTemplate', async ({ templateId, templateData }: { templateId: string; templateData: Partial<ItemTemplate> }, thunkAPI) => {
    const token = (thunkAPI.getState() as RootState).auth.user!.token;
    return await catalogService.updateTemplate(templateId, templateData, token);
});

export const deleteTemplate = createAsyncThunk('catalog/deleteTemplate', async (templateId: string, thunkAPI) => {
    const token = (thunkAPI.getState() as RootState).auth.user!.token;
    await catalogService.deleteTemplate(templateId, token);
    return templateId; // Sirf ID wapas bhejein
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
            state.templates = state.templates.filter(t => t._id !== action.payload);
        });
},
});

export const { reset } = catalogSlice.actions;
export default catalogSlice.reducer;