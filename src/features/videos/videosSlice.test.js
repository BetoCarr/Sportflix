import reducer, { toggleLike } from "./videosSlice"
import { getVideoStateWithLikes } from "./helpers/stateHelpers"
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