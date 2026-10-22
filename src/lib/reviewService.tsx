import api from '@/lib/axios';
import { endpoints } from '@/lib/endpoints';

export const reviewService = {
    getReview: async (spotifyId: string) => {
        const response = await api.get(endpoints.REVIEWS.EXISTS(spotifyId));
        return response.data;
    },

    getPopularReviews: async () => {
        const response = await api.get(endpoints.REVIEWS.POPULAR);
        return response.data;
    },

    createOrUpdateReview: async (releaseId: string, rating: number | null, comment: string) => {
        const response = await api.post(endpoints.REVIEWS.CREATE(releaseId), {
            rating,
            comment,
        });
        return response.data;
    },
};