
export const assertThunkResult = ({
    result,
    state,
    payload,
    mockFn,
    expectedType,
    thunkName,
    expectedError,
    expectedIds,
    removedId,
    customChecks,
}) => {
    expect(result.type).toBe(`videos/${thunkName}/${expectedType}`);

    if (expectedType === 'fulfilled') {
        switch (thunkName) {
            case 'fetchVideos':
                expect(result.payload).toHaveLength(expectedIds.length);
                expect(state.ids).toEqual(expectedIds);
                break;

            case 'agregarNuevoVideo':
                expect(result.payload).toEqual(payload.newVideo);
                expect(state.ids).toContain(payload.newVideo.id);
                break;

            // case 'editarVideo':
            //     expect(result.payload).toEqual(payload.updatedVideoData);
            //     expect(state.entities[payload.videoId]).toEqual(payload.updatedVideoData);
            //     break;

            // case 'eliminarVideo':
            //     expect(result.payload).toEqual({ videoId: removedId });
            //     expect(state.ids).not.toContain(removedId);
            //     break;

        

            default:
                throw new Error(`No hay asserts definidos para el thunk "${thunkName}"`);
        }
    }

    if (expectedType === 'rejected') {
        expect(result.payload).toBe(expectedError);

        switch (thunkName) {
            case 'fetchVideos':
                expect(state.ids).toEqual([]);
                break;
            case 'agregarNuevoVideo':
                expect(state.ids).not.toContain(payload.newVideo.id);
                break;
            
            // case 'editarVideo':
            //     // Opcional: verificar que los datos del video no hayan cambiado
            //     break;

            // case 'eliminarVideo':
            //     expect(state.ids).toContain(removedId);
            //     break;
        }
    }

    expect(mockFn).toHaveBeenCalledTimes(1);

    if (mockFn && payload) {
        // Inferir los argumentos del mock en función del thunk
        if (thunkName === 'agregarNuevoVideo') {
            expect(mockFn).toHaveBeenCalledWith(payload.categoryId, payload.newVideo);
        } else if (thunkName === 'editarVideo') {
            expect(mockFn).toHaveBeenCalledWith(payload.videoId, payload.updatedVideoData);
        } else if (thunkName === 'eliminarVideo') {
            expect(mockFn).toHaveBeenCalledWith(payload.categoryId, payload.videoId);
        }
    }

    // Personaliza aún más con lógica adicional
    if (customChecks) customChecks();
};
