import api from './api';
import type { Link } from '../types/link';

export const linkService = {
    getAll: () => api.get<Link[]>('/links'),
    
    create: (data: {
        original_url: string;
        custom_slug?: string;
        expires_at?: string;
        is_commercial?: boolean;
    }) => api.post('/links', data),
    
    delete: (id: number) => api.delete(`/links/${id}`)
};