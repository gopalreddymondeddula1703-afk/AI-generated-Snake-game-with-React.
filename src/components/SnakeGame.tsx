import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GRID_SIZE, GAME_SPEED, INITIAL_SNAKE, INITIAL_DIRECTION } from '../constants';
import { Point, GameState } from '../types';
import { Trophy, RefreshCcw, Play } from 'lucide-react';

interface SnakeGameProps {
  onScoreUpdate: (score: number) => void;
}

export const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [gameState, setGameState] = useState<GameState>('start');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(seg => seg.x === newFood.x && seg.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setFood(generateFood(INITIAL_SNAKE));
    setGameState('playing');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
          y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
        };

        // Check collision with self
        if (prevSnake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
          setGameState('gameover');
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          const newScore = score + 10;
          setScore(newScore);
          onScoreUpdate(newScore);
          if (newScore > highScore) setHighScore(newScore);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(interval);
  }, [direction, food, gameState, score, highScore, onScoreUpdate, generateFood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines subtly
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(canvas.width, i * cellSize);
        ctx.stroke();
    }

    // Draw food
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#FF00FF'; // neon-pink
    ctx.fillStyle = '#FF00FF';
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.shadowBlur = isHead ? 10 : 0;
      ctx.shadowColor = '#39FF14'; 
      ctx.fillStyle = isHead ? '#39FF14' : '#20a00d';
      
      ctx.beginPath();
      ctx.roundRect(
        segment.x * cellSize + 1,
        segment.y * cellSize + 1,
        cellSize - 2,
        cellSize - 2,
        isHead ? 2 : 1
      );
      ctx.fill();
    });

    ctx.shadowBlur = 0;
  }, [snake, food]);

  return (
    <div className="relative group perspective-container">
      {/* Game Window Neon Frame */}
      <div className="relative bg-slate-950 rounded-xl overflow-hidden border border-white/10 glass-panel shadow-2xl flex flex-col items-center">
        
        {/* Scoreboard */}
        <div className="w-full px-6 py-3 flex justify-between items-center glass-panel border-b border-white/5">
          <div className="flex flex-col">
            <span className="text-[8px] uppercase opacity-40 font-bold tracking-widest">RECORD_LOG</span>
            <span className="font-mono text-white text-xs">HI: {highScore.toString().padStart(4, '0')}</span>
          </div>
          <div className="text-xl font-bold font-mono neon-text-pink">
            {score.toString().padStart(4, '0')}
          </div>
        </div>

        {/* Snake Game Label from Screenshot */}
        <div className="absolute top-[4.5rem] left-6 z-20">
          <div className="px-3 py-1 border-2 border-blue-400 rounded-sm">
            <span className="text-sm font-mono font-bold text-blue-400 uppercase tracking-tighter shadow-[0_0_10px_rgba(96,165,250,0.5)]">
              snake game
            </span>
          </div>
        </div>

        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="w-full aspect-square max-w-[400px] cursor-none"
        />

        <AnimatePresence>
          {gameState !== 'playing' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 glass-panel flex flex-col items-center justify-center p-8 text-center z-10"
            >
              {gameState === 'start' ? (
                <>
                  <h2 className="text-4xl font-black neon-text-blue mb-2 tracking-tighter italic">
                    SYNC_GRID
                  </h2>
                  <p className="text-slate-400 mb-8 text-[10px] uppercase tracking-[0.2em]">
                    ESTABLISH NEURAL LINK
                  </p>
                  <button
                    onClick={resetGame}
                    className="relative px-10 py-3 border border-cyan-400 text-cyan-400 font-bold rounded-full overflow-hidden transition-all hover:bg-cyan-400/10 active:scale-95 text-xs tracking-widest"
                  >
                    INITIALIZE
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-4xl font-black neon-text-pink mb-2 tracking-tighter italic">
                    BUFFER_ERROR
                  </h2>
                  <p className="text-slate-400 mb-8 text-xs font-mono uppercase">Node Collapse: {score}</p>
                  <button
                    onClick={resetGame}
                    className="flex items-center gap-2 px-10 py-3 bg-white text-black font-bold rounded-full hover:bg-slate-200 transition-colors text-xs uppercase tracking-widest"
                  >
                    <RefreshCcw className="w-4 h-4" />
                    RESTART
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="w-full px-6 py-2 flex justify-between items-center glass-panel border-t border-white/5 opacity-50">
           <span className="text-[10px] font-mono">PRESS [SPACE] TO RESTART</span>
           <span className="text-[10px] font-mono uppercase tracking-widest">LEVEL 01</span>
        </div>
      </div>
      
      {/* Keyboard Hint */}
      <div className="mt-4 flex justify-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
        <div className="flex flex-col items-center gap-1">
          <div className="w-8 h-8 rounded border border-slate-700 flex items-center justify-center font-mono text-xs">↑</div>
          <div className="flex gap-1">
            <div className="w-8 h-8 rounded border border-slate-700 flex items-center justify-center font-mono text-xs">←</div>
            <div className="w-8 h-8 rounded border border-slate-700 flex items-center justify-center font-mono text-xs">↓</div>
            <div className="w-8 h-8 rounded border border-slate-700 flex items-center justify-center font-mono text-xs">→</div>
          </div>
        </div>
      </div>
    </div>
  );
};
