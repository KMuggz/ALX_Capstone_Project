import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

const MoodWheel = ({ moods, onSelect, autoSpin, setAutoSpin }) => {
    const [isSpinning, setIsSpinning] = useState(false);
    const [winningMood, setWinningMood] = useState(null);
    const controls = useAnimation();

    // Audio refs
    const tickSound = useRef(new Audio('/tick.wav'));
    const winSound = useRef(new Audio('/win.wav'));

    // Set initial volume
    useEffect(() => {
        if (tickSound.current) tickSound.current.volume = 0.4;
        if (winSound.current) winSound.current.volume = 0.6;
    }, []);

    const spinWheel = async () => {
        if (isSpinning || moods.length === 0) return;
        setIsSpinning(true);
        setAutoSpin(false);

        const randomDegree = Math.floor(Math.random() * 360) + 1800; 

        // Tick sound
        let playAudio = true;
        const playTick = () => {
            if (playAudio && tickSound.current) {
                tickSound.current.currentTime = 0;
                tickSound.current.play().catch(() => {});
            }
        };

        const audioInterval = setInterval(playTick, 200);

        try {
            await controls.start({
                rotate: randomDegree,
                transition: { duration: 4, ease: [0.13, 0, 0, 1] }
            });
        } finally {
            clearInterval(audioInterval);
            playAudio = false;
        }

        // Play win sound
        winSound.current?.play().catch(() => {});

        // Calculate winner
        const actualDegree = randomDegree % 360;
        const segmentSize = 360 / moods.length;
        const index = Math.floor((360 - actualDegree) / segmentSize) % moods.length;
        const selected = moods[index];

        setWinningMood(selected.name);

        // Show winning mood briefly
        setTimeout(() => {
            setIsSpinning(false);
            onSelect(selected.id);
            setWinningMood(null);
        }, 1000);
    };

    useEffect(() => { 
        if (autoSpin) spinWheel(); 
    }, [autoSpin]);

    return (
        <div className="flex flex-col items-center gap-10">
            <div className="relative w-80 h-80">
                {/* POINTER */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20">
                    <div className="w-8 h-10 bg-gradient-to-b from-white to-movieGold shadow-xl" 
                            style={{ clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)' }} />
                    <div className="w-2 h-2 bg-white rounded-full absolute -top-1 left-1/2 -translate-x-1/2 shadow-glow" />
                </div>

                {/* WHEEL */}
                <motion.div 
                    animate={controls}
                    className="w-full h-full rounded-full border-[10px] border-slate-900 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden relative"
                    style={{ background: `conic-gradient(${moods.map((m, i) => 
                        `${i % 2 === 0 ? '#0f172a' : '#1e293b'} ${i * (360/moods.length)}deg ${(i+1) * (360/moods.length)}deg`
                    ).join(', ')})` }}
                >
                    {moods.map((mood, i) => (
                        <div 
                            key={mood.id}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-black text-white/40 uppercase"
                            style={{ transform: `rotate(${(i * (360/moods.length)) + (360/moods.length/2)}deg) translateY(-110px)` }}
                        >
                            {mood.name}
                        </div>
                    ))}
                </motion.div>

                {/* WINNING INDICATOR */}
                <AnimatePresence>
                    {winningMood && (
                        <motion.div 
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.5, opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
                        >
                            <span className="bg-movieGold text-black px-4 py-1 rounded font-black text-xl shadow-2xl">
                                {winningMood}
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <button 
                onClick={spinWheel} 
                disabled={isSpinning} 
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
            >
                <span className="text-[#FDE047]">{isSpinning ? 'LUCK IS CAST...' : 'SPIN THE WHEEL'}</span>
            </button>
        </div>
    );
};

export default MoodWheel;