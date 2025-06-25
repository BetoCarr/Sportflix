import React from 'react'
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
    setupFailedUpdateCategoryMock,
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
    editarCategoria : require('../mocks/categoriesApiMocks').mockUpdateCategory
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

        await assertionHelpers.expectErrorVisible()  // Espera a que aparezca el mensaje de error en pantalla

        expect(mockBuscar).toHaveBeenCalledTimes(1)  // Verifica que la función mock de fetch (mockBuscar) fue llamada exactamente una vez
    });
    // TEST: debe agregar una nueva categoría exitosamente
    test('should add a new category', async () => {
 
        const preloadedState = createPreloadedCategoryState(mockCategoriesData.basic)  // 1️⃣ Crea un estado inicial precargado con las categorías básicas

        setupSuccessfulAddCategoryMock() // Configura el mock con el nuevo listado incluyendo la nueva categoría

        const { store } = renderWithProviders(<CategoriesTestComponent />, { preloadedState })  // Renderiza el componente con el estado precargado

        actionHelpers.clickAddCategoryButton()   // Dispara el evento que simula el click en el botón "Agregar categoría"

        await assertionHelpers.expectCategoriesToBeRendered([   // 5️⃣ Verifica que todas las categorías (incluyendo la nueva) estén renderizadas en el DOM
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

        await assertionHelpers.expectErrorVisible()   // Espera a que el error se haga visible en el DOM

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

        await assertionHelpers.expectErrorVisible() // Espera a que el mensaje de error sea visible

        const state = store.getState() // Verifica el estado final del store

        expect(state.categories.entities[1].nombre).toBe('Fut-bol') // La categoría no debe haberse modificado

        expect(state.categories.status).toBe('failed') // El estado del slice debe reflejar el error
        expect(state.categories.error).toBe('Error de red al editar')

        expect(mockUpdateCategory).toHaveBeenCalledTimes(1) // Verifica que el mock fue llamado una vez
    });

});

