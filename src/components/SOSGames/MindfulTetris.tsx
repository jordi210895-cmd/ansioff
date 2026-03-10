'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw, ArrowLeft, Sparkles } from 'lucide-react';

interface MindfulTetrisProps {
    onBack: () => void;
}

const COLS = 10;
const ROWS = 20;
const CALM_WORDS = ['Respira', 'Acepta', 'Flota', 'Calma', 'Estás a salvo', 'Paz', 'Confía', 'Suelta'];
// Modern, cohesive blue palette for Navy Zen
const COLORS = ['#7ec8e3', '#4fa3c8', '#e07d6a', '#b48cdc', '#78b478'];

const TETROMINOS = {
    I: { shape: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]], color: COLORS[0] },
    J: { shape: [[1, 0, 0], [1, 1, 1], [0, 0, 0]], color: COLORS[1] },
    L: { shape: [[0, 0, 1], [1, 1, 1], [0, 0, 0]], color: COLORS[2] },
    O: { shape: [[1, 1], [1, 1]], color: COLORS[3] },
    S: { shape: [[0, 1, 1], [1, 1, 0], [0, 0, 0]], color: COLORS[4] },
    T: { shape: [[0, 1, 0], [1, 1, 1], [0, 0, 0]], color: COLORS[0] },
    Z: { shape: [[1, 1, 0], [0, 1, 1], [0, 0, 0]], color: COLORS[1] },
};

export default function MindfulTetris({ onBack }: MindfulTetrisProps) {
    const [grid, setGrid] = useState<string[][]>(Array(ROWS).fill(null).map(() => Array(COLS).fill('')));
    const [activePiece, setActivePiece] = useState<{ shape: number[][], pos: { x: number, y: number }, color: string } | null>(null);
    const [nextPiece, setNextPiece] = useState<{ shape: number[][], color: string } | null>(null);
    const [calmWord, setCalmWord] = useState('');
    const [isPaused, setIsPaused] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [score, setScore] = useState(0);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const boardRef = useRef<HTMLDivElement>(null);
    const [cellSize, setCellSize] = useState(22);

    // Dynamically calculate optimal cell size to fit the board on screen
    useEffect(() => {
        const calcSize = () => {
            // Available height = total viewport minus top bar (~80px) and controls (~200px)
            const availableH = window.innerHeight - 280;
            // Available width = viewport minus some padding
            const availableW = window.innerWidth - 48;
            const byHeight = Math.floor(availableH / ROWS);
            const byWidth = Math.floor(availableW / COLS);
            // Use smallest to ensure it fits both dimensions, clamp between 14 and 28
            setCellSize(Math.max(14, Math.min(28, byHeight, byWidth)));
        };
        calcSize();
        window.addEventListener('resize', calcSize);
        return () => window.removeEventListener('resize', calcSize);
    }, []);

    const getRandomPiece = useCallback(() => {
        const keys = Object.keys(TETROMINOS) as (keyof typeof TETROMINOS)[];
        const key = keys[Math.floor(Math.random() * keys.length)];
        return TETROMINOS[key];
    }, []);

    const spawnPiece = useCallback(() => {
        let currentPiece = nextPiece;
        let futurePiece = getRandomPiece();

        if (!currentPiece) {
            currentPiece = getRandomPiece();
        }

        const newPos = { x: Math.floor(COLS / 2) - Math.floor(currentPiece.shape[0].length / 2), y: 0 };

        if (!isValidMove(currentPiece.shape, newPos, grid)) {
            setIsGameOver(true);
            setIsPaused(true);
            return;
        }

        setActivePiece({
            ...currentPiece,
            pos: newPos
        });
        setNextPiece(futurePiece);
    }, [nextPiece, grid, getRandomPiece]);

    const resetGame = () => {
        setGrid(Array(ROWS).fill(null).map(() => Array(COLS).fill('')));
        setActivePiece(null);
        setNextPiece(null);
        setIsGameOver(false);
        setIsPaused(false);
        setScore(0);
        setCalmWord('');
    };

    const clearLines = useCallback((newGrid: string[][]) => {
        let cleared = 0;
        const filteredGrid = newGrid.filter(row => {
            if (row.every(cell => cell !== '')) {
                cleared++;
                return false;
            }
            return true;
        });

        if (cleared > 0) {
            setCalmWord(CALM_WORDS[Math.floor(Math.random() * CALM_WORDS.length)]);
            setTimeout(() => setCalmWord(''), 2000);
            setScore(s => s + (cleared * 100));

            const emptyRows = Array(cleared).fill(null).map(() => Array(COLS).fill(''));
            setGrid([...emptyRows, ...filteredGrid]);
        } else {
            setGrid(newGrid);
        }
    }, []);

    function isValidMove(shape: number[][], pos: { x: number, y: number }, currentGrid: string[][]) {
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x]) {
                    const newX = pos.x + x;
                    const newY = pos.y + y;
                    if (newX < 0 || newX >= COLS || newY >= ROWS) return false;
                    if (newY >= 0 && currentGrid[newY][newX] !== '') return false;
                }
            }
        }
        return true;
    }

    const moveDown = useCallback(() => {
        if (!activePiece || isPaused || isGameOver) return;

        const newPos = { ...activePiece.pos, y: activePiece.pos.y + 1 };
        if (isValidMove(activePiece.shape, newPos, grid)) {
            setActivePiece({ ...activePiece, pos: newPos });
        } else {
            const newGrid = grid.map(row => [...row]);
            activePiece.shape.forEach((row, y) => {
                row.forEach((cell, x) => {
                    if (cell) {
                        const gridY = activePiece.pos.y + y;
                        const gridX = activePiece.pos.x + x;
                        if (gridY >= 0 && gridY < ROWS && gridX >= 0 && gridX < COLS) {
                            newGrid[gridY][gridX] = activePiece.color;
                        }
                    }
                });
            });
            clearLines(newGrid);
            spawnPiece();
        }
    }, [activePiece, grid, spawnPiece, clearLines, isPaused, isGameOver]);

    useEffect(() => {
        if (!activePiece && !isGameOver) {
            spawnPiece();
        }
    }, [activePiece, isGameOver, spawnPiece]);

    useEffect(() => {
        if (!isPaused && !isGameOver) {
            timerRef.current = setInterval(moveDown, 1000);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [moveDown, isPaused, isGameOver]);

    const rotate = useCallback(() => {
        if (!activePiece || isPaused || isGameOver) return;
        const newShape = activePiece.shape[0].map((_, i) => activePiece.shape.map(row => row[i]).reverse());

        let newX = activePiece.pos.x;
        if (newX + newShape[0].length > COLS) newX = COLS - newShape[0].length;
        if (newX < 0) newX = 0;

        if (isValidMove(newShape, { ...activePiece.pos, x: newX }, grid)) {
            setActivePiece({ ...activePiece, shape: newShape, pos: { ...activePiece.pos, x: newX } });
        }
    }, [activePiece, isPaused, isGameOver, grid]);

    const moveSide = useCallback((dir: number) => {
        if (!activePiece || isPaused || isGameOver) return;
        const newPos = { ...activePiece.pos, x: activePiece.pos.x + dir };
        if (isValidMove(activePiece.shape, newPos, grid)) {
            setActivePiece({ ...activePiece, pos: newPos });
        }
    }, [activePiece, isPaused, isGameOver, grid]);

    const hardDrop = useCallback(() => {
        if (!activePiece || isPaused || isGameOver) return;
        let tempY = activePiece.pos.y;
        while (isValidMove(activePiece.shape, { ...activePiece.pos, y: tempY + 1 }, grid)) {
            tempY++;
        }

        const newPos = { ...activePiece.pos, y: tempY };
        const newGrid = grid.map(row => [...row]);
        activePiece.shape.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell) {
                    const gridY = tempY + y;
                    const gridX = activePiece.pos.x + x;
                    if (gridY >= 0 && gridY < ROWS && gridX >= 0 && gridX < COLS) {
                        newGrid[gridY][gridX] = activePiece.color;
                    }
                }
            });
        });
        clearLines(newGrid);
        spawnPiece();
    }, [activePiece, grid, clearLines, spawnPiece, isPaused, isGameOver]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isPaused || isGameOver) {
                if (e.key === 'p' || e.key === 'P') setIsPaused(p => !p);
                return;
            };
            switch (e.key) {
                case 'ArrowLeft': moveSide(-1); break;
                case 'ArrowRight': moveSide(1); break;
                case 'ArrowDown': moveDown(); break;
                case 'ArrowUp': rotate(); break;
                case ' ': e.preventDefault(); hardDrop(); break;
                case 'p':
                case 'P': setIsPaused(true); break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [moveSide, moveDown, rotate, hardDrop, isPaused, isGameOver]);

    return (
        <div className="flex flex-col items-center h-full bg-[#06101a] text-white overflow-hidden" style={{ maxHeight: '100dvh' }}>
            <div className="w-full flex justify-between items-center p-8 flex-shrink-0">
                <button onClick={onBack} className="flex items-center gap-2 text-white/40 hover:text-white transition-colors">
                    <ArrowLeft size={20} />
                    <span className="text-[14px] font-medium">Volver</span>
                </button>
                <div className="flex flex-col items-center">
                    <span className="text-[10px] tracking-[0.2em] text-[#7ec8e3] uppercase font-bold">Mindful Tetris</span>
                    <span className="text-[15px] font-mono text-white/40">{score.toString().padStart(5, '0')}</span>
                </div>
                <button onClick={() => setIsPaused(!isPaused)} className="w-11 h-11 rounded-[16px] bg-white/[0.03] border border-white/5 flex items-center justify-center text-white/40 active:scale-95 transition-all">
                    {isPaused && !isGameOver ? <Play size={20} /> : <Pause size={20} />}
                </button>
            </div>

            <div className="flex-1 w-full flex flex-col items-center justify-center min-h-0 overflow-hidden px-4">
                <div className="relative flex gap-4 max-h-full">
                    {/* Information Panel (Desktop) */}
                    <div className="hidden sm:flex flex-col gap-4 absolute -left-20 top-0">
                        <div className="bg-white/[0.03] p-3 rounded-2xl border border-white/5 w-16 shadow-xl">
                            <div className="text-[8px] uppercase tracking-widest text-[#7ec8e3] font-bold mb-3">Next</div>
                            <div className="w-full aspect-square flex items-center justify-center">
                                {nextPiece && (
                                    <div className="grid gap-[2px]" style={{ gridTemplateColumns: `repeat(${nextPiece.shape[0].length}, 1fr)` }}>
                                        {nextPiece.shape.flat().map((cell, i) => (
                                            <div key={i} className="w-1.5 h-1.5 rounded-[1px]" style={{ backgroundColor: cell ? nextPiece.color : 'transparent' }} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* The Grid Area */}
                    <div className="relative flex flex-col items-center mb-[40px]">
                        <div className="grid grid-cols-10 gap-[1px] bg-white/[0.02] border border-white/5 p-[2px] rounded-xl shadow-2xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-[#7ec8e3]/5 pointer-events-none"></div>
                            {grid.map((row, y) =>
                                row.map((cell, x) => {
                                    let activeColor = '';
                                    if (activePiece) {
                                        const px = x - activePiece.pos.x;
                                        const py = y - activePiece.pos.y;
                                        if (py >= 0 && py < activePiece.shape.length && px >= 0 && px < activePiece.shape[py].length) {
                                            if (activePiece.shape[py][px]) activeColor = activePiece.color;
                                        }
                                    }
                                    return (
                                        <div
                                            key={`${y}-${x}`}
                                            className="rounded-[2px] transition-colors duration-100 shadow-[inset_0_0_4px_rgba(0,0,0,0.1)]"
                                            style={{
                                                backgroundColor: activeColor || cell || 'rgba(26,46,66,0.3)',
                                                width: cellSize,
                                                height: cellSize,
                                            }}
                                        ></div>
                                    );
                                })
                            )}
                        </div>

                        {/* Overlays */}
                        {(isGameOver || isPaused) && (
                            <div className="absolute inset-0 bg-[#06101a]/95 backdrop-blur-md flex flex-col items-center justify-center z-30 rounded-xl p-6 text-center animate-in fade-in duration-500">
                                {isGameOver ? (
                                    <>
                                        <Sparkles className="text-[#7ec8e3] mb-4" size={36} />
                                        <span className="text-[#7ec8e3]/60 text-[11px] uppercase tracking-[0.2em] mb-2 font-bold">Sesión Finalizada</span>
                                        <h3 className="text-[32px] font-serif text-[#e8f4f8] mb-8">Paz Interior</h3>
                                        <button
                                            onClick={resetGame}
                                            className="w-full bg-white/10 hover:bg-white/15 text-[#e8f4f8] border border-white/10 py-4 rounded-[20px] flex items-center justify-center gap-2 font-medium transition-all active:scale-95 shadow-lg"
                                        >
                                            <RotateCcw size={20} />
                                            Empezar de nuevo
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-16 h-16 bg-[#7ec8e3]/10 rounded-full flex items-center justify-center text-[#7ec8e3] mb-6">
                                            <Pause size={32} />
                                        </div>
                                        <span className="text-[#7ec8e3]/60 text-[11px] uppercase tracking-[0.2em] mb-6 font-bold">En Pausa</span>
                                        <button
                                            onClick={() => setIsPaused(false)}
                                            className="w-full bg-[#1a2e42]/60 hover:bg-[#1a2e42]/80 text-[#e8f4f8] py-4 rounded-[20px] border border-white/5 font-medium transition-all"
                                        >
                                            Continuar Fluyendo
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Mobile Next Piece */}
                    <div className="sm:hidden absolute -right-10 top-0">
                        {nextPiece && (
                            <div className="bg-slate-900 p-2 rounded-xl border-2 border-slate-800 shadow-xl">
                                <div className="grid gap-[2px]" style={{ gridTemplateColumns: `repeat(${nextPiece.shape[0].length}, 1fr)` }}>
                                    {nextPiece.shape.flat().map((cell, i) => (
                                        <div key={i} className="w-1.5 h-1.5 rounded-[1px]" style={{ backgroundColor: cell ? nextPiece.color : 'transparent' }} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Word Overlay */}
                    {calmWord && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                            <div className="bg-[#1a2e42]/60 backdrop-blur-xl px-10 py-5 rounded-[32px] border border-[#7ec8e3]/30 animate-in zoom-in-90 fade-in duration-500 shadow-xl">
                                <span className="text-[#e8f4f8] font-serif text-[28px] tracking-wide text-center block">{calmWord}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Controls */}
            <div className="w-full max-w-[320px] p-6 flex-shrink-0 select-none pb-12 mt-4">
                <div className="grid grid-cols-3 gap-3">
                    <div />
                    <button
                        onPointerDown={(e) => { e.preventDefault(); rotate(); }}
                        className="bg-white/[0.03] aspect-square rounded-[20px] flex items-center justify-center border border-white/5 active:scale-90 active:bg-[#7ec8e3]/10 transition-all text-white/40 active:text-[#7ec8e3]"
                    >
                        <RotateCcw size={28} />
                    </button>
                    <div />

                    <button
                        onPointerDown={(e) => { e.preventDefault(); moveSide(-1); }}
                        className="bg-white/[0.03] aspect-square rounded-[20px] flex items-center justify-center border border-white/5 active:scale-90 active:bg-[#7ec8e3]/10 transition-all text-white/40 active:text-[#7ec8e3] font-bold text-3xl"
                    >
                        ←
                    </button>
                    <button
                        onPointerDown={(e) => { e.preventDefault(); moveDown(); }}
                        className="bg-white/[0.03] aspect-square rounded-[20px] flex items-center justify-center border border-white/5 active:scale-90 active:bg-[#7ec8e3]/10 transition-all text-white/40 active:text-[#7ec8e3] font-bold text-3xl"
                    >
                        ↓
                    </button>
                    <button
                        onPointerDown={(e) => { e.preventDefault(); moveSide(1); }}
                        className="bg-white/[0.03] aspect-square rounded-[20px] flex items-center justify-center border border-white/5 active:scale-90 active:bg-[#7ec8e3]/10 transition-all text-white/40 active:text-[#7ec8e3] font-bold text-3xl"
                    >
                        →
                    </button>
                </div>

                <button
                    onPointerDown={(e) => { e.preventDefault(); hardDrop(); }}
                    className="w-full mt-4 py-3.5 bg-white/[0.03] rounded-[16px] border border-white/5 text-white/30 text-[11px] uppercase tracking-[0.2em] font-medium active:bg-[#7ec8e3]/10 transition-all"
                >
                    Drop (Espacio)
                </button>
            </div>
        </div>
    );
}
