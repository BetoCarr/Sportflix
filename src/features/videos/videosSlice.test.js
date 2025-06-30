import reducer, { toggleLike } from "./videosSlice"
import { getBaseVideoState ,getVideoStateWithLikes } from "./helpers/stateHelpers"
import { fetchVideos } from "./videosSlice";
// TEST: si el "like" está inicialmente en false, al alternarlo debería pasar a true
test('should toggle like from false to true', () => {

    const initialState = getVideoStateWithLikes({ '1': false }) // Preparar: estado inicial con like en false para el video con ID '1'

    const newState = reducer(initialState, toggleLike('1')) // Actuar: se despacha la acción toggleLike

    expect(newState.likes['1']).toBe(true)  // Verificar: el like ahora debería ser true
});
// TEST: si el "like" está inicialmente en true, al alternarlo debería pasar a false
test('should toggle like from true to false', () => {

    const initialState = getVideoStateWithLikes({ '1': true })  // Preparar: estado inicial con like en true para el video con ID '1'

    const newState = reducer(initialState, toggleLike('1')) // Actuar: se despacha la acción toggleLike

    expect(newState.likes['1']).toBe(false) // Verificar: el like ahora debería ser false
});
// TEST: si el "like" no existe (es undefined), al alternarlo debería establecerse en true
test('should toggle like from undefined to true', () => {
    const initialState = getVideoStateWithLikes() // Preparar: estado inicial sin ningún like definido

    const newState = reducer(initialState, toggleLike('999'))   // Actuar: se despacha la acción toggleLike sobre el video con ID '999'

    expect(newState.likes['999']).toBe(true)    // Verificar: el like del video '999' debería ser true
});
//  TEST: Verifica que el estado cambie a "loading" cuando se inicia la carga de videos
test('should handle fetchVideos.pending and set status to loading', () => {
    const initialState = getBaseVideoState()    //  Estado inicial vacío

    const newState = reducer(initialState, {     // Ejecutamos el reducer simulando que se disparó la acción fetchVideos.pending
        type: fetchVideos.pending.type
    });

    expect(newState.status).toBe('loading')     // Verificamos que el estado esté en "loading"
});
// TEST: Verifica que el estado se actualice correctamente cuando la API responde exitosamente. Carga los videos y agrega sus respectivos "likes" en false
test('should handle fetchVideos.fulfilled and populate videos and likes', () => {
    const initialState = getBaseVideoState()    //Estado inicial vacío

    const mockPayload = [ // Simulamos una respuesta de la API con dos videos
        { id: 1, title: 'Video 1', categoria_id: 101 },
        { id: 2, title: 'Video 2', categoria_id: 102 }
    ];

    const newState = reducer(initialState, { // Ejecucion de reducer con la acción fulfilled y el payload simulado
        type: fetchVideos.fulfilled.type,
        payload: mockPayload
    });

    expect(newState.status).toBe('succeeded')   // Estado actualizado
    expect(Object.keys(newState.entities)).toHaveLength(2)  // Dos videos cargados
    expect(newState.ids).toEqual([1, 2])    // IDs correctamente agregados
    expect(newState.likes[1]).toBe(false)   // Like inicializado a false
    expect(newState.likes[2]).toBe(false) // Like inicializado a false
});
// TEST: Verifica que el estado se marque como "failed" y que se guarde el error cuando la petición falla
test('should handle fetchVideos.rejected and set error and failed status', () => {
    const initialState = getBaseVideoState() // Estado inicial vacío

    const errorMessage = 'Network error';     // Simulamos un error en la llamada

    const newState = reducer(initialState, {    // Ejecutamos el reducer simulando que la acción fue rechazada con un error
        type: fetchVideos.rejected.type,
        payload: errorMessage
    });

    expect(newState.status).toBe('failed')    // Verificamos que se haya guardado el error y el estado sea "failed"
    expect(newState.error).toBe(errorMessage)
});
