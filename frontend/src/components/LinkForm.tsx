import React, { useState } from 'react';
import { linkService } from '../services/link';

export default function LinkForm({ onLinkCreated }: { onLinkCreated: (shortUrl: string) => void }) {
    const [url, setUrl] = useState('');
    const [customSlug, setCustomSlug] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await linkService.create({
                original_url: url,
                custom_slug: customSlug || undefined
            });
            
            onLinkCreated(response.data.short_url);
            
            setUrl('');
            setCustomSlug('');
        } catch (err) {
            setError('Ошибка при создании ссылки');
        } finally {
            setLoading(false);
        }
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