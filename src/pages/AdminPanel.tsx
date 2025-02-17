import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { Book, Trees, Sword, Plus, Trash2 } from 'lucide-react';

interface Word {
  id: string;
  word: string;
  definition: string;
  game_mode: 'wordsmith' | 'forest' | 'tower';
  floor_number?: number;
  combined_word?: string;
  component_words?: string[];
  obstacle_type?: 'tree' | 'trap' | 'powerup' | 'monster';
  options?: string[];
  correct_answer?: string;
}

const AdminPanel = () => {
  const navigate = useNavigate();
  const [words, setWords] = useState<Word[]>([]);
  const [selectedGameMode, setSelectedGameMode] = useState<'wordsmith' | 'forest' | 'tower'>('wordsmith');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [newWord, setNewWord] = useState<Partial<Word>>({
    word: '',
    definition: '',
    game_mode: 'wordsmith',
    component_words: [],
    options: ['', '', '', ''],
  });

  useEffect(() => {
    checkAuthAndLoadWords();
  }, [navigate, selectedGameMode]);

  const checkAuthAndLoadWords = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profile?.role !== 'admin') {
        navigate('/login');
        return;
      }

      const { data: wordsData, error: wordsError } = await supabase
        .from('words')
        .select('*')
        .eq('game_mode', selectedGameMode)
        .order('created_at', { ascending: false });

      if (wordsError) throw wordsError;
      setWords(wordsData || []);
    } catch (error) {
      console.error('Error:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleAddWord = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!newWord.word || !newWord.definition) {
        setMessage('Please fill in all required fields');
        return;
      }

      const wordData: Partial<Word> = {
        ...newWord,
        game_mode: selectedGameMode,
      };

      if (selectedGameMode === 'wordsmith') {
        if (!wordData.component_words?.length) {
          setMessage('Please add component words');
          return;
        }
        wordData.combined_word = wordData.word;
        wordData.word = wordData.component_words[0];
      }

      if (selectedGameMode === 'forest' && !wordData.obstacle_type) {
        setMessage('Please select an obstacle type');
        return;
      }

      if (selectedGameMode === 'tower') {
        if (!wordData.floor_number) {
          setMessage('Please specify the floor number');
          return;
        }
        if (!wordData.options?.some(opt => opt) || !wordData.correct_answer) {
          setMessage('Please add answer options and select the correct answer');
          return;
        }
        wordData.options = wordData.options.filter(opt => opt);
      }

      const { data, error } = await supabase
        .from('words')
        .insert([wordData])
        .select();

      if (error) throw error;

      setWords([...(data as Word[]), ...words]);
      setNewWord({
        word: '',
        definition: '',
        game_mode: selectedGameMode,
        component_words: [],
        options: ['', '', '', ''],
      });
      setMessage('Word added successfully!');
    } catch (error) {
      console.error('Error adding word:', error);
      setMessage('Error adding word. Please try again.');
    }
  };

  const handleDeleteWord = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this word?')) return;

    try {
      const { error } = await supabase
        .from('words')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setWords(words.filter(w => w.id !== id));
      setMessage('Word deleted successfully!');
    } catch (error) {
      console.error('Error deleting word:', error);
      setMessage('Error deleting word. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"
        />
        <p className="mt-4 text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Admin Panel</h1>
          <button
            onClick={() => supabase.auth.signOut()}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg mb-4 ${
              message.includes('Error') ? 'bg-red-500/50' : 'bg-green-500/50'
            }`}
          >
            {message}
          </motion.div>
        )}

        <div className="grid grid-cols-3 gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedGameMode('wordsmith')}
            className={`p-4 rounded-lg flex items-center justify-center gap-2 ${
              selectedGameMode === 'wordsmith' 
                ? 'bg-purple-600 border-2 border-purple-300' 
                : 'bg-purple-800 bg-opacity-50'
            }`}
          >
            <Book className="w-5 h-5" />
            Realm of WordSmiths
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedGameMode('forest')}
            className={`p-4 rounded-lg flex items-center justify-center gap-2 ${
              selectedGameMode === 'forest'
                ? 'bg-purple-600 border-2 border-purple-300'
                : 'bg-purple-800 bg-opacity-50'
            }`}
          >
            <Trees className="w-5 h-5" />
            Mystic Forest
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedGameMode('tower')}
            className={`p-4 rounded-lg flex items-center justify-center gap-2 ${
              selectedGameMode === 'tower'
                ? 'bg-purple-600 border-2 border-purple-300'
                : 'bg-purple-800 bg-opacity-50'
            }`}
          >
            <Sword className="w-5 h-5" />
            Tower of Trials
          </motion.button>
        </div>

        <div className="bg-purple-800 bg-opacity-50 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">
            Add New {
              selectedGameMode === 'wordsmith' ? 'Word Combination' :
              selectedGameMode === 'forest' ? 'Forest Challenge' :
              'Tower Challenge'
            }
          </h2>
          <form onSubmit={handleAddWord} className="space-y-4">
            {selectedGameMode === 'wordsmith' ? (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Combined Word</label>
                  <input
                    type="text"
                    value={newWord.word}
                    onChange={(e) => setNewWord({ ...newWord, word: e.target.value })}
                    className="w-full p-2 rounded bg-purple-900 bg-opacity-50 border border-purple-500 focus:border-purple-300"
                    placeholder="e.g., IDONT"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Component Words (comma-separated)</label>
                  <input
                    type="text"
                    value={newWord.component_words?.join(', ')}
                    onChange={(e) => setNewWord({
                      ...newWord,
                      component_words: e.target.value.split(',').map(w => w.trim()).filter(w => w)
                    })}
                    className="w-full p-2 rounded bg-purple-900 bg-opacity-50 border border-purple-500 focus:border-purple-300"
                    placeholder="e.g., I, DONT"
                    required
                  />
                </div>
              </>
            ) : (
              <div>
                <label className="block text-sm font-medium mb-2">Word/Question</label>
                <input
                  type="text"
                  value={newWord.word}
                  onChange={(e) => setNewWord({ ...newWord, word: e.target.value })}
                  className="w-full p-2 rounded bg-purple-900 bg-opacity-50 border border-purple-500 focus:border-purple-300"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Definition/Hint</label>
              <textarea
                value={newWord.definition}
                onChange={(e) => setNewWord({ ...newWord, definition: e.target.value })}
                className="w-full p-2 rounded bg-purple-900 bg-opacity-50 border border-purple-500 focus:border-purple-300"
                required
                rows={2}
              />
            </div>

            {selectedGameMode === 'forest' && (
              <div>
                <label className="block text-sm font-medium mb-2">Obstacle Type</label>
                <select
                  value={newWord.obstacle_type}
                  onChange={(e) => setNewWord({
                    ...newWord,
                    obstacle_type: e.target.value as 'tree' | 'trap' | 'powerup' | 'monster'
                  })}
                  className="w-full p-2 rounded bg-purple-900 bg-opacity-50 border border-purple-500 focus:border-purple-300"
                  required
                >
                  <option value="">Select obstacle type</option>
                  <option value="tree">Mystical Tree</option>
                  <option value="trap">Dark Trap</option>
                  <option value="powerup">Ancient Powerup</option>
                  <option value="monster">Shadow Monster</option>
                </select>
              </div>
            )}

            {selectedGameMode === 'tower' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Floor Number (1-100)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newWord.floor_number || ''}
                    onChange={(e) => setNewWord({
                      ...newWord,
                      floor_number: parseInt(e.target.value)
                    })}
                    className="w-full p-2 rounded bg-purple-900 bg-opacity-50 border border-purple-500 focus:border-purple-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Answer Options</label>
                  <div className="grid grid-cols-2 gap-4">
                    {newWord.options?.map((option, index) => (
                      <input
                        key={index}
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...(newWord.options || [])];
                          newOptions[index] = e.target.value;
                          setNewWord({ ...newWord, options: newOptions });
                        }}
                        className="w-full p-2 rounded bg-purple-900 bg-opacity-50 border border-purple-500 focus:border-purple-300"
                        placeholder={`Option ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Correct Answer</label>
                  <select
                    value={newWord.correct_answer}
                    onChange={(e) => setNewWord({ ...newWord, correct_answer: e.target.value })}
                    className="w-full p-2 rounded bg-purple-900 bg-opacity-50 border border-purple-500 focus:border-purple-300"
                    required
                  >
                    <option value="">Select correct answer</option>
                    {newWord.options?.filter(opt => opt !== '').map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div className="text-right">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="bg-purple-600 hover:bg-purple-500 px-6 py-2 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4 inline-block mr-2" />
                Add {selectedGameMode === 'wordsmith' ? 'Word Combination' : 'Challenge'}
              </motion.button>
            </div>
          </form>
        </div>

        <div className="bg-purple-800 bg-opacity-50 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">
            {selectedGameMode === 'wordsmith' ? 'Word Combinations' :
             selectedGameMode === 'forest' ? 'Forest Challenges' :
             'Tower Challenges'} List
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-purple-600">
                  {selectedGameMode === 'wordsmith' ? (
                    <>
                      <th className="px-4 py-2 text-left">Combined Word</th>
                      <th className="px-4 py-2 text-left">Component Words</th>
                    </>
                  ) : (
                    <>
                      <th className="px-4 py-2 text-left">Word/Question</th>
                      {selectedGameMode === 'forest' && (
                        <th className="px-4 py-2 text-left">Obstacle Type</th>
                      )}
                      {selectedGameMode === 'tower' && (
                        <th className="px-4 py-2 text-left">Floor</th>
                      )}
                      <th className="px-4 py-2 text-left">Options</th>
                    </>
                  )}
                  <th className="px-4 py-2 text-left">Definition/Hint</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {words.map((word) => (
                  <tr key={word.id} className="border-b border-purple-700">
                    {selectedGameMode === 'wordsmith' ? (
                      <>
                        <td className="px-4 py-2">{word.combined_word}</td>
                        <td className="px-4 py-2">{word.component_words?.join(', ')}</td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-2">{word.word}</td>
                        {selectedGameMode === 'forest' && (
                          <td className="px-4 py-2">{word.obstacle_type}</td>
                        )}
                        {selectedGameMode === 'tower' && (
                          <td className="px-4 py-2">{word.floor_number}</td>
                        )}
                        <td className="px-4 py-2">
                          {word.options?.join(', ')}
                          {word.correct_answer && (
                            <span className="text-green-400 ml-2">
                              (Correct: {word.correct_answer})
                            </span>
                          )}
                        </td>
                      </>
                    )}
                    <td className="px-4 py-2">{word.definition}</td>
                    <td className="px-4 py-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteWord(word.id)}
                        className="p-1 hover:bg-red-700 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminPanel;