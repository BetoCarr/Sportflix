import { fetchVideos, addNewVideo } from '../videosSlice';
import { setupStore } from '../../../store/store';
import { getVideoStateWithEntities } from '../helpers/stateHelpers';

import {
    mockVideosData,
    mockFetchVideos,
    setupSuccessfulFetchVideosMock, 
    setupFailedFetchVideosMock,
    mockAddVideo,
    setupSuccessfulAddVideoMock,
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

        expect(result.type).toBe('videos/fetchVideos/fulfilled')    // Verificar que el thunk haya terminado con éxito
        expect(result.payload).toHaveLength(2)  // Verificar que el payload contenga exactamente 2 videos
        expect(state.ids).toEqual([1, 2])   // Verificar que los IDs fueron correctamente guardados en el estado
        expect(mockFetchVideos).toHaveBeenCalledTimes(1)    // Asegurar que el mock fue llamado exactamente una vez
    });
    // TEST: debe manejar correctamente el error al obtener los videos
    test('dispatches rejected when API call fails', async () => {
        setupFailedFetchVideosMock('Falla de red') // Simular que la API falla con un mensaje de error

        const store = setupStore()  // Crear un store simulado
        const result = await store.dispatch(fetchVideos())  // Disparar el thunk
        const state = store.getState().videos;  // Obtener el estado actualizado del slice videos

        expect(result.type).toBe('videos/fetchVideos/rejected') // Verificar que el thunk terminó con estado "rejected"
        expect(result.payload).toBe('Falla de red') // Verificar que el mensaje de error se haya propagado correctamente
        expect(state.ids).toEqual([])   // Verificar que el estado no haya cambiado (sin videos cargados)
        expect(mockFetchVideos).toHaveBeenCalledTimes(1)    // Asegurar que el mock fue llamado
    });
    // TEST: debe agregar correctamente un nuevo video
    test('dispatches fulfilled when addNewVideo succeeds', async () => {
        setupSuccessfulAddVideoMock()   // Simular una respuesta exitosa de la API para agregar un nuevo video

        const preloadedState = {
            videos: getVideoStateWithEntities(mockVideosData.basic) // Usar los mocks ya definidos como estado inicial
        };

        const store = setupStore(preloadedState)  // Crear un store simulado para testear el flujo completo del thunk

        const payload = {
            categoryId: mockVideosData.newVideo.categoria_id, // ID de categoría necesario para la API
            newVideo: mockVideosData.newVideo // Objeto con los datos del nuevo video
        }

        const result = await store.dispatch(addNewVideo(payload)) // Ejecuta el thunk con el payload simulado
        const state = store.getState().videos; // Obtiene el estado actualizado del slice "videos"
        
        expect(result.type).toBe('videos/agregarNuevoVideo/fulfilled')    // Verifica que el thunk terminó exitosamente con el tipo correcto
        expect(result.payload).toEqual(mockVideosData.newVideo)    // Verifica que el payload devuelto por el thunk sea exactamente el nuevo video agregado
        expect(state.ids).toContain(mockVideosData.newVideo.id)    // Verifica que el nuevo ID del video esté presente en el estado (indicando que fue agregado al store)
        expect(mockAddVideo).toHaveBeenCalledWith(payload.categoryId, payload.newVideo)    // Verifica que la función de la API fue llamada con los argumentos esperados
        expect(mockAddVideo).toHaveBeenCalledTimes(1)     // Verifica que la función de la API fue llamada exactamente una vez
    });
});
