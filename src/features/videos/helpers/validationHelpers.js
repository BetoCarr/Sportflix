export function expectStatusToBe(state, key, expected) {
    expect(state[key]).toBe(expected);
}

export function expectErrorToBe(state, expectedError) {
    expect(state.error).toBe(expectedError);
}
export const expectLikesToBeFalse = (likes, ids) => {
    ids.forEach(id => expect(likes[id]).toBe(false));
};

export function expectVideoToMatch(entity, expectedVideo) {
    expect(entity).toBeDefined();
    expect(entity.id).toBe(expectedVideo.id);
    expect(entity.title).toBe(expectedVideo.title);
    expect(entity.categoria_id).toBe(expectedVideo.categoria_id);
    expect(entity.imageUrl).toBe(expectedVideo.imageUrl);
    expect(entity.videoUrl).toBe(expectedVideo.videoUrl);
}
