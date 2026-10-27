import api from "./axios";
import { endpoints } from "./endpoints";

export const releaseService = {
    search: async (query: string) => {
        const response = await api.get(endpoints.RELEASES.SEARCH(query));
        return response.data;
    },

    getRelease: async (spotifyId: string) => {
        const response = await api.get(endpoints.RELEASES.EXISTS(spotifyId));
        return response.data;
    },

    getTracks: async (spotifyId: string) => {
        const response = await api.get(endpoints.RELEASES.TRACKS(spotifyId));
        return response.data;
    },

    getStats: async (spotifyId: string) => {
        const response = await api.get(endpoints.RELEASES.STATS(spotifyId));
        return response.data;
    },

    getNewReleases: async () => {
        const response = await api.get(endpoints.RELEASES.NEWS);
        return response.data;
    },

    getArtistRelases: async (spotifyId: string) => {
        const response = await api.get(endpoints.RELEASES.ARTIST(spotifyId));
        return response.data;
    }
};