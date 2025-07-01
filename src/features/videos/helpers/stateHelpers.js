// Estado base de videos, imitando el shape de videosAdapter
export const getBaseVideoState = (overrides = {}) => ({
    ids: [],
    entities: {},
    likes: {},
    status: 'idle',
    addVideoStatus: 'idle',
    deleteVideoStatus: 'idle',
    updateVideoStatus: 'idle',
    error: null,
    ...overrides // Permite personalizar campos específicos
});

// Estado con likes predefinidos
export const getVideoStateWithLikes = (likes = {}) =>   getBaseVideoState({ likes });


export const getVideoStateWithEntities = (videosArray = []) => {
    const entities = {};
    const ids = [];

    videosArray.forEach(video => {
        entities[video.id] = video;
        ids.push(video.id);
    });

    return {
        ids,
        entities,
        likes: Object.fromEntries(ids.map(id => [id, false])),
        status: 'succeeded',
        addVideoStatus: 'idle',
        deleteVideoStatus: 'idle',
        updateVideoStatus: 'idle',
        error: null
    };
};
