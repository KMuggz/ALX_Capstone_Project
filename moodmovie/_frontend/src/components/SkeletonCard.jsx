import React from 'react';

const SkeletonCard = () => (
    <div className="max-w-md mx-auto bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-white/5 animate-pulse">
        <div className="w-full h-[450px] bg-slate-800" />
        <div className="p-8 space-y-4">
            <div className="h-8 bg-slate-800 rounded w-3/4" />
            <div className="space-y-2">
                <div className="h-4 bg-slate-800 rounded w-full" />
                <div className="h-4 bg-slate-800 rounded w-5/6" />
            </div>
            <div className="h-12 bg-slate-800 rounded-full w-full mt-6" />
        </div>
    </div>
);

export default SkeletonCard;