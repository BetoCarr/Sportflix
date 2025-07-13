import reducer from "../videosSlice";
import { mockVideosData } from "../mocks/mockVideosData";
import { expectErrorToBe, expectStatusToBe, expectLikesToBeFalse, expectVideoToMatch } from "../helpers/validationHelpers";
import { getBaseVideoState } from "../helpers/stateHelpers";
import { fetchVideos } from "../videosSlice";

//  TEST: Verifica que el estado cambie a "loading" cuando se inicia la carga de videos
test('should handle fetchVideos.pending and set status to loading', () => {
    const initialState = getBaseVideoState()    //  Estado inicial vacío

    const newState = reducer(initialState, {     // Ejecutamos el reducer simulando que se disparó la acción fetchVideos.pending
        type: fetchVideos.pending.type
    });
    expectStatusToBe(newState, 'status', 'loading');
});
// TEST: Verifica que el estado se actualice correctamente cuando la API responde exitosamente. Carga los videos y agrega sus respectivos "likes" en false
test('should handle fetchVideos.fulfilled and populate videos and likes', () => {
    const initialState = getBaseVideoState()    //Estado inicial vacío

    const newState = reducer(initialState, { // Ejecucion de reducer con la acción fulfilled y el payload simulado
        type: fetchVideos.fulfilled.type,
        payload: mockVideosData.basic
    });

    expectStatusToBe(newState, 'status', 'succeeded') // Estado actualizado

    expect(Object.keys(newState.entities)).toHaveLength(2)  // Dos videos cargados

    expectVideoToMatch(newState.entities[1], mockVideosData.basic[0])   // Verifica que los datos del video con ID 1 coincidan exactamente con los datos simulados
    expectVideoToMatch(newState.entities[2], mockVideosData.basic[1])   // Verifica que los datos del video con ID 2 coincidan exactamente con los datos simulados

    expectLikesToBeFalse(newState.likes, [1, 2])    // Verifica que los "likes" para los videos 1 y 2 estén inicializados en false
});
// TEST: Verifica que el estado se marque como "failed" y que se guarde el error cuando la petición falla
test('should handle fetchVideos.rejected and set error and failed status', () => {
    const initialState = getBaseVideoState() // Estado inicial vacío

    const errorMessage = 'Network error';     // Simulamos un error en la llamada

    const newState = reducer(initialState, {    // Ejecutamos el reducer simulando que la acción fue rechazada con un error
        type: fetchVideos.rejected.type,
        payload: errorMessage
    });

    expectStatusToBe(newState, 'status', 'failed') // Estado actualizado
    expectErrorToBe(newState, errorMessage)
});
