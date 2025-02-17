import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import EasyMode from './pages/EasyMode';
import MediumMode from './pages/MediumMode';
import HardMode from './pages/HardMode';
import WordQuest from './pages/WordQuest';
import WordClash from './pages/WordClash';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black bg-opacity-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/easy" element={<EasyMode />} />
              <Route path="/medium" element={<MediumMode />} />
              <Route path="/hard" element={<HardMode />} />
              <Route path="/word-quest" element={<WordQuest />} />
              <Route path="/word-clash" element={<WordClash />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/login" element={<Navigate to="/admin/signin.html" />} />
              <Route path="/register" element={<Navigate to="/admin/signup.html" />} />
            </Routes>
          </div>
        </motion.div>
      </div>
    </Router>
  );
}

export default App;