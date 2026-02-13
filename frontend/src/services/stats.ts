import api from './api';

export const statsService = {
    async getLinkStats(slug: string) {
        const response = await api.get(`/stats/${slug}`);
        return response.data;
    },

    async getUniqueVisitors14Days() {
        const response = await api.get('/stats/unique/14days');
        return response.data;
    },

    async getLinkUniqueVisitors14Days(slug: string) {
        const response = await api.get(`/stats/unique/${slug}/14days`);
        return response.data;
    }
};