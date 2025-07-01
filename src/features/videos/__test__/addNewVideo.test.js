import reducer, {addNewVideo} from "../videosSlice";
import { getVideoStateWithEntities } from "../helpers/stateHelpers";
import { mockVideosData } from "../helpers/mockVideosData";

// TEST: Cuando comienza la acción, el estado debe pasar a 'loading'
test('should handle addNewVideo.pending and set addVideoStatus to loading', () => {
    const initialState = getVideoStateWithEntities(mockVideosData.basic)
    
    const newState = reducer(initialState, {
        type: addNewVideo.pending.type,
    });
    
    expect(newState.addVideoStatus).toBe('loading')
});

// TEST: Cuando se agrega un video correctamente
test('should handle addNewVideo.fulfilled and add video and like', () => {
    const initialState = getVideoStateWithEntities(mockVideosData.basic)

    const newVideo = mockVideosData.newVideo // Asegúrate de que tenga un ID único (ej. 10)

    const newState = reducer(initialState, {
        type: addNewVideo.fulfilled.type,
        payload: newVideo
    })

    expect(newState.addVideoStatus).toBe('succeeded')   // El estado debe reflejar éxito

    expect(newState.entities[newVideo.id]).toEqual(newVideo)    // El nuevo video debe agregarse correctamente al adaptador (entities + ids)
    expect(newState.ids).toContain(newVideo.id)

    expect(newState.likes[newVideo.id]).toBe(false)     // El like debe estar inicializado a false

    expect(Object.keys(newState.entities)).toHaveLength(mockVideosData.basic.length + 1) // El resto del estado no debe haber sido alterado incorrectamente

});

// // TEST: Cuando ocurre un error al agregar un video
// test('should handle addNewVideo.rejected and set status to failed with error', () => {
//     const initialState = getBaseVideoState();
//     const error = 'Error de red';

//     const newState = reducer(initialState, {
//         type: addNewVideo.rejected.type,
//         payload: error
//     });

//     expect(newState.addVideoStatus).toBe('failed');
//     expect(newState.error).toBe(error);
// });