/*
  # Improve word management and game integration

  1. Changes
    - Add combined_word field for WordSmiths game
    - Add component_words field to track individual words that can be combined
    - Remove unused fields (category, difficulty)
    - Add validation for word combinations
*/

-- Remove unused columns
ALTER TABLE words DROP COLUMN IF EXISTS category;
ALTER TABLE words DROP COLUMN IF EXISTS difficulty;

-- Add new columns for word combinations
ALTER TABLE words 
ADD COLUMN IF NOT EXISTS combined_word text,
ADD COLUMN IF NOT EXISTS component_words text[];

-- Add constraint to ensure component words are provided for wordsmith mode
ALTER TABLE words
ADD CONSTRAINT valid_wordsmith_components CHECK (
  (game_mode != 'wordsmith' AND component_words IS NULL) OR
  (game_mode = 'wordsmith' AND (
    (combined_word IS NOT NULL AND component_words IS NOT NULL AND array_length(component_words, 1) > 1) OR
    (combined_word IS NULL AND component_words IS NULL)
  ))
);