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

    getUserProfile: async (id: string) => {
        const response = await api.get(endpoints.USERS.USER_PROFILE(id));
        return response.data;
    },

    getPopularUsers: async () => {
        const response = await api.get(endpoints.USERS.POPULAR);
        return response.data;
    },

    toggleFollow: async (id: string) => {
        const response = await api.post(endpoints.USERS.FOLLOW(id));
        return response.data;
    },

    addFav: async (type: 'tracks' | 'albums' | 'artists', id: string) => {
        const response = await api.post(endpoints.USERS.ADD_FAV, { type, id });
        return response.data;
    },

    removeFav: async (type: 'tracks' | 'albums' | 'artists', id: string) => {
        const response = await api.delete(endpoints.USERS.DELETE_FAV, { data: { type, id } });
        return response.data;
    },

    reorderFav: async (type: 'tracks' | 'albums' | 'artists', ids: string[]) => {
        const response = await api.patch(endpoints.USERS.REORDER_FAV, { type, ids });
        return response.data;
    },
};