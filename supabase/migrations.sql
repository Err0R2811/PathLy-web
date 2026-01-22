-- PathLy Database Schema for Supabase
-- Run this in your Supabase SQL Editor
-- ============================================================================
-- PROFILES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    interests TEXT [] DEFAULT '{}',
    goals TEXT,
    difficulty_preference TEXT DEFAULT 'Beginner',
    daily_time_minutes INTEGER DEFAULT 30,
    theme TEXT DEFAULT 'light',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles FOR
SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR
UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR
INSERT WITH CHECK (auth.uid() = id);
-- ============================================================================
-- SKILL PLANS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS skill_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    skill_name TEXT NOT NULL,
    duration INTEGER NOT NULL,
    difficulty TEXT NOT NULL,
    start_date TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- Enable RLS
ALTER TABLE skill_plans ENABLE ROW LEVEL SECURITY;
-- RLS Policies
CREATE POLICY "Users can view own skill plans" ON skill_plans FOR
SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own skill plans" ON skill_plans FOR
INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own skill plans" ON skill_plans FOR
UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own skill plans" ON skill_plans FOR DELETE USING (auth.uid() = user_id);
-- ============================================================================
-- MODULES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_plan_id UUID REFERENCES skill_plans(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    week INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    objective TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- Enable RLS
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
-- RLS Policies
CREATE POLICY "Users can view own modules" ON modules FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM skill_plans
            WHERE skill_plans.id = modules.skill_plan_id
                AND skill_plans.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can insert own modules" ON modules FOR
INSERT WITH CHECK (
        EXISTS (
            SELECT 1
            FROM skill_plans
            WHERE skill_plans.id = modules.skill_plan_id
                AND skill_plans.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can update own modules" ON modules FOR
UPDATE USING (
        EXISTS (
            SELECT 1
            FROM skill_plans
            WHERE skill_plans.id = modules.skill_plan_id
                AND skill_plans.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can delete own modules" ON modules FOR DELETE USING (
    EXISTS (
        SELECT 1
        FROM skill_plans
        WHERE skill_plans.id = modules.skill_plan_id
            AND skill_plans.user_id = auth.uid()
    )
);
-- ============================================================================
-- TASKS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID REFERENCES modules(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    content_type TEXT NOT NULL,
    content_link TEXT,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    "order" INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
-- RLS Policies
CREATE POLICY "Users can view own tasks" ON tasks FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM modules
                JOIN skill_plans ON skill_plans.id = modules.skill_plan_id
            WHERE modules.id = tasks.module_id
                AND skill_plans.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can insert own tasks" ON tasks FOR
INSERT WITH CHECK (
        EXISTS (
            SELECT 1
            FROM modules
                JOIN skill_plans ON skill_plans.id = modules.skill_plan_id
            WHERE modules.id = tasks.module_id
                AND skill_plans.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can update own tasks" ON tasks FOR
UPDATE USING (
        EXISTS (
            SELECT 1
            FROM modules
                JOIN skill_plans ON skill_plans.id = modules.skill_plan_id
            WHERE modules.id = tasks.module_id
                AND skill_plans.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can delete own tasks" ON tasks FOR DELETE USING (
    EXISTS (
        SELECT 1
        FROM modules
            JOIN skill_plans ON skill_plans.id = modules.skill_plan_id
        WHERE modules.id = tasks.module_id
            AND skill_plans.user_id = auth.uid()
    )
);
-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_skill_plans_user_id ON skill_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_skill_plans_status ON skill_plans(status);
CREATE INDEX IF NOT EXISTS idx_modules_skill_plan_id ON modules(skill_plan_id);
CREATE INDEX IF NOT EXISTS idx_tasks_module_id ON tasks(module_id);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);
-- ============================================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW();
RETURN NEW;
END;
$$ language 'plpgsql';
-- Apply triggers
CREATE TRIGGER update_profiles_updated_at BEFORE
UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_skill_plans_updated_at BEFORE
UPDATE ON skill_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_modules_updated_at BEFORE
UPDATE ON modules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE
UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();