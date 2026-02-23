import { useEffect, useState } from 'react';
import api from '../api/axios';

const MoodList = ({ onSelect }) => {
    const [moods, setMoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.get('moods/')
            .then(response => {
                setMoods(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching moods:", error);
                setError("Failed to connect to the server.");
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-8 text-center text-movieGold">Loading moods...</div>;

    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    if (moods.length === 0) return (
        <div className="p-8 text-center text-slate-400">
            No moods found. Please add some in the Django Admin!
        </div>
    );

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-movieGold mb-8">How are you feeling?</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {moods.map(mood => (
                    <button 
                        key={mood.id}
                        onClick={() => onSelect(mood.id)}
                        className="group relative p-6 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-movieGold transition-all duration-300 text-left"
                    >
                        <h3 className="text-xl font-bold group-hover:text-movieGold transition-colors">
                            {mood.name}
                        </h3>
                        <p className="text-slate-400 text-sm mt-2">
                            {mood.description || "Discover movies matching this vibe."}
                        </p>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MoodList;
