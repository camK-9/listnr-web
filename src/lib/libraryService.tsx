import api from '@/lib/axios';
import { endpoints } from './endpoints';

export const libraryService = {
    getQueue: async () => {
        const response = await api.get(endpoints.LIBRARY.QUEUE);
        return response.data;
    },

    getHistory: async () => {
        const response = await api.get(endpoints.LIBRARY.HISTORY);
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