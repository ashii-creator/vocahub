import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Land {
  id: string;
  name: string;
  theme: string;
  challenges: Challenge[];
  unlocked: boolean;
}

interface Challenge {
  id: string;
  type: 'unscramble' | 'context' | 'match';
  word: string;
  answer: string;
  hints: string[];
}

const WordQuest = () => {
  const [currentLand, setCurrentLand] = useState<Land>({
    id: '1',
    name: 'Science Land',
    theme: 'Scientific vocabulary',
    challenges: [
      {
        id: 'c1',
        type: 'unscramble',
        word: 'YPOTHESISH',
        answer: 'HYPOTHESIS',
        hints: ['A proposed explanation', 'Scientific method step'],
      },
    ],
    unlocked: true,
  });
  const [score, setScore] = useState(0);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold mb-4">Word Quest: The Vocabulary Odyssey</h1>
        <div className="bg-purple-800 bg-opacity-50 px-6 py-3 rounded-lg inline-block">
          <p className="text-xl">Score: {score}</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Land Selection */}
        <div className="bg-purple-900 bg-opacity-40 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Lands</h2>
          <div className="space-y-4">
            {['Science Land', 'Literature Land', 'History Land'].map((land) => (
              <motion.button
                key={land}
                whileHover={{ scale: 1.05 }}
                className="w-full bg-purple-700 hover:bg-purple-600 px-4 py-3 rounded-lg transition-colors text-left"
              >
                {land}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Current Challenge */}
        <div className="md:col-span-2 bg-purple-800 bg-opacity-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">{currentLand.name}</h2>
          <div className="bg-purple-900 bg-opacity-40 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Current Challenge</h3>
            <p className="text-lg mb-6">Unscramble: {currentLand.challenges[0].word}</p>
            <input
              type="text"
              className="w-full bg-purple-700 bg-opacity-50 border border-purple-500 rounded-lg px-4 py-2 mb-4"
              placeholder="Your answer..."
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg transition-colors"
            >
              Submit Answer
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordQuest;