import React from 'react'
import { waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../../utils/testUtils'
import CategoriesTestComponent from '../CategoriesTestComponent'
import { screen } from '@testing-library/react'
import { act } from 'react-dom/test-utils';

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
    setupFailedUpdateCategoryMock,
    mockDeleteCategory,
    setupSuccessfulDeleteCategoryMock,
    setupFailedDeleteCategoryMock,
    clearAllMocks,
    resetAllMocks
} from '../mocks/categoriesApiMocks';

import { assertionHelpers } from '../helpers/assertionHelpers';
import { actionHelpers } from '../helpers/actionHelpers';
import { createPreloadedCategoryState } from '../helpers/stateHelpers';

// Mock de las funciones de API
jest.mock('../../../api/api', () => ({
    buscar: require('../mocks/categoriesApiMocks').mockBuscar,
    agregarCategoria : require('../mocks/categoriesApiMocks').mockAddCategory,
    editarCategoria : require('../mocks/categoriesApiMocks').mockUpdateCategory,
    eliminarCategoria : require('../mocks/categoriesApiMocks').mockDeleteCategory,
}));

describe("categories Integration Tests", () => {
    beforeEach(() => {    // Limpiar todos los mocks antes de cada test
        clearAllMocks()
        resetAllMocks()
    });
    // TEST: debe obtener correctamente las categorias
    test('should fetch and render categories', async () => {
        setupSuccessfulFetchMock(mockCategoriesData.basic)  // Estado inicial pre-cargado con 3 categorías básicas

        const { store } = renderWithProviders(<CategoriesTestComponent />); // Renderiza el componente con el estado inicial y captura el store para inspección

        assertionHelpers.expectLoadingVisible()    // Verifica estado de loading

        await assertionHelpers.expectCategoriesToBeRendered([   // Assert: categories render
            'Fut-bol',
            'Frontenis',
            'Longboarding'
        ])

        expect(mockBuscar).toHaveBeenCalledWith('/categorias') // Verifica que la API se llamó correctamente y una vez.
        expect(mockBuscar).toHaveBeenCalledTimes(1) // Verifica el estado del store (status y llamada al mock)
    
        const state = store.getState() // Verifica el estado del store 
        expect(state.categories.status).toBe('succeeded')
        expect(state.categories.entities['1'].nombre).toBe('Fut-bol')
    })
    // TEST: debe manejar correctamente el error al obtener categorías
    test('should handle API error gracefully', async () => {
        setupFailedFetchMock('Error de red') // Configura el mock de la API para simular un fallo al hacer fetch

        renderWithProviders(<CategoriesTestComponent />)   // Renderiza el componente con la configuración por defecto (sin estado precargado)

        await assertionHelpers.expectErrorVisible('Error de red') // Espera a que el error se haga visible en el DOM

        expect(mockBuscar).toHaveBeenCalledTimes(1)  // Verifica que la función mock de fetch (mockBuscar) fue llamada exactamente una vez
    });
    // TEST: debe agregar una nueva categoría exitosamente
    test('should add a new category', async () => {

        const preloadedState = createPreloadedCategoryState(mockCategoriesData.basic)  // 1️⃣ Crea un estado inicial precargado con las categorías básicas

        setupSuccessfulAddCategoryMock() // Configura el mock con el nuevo listado incluyendo la nueva categoría

        const { store } = renderWithProviders(<CategoriesTestComponent />, { preloadedState })  // Renderiza el componente con el estado precargado

        actionHelpers.clickAddCategoryButton()   // Dispara el evento que simula el click en el botón "Agregar categoría"

        await assertionHelpers.expectCategoriesToBeRendered([   // Verifica que todas las categorías (incluyendo la nueva) estén renderizadas en el DOM
            'Fut-bol',
            'Frontenis',
            'Longboarding',
            'Natacion'
        ])

        expect(mockAddCategory).toHaveBeenCalledTimes(1)   // Asegura que la función mock de agregar categoría fue llamada una vez

        const state = store.getState()   // Verifica que el estado global del store se actualizó con la nueva categoría
        expect(state.categories.entities['4']).toEqual(
            expect.objectContaining({
                nombre: 'Natacion',
                color: '#123456',
                isBanner: false
            })
        );
    });
    // TEST: debe manejar correctamente el error al intentar agregar una categoría
    test('should handle addCategory API error gracefully', async () => {

        const preloadedState = createPreloadedCategoryState(mockCategoriesData.basic)   // Crea un estado inicial precargado con las categorías básicas

        setupFailedAddCategoryMock('Error de red al agregar')   // Configura el mock para simular un error al llamar a la API de agregar categoría

        const { store } = renderWithProviders(<CategoriesTestComponent />, { preloadedState })  // Renderiza el componente con el estado precargado

        actionHelpers.clickAddCategoryButton()  // Simula el click en el botón para agregar una categoría

        await assertionHelpers.expectErrorVisible('Error de red al agregar') // Espera a que el error se haga visible en el DOM

        const state = store.getState()   // Obtiene el estado actual del store para hacer verificaciones

        expect(state.categories.entities['4']).toBeUndefined()   // Asegura que la nueva categoría *no* fue agregada al estado

        expect(state.categories.status).toBe('failed')  // Verifica que el estado y el mensaje de error se hayan actualizado correctamente
        expect(state.categories.error).toBe('Error de red al agregar')

        expect(mockAddCategory).toHaveBeenCalledTimes(1);  // Asegura que el mock fue llamado una sola vez

    });
    // TEST: debe editar correctamente una categoria existente
    test('should update a category', async () => {

        const preloadedState = createPreloadedCategoryState(mockCategoriesData.basic)   // Estado inicial pre-cargado con 3 categorías básicas

        setupSuccessfulUpdateCategoryMock() // Configura el mock de la API para simular una actualización exitosa

        const { store } = renderWithProviders(<CategoriesTestComponent />, { preloadedState })  // Renderiza el componente con el estado inicial y captura el store para inspección

        await assertionHelpers.expectCategoriesToBeRendered(['Fut-bol', 'Frontenis', 'Longboarding']) // Verifica que las categorías iniciales se hayan renderizado correctamente

        actionHelpers.clickUpdateCategoryButton()   //  Dispara la acción para actualizar la categoría

        await assertionHelpers.expectCategoriesToBeRendered(['Futbol Editado', 'Frontenis', 'Longboarding'])    //  Espera a que la UI se actualice y verifique el nuevo nombre

        expect(store.getState().categories.status).toBe('succeeded')    // Verifica el estado del store (status y llamada al mock)
        expect(mockUpdateCategory).toHaveBeenCalledTimes(1);
    });
    // TEST: debe manejar correctamente el error al intentar agregar una categoría
    test('should handle updateCategory API error gracefully', async () => {
        const preloadedState = createPreloadedCategoryState(mockCategoriesData.basic)   // Estado inicial precargado con las categorías básicas

        setupFailedUpdateCategoryMock('Error de red al editar') // Configura el mock para simular un fallo en la edición de la categoría

        const { store } = renderWithProviders(<CategoriesTestComponent />, { preloadedState })  // Renderiza el componente con el estado predefinido
        
        actionHelpers.clickUpdateCategoryButton() // Simula el click en el botón de actualizar categoría

        await assertionHelpers.expectErrorVisible('Error de red al editar') // Espera a que el mensaje de error sea visible

        const state = store.getState() // Verifica el estado final del store

        expect(state.categories.entities[1].nombre).toBe('Fut-bol') // La categoría no debe haberse modificado

        expect(state.categories.status).toBe('failed') // El estado del slice debe reflejar el error
        expect(state.categories.error).toBe('Error de red al editar')

        expect(mockUpdateCategory).toHaveBeenCalledTimes(1) // Verifica que el mock fue llamado una vez
    });
    // TEST: debe eliminar correctamente una categoria 
    test('should delete a category', async () => {

        const preloadedState = createPreloadedCategoryState(mockCategoriesData.basic)   // Estado inicial pre-cargado con 3 categorías básicas

        setupSuccessfulDeleteCategoryMock() // Configura el mock de la API para simular una eliminacion exitosa

        const { store } = renderWithProviders(<CategoriesTestComponent />, { preloadedState })  // Renderiza el componente con el estado inicial y captura el store para inspección

        await assertionHelpers.expectCategoriesToBeRendered(['Fut-bol', 'Frontenis', 'Longboarding']) // Verifica que las categorías iniciales se hayan renderizado correctamente
    
        actionHelpers.clickDeleteCategoryButton()   // Simula el click en el botón de eliminar categoría

        await waitFor(() => {   // Espera a que la categoría eliminada desaparezca del DOM y se dispare el thunk
            expect(mockDeleteCategory).toHaveBeenCalledTimes(1);
            expect(mockDeleteCategory).toHaveBeenCalledWith(mockCategoriesData.basic[2].id);
            expect(screen.queryByText('Longboarding')).not.toBeInTheDocument(); // ✅ confirmamos que fue eliminada
        })

        const finalState = store.getState().categories  // Obtiene el estado final del slice de categorías

        expect(finalState.deleteStatus).toBe('succeeded')   // El estado de la operación de eliminación debe ser 'succeeded'

        expect(finalState.ids).not.toContain(mockCategoriesData.basic[2].id)   // El ID de la categoría eliminada ya no debe estar presente
        expect(finalState.entities[mockCategoriesData.basic[2].id]).toBeUndefined() // Su entidad debe haber sido removida
        
        expect(screen.getByText('Fut-bol')).toBeInTheDocument()   // Las demás categorías deben seguir presentes en el DOM
        expect(screen.getByText('Frontenis')).toBeInTheDocument()

        expect(finalState.ids).toEqual(expect.arrayContaining([ // Redux: Las categorías restantes deben seguir en el estado
            mockCategoriesData.basic[0].id,
            mockCategoriesData.basic[1].id,
        ]));
    });
    // TEST: debe manejar correctamente el error al eliminar una categoría
    test('should handle deleteCategory API error gracefully', async () => {

        const preloadedState = createPreloadedCategoryState(mockCategoriesData.basic)   // Estado inicial pre-cargado con 3 categorías básicas

        setupFailedDeleteCategoryMock('Error de red al eliminar') // Simula fallo en el endpoint

        const { store } = renderWithProviders(<CategoriesTestComponent />, { preloadedState })  // Renderiza el componente con el estado inicial y captura el store para inspección

        await assertionHelpers.expectCategoriesToBeRendered(['Fut-bol', 'Frontenis', 'Longboarding']) // Verifica que las categorías iniciales se hayan renderizado correctamente
    
        await act(async () => {
            actionHelpers.clickDeleteCategoryButton() // Simula click
        })
        await waitFor(() => {   // Espera a que se dispare el thunk y React procese actualizaciones
            expect(mockDeleteCategory).toHaveBeenCalledTimes(1) // Verifica que la función mock haya sido llamada una vez
            expect(mockDeleteCategory).toHaveBeenCalledWith(mockCategoriesData.basic[2].id) // Verifica que el thunk fue invocado con el ID correcto

            expect(screen.getByText('Fut-bol')).toBeInTheDocument();  // La categoría no debe haberse eliminado del DOM
            expect(screen.getByText('Frontenis')).toBeInTheDocument();
            expect(screen.queryByText('Longboarding')).toBeInTheDocument();
        })

        const finalState = store.getState().categories    // Obtiene el estado final del slice de categorías

        expect(finalState.deleteStatus).toBe('failed'); // El status refleja el error
        expect(finalState.error).toBe('Error de red al eliminar'); // Mensaje correcto
        
        expect(finalState.ids).toContain(mockCategoriesData.basic[2].id); // La categoría aún está en el estado
        expect(finalState.entities[mockCategoriesData.basic[2].id]).toBeDefined(); // Aún existe en entities
    });
});