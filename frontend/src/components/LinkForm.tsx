import React, { useState } from 'react';
import { linkService } from '../services/link';
import { formatDateForServer } from '../utils/date';

export default function LinkForm({ onLinkCreated }: { onLinkCreated: (shortUrl: string) => void }) {
    const [url, setUrl] = useState('');
    const [customSlug, setCustomSlug] = useState('');
    const [expiresAt, setExpiresAt] = useState('');
    const [isCommercial, setIsCommercial] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload: any = { 
                original_url: url,
                is_commercial: isCommercial 
            };
            
            if (customSlug.trim()) {
                payload.custom_slug = customSlug.trim();
            }
            
            if (expiresAt) {
                payload.expires_at = formatDateForServer(expiresAt);
            }

            const response = await linkService.create(payload);
            onLinkCreated(response.data.short_url);
            
            setUrl('');
            setCustomSlug('');
            setExpiresAt('');
            setIsCommercial(false);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Ошибка при создании ссылки');
        } finally {
            setLoading(false);
        }
    };

    const getCurrentDateTime = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded text-sm">
                    {error}
                </div>
            )}
            
            <div>
                <label className="block mb-1 text-sm font-medium">Длинная ссылка</label>
                <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full p-2 border rounded"
                    required
                />
            </div>
            
            <div>
                <label className="block mb-1 text-sm font-medium">
                    Свой вариант (необязательно)
                </label>
                <input
                    type="text"
                    value={customSlug}
                    onChange={(e) => setCustomSlug(e.target.value)}
                    placeholder="your-link"
                    className="w-full p-2 border rounded"
                />
            </div>

            <div>
                <label className="block mb-1 text-sm font-medium">
                    Срок действия (необязательно)
                </label>
                <input
                    type="datetime-local"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="w-full p-2 border rounded"
                    min={getCurrentDateTime()}
                />
                <p className="text-xs text-gray-500 mt-1">
                    Оставьте пустым для бессрочной ссылки
                </p>
            </div>

            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="isCommercial"
                    checked={isCommercial}
                    onChange={(e) => setIsCommercial(e.target.checked)}
                    className="mr-2"
                />
                <label htmlFor="isCommercial" className="text-sm">
                    Коммерческая ссылка (с рекламой)
                </label>
            </div>
            
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
                {loading ? 'Создание...' : 'Уменьшить'}
            </button>
        </form>
    );
}