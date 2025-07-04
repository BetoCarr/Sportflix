import reducer from "../videosSlice";
import { mockVideosData } from "../helpers/mockVideosData";
import { expectErrorToBe, expectStatusToBe, expectVideoToMatch } from "../helpers/validationHelpers";
import { getVideoStateWithEntities } from "../helpers/stateHelpers";
import { updateVideo } from "../videosSlice";

// TEST: Cuando comienza la acción de editar un video, el estado debe pasar a 'loading'
test('should handle updateVideo.pending and set updateVideoStatus to loading', () => {
    const initialState = getVideoStateWithEntities(mockVideosData.basic)     // Estado inicial con videos cargados

    const newState = reducer(initialState, {    // Simula el dispatch manual de la acción pending
        type: updateVideo.pending.type,
    })

    expectStatusToBe(newState, 'updateVideoStatus', 'loading')     // Verifica que el estado de actualización esté en 'loading'
});
// TEST: Cuando se edita un video correctamente, se actualiza su información
test('should handle updateVideo.fulfilled and update the video data', () => {
    const initialState = getVideoStateWithEntities(mockVideosData.basic)     // Estado inicial con videos cargados

    const updatedVideo = mockVideosData.updatedVideo.video     // Extrae el video actualizado (estructura: { video: { ... } })

    const newState = reducer(initialState, {    // Simula el dispatch de una acción exitosa con el payload esperado
        type: updateVideo.fulfilled.type,
        payload: mockVideosData.updatedVideo 
    })

    expectStatusToBe(newState, 'updateVideoStatus', 'succeeded')    // Verifica que el estado indique éxito

    expectVideoToMatch(newState.entities[updatedVideo.id], updatedVideo)    // Verifica que los datos del video hayan sido actualizados correctamente
});
// TEST: Cuando falla la edición de un video, se guarda el error y se marca como fallido
test('should handle updateVideo.rejected and set status to failed with error', () => {
    const initialState = getVideoStateWithEntities(mockVideosData.basic);    // Estado inicial con videos cargados

    const errorMessage = 'Error al actualizar el video';    // Mensaje de error simulado

    const newState = reducer(initialState, {     // Simula el dispatch de una acción fallida
        type: updateVideo.rejected.type,
        payload: errorMessage
    });

    expectStatusToBe(newState, 'updateVideoStatus', 'failed')   // Verifica que el estado esté en 'failed'

    expectErrorToBe(newState, errorMessage)     // Verifica que el mensaje de error esté presente
});
