import api from "./axios";
import { endpoints } from "./endpoints";
import IRelease from '@/interfaces/IRelease';

export const releaseService = {
    getNewReleases: async (): Promise<IRelease[]> => {
        const response = await api.get(endpoints.RELEASES.NEWS);
        return response.data;
    },
};