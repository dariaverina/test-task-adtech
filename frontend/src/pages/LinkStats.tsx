import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { statsService } from '../services/stats';

interface UniqueStats {
    total_unique_14days: number;
    daily_unique: Array<{
        date: string;
        unique_count: number;
    }>;
}

export default function LinkStats() {
    const { slug } = useParams();
    const [stats, setStats] = useState<any>(null);
    const [uniqueStats, setUniqueStats] = useState<UniqueStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                const data = await statsService.getLinkStats(slug!);
                setStats(data);
                
                const unique = await statsService.getLinkUniqueVisitors14Days(slug!);
                setUniqueStats(unique);
                
            } catch (error) {
                console.error('Ошибка загрузки:', error);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchData();
        }
    }, [slug]);

    if (loading) return <div className="p-4">Загрузка...</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Статистика</h1>
            
            {/* Основная информация */}
            <div className="bg-white rounded-lg shadow p-4 mb-4">
                <p><strong>Ссылка:</strong> {stats.link.original_url}</p>
                <p><strong>Короткая:</strong> {stats.link.short_url}</p>
                <p><strong>Всего переходов:</strong> {stats.total_clicks}</p>
            </div>

            {/*Уникальные посетители за 14 дней */}
            {uniqueStats && (
                <div className="bg-white rounded-lg shadow p-4 mb-4">
                    <h2 className="text-xl font-semibold mb-3">Уникальные посетители за 14 дней</h2>
                    
                    <div className="mb-4">
                        <span className="text-3xl font-bold text-blue-600">
                            {uniqueStats.total_unique_14days}
                        </span>
                        <span className="text-gray-600 ml-2">уникальных посетителей</span>
                    </div>

                    {uniqueStats.daily_unique && uniqueStats.daily_unique.length > 0 ? (
                        <div>
                            <h3 className="font-semibold mb-2">По дням:</h3>
                            <div className="space-y-2">
                                {uniqueStats.daily_unique.map((day) => (
                                    <div key={day.date} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                        <span>{new Date(day.date).toLocaleDateString('ru-RU')}</span>
                                        <span className="font-semibold text-blue-600">{day.unique_count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500">Нет переходов за последние 14 дней</p>
                    )}
                </div>
            )}

            {/* История всех переходов */}
            <div className="bg-white rounded-lg shadow">
                <h2 className="text-xl font-semibold p-4 border-b">История всех переходов</h2>
                {stats.clicks?.length > 0 ? (
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left">Дата</th>
                                <th className="px-4 py-2 text-left">IP</th>
                                <th className="px-4 py-2 text-left">User Agent</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.clicks.map((click: any, i: number) => (
                                <tr key={i} className="border-t">
                                    <td className="px-4 py-2">{new Date(click.clicked_at).toLocaleString()}</td>
                                    <td className="px-4 py-2">{click.ip}</td>
                                    <td className="px-4 py-2 text-sm">{click.user_agent}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="p-4 text-gray-500">Нет переходов</p>
                )}
            </div>
        </div>
    );
}