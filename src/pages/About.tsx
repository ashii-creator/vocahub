import React from 'react';
import { motion } from 'framer-motion';
import { Book, Brain, Star, Trophy, Heart } from 'lucide-react';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-5xl font-bold mb-8 text-center text-green-100">About VocabHub</h1>
        
        <div className="bg-green-900 bg-opacity-50 rounded-lg p-8 backdrop-blur-sm shadow-xl border border-green-700">
          <div className="space-y-8">
            <section>
              <div className="flex items-center mb-4">
                <Book className="w-8 h-8 text-green-400 mr-3" />
                <h2 className="text-3xl font-bold text-green-100">Our Mission</h2>
              </div>
              <p className="text-lg text-green-50">
                VocabHub is dedicated to making vocabulary learning an engaging and immersive experience. 
                We believe that learning new words should be as exciting as playing your favorite game, 
                which is why we've created a unique platform that combines education with entertainment.
              </p>
            </section>

            <section>
              <div className="flex items-center mb-4">
                <Brain className="w-8 h-8 text-green-400 mr-3" />
                <h2 className="text-3xl font-bold text-green-100">Learning Approach</h2>
              </div>
              <p className="text-lg text-green-50">
                Our platform features multiple game modes designed to cater to different learning styles 
                and difficulty levels. From the beginner-friendly Realm of WordSmiths to the challenging 
                Tower of Trials, each mode offers a unique way to expand your vocabulary.
              </p>
            </section>

            <section>
              <div className="flex items-center mb-4">
                <Star className="w-8 h-8 text-green-400 mr-3" />
                <h2 className="text-3xl font-bold text-green-100">Features</h2>
              </div>
              <ul className="list-none space-y-3 text-lg text-green-50">
                <li className="flex items-center">
                  <Trophy className="w-5 h-5 text-green-400 mr-2" />
                  Multiple engaging game modes for different skill levels
                </li>
                <li className="flex items-center">
                  <Trophy className="w-5 h-5 text-green-400 mr-2" />
                  Progress tracking and achievement system
                </li>
                <li className="flex items-center">
                  <Trophy className="w-5 h-5 text-green-400 mr-2" />
                  Multiplayer challenges and competitions
                </li>
                <li className="flex items-center">
                  <Trophy className="w-5 h-5 text-green-400 mr-2" />
                  Regular content updates with new words and challenges
                </li>
              </ul>
            </section>

            <section>
              <div className="flex items-center mb-4">
                <Heart className="w-8 h-8 text-green-400 mr-3" />
                <h2 className="text-3xl font-bold text-green-100">Why Choose VocabHub?</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg text-green-50">
                <div className="bg-green-800 bg-opacity-50 p-4 rounded-lg">
                  <h3 className="font-bold mb-2 text-green-200">Engaging Learning</h3>
                  <p>Learn through interactive games and challenges that make vocabulary building fun</p>
                </div>
                <div className="bg-green-800 bg-opacity-50 p-4 rounded-lg">
                  <h3 className="font-bold mb-2 text-green-200">Track Progress</h3>
                  <p>Monitor your improvement with detailed statistics and achievements</p>
                </div>
                <div className="bg-green-800 bg-opacity-50 p-4 rounded-lg">
                  <h3 className="font-bold mb-2 text-green-200">Community</h3>
                  <p>Join a community of learners and compete in multiplayer challenges</p>
                </div>
                <div className="bg-green-800 bg-opacity-50 p-4 rounded-lg">
                  <h3 className="font-bold mb-2 text-green-200">Regular Updates</h3>
                  <p>New content and features added regularly to keep learning fresh</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default About;