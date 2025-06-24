import React from 'react'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { renderWithProviders } from '../../../utils/testUtils'
import CategoriesTestComponent from '../CategoriesTestComponent'

// 👉 Importas el mock centralizado
import { 
    mockBuscar,
    mockCategoriesData,
    setupSuccessfulFetchMock,
    setupFailedFetchMock,
    mockAddCategory,
    setupSuccessfulAddCategoryMock,
    setupFailedAddCategoryMock,
    mockUpdateCategory,
    setupSuccessfulUpdateCategoryMock,
    clearAllMocks,
    resetAllMocks
} from '../mocks/categoriesApiMocks';

import { assertionHelpers } from '../helpers/assertionHelpers';
import { actionHelpers } from '../helpers/actionHelpers';
import { createPreloadedCategoryState } from '../helpers/stateHelpers';
// import { editarCategoria } from '../../../api/api';

// Mock de las funciones de API
jest.mock('../../../api/api', () => ({
    buscar: require('../mocks/categoriesApiMocks').mockBuscar,
    agregarCategoria : require('../mocks/categoriesApiMocks').mockAddCategory,
    editarCategoria : require('../mocks/categoriesApiMocks').mockUpdateCategory
}));

describe("categories Integration Tests", () => {

    beforeEach(() => {
        // Limpiar todos los mocks antes de cada test
        clearAllMocks()
        resetAllMocks()
    });
    
    test('should fetch and render categories', async () => {
        setupSuccessfulFetchMock(mockCategoriesData.basic);
        const { store } = renderWithProviders(<CategoriesTestComponent />);

        // Verifica estado de loading
        assertionHelpers.expectLoadingVisible();

        // Assert: categories render
        await assertionHelpers.expectCategoriesToBeRendered([
            'Fut-bol',
            'Frontenis',
            'Longboarding'
        ]);

        // Verifica que la API se llamó correctamente
        expect(mockBuscar).toHaveBeenCalledWith('/categorias');
        expect(mockBuscar).toHaveBeenCalledTimes(1);
    
        const state = store.getState();
        expect(state.categories.status).toBe('succeeded');
        expect(state.categories.entities['1'].nombre).toBe('Fut-bol');
    })
    test('should handle API error gracefully', async () => {
        setupFailedFetchMock('Error de red');

        renderWithProviders(<CategoriesTestComponent />);

        await assertionHelpers.expectErrorVisible();

        expect(mockBuscar).toHaveBeenCalledTimes(1);
    });

    test('should add a new category', async () => {
 
        const preloadedState = createPreloadedCategoryState(mockCategoriesData.basic);

        // Configura el mock con el nuevo listado incluyendo la nueva categoría
        setupSuccessfulAddCategoryMock();

        const { store } = renderWithProviders(<CategoriesTestComponent />, { preloadedState });
        actionHelpers.clickAddCategoryButton()

        // Assert: verifica que la nueva categoría aparece en el DOM
        await assertionHelpers.expectCategoriesToBeRendered([
            'Fut-bol',
            'Frontenis',
            'Longboarding',
            'Natacion' // La nueva
        ]);
        // Verifica que la API fue llamada correctamente
        expect(mockAddCategory).toHaveBeenCalledTimes(1);
         // Verifica que el estado global del store fue actualizado correctamente
        const state = store.getState();
        expect(state.categories.entities['4']).toEqual(
            expect.objectContaining({
                nombre: 'Natacion',
                color: '#123456',
                isBanner: false
            })
        );
    });
    // TEST error addCategory
    test('should handle addCategory API error gracefully', async () => {
 
        const preloadedState = createPreloadedCategoryState(mockCategoriesData.basic);
        // Configura el mock con el nuevo listado incluyendo la nueva categoría
        setupFailedAddCategoryMock('Error de red al agregar');

        const { store } = renderWithProviders(<CategoriesTestComponent />, { preloadedState });
        actionHelpers.clickAddCategoryButton();

        // Espera a que el estado se actualice y el error sea visible
        await assertionHelpers.expectErrorVisible();

        const state = store.getState();

        // Verifica que no se agregó la nueva categoría
        expect(state.categories.entities['4']).toBeUndefined();

        // Verifica que el estado y error del slice fueron actualizados
        expect(state.categories.status).toBe('failed');
        expect(state.categories.error).toBe('Error de red al agregar');
        expect(mockAddCategory).toHaveBeenCalledTimes(1);
    });
    // TEST EDITAR CATEGORIA
    test('should update a category', async () => {
        // Estado inicial pre-cargado con 3 categorías básicas
        const preloadedState = createPreloadedCategoryState(mockCategoriesData.basic)

        // Configura el mock de la API para simular una actualización exitosa
        setupSuccessfulUpdateCategoryMock()

        // Renderiza el componente con el estado inicial y captura el store para inspección
        const { store } = renderWithProviders(<CategoriesTestComponent />, { preloadedState })

        // Verifica que las categorías iniciales se hayan renderizado correctamente
        await assertionHelpers.expectCategoriesToBeRendered(['Fut-bol', 'Frontenis', 'Longboarding'])

        //  Dispara la acción para actualizar la categoría
        actionHelpers.clickUpdateCategoryButton()

        //  Espera a que la UI se actualice y verifique el nuevo nombre
        await assertionHelpers.expectCategoriesToBeRendered(['Futbol Editado', 'Frontenis', 'Longboarding'])

        // Verifica el estado del store (status y llamada al mock)
        expect(store.getState().categories.status).toBe('succeeded');
        expect(mockUpdateCategory).toHaveBeenCalledTimes(1);
    });
});

