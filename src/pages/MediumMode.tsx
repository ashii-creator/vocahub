import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trees, Skull, Star, Sword, Shield, Heart, Scroll } from 'lucide-react';

interface Position {
  x: number;
  y: number;
}

interface Obstacle {
  id: string;
  position: Position;
  type: 'tree' | 'trap' | 'powerup' | 'monster';
}

interface Clue {
  id: string;
  sentence: string;
  missingWord: string;
  options: string[];
  position: Position;
}

const MediumMode = () => {
  const [playerPosition, setPlayerPosition] = useState<Position>({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [gameActive, setGameActive] = useState(true);
  const [obstacles, setObstacles] = useState<Obstacle[]>([
    { id: 'tree1', position: { x: 2, y: 1 }, type: 'tree' },
    { id: 'trap1', position: { x: 1, y: 2 }, type: 'trap' },
    { id: 'powerup1', position: { x: 3, y: 2 }, type: 'powerup' },
    { id: 'monster1', position: { x: 4, y: 3 }, type: 'monster' },
  ]);
  const [currentClue, setCurrentClue] = useState<Clue>({
    id: '1',
    sentence: 'The detective found a crucial _____ at the crime scene.',
    missingWord: 'evidence',
    options: ['evidence', 'proof', 'clue', 'sign'],
    position: { x: 4, y: 2 },
  });
  const [showClue, setShowClue] = useState(false);
  const [message, setMessage] = useState('');
  const [combo, setCombo] = useState(0);

  const gridSize = 5;

  useEffect(() => {
    const checkCollisions = () => {
      const obstacle = obstacles.find(o => 
        o.position.x === playerPosition.x && o.position.y === playerPosition.y
      );

      if (obstacle) {
        switch (obstacle.type) {
          case 'tree':
            setPlayerPosition(prev => ({ x: prev.x - 1, y: prev.y }));
            setMessage("A mystical barrier blocks your path!");
            break;
          case 'trap':
            setLives(prev => prev - 1);
            setMessage("You triggered a dark rune! -1 HP");
            if (lives <= 1) setGameActive(false);
            break;
          case 'powerup':
            setScore(prev => prev + 5);
            setMessage("Ancient blessing found! +5 XP");
            setObstacles(prev => prev.filter(o => o.id !== obstacle.id));
            break;
          case 'monster':
            setLives(prev => prev - 1);
            setMessage("A shadow creature attacks! -1 HP");
            if (lives <= 1) setGameActive(false);
            setObstacles(prev => prev.filter(o => o.id !== obstacle.id));
            break;
        }
        setTimeout(() => setMessage(''), 2000);
      }

      if (playerPosition.x === currentClue.position.x && 
          playerPosition.y === currentClue.position.y) {
        setShowClue(true);
      }
    };

    checkCollisions();
  }, [playerPosition, obstacles, lives]);

  const handleMove = (dx: number, dy: number) => {
    if (!gameActive) return;

    const newX = playerPosition.x + dx;
    const newY = playerPosition.y + dy;

    if (newX >= 0 && newX < gridSize && newY >= 0 && newY < gridSize) {
      setPlayerPosition({ x: newX, y: newY });
    }
  };

  const handleAnswer = (answer: string) => {
    if (answer === currentClue.missingWord) {
      const comboBonus = Math.min(combo, 5);
      const points = 10 + (comboBonus * 2);
      setScore(prev => prev + points);
      setCombo(prev => prev + 1);
      setShowClue(false);
      setMessage(`Correct! +${points} XP`);
      
      if (score + points >= level * 50) {
        setLevel(prev => prev + 1);
        setMessage("Level Up! New challenges await!");
      }
      
      const newPosition = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize),
      };
      setCurrentClue(prev => ({ ...prev, position: newPosition }));
      
      // Add new obstacles
      if (Math.random() > 0.5) {
        const newObstacle = {
          id: `obstacle${Date.now()}`,
          position: {
            x: Math.floor(Math.random() * gridSize),
            y: Math.floor(Math.random() * gridSize),
          },
          type: Math.random() > 0.5 ? 'monster' : 'trap' as const,
        };
        setObstacles(prev => [...prev, newObstacle]);
      }
    } else {
      setLives(prev => prev - 1);
      setCombo(0);
      setMessage("The ancient magic rejects your answer! -1 HP");
      if (lives <= 1) setGameActive(false);
    }
    setTimeout(() => setMessage(''), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8"
      >
        <h1 className="text-5xl font-bold mb-4 font-medieval">Mystic Forest of Trials</h1>
        <div className="flex justify-center space-x-8">
          <motion.div 
            className="bg-gradient-to-br from-amber-900 to-amber-700 px-6 py-3 rounded-lg border-2 border-amber-500"
            whileHover={{ scale: 1.05 }}
          >
            <Shield className="w-6 h-6 mb-1 mx-auto text-amber-300" />
            <p className="text-xl">Level {level}</p>
          </motion.div>
          <motion.div 
            className="bg-gradient-to-br from-purple-900 to-purple-700 px-6 py-3 rounded-lg border-2 border-purple-500"
            whileHover={{ scale: 1.05 }}
          >
            <Scroll className="w-6 h-6 mb-1 mx-auto text-purple-300" />
            <p className="text-xl">XP: {score}</p>
          </motion.div>
          <motion.div 
            className="bg-gradient-to-br from-red-900 to-red-700 px-6 py-3 rounded-lg border-2 border-red-500"
            whileHover={{ scale: 1.05 }}
          >
            <Heart className="w-6 h-6 mb-1 mx-auto text-red-300" />
            <p className="text-xl">HP: {lives}</p>
          </motion.div>
          {combo > 1 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-gradient-to-br from-yellow-900 to-yellow-700 px-6 py-3 rounded-lg border-2 border-yellow-500"
            >
              <Star className="w-6 h-6 mb-1 mx-auto text-yellow-300" />
              <p className="text-xl">Combo x{combo}!</p>
            </motion.div>
          )}
        </div>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-xl font-bold text-purple-300"
          >
            {message}
          </motion.div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-lg border-2 border-gray-600">
          <h2 className="text-2xl font-bold mb-4">Enchanted Path</h2>
          <div className="relative aspect-square bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg overflow-hidden border-2 border-purple-500">
            <div className="grid grid-cols-5 grid-rows-5 gap-1 h-full">
              {Array.from({ length: gridSize * gridSize }).map((_, index) => {
                const x = index % gridSize;
                const y = Math.floor(index / gridSize);
                const hasObstacle = obstacles.find(o => o.position.x === x && o.position.y === y);
                const hasClue = currentClue.position.x === x && currentClue.position.y === y;
                const isPlayer = playerPosition.x === x && playerPosition.y === y;

                return (
                  <div
                    key={index}
                    className="relative bg-gradient-to-br from-purple-800 to-purple-700 bg-opacity-30 rounded-sm border border-purple-600"
                  >
                    {hasObstacle && (
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        whileHover={{ scale: 1.1 }}
                        animate={hasObstacle.type === 'monster' ? {
                          rotate: [0, 10, -10, 0],
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {hasObstacle.type === 'tree' && <Trees className="text-green-400" />}
                        {hasObstacle.type === 'trap' && <Skull className="text-red-400" />}
                        {hasObstacle.type === 'powerup' && <Star className="text-yellow-400" />}
                        {hasObstacle.type === 'monster' && <Sword className="text-red-400" />}
                      </motion.div>
                    )}
                    {hasClue && (
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full" />
                      </motion.div>
                    )}
                    {isPlayer && (
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      >
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full border-2 border-white shadow-lg" />
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleMove(-1, 0)}
              className="bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-600 hover:to-purple-500 px-4 py-2 rounded-lg border border-purple-400"
            >
              ←
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleMove(0, -1)}
              className="bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-600 hover:to-purple-500 px-4 py-2 rounded-lg border border-purple-400"
            >
              ↑
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleMove(1, 0)}
              className="bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-600 hover:to-purple-500 px-4 py-2 rounded-lg border border-purple-400"
            >
              →
            </motion.button>
            <div className="col-start-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleMove(0, 1)}
                className="w-full bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-600 hover:to-purple-500 px-4 py-2 rounded-lg border border-purple-400"
              >
                ↓
              </motion.button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showClue && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="bg-gradient-to-br from-purple-900 to-purple-800 p-6 rounded-lg border-2 border-purple-500"
            >
              <h2 className="text-2xl font-bold mb-4">Ancient Riddle</h2>
              <p className="text-lg mb-6">{currentClue.sentence}</p>
              <div className="grid grid-cols-2 gap-4">
                {currentClue.options.map((option) => (
                  <motion.button
                    key={option}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-600 hover:to-purple-500 px-4 py-2 rounded-lg transition-colors border border-purple-400"
                    onClick={() => handleAnswer(option)}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!gameActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-purple-900 to-purple-800 p-8 rounded-lg text-center border-4 border-purple-500 shadow-2xl"
          >
            <h2 className="text-3xl font-bold mb-4">Quest Complete!</h2>
            <p className="text-xl mb-2">Level Reached: {level}</p>
            <p className="text-xl mb-4">Final XP: {score}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 px-6 py-2 rounded-lg transition-colors border-2 border-purple-400"
            >
              Begin New Quest
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default MediumMode;