import { useEffect, useState } from 'react';
import { linkService } from '../services/link';
import type { Link } from '../types/link';
import { formatLocalDateTime } from '../utils/date';
import { Link as RouterLink } from 'react-router-dom'; 

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

    const isLinkExpired = (link: Link): boolean => {
        if (!link.expires_at) return false;
        return new Date(link.expires_at) < new Date();
    };

    const getLinkStatus = (link: Link) => {
        if (!link.expires_at) {
            return {
                label: 'Постоянная',
                className: 'bg-green-100 text-green-600',
                icon: '∞'
            };
        }
        const expired = isLinkExpired(link);
        if (expired) {
            return {
                label: 'Истекла',
                className: 'bg-red-100 text-red-600',
                icon: '⏳'
            };
        }
        return {
            label: 'Активна',
            className: 'bg-green-100 text-green-600',
            icon: '✓'
        };
    };

    const getTimeUntilExpiry = (expiresAt: string) => {
        const now = new Date();
        const expiry = new Date(expiresAt);
        const diffMs = expiry.getTime() - now.getTime();
        
        if (diffMs <= 0) return null;
        
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        
        if (diffHours > 24) {
            const diffDays = Math.floor(diffHours / 24);
            return `${diffDays} ${getDaysWord(diffDays)}`;
        }
        
        return `${diffHours}ч ${diffMinutes}м`;
    };

    const getDaysWord = (days: number) => {
        if (days % 10 === 1 && days % 100 !== 11) return 'день';
        if ([2, 3, 4].includes(days % 10) && ![12, 13, 14].includes(days % 100)) return 'дня';
        return 'дней';
    };

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
            {links.map((link) => {
                const status = getLinkStatus(link);
                const expired = isLinkExpired(link);
                const timeUntilExpiry = link.expires_at && !expired ? getTimeUntilExpiry(link.expires_at) : null;
                
                return (
                    <div 
                        key={link.id} 
                        className={`border rounded p-3 hover:bg-gray-50 transition-colors ${
                            expired ? 'border-red-200 bg-red-50/30' : 'border-gray-200'
                        }`}
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.className}`}>
                                        <span>{status.icon}</span>
                                        {status.label}
                                    </span>
                                    
                                    {!expired && link.expires_at && (
                                        <span className="text-xs text-gray-500">
                                            Осталось: {timeUntilExpiry}
                                        </span>
                                    )}
                                </div>
                                
                                <a
                                    href={link.short_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`hover:underline font-medium block truncate ${
                                        expired ? 'text-gray-400' : 'text-blue-500'
                                    }`}
                                >
                                    {link.short_url}
                                </a>
                                
                                <p className="text-gray-600 text-sm truncate mt-1">
                                    {link.original_url}
                                </p>
                                
                                <div className="flex items-center gap-3 text-xs mt-2">
                                    {link.expires_at && (
                                        <span className={`${expired ? 'text-red-500' : 'text-orange-500'}`}>
                                            {expired ? 'Истекла:' : 'Действует до:'} {formatLocalDateTime(link.expires_at)}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <RouterLink 
                                to={`/stats/${link.short_code}`}
                                className="text-blue-600 hover:underline text-sm ml-4"
                            >
                                Статистика
                            </RouterLink>
                            <button
                                onClick={() => handleDelete(link.id)}
                                className="text-red-500 hover:text-red-700 ml-2 cursor-pointer p-1 rounded-full hover:bg-red-50 transition-colors"
                                title="Удалить"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}