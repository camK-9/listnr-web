import api from '@/lib/axios';
import { endpoints } from '@/lib/endpoints';

export const reviewService = {
    getPopularReviews: async () => {
        const response = await api.get(endpoints.REVIEWS.POPULAR);
        return response.data;
    },
};