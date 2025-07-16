import { fetchVideos, addNewVideo } from '../videosSlice';
import { setupStore } from '../../../store/store';
import { createPreloadedStateVideos } from '../helpers/stateHelpers';
import { buildThunkPayload } from '../helpers/thunkPayloadBuilder';
import { assertThunkResult } from '../helpers/assertionHelpers';

import {
    mockVideosData,
    mockFetchVideos,
    setupSuccessfulFetchVideosMock, 
    setupFailedFetchVideosMock,
    mockAddVideo,
    setupSuccessfulAddVideoMock,
    setupFailedAddVideoMock,
    clearAllMocks,
    resetAllMocks
} from '../mocks/mockVideosData';

jest.mock('../../../api/api', () => ({ // Mock de las funciones de API
    obtnerVideos: require('../mocks/mockVideosData').mockFetchVideos,
    agregarNuevoVideo: require('../mocks/mockVideosData').mockAddVideo,
}));

describe('fetchVideos thunk', () => {
    beforeEach(() => {    // Limpiar todos los mocks antes de cada test
        clearAllMocks()
        resetAllMocks()
    });
    // TEST: debe obtener correctamente los videos
    test('dispatches fulfilled when API call succeeds', async () => {
        setupSuccessfulFetchVideosMock()    // Configurar el mock para que devuelva una respuesta exitosa con 2 videos

        const store = setupStore()  // Crear un store simulado
        const result = await store.dispatch(fetchVideos())  // Disparar el thunk
        const state = store.getState().videos;  // Obtener el estado actualizado del slice videos
        assertThunkResult({
            result,
            state,
            expectedType: 'fulfilled',
            thunkName: 'fetchVideos',
            mockFn: mockFetchVideos,
            expectedIds: [1, 2],
        });
    });
    // TEST: debe manejar correctamente el error al obtener los videos
    test('dispatches rejected when API call fails', async () => {
        setupFailedFetchVideosMock('Falla de red') // Simular que la API falla con un mensaje de error

        const store = setupStore()  // Crear un store simulado
        const result = await store.dispatch(fetchVideos())  // Disparar el thunk
        const state = store.getState().videos;  // Obtener el estado actualizado del slice videos
        assertThunkResult({
            result,
            state,
            expectedType: 'rejected',
            thunkName: 'fetchVideos',
            mockFn: mockFetchVideos,
            expectedError: 'Falla de red',
        });
    });
    // TEST: debe agregar correctamente un nuevo video
    test('dispatches fulfilled when addNewVideo succeeds', async () => {
        setupSuccessfulAddVideoMock()   // Simular una respuesta exitosa de la API para agregar un nuevo video

        const store = createPreloadedStateVideos(mockVideosData.basic) // Crear un store simulado con videos precargados para testear el flujo completo del thunk

        const payload = buildThunkPayload('add');

        const result = await store.dispatch(addNewVideo(payload)) // Ejecuta el thunk con el payload simulado
        const state = store.getState().videos; // Obtiene el estado actualizado del slice "videos"
        assertThunkResult({
            result,
            state,
            payload,
            mockFn: mockAddVideo,
            expectedType: 'fulfilled',
            thunkName: 'agregarNuevoVideo',
        });
    });
    // TEST: debe manejar correctamente el error al agregar un video
    test('dispatches rejected when addNewVideo fails', async () => {
        setupFailedAddVideoMock('Error al agregar video'); // Simular error de la API

        const store = createPreloadedStateVideos(mockVideosData.basic)  // Crear un store simulado con videos precargados para testear el flujo completo del thunk

        const payload = buildThunkPayload('add');

        const result = await store.dispatch(addNewVideo(payload)); // Ejecuta el thunk con el payload simulado
        const state = store.getState().videos; // Obtiene el estado actualizado del slice "videos"

        assertThunkResult({
            result,
            state,
            payload,
            mockFn: mockAddVideo,
            expectedType: 'rejected',
            thunkName: 'agregarNuevoVideo',
            expectedError: 'Error al agregar video',
        });
    });
});
