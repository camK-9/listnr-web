import api from '@/lib/axios';
import { endpoints } from '@/lib/endpoints';

export const userService = {
    search: async (query: string) => {
        const response = await api.get(endpoints.USERS.SEARCH(query));
        return response.data;
    },

    getProfile: async () => {
        const response = await api.get(endpoints.USERS.PROFILE);
        return response.data;
    },

    getUserProfile: async (spotifyId: string) => {
        const response = await api.get(endpoints.USERS.USER_PROFILE(spotifyId));
        return response.data;
    },

    getPopularUsers: async () => {
        const response = await api.get(endpoints.USERS.POPULAR);
        return response.data;
    },

    toggleFollow: async (spotifyId: string) => {
        const response = await api.post(endpoints.USERS.FOLLOW(spotifyId));
        return response.data;
    },
};