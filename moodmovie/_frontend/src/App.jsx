import React, { useState, useEffect } from 'react';
import api from './api/axios';
import MoodList from './components/MoodList';
import MoodWheel from './components/MoodWheel';
import MovieCard from './components/MovieCard';
import SkeletonCard from './components/SkeletonCard';
import { motion, AnimatePresence } from 'framer-motion';

const App = () => {
    const [moods, setMoods] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [currentMoodId, setCurrentMoodId] = useState(null);
    const [autoSpin, setAutoSpin] = useState(false); 

    useEffect(() => {
        api.get('moods/')
            .then(res => setMoods(res.data))
            .catch(err => console.error("Error loading moods:", err));
    }, []);

    const handleMoodSelect = async (moodId) => {
        setCurrentMoodId(moodId);
        setLoading(true);
        setSelectedMovie(null);
        setAutoSpin(false); 

        try {
            const response = await api.get(`recommend/?mood_id=${moodId}`);
            setSelectedMovie(response.data);
        } catch (error) {
            console.error("Error fetching recommendation:", error);
            setCurrentMoodId(null);
            setSelectedMovie(null);
        } finally {
            setLoading(false);
        }
    };

    const handleSpinAgain = () => {
        setSelectedMovie(null); // Remove movie card first

        if (viewMode === 'wheel') {
            setAutoSpin(true); // Tell wheel to spin automatically
        } else {
            // Grid mode: fetch immediately like before
            if (currentMoodId) {
                handleMoodSelect(currentMoodId);
            }
        }
    };

    const handleReset = () => {
        setSelectedMovie(null);
        setCurrentMoodId(null);
        setAutoSpin(false);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">
            <header className="max-w-4xl mx-auto text-center mb-12">
                <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-movieGold to-yellow-200 bg-clip-text text-transparent">
                    MOODMOVIE
                </h1>
                <p className="text-slate-400">Find the perfect watch for your current vibe.</p>
                
                {!selectedMovie && !loading && (
                    <div className="mt-8 flex justify-center p-1 bg-slate-900 w-fit mx-auto rounded-xl border border-white/5">
                        <button 
                            onClick={() => setViewMode('grid')}
                            className={`px-6 py-2 rounded-lg font-bold transition-all ${viewMode === 'grid' ? 'bg-movieGold text-black' : 'text-slate-400'}`}
                        >
                            Quick Select
                        </button>
                        <button 
                            onClick={() => setViewMode('wheel')}
                            className={`px-6 py-2 rounded-lg font-bold transition-all ${viewMode === 'wheel' ? 'bg-movieGold text-black' : 'text-slate-400'}`}
                        >
                            Surprise Me
                        </button>
                    </div>
                )}
            </header>

            <main className="max-w-6xl mx-auto">
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div 
                            key="loader"
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                        >
                            <SkeletonCard />
                            <p className="text-center mt-4 text-movieGold font-mono animate-pulse uppercase tracking-widest">
                                SCANNING THE ARCHIVES...
                            </p>
                        </motion.div>
                    ) : selectedMovie ? (
                        <motion.div
                            key="movie"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center"
                        >
                            <MovieCard 
                                movie={selectedMovie} 
                                onNext={handleSpinAgain}
                            />

                            <button 
                                onClick={handleReset}
                                className="mt-8 text-slate-500 hover:text-white transition-colors text-sm uppercase tracking-widest font-bold"
                            >
                                ← Back to Moods
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="selector"
                            initial={{ opacity: 0, y: 20 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            exit={{ opacity: 0, y: -20 }}
                        >
                            {viewMode === 'grid' ? (
                                <MoodList 
                                    moods={moods} 
                                    onSelect={handleMoodSelect} 
                                />
                            ) : (
                                <MoodWheel 
                                    moods={moods} 
                                    onSelect={handleMoodSelect}
                                    autoSpin={autoSpin}          
                                    setAutoSpin={setAutoSpin}    
                                />
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default App;