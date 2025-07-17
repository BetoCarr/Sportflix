import { mockVideosData } from '../mocks/mockVideosData';

/**
 * Construye payloads estándar para tests de thunks de videos
 * @param {string} type - Tipo de thunk: 'add', 'update', 'delete'
 * @param {object} options - Opcional, permite personalizar videoId, categoryId, data
 */
export const buildThunkPayload = (type, options = {}) => {
  // const {
  //   video = mockVideosData.newVideo,
  //   videoId = video?.id || 1,
  //   categoryId = video?.categoria_id || 101,
  //   updatedVideoData = mockVideosData.updatedVideo,
  // } = options;

  switch (type) {
    case 'add':
      return {
        categoryId: mockVideosData.newVideo.categoria_id,
        newVideo: mockVideosData.newVideo,
      };

    case 'update':
      return {
        videoId: mockVideosData.updatedVideo.id || 1,
        updatedVideoData: mockVideosData.updatedVideo,
      };

    case 'delete':
      return {
        videoId,
        categoryId,
      };

    default:
      throw new Error(`Unsupported thunk payload type: ${type}`);
  }
};
