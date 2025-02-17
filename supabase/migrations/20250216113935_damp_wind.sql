/*
  # Add game-specific fields to words table

  1. Changes
    - Add game_mode column to specify which game the word belongs to
    - Add floor_number for Tower of Trials
    - Add mergeable_words array for Realm of WordSmiths
    - Add obstacle_type for Mystic Forest
*/

ALTER TABLE words
ADD COLUMN IF NOT EXISTS game_mode text NOT NULL DEFAULT 'wordsmith' CHECK (game_mode IN ('wordsmith', 'forest', 'tower')),
ADD COLUMN IF NOT EXISTS floor_number integer,
ADD COLUMN IF NOT EXISTS mergeable_words text[],
ADD COLUMN IF NOT EXISTS obstacle_type text CHECK (obstacle_type IN ('tree', 'trap', 'powerup', 'monster'));

-- Add constraint for floor number range
ALTER TABLE words
ADD CONSTRAINT floor_number_range CHECK (
  (game_mode != 'tower' AND floor_number IS NULL) OR
  (game_mode = 'tower' AND floor_number BETWEEN 1 AND 100)
);

-- Add constraint for obstacle type
ALTER TABLE words
ADD CONSTRAINT valid_obstacle_type CHECK (
  (game_mode != 'forest' AND obstacle_type IS NULL) OR
  (game_mode = 'forest' AND obstacle_type IS NOT NULL)
);