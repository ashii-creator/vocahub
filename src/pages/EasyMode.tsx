import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Scroll, Sparkles, Shield } from 'lucide-react';

interface WordTile {
  id: string;
  content: string;
  type: 'prefix' | 'root' | 'suffix';
}

const EasyMode = () => {
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(60);
  const [level, setLevel] = useState(1);
  const [wordTiles, setWordTiles] = useState<WordTile[]>([
    { id: 'pre1', content: 'un', type: 'prefix' },
    { id: 'pre2', content: 're', type: 'prefix' },
    { id: 'root1', content: 'help', type: 'root' },
    { id: 'root2', content: 'play', type: 'root' },
    { id: 'suf1', content: 'ful', type: 'suffix' },
    { id: 'suf2', content: 'ing', type: 'suffix' },
  ]);
  const [cauldronTiles, setCauldronTiles] = useState<WordTile[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [gameActive, setGameActive] = useState(true);
  const [combo, setCombo] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (time > 0 && gameActive) {
      const timer = setInterval(() => setTime(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (time === 0) {
      setGameActive(false);
    }
  }, [time, gameActive]);

  const handleDragEnd = (result: any) => {
    if (!result.destination || !gameActive) return;

    const { source, destination } = result;

    if (source.droppableId === 'wordTiles' && destination.droppableId === 'cauldron') {
      const tile = wordTiles[source.index];
      setWordTiles(prev => prev.filter((_, index) => index !== source.index));
      setCauldronTiles(prev => [...prev, tile]);
      checkWord([...cauldronTiles, tile]);
    } else if (source.droppableId === 'cauldron' && destination.droppableId === 'wordTiles') {
      const tile = cauldronTiles[source.index];
      setCauldronTiles(prev => prev.filter((_, index) => index !== source.index));
      setWordTiles(prev => [...prev, tile]);
    }
  };

  const checkWord = (tiles: WordTile[]) => {
    const word = tiles.map(tile => tile.content).join('');
    const validWords = ['unhelpful', 'replaying', 'helpful', 'rehelp', 'ungrateful'];
    
    if (validWords.includes(word)) {
      setIsCorrect(true);
      const comboBonus = Math.min(combo, 5);
      const points = 10 + (comboBonus * 2);
      setScore(prev => prev + points);
      setCombo(prev => prev + 1);
      setMessage(`Ancient word "${word}" discovered! +${points} points`);
      
      if (score + points >= level * 50) {
        setLevel(prev => prev + 1);
        setMessage(prev => `${prev}\nYou've ascended to level ${level + 1}!`);
      }
      
      setTimeout(() => {
        setCauldronTiles([]);
        setIsCorrect(null);
        setMessage('');
        
        // Add new tiles if running low
        if (wordTiles.length < 4) {
          const newTiles: WordTile[] = [
            { id: `pre${Date.now()}`, content: 're', type: 'prefix' },
            { id: `root${Date.now()}`, content: 'play', type: 'root' },
            { id: `suf${Date.now()}`, content: 'ing', type: 'suffix' },
          ];
          setWordTiles(prev => [...prev, ...newTiles]);
        }
      }, 1500);
    } else if (word.length >= 4) {
      setIsCorrect(false);
      setCombo(0);
      setMessage('The arcane energies reject this combination!');
      setTimeout(() => {
        setIsCorrect(null);
        setMessage('');
      }, 1000);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8"
      >
        <h1 className="text-5xl font-bold mb-4 font-medieval">Realm of WordSmiths</h1>
        <div className="flex justify-center space-x-8 mb-6">
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
            <p className="text-xl">Score: {score}</p>
          </motion.div>
          <motion.div 
            className="bg-gradient-to-br from-blue-900 to-blue-700 px-6 py-3 rounded-lg border-2 border-blue-500"
            whileHover={{ scale: 1.05 }}
          >
            <p className="text-xl">Time: {time}s</p>
          </motion.div>
          {combo > 1 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-gradient-to-br from-red-900 to-red-700 px-6 py-3 rounded-lg border-2 border-red-500"
            >
              <Sparkles className="w-6 h-6 mb-1 mx-auto text-yellow-300" />
              <p className="text-xl">Combo x{combo}!</p>
            </motion.div>
          )}
        </div>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl font-bold text-purple-300 whitespace-pre-line"
          >
            {message}
          </motion.div>
        )}
      </motion.div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Droppable droppableId="wordTiles">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-lg min-h-[300px] border-2 border-gray-600 shadow-xl"
              >
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <Scroll className="w-6 h-6 mr-2 text-amber-400" />
                  Ancient Runes
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {wordTiles.map((tile, index) => (
                    <Draggable key={tile.id} draggableId={tile.id} index={index}>
                      {(provided, snapshot) => (
                        <motion.div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`bg-gradient-to-r from-amber-900 to-amber-700 p-4 rounded-lg cursor-move text-center
                            ${snapshot.isDragging ? 'shadow-lg ring-2 ring-amber-300' : ''}
                            border-2 border-amber-600 hover:border-amber-400 transition-colors`}
                          whileHover={{ scale: 1.05, rotate: [-1, 1, -1] }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span className="font-runes text-lg">{tile.content}</span>
                        </motion.div>
                      )}
                    </Draggable>
                  ))}
                </div>
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <Droppable droppableId="cauldron">
            {(provided) => (
              <motion.div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-gradient-to-br from-purple-900 to-purple-800 p-6 rounded-lg text-center relative min-h-[300px] border-2 border-purple-600 shadow-xl"
              >
                <h2 className="text-2xl font-bold mb-4 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 mr-2 text-purple-400" />
                  Arcane Forge
                </h2>
                <div className="relative">
                  <motion.div
                    className={`w-48 h-48 mx-auto rounded-full flex items-center justify-center border-4
                      ${isCorrect === true ? 'border-green-500 bg-gradient-to-br from-green-900 to-green-700' : 
                        isCorrect === false ? 'border-red-500 bg-gradient-to-br from-red-900 to-red-700' : 
                        'border-purple-400 bg-gradient-to-br from-purple-900 to-purple-700'}`}
                    animate={{
                      scale: isCorrect === true ? [1, 1.2, 1] :
                             isCorrect === false ? [1, 0.8, 1] : [1, 1.1, 1],
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 rounded-full border-4 border-purple-400 border-dashed"
                    />
                    <div className="space-y-2 relative z-10">
                      {cauldronTiles.length === 0 ? (
                        <p className="text-xl">Drag runes here to forge words</p>
                      ) : (
                        <div className="flex flex-wrap justify-center gap-2">
                          {cauldronTiles.map((tile, index) => (
                            <Draggable key={tile.id} draggableId={tile.id} index={index}>
                              {(provided, snapshot) => (
                                <motion.div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`bg-gradient-to-r from-purple-700 to-purple-600 px-3 py-1 rounded cursor-move
                                    ${snapshot.isDragging ? 'shadow-lg ring-2 ring-purple-300' : ''}
                                    border border-purple-400`}
                                >
                                  {tile.content}
                                </motion.div>
                              )}
                            </Draggable>
                          ))}
                        </div>
                      )}
                    </div>
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
                {provided.placeholder}
              </motion.div>
            )}
          </Droppable>
        </div>
      </DragDropContext>

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
            <p className="text-xl mb-4">Final Score: {score}</p>
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

export default EasyMode;