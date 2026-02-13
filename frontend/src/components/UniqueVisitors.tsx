import { useEffect, useState } from 'react';
import { statsService } from '../services/stats';

export default function UniqueVisitors() {
    const [visitors, setVisitors] = useState([]);

    useEffect(() => {
        statsService.getUniqueVisitors14Days().then(setVisitors);
    }, []);

    return (
        <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-bold mb-4">Уникальные посетители за 14 дней</h2>
            <table className="w-full">
                <thead>
                    <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left">Ссылка</th>
                        <th className="px-4 py-2 text-left">Уникальных</th>
                    </tr>
                </thead>
                <tbody>
                    {visitors.map((v: any, i) => (
                        <tr key={i} className="border-t">
                            <td className="px-4 py-2">
                                <a href={v.short_url} target="_blank" className="text-blue-600">
                                    {v.short_url}
                                </a>
                                <div className="text-sm text-gray-600 truncate">{v.url}</div>
                            </td>
                            <td className="px-4 py-2 font-bold">{v.unique_visitors_14days}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}