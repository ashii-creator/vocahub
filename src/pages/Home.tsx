import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sword, Brain, Trophy, Users, ScrollText } from 'lucide-react';

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-bold mb-4">Greetings from the VocabMasters!</h1>
        <p className="text-xl text-purple-200">Master your vocabulary through exciting games and challenges!</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {/* Difficulty Levels */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-purple-800 bg-opacity-50 rounded-lg p-6 backdrop-blur-lg"
        >
          <Link to="/easy" className="block">
            <Brain className="w-12 h-12 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Realm of WordSmiths</h2>
            <p className="text-purple-200">Begin your journey as an apprentice WordSmith.</p>
          </Link>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-purple-800 bg-opacity-50 rounded-lg p-6 backdrop-blur-lg"
        >
          <Link to="/medium" className="block">
            <ScrollText className="w-12 h-12 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Mystic Forest of Clues</h2>
            <p className="text-purple-200">Navigate through enchanted mazes of vocabulary.</p>
          </Link>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-purple-800 bg-opacity-50 rounded-lg p-6 backdrop-blur-lg"
        >
          <Link to="/hard" className="block">
            <Sword className="w-12 h-12 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Tower of Trials</h2>
            <p className="text-purple-200">Face the ultimate vocabulary challenges.</p>
          </Link>
        </motion.div>
      </div>

      {/* Multiplayer Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-purple-700 bg-opacity-50 rounded-lg p-6 backdrop-blur-lg"
        >
          <Link to="/word-quest" className="block">
            <Trophy className="w-12 h-12 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Word Quest: The Vocabulary Odyssey</h2>
            <p className="text-purple-200">Embark on an epic journey through themed vocabulary lands.</p>
          </Link>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-purple-700 bg-opacity-50 rounded-lg p-6 backdrop-blur-lg"
        >
          <Link to="/word-clash" className="block">
            <Users className="w-12 h-12 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Word Clash: Multiplayer Showdown</h2>
            <p className="text-purple-200">Challenge players worldwide in real-time vocabulary battles.</p>
          </Link>
        </motion.div>
      </div>

      {/* Authentication Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-8 space-x-4"
      >
        <a
          href="/admin/signup.html"
          className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full transition-colors"
        >
          Sign Up
        </a>
        <a
          href="/admin/signin.html"
          className="inline-block bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 px-6 rounded-full transition-colors"
        >
          Sign In
        </a>
      </motion.div>
    </div>
  );
};

export default Home;