import React from 'react';
import api from '../api/axios';

const MovieCard = ({ movie, onNext }) => {
    const handleFeedback = async (status) => {
        try {
            // Requirement 3.3: Feedback handling logic
            await api.post('feedback/', {
                movie_id: movie.id,
                status: status
            });
            
            // Smart Filtering Requirement: Instantly skip 'Bad' results
            if (status === 'Bad') {
                onNext();
            }
        } catch (err) {
            console.error("Feedback failed", err);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10">
            {/* Poster Section */}
            <div className="relative group">
                <img 
                    src={movie.poster_path 
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
                        : 'https://via.placeholder.com/500x750?text=No+Poster'} 
                    alt={movie.title}
                    className="w-full h-[450px] object-cover"
                />
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                    <span className="text-movieGold font-bold">★ {movie.vote_average?.toFixed(1)}</span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-8">
                <h2 className="text-2xl font-black mb-2 text-white uppercase tracking-tight">{movie.title}</h2>
                <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 mb-6">
                    {movie.overview}
                </p>

                {/* Core Feature: Streaming Availability Link */}
                <a 
                    href={`https://www.themoviedb.org/movie/${movie.id}/watch`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="block w-full text-center py-2 mb-6 border border-movieGold/30 text-movieGold rounded-lg hover:bg-movieGold hover:text-black transition-all font-bold text-xs uppercase tracking-widest"
                >
                    Where to Watch →
                </a>

                {/* Requirement 4.4: Feedback buttons */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    <button 
                        onClick={() => handleFeedback('Bad')}
                        className="py-2 bg-red-900/20 text-red-500 rounded-lg hover:bg-red-900/40 border border-red-500/10 text-xs font-bold uppercase"
                    >
                        Bad
                    </button>
                    <button 
                        onClick={() => handleFeedback('Meh')}
                        className="py-2 bg-slate-800 text-slate-400 rounded-lg hover:bg-slate-700 text-xs font-bold uppercase"
                    >
                        Meh
                    </button>
                    <button 
                        onClick={() => handleFeedback('Good')}
                        className="py-2 bg-green-900/20 text-green-500 rounded-lg hover:bg-green-900/40 border border-green-500/10 text-xs font-bold uppercase"
                    >
                        Good
                    </button>
                </div>

                <button 
                    onClick={onNext}
                    className="w-full py-4 bg-movieGold text-black font-black rounded-xl hover:scale-[1.02] active:scale-95 transition-transform uppercase tracking-tighter"
                >
                    Not Feeling It? Spin Again
                </button>
            </div>
        </div>
    );
};

export default MovieCard;