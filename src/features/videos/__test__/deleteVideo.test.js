import reducer from "../videosSlice";
import { deleteVideo } from "../videosSlice";
import { mockVideosData } from "../mocks/mockVideosData";
import { expectErrorToBe, expectStatusToBe } from "../helpers/validationHelpers";
import { getVideoStateWithEntities } from "../helpers/stateHelpers";

// TEST: Cuando comienza la eliminación de un video, el estado debe pasar a 'loading'
test('should handle deleteVideo.pending and set deleteVideoStatus to loading', () => {
    const initialState = getVideoStateWithEntities(mockVideosData.basic)     // Prepara el estado inicial con videos simulados

    const newState = reducer(initialState, {     // Simula la acción pending del thunk deleteVideo
        type: deleteVideo.pending.type
    })

    expectStatusToBe(newState, 'deleteVideoStatus', 'loading')     // Verifica que el estado de eliminación esté en "loading"
});

// TEST: Cuando se elimina un video correctamente, se elimina del estado
test('should handle deleteVideo.fulfilled and remove the video from state', () => {
    const initialState = getVideoStateWithEntities(mockVideosData.basic) // Prepara el estado inicial con videos simulados
    const videoIdToDelete = 1; // ID del video que simulamos eliminar

    const newState = reducer(initialState, {     // Simula la acción fulfilled con un payload que contiene el ID del video eliminado
        type: deleteVideo.fulfilled.type,
        payload: { videoId: videoIdToDelete }
    })

    expectStatusToBe(newState, 'deleteVideoStatus', 'succeeded')     // Verifica que el estado indique éxito

    expect(newState.entities[videoIdToDelete]).toBeUndefined()     // Verifica que el video fue eliminado del estado (entities e ids)
    expect(newState.ids.includes(videoIdToDelete)).toBe(false)
});

// TEST: Cuando falla la eliminación, el estado debe marcarse como fallido y guardar el error
test('should handle deleteVideo.rejected and set status to failed with error', () => {
    const initialState = getVideoStateWithEntities(mockVideosData.basic)
    const errorMessage = 'Fallo al eliminar el video'

    const newState = reducer(initialState, {    // Simula la acción rejected con un mensaje de erro
        type: deleteVideo.rejected.type,
        error: { message: errorMessage }
    });

    expectStatusToBe(newState, 'deleteVideoStatus', 'failed')   // Verifica que el estado refleje el fallo

    expectErrorToBe(newState, errorMessage) // Verifica que el mensaje de error se haya guardado correctamente
});