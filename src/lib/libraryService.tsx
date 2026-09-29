import api from '@/lib/axios';
import { endpoints } from './endpoints';

export const libraryService = {
    getQueue: async (page = 1, limit = 50) => {
        const response = await api.get(endpoints.LIBRARY.QUEUE, {
            params: { page, limit },
        });
        return response.data;
    },

    getHistory: async (page = 1, limit = 50) => {
        const response = await api.get(endpoints.LIBRARY.HISTORY, {
            params: { page, limit },
        });
        return response.data;
    },

    toggleQueue: async (spotifyId: string) => {
        const response = await api.post(endpoints.LIBRARY.TOGGLE_QUEUE(spotifyId));
        return response.data;
    },

    toggleHistory: async (spotifyId: string) => {
        const response = await api.post(endpoints.LIBRARY.TOGGLE_HISTORY(spotifyId));
        return response.data;
    },
};