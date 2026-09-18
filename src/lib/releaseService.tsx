import api from "./axios";
import { endpoints } from "./endpoints";
import IRelease from '@/interfaces/IRelease';

export const releaseService = {
    getTrackgetRelease: async (spotifyId: string) => {
        const response = await api.get(endpoints.RELEASES.EXISTS(spotifyId));
        return response.data;
    },

    getTrack: async (spotifyId: string) => {
        const response = await api.get(endpoints.RELEASES.TRACKS(spotifyId));
        return response.data;
    },

    getAlbumTracks: async (spotifyId: string) => {
        const response = await api.get(endpoints.RELEASES.ALBUM_TRACKS(spotifyId));
        return response.data;
    },

    getNewReleases: async () => {
        const response = await api.get(endpoints.RELEASES.NEWS);
        return response.data;
    },
};