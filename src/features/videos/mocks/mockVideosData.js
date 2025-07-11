import { jest } from '@jest/globals';

export const mockFetchVideos = jest.fn();
export const mockAddVideo = jest.fn();

export const mockVideosData = {
    basic: [
        {
            id: 1, 
            title: 'Video 1', 
            categoria_id: 101,
            videoUrl:'https://www.youtube.com/watch?v=TloxdC0j_cg',
            imageUrl:'images/futbol/tip-delanteros.png'
        },
        { 
            id: 2,
            title: 'Video 2', 
            categoria_id: 102,
            videoUrl:'https://www.youtube.com/watch?v=k4QMNkNV26A',
            imageUrl:'images/futbol/no-perder-balon.png'
        }
    ],
    newVideo: {
        id: 3,
        title: 'Nuevo Video',
        categoria_id: 103,
        videoUrl:'https://www.youtube.com/watch?v=7ig8v7W4BVw',
        imageUrl:'images/futbol/mejorar-regate.png'
    }, 
    updatedVideo: {
        video: {
            id: 1,
            title: 'Titulo editado',
            categoria_id: 101,
            videoUrl: 'https://www.youtube.com/watch?v=TloxdC0j_cg',
            imageUrl: 'images/futbol/tip-delanteros.png'
        }
    }
};

// Helpers
export const setupSuccessfulFetchVideosMock = (data = mockVideosData.basic) => {
    mockFetchVideos.mockResolvedValue({ data });
};
export const setupFailedFetchVideosMock = (errorMessage = 'Error al obtener videos') => {
    mockFetchVideos.mockRejectedValue(new Error(errorMessage));
};

export const setupSuccessfulAddVideoMock = () => {
    mockAddVideo.mockResolvedValue({
        data: { video: mockVideosData.newVideo }
    });
};







export const clearAllMocks = () => {
    mockFetchVideos.mockClear();
};

export const resetAllMocks = () => {
    mockFetchVideos.mockReset();
};