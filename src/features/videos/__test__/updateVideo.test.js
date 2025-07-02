import reducer from "../videosSlice";
import { mockVideosData } from "../helpers/mockVideosData";
import { getVideoStateWithEntities } from "../helpers/stateHelpers";
import { updateVideo } from "../videosSlice";

// TEST: Cuando comienza la acción de editar un video, el estado debe pasar a 'loading'
test('should handle updateVideo.pending and set updateVideoStatus to loading', () => {
    const initialState = getVideoStateWithEntities(mockVideosData.basic)

    const newState = reducer(initialState, {
        type: updateVideo.pending.type,
    })

    expect(newState.updateVideoStatus).toBe('loading')
});
// TEST: Cuando se edita un video correctamente, se actualiza su información
test('should handle updateVideo.fulfilled and update the video data', () => {
    const initialState = getVideoStateWithEntities(mockVideosData.basic)

    const updatedVideo = mockVideosData.updatedVideo

    const newState = reducer(initialState, {
        type: updateVideo.fulfilled.type,
        payload: updatedVideo
    })
    console.log(newState)
    expect(newState.updateVideoStatus).toBe('succeeded')
    expect(newState.entities[1].title).toBe('Titulo editado')
});
// TEST: Cuando falla la edición de un video, se guarda el error y se marca como fallido
test('should handle updateVideo.rejected and set status to failed with error', () => {
    const initialState = getVideoStateWithEntities(mockVideosData.basic);
    const errorMessage = 'Error al actualizar el video';

    const newState = reducer(initialState, {
        type: updateVideo.rejected.type,
        payload: errorMessage
    });

    expect(newState.updateVideoStatus).toBe('failed');
    expect(newState.error).toBe(errorMessage);
});
