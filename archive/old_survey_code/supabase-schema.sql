-- Create surveys table
CREATE TABLE IF NOT EXISTS surveys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),

    -- Basic Information
    intra_id TEXT NOT NULL,
    circle TEXT,

    -- Development Career
    dev_field TEXT,
    programming_language TEXT,
    editor TEXT,

    -- 42 Life Pattern
    active_time TEXT,
    cluster_hours TEXT,
    study_location TEXT,
    outside_cluster_activity JSONB, -- Array for multi-select

    -- Learning/Development Style
    work_style TEXT,
    planning_style TEXT,
    learning_method TEXT,

    -- Personality
    mbti TEXT,
    mbti_reliability INTEGER,

    -- Lifestyle
    coding_environment TEXT,
    favorite_snack JSONB, -- Array for multi-select
    debugging_method TEXT,

    -- Fun Elements
    hardest_project TEXT,
    goal_2026 TEXT,

    -- Balance Game Questions
    balance_bungeoppang TEXT,
    balance_bug TEXT,
    balance_mistake TEXT,
    balance_teamwork TEXT,
    balance_environment TEXT,
    balance_code_review TEXT,

    -- Constraints
    CONSTRAINT unique_intra_id UNIQUE(intra_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_surveys_created_at ON surveys(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_surveys_intra_id ON surveys(intra_id);

-- Enable Row Level Security (RLS)
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read surveys (for statistics)
CREATE POLICY "Allow public read access"
    ON surveys FOR SELECT
    USING (true);

-- Create policy to allow anyone to insert surveys
CREATE POLICY "Allow public insert access"
    ON surveys FOR INSERT
    WITH CHECK (true);

-- Create a view for statistics (optional, for easier querying)
CREATE OR REPLACE VIEW survey_stats AS
SELECT
    COUNT(*) as total_responses,
    COUNT(DISTINCT dev_field) as unique_dev_fields,
    COUNT(DISTINCT mbti) as unique_mbti_types,
    MAX(created_at) as last_response_at
FROM surveys;

-- Grant access to the view
GRANT SELECT ON survey_stats TO anon, authenticated;
