import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scroll, Shield, Sword, Heart, Star } from 'lucide-react';

interface Guardian {
  id: string;
  name: string;
  word: string;
  challenge: {
    type: 'synonym' | 'antonym' | 'usage';
    options: string[];
    correct: string;
  };
}

const generateGuardian = (floor: number): Guardian => {
  // Difficulty increases with floor level
  const words = [
    { word: 'ephemeral', correct: 'temporary', options: ['temporary', 'eternal', 'powerful', 'meaningful'] },
    { word: 'ubiquitous', correct: 'omnipresent', options: ['omnipresent', 'rare', 'unique', 'special'] },
    { word: 'surreptitious', correct: 'secretive', options: ['secretive', 'obvious', 'loud', 'bold'] },
    // Add more words as needed
  ];

  const guardianTypes = [
    'Word Keeper',
    'Lexicon Guardian',
    'Vocabulary Sentinel',
    'Language Warden',
    'Dictionary Master',
  ];

  const wordIndex = Math.floor(Math.random() * words.length);
  const guardianName = guardianTypes[Math.floor(Math.random() * guardianTypes.length)];

  return {
    id: `guardian-${floor}`,
    name: `Level ${floor} ${guardianName}`,
    word: words[wordIndex].word,
    challenge: {
      type: 'synonym',
      options: words[wordIndex].options,
      correct: words[wordIndex].correct,
    },
  };
};

const HardMode = () => {
  const [floor, setFloor] = useState(1);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [currentGuardian, setCurrentGuardian] = useState<Guardian>(generateGuardian(1));
  const [message, setMessage] = useState('');
  const [combo, setCombo] = useState(0);
  const [gameActive, setGameActive] = useState(true);
  const [isAnswering, setIsAnswering] = useState(false);

  useEffect(() => {
    if (floor > 0) {
      setCurrentGuardian(generateGuardian(floor));
    }
  }, [floor]);

  const handleAnswer = (answer: string) => {
    if (!gameActive || isAnswering) return;
    setIsAnswering(true);

    if (answer === currentGuardian.challenge.correct) {
      // Correct answer
      const comboBonus = Math.min(combo, 5);
      const points = Math.floor(10 * (1 + floor / 10)) + (comboBonus * 2);
      setScore(prev => prev + points);
      setCombo(prev => prev + 1);
      setMessage(`Correct! +${points} points`);

      // Victory animation and next floor
      setTimeout(() => {
        if (floor === 100) {
          setGameActive(false);
          setMessage('Congratulations! You have conquered the Tower of Trials!');
        } else {
          setFloor(prev => prev + 1);
          setMessage('');
        }
        setIsAnswering(false);
      }, 1500);
    } else {
      // Wrong answer
      setLives(prev => prev - 1);
      setCombo(0);
      setMessage('Incorrect! The guardian\'s challenge overwhelms you!');

      setTimeout(() => {
        if (lives <= 1) {
          setGameActive(false);
        } else {
          setFloor(1); // Reset to floor 1
          setMessage('You have been sent back to the first floor!');
        }
        setIsAnswering(false);
      }, 1500);
    }
  };

  const restartGame = () => {
    setFloor(1);
    setScore(0);
    setLives(3);
    setCombo(0);
    setMessage('');
    setGameActive(true);
    setCurrentGuardian(generateGuardian(1));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8"
      >
        <h1 className="text-5xl font-bold mb-4 font-medieval">Tower of Trials</h1>
        <div className="flex justify-center space-x-8">
          <motion.div 
            className="bg-gradient-to-br from-amber-900 to-amber-700 px-6 py-3 rounded-lg border-2 border-amber-500"
            whileHover={{ scale: 1.05 }}
          >
            <Shield className="w-6 h-6 mb-1 mx-auto text-amber-300" />
            <p className="text-xl">Floor {floor}/100</p>
          </motion.div>
          <motion.div 
            className="bg-gradient-to-br from-purple-900 to-purple-700 px-6 py-3 rounded-lg border-2 border-purple-500"
            whileHover={{ scale: 1.05 }}
          >
            <Scroll className="w-6 h-6 mb-1 mx-auto text-purple-300" />
            <p className="text-xl">Score: {score}</p>
          </motion.div>
          <motion.div 
            className="bg-gradient-to-br from-red-900 to-red-700 px-6 py-3 rounded-lg border-2 border-red-500"
            whileHover={{ scale: 1.05 }}
          >
            <Heart className="w-6 h-6 mb-1 mx-auto text-red-300" />
            <p className="text-xl">Lives: {lives}</p>
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
        <motion.div
          className="bg-gradient-to-br from-purple-900 to-purple-800 p-6 rounded-lg relative min-h-[300px] border-2 border-purple-600"
          animate={{
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
        >
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Sword className="w-6 h-6 mr-2 text-red-400" />
            {currentGuardian.name}
          </h2>
          <div className="relative h-48 flex items-center justify-center">
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="text-center"
            >
              <p className="text-4xl font-bold mb-4 text-purple-300">{currentGuardian.word}</p>
              <p className="text-xl text-purple-200">Find the {currentGuardian.challenge.type}</p>
            </motion.div>
            <motion.div
              className="absolute inset-0"
              animate={{
                background: [
                  'radial-gradient(circle, rgba(147,51,234,0.2) 0%, rgba(147,51,234,0) 70%)',
                  'radial-gradient(circle, rgba(147,51,234,0.3) 0%, rgba(147,51,234,0) 70%)',
                  'radial-gradient(circle, rgba(147,51,234,0.2) 0%, rgba(147,51,234,0) 70%)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>

        <div className="bg-gradient-to-br from-purple-800 to-purple-700 p-6 rounded-lg border-2 border-purple-500">
          <h2 className="text-2xl font-bold mb-4">Choose Your Answer</h2>
          <div className="grid grid-cols-2 gap-4">
            {currentGuardian.challenge.options.map((option) => (
              <motion.button
                key={option}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={!gameActive || isAnswering}
                onClick={() => handleAnswer(option)}
                className={`bg-gradient-to-r from-purple-700 to-purple-600 
                  hover:from-purple-600 hover:to-purple-500 
                  px-4 py-3 rounded-lg transition-colors
                  border-2 border-purple-400
                  disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {option}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {!gameActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-br from-purple-900 to-purple-800 p-8 rounded-lg text-center border-4 border-purple-500 shadow-2xl"
            >
              <h2 className="text-3xl font-bold mb-4">
                {lives <= 0 ? 'The Tower Claims Another Challenger' : 'Victory!'}
              </h2>
              <p className="text-xl mb-2">Highest Floor: {floor}</p>
              <p className="text-xl mb-4">Final Score: {score}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={restartGame}
                className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 px-6 py-2 rounded-lg transition-colors border-2 border-purple-400"
              >
                Challenge Again
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HardMode;