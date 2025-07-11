import { fetchVideos } from '../videosSlice';
import { setupStore } from '../../../store/store';

import { 
    mockFetchVideos,
    setupSuccessfulFetchVideosMock, 
    clearAllMocks,
    resetAllMocks
} from '../mocks/mockVideosData';

jest.mock('../../../api/api', () => ({ // Mock de las funciones de API
    obtnerVideos: require('../mocks/mockVideosData').mockFetchVideos,
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
});
