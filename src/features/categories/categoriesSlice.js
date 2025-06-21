// Importación de redux y funcion axios
import { createSlice, createEntityAdapter, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { buscar, agregarCategoria, editarCategoria, eliminarCategoria } from '../../api/api';

// Crear un adaptador para manejar las categorías de videos
const categoriesAdapter = createEntityAdapter({
    selectId: (category) => category.id,
    // Configurar un comparador de ordenación para colocar las categorías marcadas como banner al inicio
    sortComparer: (a, b) => {
        if (a.isBanner) return -1; // La categoría a es marcada como banner
        if (b.isBanner) return 1; // La categoría b es marcada como banner
        return 0; // Ninguna de las categorías es marcada como banner
    }
});

// Estado inicial utilizando el adaptador, con estado de carga y error
const initialState = categoriesAdapter.getInitialState({
    status: 'idle',
    deleteStatus: 'idle', // Estado específico para la eliminación de categorías
    error: null,
});

// Thunk para obtener las categorías de la API de forma asíncrona
export const fetchCategories = createAsyncThunk(
    'videoCategories/fetchCategories',
    async () => {
        const response = await buscar('/categorias')
        return response;
    }
);

// Thunk para agregar categoria
export const addCategory = createAsyncThunk(
    'categories/addCategory',
    async (newCategory, { rejectWithValue }) => {
        try {
            const response = await agregarCategoria(newCategory);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message || 'Error desconocido');
        }
    }
);

// Thunk para editar categoria
export const updateCategory = createAsyncThunk(
    'categories/updateCategory',
    async ({ categoryId, updatedCategory }, { rejectWithValue }) => {
        try {
            const response = await editarCategoria(categoryId, updatedCategory)
            console.log(response.data)
            return response.data.categorias; // Devuelve el arreglo completo de categorías
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Thunk para eliminar categoria
export const deleteCategory = createAsyncThunk(
    'categories/deleteCategory',
    async ( categoryId, { rejectWithValue } ) => {
        try {
            const response = await eliminarCategoria(categoryId);
            if (response.status === 200) {
                return categoryId 
            } else {
                return rejectWithValue('Unexpected response status');
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Crear un slice para manejar las categorías de videos
const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // OBTENER CATEGORIAS
            .addCase(fetchCategories.pending, (state) => { // Estado de carga mientras se obtienen las categorías
                state.status = 'loading'
            })
            .addCase(fetchCategories.fulfilled, (state, action) => { // Estado de éxito cuando se obtienen las categorías, e inserta categorias al estado
                state.status = 'succeeded'
                categoriesAdapter.upsertMany(state, action.payload);
            })
            .addCase(fetchCategories.rejected, (state, action) => { // Estado de error si la obtención falla
                state.status = 'failed'
                state.error = action.error.message;
            })
            // AGREGAR CATEGORIA
            .addCase(addCategory.pending, (state) => { // Estado de carga mientras se agrega la categoria
                state.status = 'loading'
            })
            .addCase(addCategory.fulfilled, (state, action) => {
                state.status = 'succeeded';
        
                const { categorias } = action.payload; // Extraer la lista actualizada de categorías
        
                if (categorias && Array.isArray(categorias)) {
                    // Reemplazar completamente el estado con las categorías actualizadas
                    categoriesAdapter.setAll(state, categorias);
                } else {
                    console.warn('Categorías no recibidas correctamente del backend.');
                }
            })
            .addCase(addCategory.rejected, (state, action) => { // Estado de error
                state.status = 'failed'
                state.error = action.payload || 'Error al agregar la categoría';
            })
            // EDITAR CATEGORIA
            .addCase(updateCategory.pending, (state) => {
                state.status = 'loading';
            })
            // Caso fulfilled: cuando la categoría se ha editado correctamente
            .addCase(updateCategory.fulfilled, (state, action) => {
                state.status = 'succeeded';
                categoriesAdapter.setAll(state, action.payload); // Reemplaza todas las categorías con las actualizadas
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            // ELIMINAR CATEGORIA
            .addCase(deleteCategory.pending, (state) => {
                state.deleteStatus = 'loading';
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                // const { categoryId } = action.payload; // Desestructura el categoryId del payload
                state.deleteStatus = 'succeeded';
                categoriesAdapter.removeOne(state, action.payload);
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.deleteStatus = 'failed';
                state.error = action.error.message;
            });
    },
});

// Exportar selectores del adaptador para obtener todas las categorías
export const {
    selectAll: selectAllCategories,
    selectById: selectCategoryById,
    selectIds: selectCategoryIds,
} = categoriesAdapter.getSelectors(state => state.categories);

export const selectCategoryColors = createSelector(
    [selectAllCategories], // Entrada: Todas las categorías
    (categories) => categories.map((category) => category.color) // Salida: Lista de colores
);

// Exportar el reductor del slice
export default categoriesSlice.reducer;