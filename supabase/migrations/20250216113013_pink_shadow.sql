/*
  # Create words table for vocabulary game

  1. New Tables
    - `words`
      - `id` (uuid, primary key)
      - `word` (text, not null)
      - `definition` (text, not null)
      - `difficulty` (text, not null)
      - `category` (text, not null)
      - `options` (text array)
      - `correct_answer` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `words` table
    - Add policies for admin access
*/

CREATE TABLE IF NOT EXISTS words (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    word text NOT NULL,
    definition text NOT NULL,
    difficulty text NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    category text NOT NULL,
    options text[],
    correct_answer text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE words ENABLE ROW LEVEL SECURITY;

-- Policies for admin access
CREATE POLICY "Allow full access for admins"
    ON words
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Policy for public read access
CREATE POLICY "Allow public read access"
    ON words
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_words_updated_at
    BEFORE UPDATE ON words
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();