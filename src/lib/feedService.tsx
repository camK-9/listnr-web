import api from '@/lib/axios';
import { endpoints } from '@/lib/endpoints';

export const feedService = {
    getFeedService: async () => {
        const response = await api.get(endpoints.FEED);
        return response.data;
    },
};