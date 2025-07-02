import reducer, {addNewVideo} from "../videosSlice";
import { getVideoStateWithEntities } from "../helpers/stateHelpers";
import { mockVideosData } from "../helpers/mockVideosData";

// TEST: Cuando comienza la acción, el estado debe pasar a 'loading'
test('should handle addNewVideo.pending and set addVideoStatus to loading', () => {
    const initialState = getVideoStateWithEntities(mockVideosData.basic) // Preparar: Estado inicial con algunos videos ya cargados
    
    const newState = reducer(initialState, {  // Actuar: se despacha manualmente la acción pending
        type: addNewVideo.pending.type,
    });
    
    expect(newState.addVideoStatus).toBe('loading') // El estado debe reflejar loading
});

// TEST: Cuando se agrega un video correctamente
test('should handle addNewVideo.fulfilled and add video and like', () => {
    const initialState = getVideoStateWithEntities(mockVideosData.basic) // Preparar: Estado inicial con algunos videos ya cargados

    const newVideo = mockVideosData.newVideo // Asegúrate de que tenga un ID único (ej. 10)

    const newState = reducer(initialState, { // Actuar: se despacha manualmente la acción fullfiled con el nuevo video
        type: addNewVideo.fulfilled.type,
        payload: newVideo
    })

    expect(newState.addVideoStatus).toBe('succeeded')   // El estado debe reflejar éxito

    expect(newState.entities[newVideo.id]).toEqual(newVideo)    // El nuevo video debe agregarse correctamente al adaptador (entities + ids)
    expect(newState.ids).toContain(newVideo.id)

    expect(newState.likes[newVideo.id]).toBe(false)     // El like debe estar inicializado a false

    expect(Object.keys(newState.entities)).toHaveLength(mockVideosData.basic.length + 1) // El resto del estado no debe haber sido alterado incorrectamente

});

// TEST: Cuando ocurre un error al agregar un video
test('should handle addNewVideo.rejected and set status to failed with error', () => {
    const initialState = getVideoStateWithEntities(mockVideosData.basic) // Preparar: Estado inicial con algunos videos ya cargados

    const errorMessage = 'Error de red';    // Simulamos un mensaje de error que devuelve la API al fallar la petición

    const newState = reducer(initialState, {    // Actuar: se despacha manualmente la acción rejected con el mensaje de error
        type: addNewVideo.rejected.type,
        payload: errorMessage
    })

    expect(newState.addVideoStatus).toBe('failed')  // Verificar: El estado debe reflejar el fallo y contener el mensaje de error
    expect(newState.error).toBe(errorMessage)
});