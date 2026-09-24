import api from '@/lib/axios';
import { endpoints } from '@/lib/endpoints';

export const artistService = {
    getProfile: async (spotifyId: string) => {
        const response = await api.get(endpoints.ARTISTS.PROFILE(spotifyId));
        return response.data;
    },

    getPopularArtists: async () => {
        const response = await api.get(endpoints.ARTISTS.POPULAR);
        return response.data;
    },

    toggleFollow: async (spotifyId: string) => {
        const response = await api.post(endpoints.ARTISTS.FOLLOW(spotifyId));
        return response.data;
    },
};