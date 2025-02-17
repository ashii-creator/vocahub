import React from 'react';
import { Link } from 'react-router-dom';
import { Book, Users, Crown, Info } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-green-900 bg-opacity-90 backdrop-blur-lg p-4 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-12 h-12 rounded-full bg-white p-1">
            <img 
              src="https://i.imgur.com/your_logo_here.jpg" 
              alt="VocabHub Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-2xl font-bold text-green-100">VocabHub</span>
        </Link>
        
        <div className="flex space-x-6">
          <Link to="/easy" className="nav-link hover:text-green-300 transition-colors text-green-100">
            Realm of WordSmiths
          </Link>
          <Link to="/medium" className="nav-link hover:text-green-300 transition-colors text-green-100">
            Mystic Forest of Clues
          </Link>
          <Link to="/hard" className="nav-link hover:text-green-300 transition-colors text-green-100">
            Tower of Trials
          </Link>
          <div className="border-l border-green-400 mx-2"></div>
          <Link to="/word-quest" className="nav-link hover:text-green-300 transition-colors flex items-center text-green-100">
            <Crown className="w-4 h-4 mr-1" />
            Word Quest
          </Link>
          <Link to="/word-clash" className="nav-link hover:text-green-300 transition-colors flex items-center text-green-100">
            <Users className="w-4 h-4 mr-1" />
            Word Clash
          </Link>
          <Link to="/about" className="nav-link hover:text-green-300 transition-colors flex items-center text-green-100">
            <Info className="w-4 h-4 mr-1" />
            About
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;