import { useEffect, useState } from 'react';
import { linkService } from '../services/link';
import type { Link } from '../types/link';

export default function LinkList() {
    const [links, setLinks] = useState<Link[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLinks = async () => {
        setLoading(true);
        try {
            const { data } = await linkService.getAll();
            setLinks(data);
        } catch (error) {
            console.error('Ошибка загрузки ссылок');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Удалить ссылку?')) return;
        try {
            await linkService.delete(id);
            fetchLinks();
        } catch (error) {
            console.error('Ошибка удаления');
        }
    };

    useEffect(() => {
        fetchLinks();
    }, []);

    if (loading) return <div className="text-center py-4">Загрузка...</div>;

    if (links.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                У вас пока нет ссылок
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {links.map((link) => (
                <div key={link.id} className="border rounded p-3 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                            <a
                                href={link.short_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline font-medium block truncate"
                            >
                                {link.short_url}
                            </a>
                            <p className="text-gray-600 text-sm truncate mt-1">
                                {link.original_url}
                            </p>
                            <p className="text-gray-400 text-xs mt-1">
                                {new Date(link.created_at).toLocaleDateString()}
                            </p>
                        </div>
                        <button
                            onClick={() => handleDelete(link.id)}
                            className="text-red-500 hover:text-red-700 ml-2 cursor-pointer"
                            title="Удалить"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}