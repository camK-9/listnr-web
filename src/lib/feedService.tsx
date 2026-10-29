import api from '@/lib/axios';
import { endpoints } from '@/lib/endpoints';

export const feedService = {
    getFeedService: async (page = 1, limit = 10) => {
        const response = await api.get(endpoints.FEED, {
            params: { page, limit },
        });
        return response.data;
    },
};