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

    toggleLike: async (reviewId: string) => {
        const response = await api.post(endpoints.REVIEWS.LIKE(reviewId));
        return response.data
    },

    addComment: async (reviewId: string, content: string) => {
        const response = await api.post(endpoints.REVIEWS.COMMENT(reviewId), {
            content
        });
        return response.data
    },

    toggleCommentLike: async (commentId: string) => {
        const response = await api.post(endpoints.REVIEWS.LIKE_COMMENT(commentId));
        return response.data
    },

    replyComment: async (reviewId: string, commentId: string, content: string) => {
        const response = await api.post(endpoints.REVIEWS.REPLY_COMMENT(reviewId, commentId), {
            content
        });
        return response.data
    },
};