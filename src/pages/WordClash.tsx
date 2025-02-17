import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Player {
  id: string;
  name: string;
  score: number;
  streak: number;
}

interface Match {
  id: string;
  type: '1v1' | 'team' | 'ffa';
  players: Player[];
  currentWord: string;
  options: string[];
  timeLeft: number;
}

const WordClash = () => {
  const [match, setMatch] = useState<Match>({
    id: 'm1',
    type: '1v1',
    players: [
      { id: 'p1', name: 'Player 1', score: 0, streak: 0 },
      { id: 'p2', name: 'Player 2', score: 0, streak: 0 },
    ],
    currentWord: 'ubiquitous',
    options: ['widespread', 'rare', 'unique', 'special'],
    timeLeft: 30,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold mb-4">Word Clash: Multiplayer Showdown</h1>
        <div className="flex justify-center space-x-8">
          {match.players.map((player) => (
            <div key={player.id} className="bg-purple-800 bg-opacity-50 px-6 py-3 rounded-lg">
              <p className="text-xl">{player.name}: {player.score}</p>
              {player.streak > 1 && (
                <motion.p
                  animate={{ scale: [1, 1.2, 1] }}
                  className="text-sm text-purple-300"
                >
                  {player.streak}x Streak!
                </motion.p>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Game Area */}
        <motion.div
          className="bg-purple-900 bg-opacity-40 p-6 rounded-lg"
          animate={{
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          <h2 className="text-2xl font-bold mb-4">Current Word</h2>
          <div className="text-center">
            <p className="text-4xl font-bold mb-4">{match.currentWord}</p>
            <p className="text-xl text-purple-300">Find the synonym</p>
          </div>
        </motion.div>

        {/* Answer Options */}
        <div className="bg-purple-800 bg-opacity-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Choose Answer</h2>
          <div className="grid grid-cols-2 gap-4">
            {match.options.map((option) => (
              <motion.button
                key={option}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-purple-700 hover:bg-purple-600 px-4 py-3 rounded-lg transition-colors"
              >
                {option}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Match Controls */}
      <div className="mt-8 text-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="bg-purple-600 hover:bg-purple-500 px-8 py-3 rounded-lg transition-colors"
        >
          Find New Match
        </motion.button>
      </div>
    </div>
  );
};

export default WordClash;