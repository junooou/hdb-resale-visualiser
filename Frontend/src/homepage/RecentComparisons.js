import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RecentComparisons() {
    const [recentComparisons, setRecentComparisons] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const history = JSON.parse(localStorage.getItem("recentComparisons")) || [];
        setRecentComparisons(history);
    }, []);

    return (
        <div className="bg-white shadow-md p-6 rounded-lg mt-10 max-w-5xl mx-auto">
            <h2 className="text-2xl font-semibold text-center mb-4">📜 Recently Viewed Comparisons</h2>
            {recentComparisons.length > 0 ? (
                <ul className="space-y-3">
                    {recentComparisons.map((entry, index) => (
                        <li key={index} className="bg-gray-100 p-4 rounded-lg cursor-pointer hover:bg-gray-200"
                            onClick={() => {
                                const params = new URLSearchParams({
                                    districts: entry.districts.join(","),
                                    startTime: entry.startTime,
                                    endTime: entry.endTime,
                                });
                                navigate(`/price-comparison?${params.toString()}`);
                            }}>
                            <p><strong>Districts:</strong> {entry.districts.join(", ")}</p>
                            <p><strong>Time Range:</strong> {entry.startTime} - {entry.endTime}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500 text-center">No recent comparisons yet.</p>
            )}
        </div>
    );
}
